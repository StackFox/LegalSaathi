import fs from 'fs/promises'
import path from 'path'
import OpenAI from 'openai'

import { mockResponses } from './mock-data'
import type { CitedSection, AuditLogEntry, LegalResponse, Language } from './types'

type TopicKey = keyof typeof mockResponses

type VectorDoc = {
  id: string
  topicKey: TopicKey
  domain: LegalResponse['domain']
  citedSection: CitedSection
  embedding: number[]
}

const EMBEDDING_MODEL = 'text-embedding-3-small'
const CHAT_MODEL = 'gpt-4o-mini'
const VECTOR_STORE_VERSION = 1
const STORE_DIR = '.rag'
const STORE_PATH = path.join(process.cwd(), STORE_DIR, `vector-store.v${VECTOR_STORE_VERSION}.json`)

let cachedStore: { docs: Omit<VectorDoc, 'embedding'>[]; embeddings: number[][] } | null = null

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  if (!denom) return 0
  return dot / denom
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

async function embedTexts(openai: OpenAI, inputs: string[]): Promise<number[][]> {
  // Embeddings API supports batching; keep it simple by calling individually
  const result: number[][] = []
  for (const input of inputs) {
    const emb = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input,
    })
    const vec = emb.data[0]?.embedding
    if (!vec) throw new Error('Failed to compute embedding')
    result.push(vec)
  }
  return result
}

async function buildVectorStore(openai: OpenAI): Promise<VectorDoc[]> {
  const docs: VectorDoc[] = []

  for (const [topicKeyRaw, resp] of Object.entries(mockResponses) as Array<
    [TopicKey, (typeof mockResponses)[TopicKey]]
  >) {
    for (const section of resp.cited_sections) {
      const id = `${topicKeyRaw}:${section.act}:${section.section}`
      const text = `${section.act} ${section.section}\n${section.title}\n\n${section.snippet}`
      docs.push({
        id,
        topicKey: topicKeyRaw,
        domain: resp.domain,
        citedSection: section,
        embedding: [], // placeholder
      })
      // We'll embed in a separate step for better batching later.
    }
  }

  const texts = docs.map((d) => {
    const s = d.citedSection
    return `${s.act} ${s.section}\n${s.title}\n\n${s.snippet}`
  })

  const embeddings = await embedTexts(openai, texts)
  return docs.map((d, i) => ({ ...d, embedding: embeddings[i] }))
}

async function getVectorStore(openai: OpenAI): Promise<{ docs: Omit<VectorDoc, 'embedding'>[]; embeddings: number[][] }> {
  if (cachedStore) return cachedStore

  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as { docs: Omit<VectorDoc, 'embedding'>[]; embeddings: number[][] }
    if (parsed?.docs?.length && parsed?.embeddings?.length) {
      cachedStore = parsed
      return cachedStore
    }
  } catch {
    // Build from scratch
  }

  const vectorDocs = await buildVectorStore(openai)
  const docs = vectorDocs.map(({ embedding, ...rest }) => rest)
  const embeddings = vectorDocs.map((d) => d.embedding)

  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true })
  await fs.writeFile(STORE_PATH, JSON.stringify({ docs, embeddings }), 'utf8')

  cachedStore = { docs, embeddings }
  return cachedStore
}

