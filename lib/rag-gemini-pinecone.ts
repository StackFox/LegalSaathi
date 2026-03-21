import { GoogleGenerativeAI, TaskType } from '@google/generative-ai'
import { Pinecone } from '@pinecone-database/pinecone'

import { legalDocuments, type LegalDocument } from './legal-documents'
import type { CitedSection, AuditLogEntry, LegalResponse, Language } from './types'

interface VectorMetadata {
  id: string
  domain: string
  act: string
  section: string
  title: string
  snippet: string
  keywords: string
  sourceUrl?: string
}

// Use text-embedding-004 which is the latest embedding model
// Alternative models: embedding-001, text-embedding-preview-0409
const EMBEDDING_MODEL = 'gemini-embedding-001'
// Gemini embedding outputs 3072 dims, but Pinecone free tier maxes at 1024
// We truncate to fit - this is a common technique that works reasonably well
const EMBEDDING_DIMENSION = 1024
// Use gemini-2.5-flash for better availability on free tier
const CHAT_MODEL = 'gemini-2.5-flash'
const PINECONE_INDEX = process.env.PINECONE_INDEX || 'legal-saathi'
const NAMESPACE = 'legal-docs'

// Cache to avoid reinitializing
let pineconeClient: Pinecone | null = null
let genAI: GoogleGenerativeAI | null = null
let indexInitialized = false

function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      throw new Error('Missing GOOGLE_AI_API_KEY environment variable')
    }
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY
    if (!apiKey) {
      throw new Error('Missing PINECONE_API_KEY environment variable')
    }
    pineconeClient = new Pinecone({ apiKey })
  }
  return pineconeClient
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

function detectLanguage(text: string): Language {
  const hindiRegex = /[\u0900-\u097F]/
  const tamilRegex = /[\u0B80-\u0BFF]/
  const teluguRegex = /[\u0C00-\u0C7F]/
  const bengaliRegex = /[\u0980-\u09FF]/

  if (hindiRegex.test(text)) return 'hi'
  if (tamilRegex.test(text)) return 'ta'
  if (teluguRegex.test(text)) return 'te'
  if (bengaliRegex.test(text)) return 'bn'
  return 'en'
}

async function getEmbedding(text: string): Promise<number[]> {
  const genAI = getGeminiClient()
  const embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL })
  
  const result = await embeddingModel.embedContent(text)
  
  if (!result.embedding || !result.embedding.values) {
    throw new Error('No embedding values returned from Gemini')
  }
  
  // Truncate to EMBEDDING_DIMENSION for Pinecone free tier compatibility
  const fullEmbedding = result.embedding.values
  return fullEmbedding.slice(0, EMBEDDING_DIMENSION)
}

async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const genAI = getGeminiClient()
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL })
  
  const results: number[][] = []
  for (const text of texts) {
    const result = await model.embedContent(text)
    // Truncate each embedding
    results.push(result.embedding.values.slice(0, EMBEDDING_DIMENSION))
  }
  return results
}

// Initialize Pinecone index with legal documents
export async function initializePineconeIndex(): Promise<void> {
  // Use in-memory flag to avoid repeated initialization attempts in same process
  if (indexInitialized) {
    console.log('Pinecone index already initialized (in-memory flag)')
    return
  }

  const pinecone = getPineconeClient()
  const index = pinecone.index(PINECONE_INDEX)
  
  // Check if index already has data
  const stats = await index.describeIndexStats()
  console.log('Pinecone index stats:', JSON.stringify(stats))
  
  // Validate dimension - we truncate Gemini embeddings to 1024 for free tier
  if (stats.dimension && stats.dimension !== EMBEDDING_DIMENSION) {
    throw new Error(
      `Pinecone index dimension mismatch. Expected ${EMBEDDING_DIMENSION}, got ${stats.dimension}. ` +
      `Please recreate your Pinecone index "${PINECONE_INDEX}" with dimension=${EMBEDDING_DIMENSION} and metric=cosine.`
    )
  }
  
  // Check namespace specifically for our documents
  const namespaceStats = stats.namespaces?.[NAMESPACE]
  if (namespaceStats && namespaceStats.recordCount && namespaceStats.recordCount > 0) {
    console.log(`Pinecone index already initialized with ${namespaceStats.recordCount} vectors in namespace ${NAMESPACE}`)
    indexInitialized = true
    return
  }

  console.log('Initializing Pinecone index with legal documents...')
  
  const vectors: Array<{
    id: string
    values: number[]
    metadata: VectorMetadata
  }> = []

  // Use real legal documents from legal-documents.ts
  for (const doc of legalDocuments) {
    const text = `${doc.act} ${doc.section}\n${doc.title}\n\nKeywords: ${doc.keywords.join(', ')}\n\n${doc.fullText}`
    
    try {
      const embedding = await getEmbedding(text)
      
      vectors.push({
        id: doc.id,
        values: embedding,
        metadata: {
          id: doc.id,
          domain: doc.domain,
          act: doc.act,
          section: doc.section,
          title: doc.title,
          snippet: doc.snippet,
          keywords: doc.keywords.join(', '),
          sourceUrl: doc.sourceUrl,
        },
      })
    } catch (embError) {
      console.error(`Failed to embed document ${doc.id}:`, embError)
      throw embError
    }
  }

  if (vectors.length === 0) {
    throw new Error('No vectors were generated for Pinecone')
  }

  // Upsert in batches of 100
  const batchSize = 100
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize)
    // Pinecone v7+ requires { records: [...] } format
    await index.namespace(NAMESPACE).upsert({ records: batch })
  }

  console.log(`Initialized Pinecone index with ${vectors.length} vectors`)
  indexInitialized = true
}

