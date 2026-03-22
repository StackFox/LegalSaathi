import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const languageNames: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu',
  bn: 'Bengali',
  mr: 'Marathi',
  gu: 'Gujarati',
  kn: 'Kannada',
  ml: 'Malayalam',
  pa: 'Punjabi',
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null
    const language = (formData.get('language') as string) || 'en'

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Speech transcription service not configured' },
        { status: 500 }
      )
    }

    // Convert audio file to base64
    const audioBuffer = await audioFile.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    // Determine MIME type
    const mimeType = audioFile.type || 'audio/webm'

    // Use Gemini for transcription
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const languageName = languageNames[language] || 'English or Hindi'

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Audio,
        },
      },
      {
        text: `Transcribe this audio recording accurately. The speaker may be speaking in ${languageName} or mixing languages. 
        
Rules:
- Output ONLY the transcribed text, nothing else
- If Hindi or other Indian language, write in the original script (Devanagari, etc.)
- If English, write in English
- If mixed, preserve both languages as spoken
- Do not add punctuation unless clearly spoken
- If the audio is unclear or silent, respond with an empty string

Transcribe now:`,
      },
    ])

    const transcript = result.response.text().trim()

    return NextResponse.json({ transcript })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}