export async function answerLegalQueryWithRag(params: {
  query: string
  language?: Language
  include_audit_log?: boolean
}): Promise<LegalResponse> {
  const { query, language, include_audit_log } = params

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('Query is required')
  }

  const requestedLang = language ?? detectLanguage(query)
  const detectedLang = requestedLang

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY')
  }

  const store = await getVectorStore(openai)

  // 1) Retrieve top contexts
  const queryEmbResp = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query.trim(),
  })
  const queryEmbedding = queryEmbResp.data[0]?.embedding
  if (!queryEmbedding) throw new Error('Failed to compute query embedding')

  const scored = store.docs
    .map((doc, idx) => ({
      doc,
      score: cosineSimilarity(queryEmbedding, store.embeddings[idx]),
    }))
    .sort((a, b) => b.score - a.score)

  const bestTopicScore = new Map<TopicKey, number>()
  for (const { doc, score } of scored) {
    bestTopicScore.set(doc.topicKey, (bestTopicScore.get(doc.topicKey) ?? 0) + score)
  }

  let bestTopic: TopicKey = scored[0]?.doc.topicKey ?? 'tenant-rights'
  let bestTopicTotal = -Infinity
  for (const [k, v] of bestTopicScore.entries()) {
    if (v > bestTopicTotal) {
      bestTopic = k
      bestTopicTotal = v
    }
  }

  const topDocs = scored
    .filter((x) => x.doc.topicKey === bestTopic)
    .slice(0, 3)

  const selectedResponse = mockResponses[bestTopic]

  const maxScore = topDocs[0]?.score ?? 0
  const cited_sections: CitedSection[] = topDocs.map(({ doc, score }) => {
    const ratio = maxScore > 0 ? score / maxScore : 0
    const relevance = ratio >= 0.7 ? 'High' : ratio >= 0.35 ? 'Medium' : 'Low'
    return {
      ...doc.citedSection,
      relevance,
      snippet: doc.citedSection.snippet,
    }
  })

  // 2) Generate answer + steps via LLM
  const context = topDocs
    .map(({ doc }) => {
      const s = doc.citedSection
      return `Act: ${s.act}\nSection: ${s.section}\nTitle: ${s.title}\nSnippet: ${s.snippet}`
    })
    .join('\n\n---\n\n')

  const langLabel = requestedLang === 'hi' ? 'Hindi' : 'English'

  const promptPayload = JSON.stringify(
    {
      query,
      answer_language: langLabel,
      domain_hint: selectedResponse.domain,
      legal_excerpts: context,
      instructions: [
        'Write a short summary in the requested language.',
        'Write action_steps as 5-7 practical steps in that language.',
        'Write deadlines as a list of relevant limitation/response timelines (if not sure, say "depends on facts" but still provide typical timelines).',
        'Each action_step should include at least one citation in the format: [Act - Section].',
        'translated_query must be the query translated to the requested language.',
      ],
      output_schema: {
        translated_query: 'string',
        action_steps: ['string'],
        deadlines: ['string'],
      },
    },
    null,
    2,
  )

  let completion: OpenAI.Chat.Completions.ChatCompletion | null = null
  try {
    completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You are Legal Saathi, a helpful legal information assistant. You provide general guidance, not a substitute for professional legal advice. You MUST use the provided legal excerpts as citations. Output valid JSON only.',
        },
        { role: 'user', content: promptPayload },
      ],
      response_format: { type: 'json_object' } as any,
    })
  } catch {
    // If `response_format` is not supported by the current model or SDK version, retry without it.
    completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You are Legal Saathi, a helpful legal information assistant. You provide general guidance, not a substitute for professional legal advice. You MUST use the provided legal excerpts as citations. Output valid JSON only.',
        },
        { role: 'user', content: promptPayload },
      ],
    })
  }

  const raw = completion.choices[0]?.message?.content

  let llmPayload: { translated_query: string; action_steps: string[]; deadlines: string[] } | null = null
  try {
    llmPayload = raw ? (JSON.parse(raw) as any) : null
  } catch {
    llmPayload = null
  }

  const action_steps = llmPayload?.action_steps?.length ? llmPayload.action_steps : selectedResponse.action_steps
  const deadlines = llmPayload?.deadlines?.length ? llmPayload.deadlines : selectedResponse.deadlines
  const translated_query = llmPayload?.translated_query || query

  const overallBestScore = scored[0]?.score ?? 0
  const confidence_score = overallBestScore > 0 ? Math.round(clamp((maxScore / overallBestScore) * 100, 35, 98)) : 60

  const audit_log: AuditLogEntry[] = include_audit_log
    ? topDocs.map(({ doc, score }) => ({
        statute: `${doc.citedSection.act} ${doc.citedSection.section}`.trim(),
        score,
        method: 'semantic_search',
        timestamp: new Date().toISOString(),
      }))
    : []

  return {
    query: query.trim(),
    detected_language: detectedLang.charAt(0).toUpperCase() + detectedLang.slice(1),
    translated_query,
    domain: selectedResponse.domain,
    confidence_score,
    cited_sections,
    action_steps,
    deadlines,
    audit_log,
  }
}

