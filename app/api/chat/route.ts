import { NextRequest, NextResponse } from 'next/server'
import type { LegalResponse, Language } from '@/lib/types'
import { answerLegalQueryWithGeminiPinecone } from '@/lib/rag-gemini-pinecone'
import { answerLegalQueryWithRag as answerWithTfIdf } from '@/lib/rag'

interface ChatRequest {
  query: string
  language?: Language
  include_audit_log?: boolean
}

interface ApiResponse {
  success: boolean
  data?: LegalResponse
  error?: {
    code: string
    message: string
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body: ChatRequest = await request.json()

    if (!body.query || typeof body.query !== 'string' || body.query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Query parameter is required and must be a non-empty string',
          },
        },
        { status: 400 },
      )
    }

    let data: LegalResponse

    // Use Gemini + Pinecone if API keys are available, otherwise fallback to TF-IDF
    if (process.env.GOOGLE_AI_API_KEY && process.env.PINECONE_API_KEY) {
      data = await answerLegalQueryWithGeminiPinecone({
        query: body.query,
        language: body.language,
        include_audit_log: body.include_audit_log,
      })
    } else {
      // Fallback to TF-IDF based RAG (works without external API)
      const missingKeys = []
      if (!process.env.GOOGLE_AI_API_KEY) missingKeys.push('GOOGLE_AI_API_KEY')
      if (!process.env.PINECONE_API_KEY) missingKeys.push('PINECONE_API_KEY')
      console.warn(`Missing ${missingKeys.join(', ')} - using TF-IDF fallback for RAG`)
      
      data = await answerWithTfIdf({
        query: body.query,
        language: body.language,
        include_audit_log: body.include_audit_log,
      })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'An internal server error occurred. Please try again.',
        },
      },
      { status: 500 },
    )
  }
}

export async function GET(): Promise<NextResponse> {
  const hasGemini = !!process.env.GOOGLE_AI_API_KEY
  const hasPinecone = !!process.env.PINECONE_API_KEY
  
  return NextResponse.json({
    name: 'Legal Saathi Chat API',
    version: '2.0.0',
    endpoints: {
      chat: {
        method: 'POST',
        path: '/api/chat',
        description: 'Chat-style legal guidance with RAG citations',
      },
    },
    mode: hasGemini && hasPinecone ? 'gemini-pinecone' : 'tfidf-fallback',
    status: {
      gemini: hasGemini ? 'configured' : 'not configured',
      pinecone: hasPinecone ? 'configured' : 'not configured',
    },
  })
}