async function queryPinecone(queryEmbedding: number[], topK: number = 5): Promise<Array<{
  id: string
  score: number
  metadata: VectorMetadata
}>> {
  const pinecone = getPineconeClient()
  const index = pinecone.index(PINECONE_INDEX)
  
  const results = await index.namespace(NAMESPACE).query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  })

  return (results.matches || []).map((match) => ({
    id: match.id,
    score: match.score || 0,
    metadata: match.metadata as unknown as VectorMetadata,
  }))
}

async function generateAnswer(
  query: string,
  context: string,
  language: Language,
  domain: string,
  isLegalQuery: boolean
): Promise<{ translated_query: string; action_steps: string[]; deadlines: string[]; is_legal: boolean }> {
  const genAI = getGeminiClient()
  const model = genAI.getGenerativeModel({ model: CHAT_MODEL })
  
  const langLabel = language === 'hi' ? 'Hindi' : 'English'
  
  const prompt = `You are Legal Saathi, a helpful legal information assistant for Indian citizens. You provide general guidance based on Indian laws, not professional legal advice.

${isLegalQuery ? `CONTEXT (Relevant Legal Provisions from Indian Law):
${context}

USER QUERY: ${query}

INSTRUCTIONS:
1. First determine if this is a genuine legal question or just a greeting/casual message
2. If it's NOT a legal question (like "hi", "hello", "how are you", etc.), set is_legal to false and provide a friendly response
3. If it IS a legal question, provide your response in ${langLabel}
4. Generate practical action steps (5-7 steps) that cite relevant laws in format [Act - Section]
5. List any important deadlines or time limits from the legal provisions
6. Translate the query to ${langLabel} if not already in that language

Respond in JSON format:
{
  "is_legal": true/false,
  "translated_query": "query in ${langLabel}",
  "action_steps": ["step 1 with [Act - Section] citation", "step 2...", ...],
  "deadlines": ["deadline 1 with time limit", "deadline 2", ...]
}` : `USER QUERY: ${query}

This does not appear to be a legal question. Respond with:
{
  "is_legal": false,
  "translated_query": "${query}",
  "action_steps": ["I'm Legal Saathi, your legal information assistant. Please ask me a legal question about Indian laws, such as how to file an RTI, tenant rights, FIR registration, consumer complaints, or workplace harassment."],
  "deadlines": []
}`}

Domain hint: ${domain}
Output valid JSON only.`

  const result = await model.generateContent(prompt)
  const response = result.response.text()
  
  // Extract JSON from response (handle markdown code blocks)
  let jsonStr = response
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim()
  }
  
  try {
    const parsed = JSON.parse(jsonStr)
    return {
      is_legal: parsed.is_legal ?? isLegalQuery,
      translated_query: parsed.translated_query || query,
      action_steps: parsed.action_steps || ['Please consult a legal professional for specific advice.'],
      deadlines: parsed.deadlines || [],
    }
  } catch {
    // Fallback if JSON parsing fails
    return {
      is_legal: isLegalQuery,
      translated_query: query,
      action_steps: ['Please consult a legal professional for specific advice.'],
      deadlines: ['Varies based on specific case'],
    }
  }
}

