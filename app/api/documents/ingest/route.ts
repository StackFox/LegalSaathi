import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs/promises'
import path from 'path'

const EMBEDDING_MODEL = 'text-embedding-3-small'
const STORE_DIR = '.rag'
const CUSTOM_DOCS_STORE_PATH = path.join(process.cwd(), STORE_DIR, 'custom-documents.json')

// Chunk configuration
const CHUNK_SIZE = 1000 // characters
const CHUNK_OVERLAP = 200 // characters

interface DocumentChunk {
  id: string
  documentId: string
  documentName: string
  content: string
  chunkIndex: number
  totalChunks: number
  embedding: number[]
  createdAt: string
}

interface CustomDocumentsStore {
  documents: Array<{
    id: string
    name: string
    totalChunks: number
    createdAt: string
  }>
  chunks: Array<Omit<DocumentChunk, 'embedding'>>
  embeddings: number[][]
}

// Split text into overlapping chunks
function splitIntoChunks(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    let chunk = text.slice(start, end)

    // Try to break at sentence boundaries if possible
    if (end < text.length) {
      const lastSentenceEnd = chunk.lastIndexOf('.')
      const lastNewline = chunk.lastIndexOf('\n')
      const breakPoint = Math.max(lastSentenceEnd, lastNewline)
      
      if (breakPoint > chunkSize * 0.5) {
        chunk = chunk.slice(0, breakPoint + 1)
      }
    }

    chunks.push(chunk.trim())
    start = start + chunk.length - overlap
    
    // Prevent infinite loops
    if (start <= 0 && chunks.length > 1) break
  }

  return chunks.filter(c => c.length > 0)
}

// Clean and normalize text
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

// Generate embeddings for chunks
async function embedChunks(openai: OpenAI, chunks: string[]): Promise<number[][]> {
  const embeddings: number[][] = []
  
  // Process in batches to avoid rate limits
  const batchSize = 10
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize)
    
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
    })
    
    for (const item of response.data) {
      embeddings.push(item.embedding)
    }
  }
  
  return embeddings
}

// Load existing custom documents store
async function loadStore(): Promise<CustomDocumentsStore> {
  try {
    const data = await fs.readFile(CUSTOM_DOCS_STORE_PATH, 'utf8')
    return JSON.parse(data)
  } catch {
    return { documents: [], chunks: [], embeddings: [] }
  }
}

// Save custom documents store
async function saveStore(store: CustomDocumentsStore): Promise<void> {
  await fs.mkdir(path.dirname(CUSTOM_DOCS_STORE_PATH), { recursive: true })
  await fs.writeFile(CUSTOM_DOCS_STORE_PATH, JSON.stringify(store), 'utf8')
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const textContent = formData.get('content') as string | null
    const documentName = formData.get('name') as string | null

    if (!file && !textContent) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'Either file or text content is required' } },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFIG_ERROR', message: 'OpenAI API key is not configured' } },
        { status: 500 }
      )
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    let rawText: string
    let finalDocName: string

    if (file) {
      // Handle file upload
      const fileBuffer = await file.arrayBuffer()
      const fileText = new TextDecoder('utf-8').decode(fileBuffer)
      rawText = fileText
      finalDocName = documentName || file.name
    } else {
      // Handle direct text content
      rawText = textContent!
      finalDocName = documentName || `Document ${Date.now()}`
    }

    // Clean and process the text
    const cleanedText = cleanText(rawText)
    
    if (cleanedText.length < 50) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CONTENT', message: 'Document content is too short (minimum 50 characters)' } },
        { status: 400 }
      )
    }

    // Split into chunks
    const textChunks = splitIntoChunks(cleanedText, CHUNK_SIZE, CHUNK_OVERLAP)
    
    if (textChunks.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'CHUNKING_ERROR', message: 'Failed to split document into chunks' } },
        { status: 500 }
      )
    }

    // Generate embeddings
    const embeddings = await embedChunks(openai, textChunks)

    // Create document and chunk records
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const createdAt = new Date().toISOString()

    const newDocument = {
      id: documentId,
      name: finalDocName,
      totalChunks: textChunks.length,
      createdAt,
    }

    const newChunks = textChunks.map((content, index) => ({
      id: `chunk_${documentId}_${index}`,
      documentId,
      documentName: finalDocName,
      content,
      chunkIndex: index,
      totalChunks: textChunks.length,
      createdAt,
    }))

    // Load existing store and add new data
    const store = await loadStore()
    store.documents.push(newDocument)
    store.chunks.push(...newChunks)
    store.embeddings.push(...embeddings)

    // Save updated store
    await saveStore(store)

    return NextResponse.json({
      success: true,
      data: {
        documentId,
        documentName: finalDocName,
        totalChunks: textChunks.length,
        totalCharacters: cleanedText.length,
        createdAt,
      },
    })
  } catch (error) {
    console.error('Document ingestion error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'SERVER_ERROR', 
          message: error instanceof Error ? error.message : 'Failed to process document' 
        } 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const store = await loadStore()
    
    return NextResponse.json({
      success: true,
      data: {
        documents: store.documents,
        totalDocuments: store.documents.length,
        totalChunks: store.chunks.length,
      },
    })
  } catch (error) {
    console.error('Error loading documents:', error)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to load documents' } },
      { status: 500 }
    )
  }
}
