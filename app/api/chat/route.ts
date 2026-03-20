import { NextRequest, NextResponse } from 'next/server'
import type { LegalResponse, Language } from '@/lib/types'
import { answerLegalQueryWithRag } from '@/lib/rag-openai'

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

    const data = await answerLegalQueryWithRag({
      query: body.query,
      language: body.language,
      include_audit_log: body.include_audit_log,
    })

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
          message: 'An internal server error occurred. Please try again.',
        },
      },
      { status: 500 },
    )
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    name: 'Legal Saathi Chat API',
    version: '1.0.0',
    endpoints: {
      chat: {
        method: 'POST',
        path: '/api/chat',
        description: 'Chat-style legal guidance with RAG citations',
      },
    },
  })
}

