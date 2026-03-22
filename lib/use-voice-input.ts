'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export interface UseVoiceInputOptions {
  language?: string
  continuous?: boolean
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
}

export interface UseVoiceInputReturn {
  isListening: boolean
  isSupported: boolean
  isMounted: boolean
  transcript: string
  error: string | null
  startListening: () => void
  stopListening: () => void
  toggleListening: () => void
}

const languageCodeMap: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
}

export function useVoiceInput(options: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const { language = 'en', continuous = false, onResult, onError } = options
  
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const useWebSpeechAPI = useRef(false)

  // Handle client-side mounting first
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    
    if (typeof window !== 'undefined') {
      // Check for Web Speech API (Chrome/Edge)
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
      
      // Check for MediaRecorder API (all modern browsers)
      const hasMediaRecorder = typeof MediaRecorder !== 'undefined' && navigator.mediaDevices?.getUserMedia
      
      // Prefer Web Speech API if available (real-time transcription)
      if (SpeechRecognitionAPI) {
        useWebSpeechAPI.current = true
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognitionAPI()
        recognitionRef.current.continuous = continuous
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = languageCodeMap[language] || 'en-IN'
      } else if (hasMediaRecorder) {
        // Fallback to MediaRecorder (requires backend transcription)
        useWebSpeechAPI.current = false
        setIsSupported(true)
      } else {
        setIsSupported(false)
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [isMounted, continuous, language])

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = languageCodeMap[language] || 'en-IN'
    }
  }, [language])

  // Transcribe audio using server API
  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('language', language)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const data = await response.json()
      return data.transcript || ''
    } catch (err) {
      console.error('Transcription error:', err)
      throw err
    }
  }, [language])

  // Start recording with MediaRecorder
  const startMediaRecorder = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        } 
      })
      
      audioChunksRef.current = []
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      })
      
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop())
        
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          
          try {
            setTranscript('Transcribing...')
            const text = await transcribeAudio(audioBlob)
            if (text) {
              onResult?.(text)
            }
            // Clear transcript after successful transcription (query is updated via onResult)
            setTranscript('')
          } catch (err) {
            setTranscript('')
            setError('Failed to transcribe audio. Please try again.')
            onError?.('Failed to transcribe audio')
          }
        }
        
        setIsListening(false)
      }

      mediaRecorder.onerror = () => {
        setError('Recording failed. Please try again.')
        setIsListening(false)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsListening(true)
      setError(null)
      setTranscript('')
    } catch (err) {
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access.')
        onError?.('Microphone access denied')
      } else {
        setError('Failed to access microphone. Please check your settings.')
        onError?.('Failed to access microphone')
      }
    }
  }, [language, onResult, onError, transcribeAudio])

  const startListening = useCallback(() => {
    setError(null)
    setTranscript('')

    if (useWebSpeechAPI.current && recognitionRef.current) {
      // Use Web Speech API (Chrome/Edge)
      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          } else {
            interimTranscript += result[0].transcript
          }
        }

        const currentTranscript = finalTranscript || interimTranscript
        setTranscript(currentTranscript)
        
        if (finalTranscript) {
          onResult?.(finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorMessage = 'An error occurred during speech recognition'
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.'
            break
          case 'audio-capture':
            errorMessage = 'No microphone found. Please check your microphone settings.'
            break
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access.'
            break
          case 'network':
            errorMessage = 'Network error occurred. Please check your connection.'
            break
          case 'aborted':
            return
        }
        
        setError(errorMessage)
        setIsListening(false)
        onError?.(errorMessage)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      try {
        recognitionRef.current.start()
      } catch (err) {
        setError('Failed to start speech recognition')
        onError?.('Failed to start speech recognition')
      }
    } else if (isSupported) {
      // Use MediaRecorder fallback
      startMediaRecorder()
    } else {
      setError('Speech recognition is not supported in this browser')
      onError?.('Speech recognition is not supported in this browser')
    }
  }, [isSupported, onResult, onError, startMediaRecorder])

  const stopListening = useCallback(() => {
    if (useWebSpeechAPI.current && recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      // isListening will be set to false in onstop handler
    }
  }, [isListening])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    isSupported,
    isMounted,
    transcript,
    error,
    startListening,
    stopListening,
    toggleListening,
  }
}