export async function answerLegalQueryWithGeminiPinecone(params: {
  query: string
  language?: Language
  include_audit_log?: boolean
}): Promise<LegalResponse> {
  const { query, language, include_audit_log } = params

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('Query is required')
  }

  const requestedLang = language ?? detectLanguage(query)
  const queryText = query.trim()

  // Check if this looks like a casual/non-legal query
  const casualPatterns = /^(hi|hello|hey|good morning|good evening|good night|how are you|what's up|yo|namaste|namaskar|hii+|hlo|hola|bye|thanks|thank you|ok|okay|yes|no|hmm|lol|haha|test|testing)$/i
  const isLikelyCasual = casualPatterns.test(queryText) || queryText.length < 5

  // Initialize index if needed (will skip if already done)
  await initializePineconeIndex()

  // Get query embedding
  const queryEmbedding = await getEmbedding(queryText)

  // Query Pinecone for relevant documents
  const results = await queryPinecone(queryEmbedding, 5)

  // Calculate relevance - if top score is low, it's probably not a legal question
  const topScore = results[0]?.score || 0
  const isLegalQuery = !isLikelyCasual && topScore > 0.3 && results.length > 0

  // Determine best domain by aggregating scores
  const domainScores = new Map<string, number>()
  for (const result of results) {
    const domain = result.metadata.domain
    domainScores.set(domain, (domainScores.get(domain) || 0) + result.score)
  }

  let bestDomain = results[0]?.metadata?.domain || 'General'
  let bestDomainScore = -Infinity
  for (const [domain, score] of domainScores.entries()) {
    if (score > bestDomainScore) {
      bestDomain = domain
      bestDomainScore = score
    }
  }

  // Get top results from the best domain
  const domainResults = results
    .filter((r) => r.metadata.domain === bestDomain)
    .slice(0, 3)
  
  // If not enough from best domain, include others
  const selectedResults = domainResults.length >= 2 
    ? domainResults 
    : results.slice(0, 3)

  // Build cited sections
  const maxScore = selectedResults[0]?.score || 0
  const cited_sections: CitedSection[] = selectedResults.map((result) => {
    const ratio = maxScore > 0 ? result.score / maxScore : 0
    const relevance = ratio >= 0.7 ? 'High' : ratio >= 0.35 ? 'Medium' : 'Low'
    return {
      act: result.metadata.act,
      section: result.metadata.section,
      title: result.metadata.title,
      snippet: result.metadata.snippet,
      relevance,
    }
  })

  // Build context for LLM from real legal documents
  const context = selectedResults
    .map((r) => `Act: ${r.metadata.act}\nSection: ${r.metadata.section}\nTitle: ${r.metadata.title}\nContent: ${r.metadata.snippet}\nSource: ${r.metadata.sourceUrl || 'India Code'}`)
    .join('\n\n---\n\n')

  // Generate answer using Gemini
  const llmResponse = await generateAnswer(queryText, context, requestedLang, bestDomain, isLegalQuery)

  // Calculate confidence score based on relevance
  const confidence_score = isLegalQuery
    ? Math.round(clamp(topScore * 100, 35, 98))
    : 20 // Low confidence for non-legal queries

  // Build audit log
  const audit_log: AuditLogEntry[] = include_audit_log && isLegalQuery
    ? selectedResults.map((result) => ({
        statute: `${result.metadata.act} ${result.metadata.section}`.trim(),
        score: result.score,
        method: 'semantic_search',
        timestamp: new Date().toISOString(),
      }))
    : []

  // For non-legal queries, return a helpful response
  if (!llmResponse.is_legal) {
    return {
      query: queryText,
      detected_language: requestedLang.charAt(0).toUpperCase() + requestedLang.slice(1),
      translated_query: llmResponse.translated_query || queryText,
      domain: 'General',
      confidence_score: 20,
      cited_sections: [],
      action_steps: llmResponse.action_steps,
      deadlines: [],
      audit_log: [],
    }
  }

  return {
    query: queryText,
    detected_language: requestedLang.charAt(0).toUpperCase() + requestedLang.slice(1),
    translated_query: llmResponse.translated_query || queryText,
    domain: bestDomain,
    confidence_score,
    cited_sections,
    action_steps: llmResponse.action_steps,
    deadlines: llmResponse.deadlines,
    audit_log,
  }
}
