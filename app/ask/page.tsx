'use client'

import { useState, useEffect, Suspense, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Send, Clock, AlertTriangle, CheckCircle, ListOrdered, Scale, MessageSquare, BookOpen, Loader2, Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LegalDomainBadge } from '@/components/legal-domain-badge'
import { ConfidenceMeter } from '@/components/confidence-meter'
import { StatuteCard } from '@/components/statute-card'
import { EscalationBanner } from '@/components/escalation-banner'
import { AuditTrail } from '@/components/audit-trail'
import { useLanguage } from '@/lib/language-context'
import { useVoiceInput } from '@/lib/use-voice-input'
import { topicChips } from '@/lib/mock-data'
import type { LegalResponse, Language as LangType } from '@/lib/types'
import { cn } from '@/lib/utils'

function AskPageContent() {
  const searchParams = useSearchParams()
  const { t, language: uiLanguage } = useLanguage()
  const [query, setQuery] = useState('')
  const [selectedLang, setSelectedLang] = useState<LangType>(uiLanguage as LangType)
  const [isProcessing, setIsProcessing] = useState(false)
  const [response, setResponse] = useState<LegalResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Voice input hook
  const { isListening, isSupported, transcript, error: voiceError, toggleListening } = useVoiceInput({
    language: selectedLang,
    onResult: useCallback((text: string) => {
      setQuery(prev => prev ? `${prev} ${text}` : text)
    }, []),
  })

  // Update query with transcript while listening
  useEffect(() => {
    if (transcript && isListening) {
      setQuery(transcript)
    }
  }, [transcript, isListening])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const initialQueryHandled = useRef(false)

  const chatRef = useRef<HTMLDivElement | null>(null)

  // Keep selector aligned with UI language for initial state changes
  useEffect(() => {
    setSelectedLang(uiLanguage as LangType)
  }, [uiLanguage])

  const handleSubmitQuery = useCallback(async (queryText?: string) => {
    const actualQuery = queryText || query
    if (!actualQuery.trim()) return

    setIsProcessing(true)
    setResponse(null)
    setError(null)
    setHasSubmitted(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: actualQuery,
          language: selectedLang,
          include_audit_log: true,
        }),
      })

      const json = await res.json()

      if (!json?.success || !json?.data) {
        throw new Error(json?.error?.message || 'Request failed')
      }

      const data: LegalResponse = json.data
      setResponse(data)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setError(msg)
    } finally {
      setIsProcessing(false)
    }
  }, [query, selectedLang])

  // Handle initial query from URL params (only once)
  useEffect(() => {
    if (initialQueryHandled.current) return
    
    const q = searchParams.get('q')
    if (q) {
      initialQueryHandled.current = true
      setQuery(q)
      handleSubmitQuery(q)
    }
  }, [searchParams, handleSubmitQuery])

  const handleTopicClick = (topicId: string) => {
    // Use predefined example queries for topics
    const topicQueries: Record<string, { en: string; hi: string }> = {
      'tenant-rights': {
        en: 'My landlord is not returning my security deposit',
        hi: 'मेरा मकान मालिक मेरी सिक्योरिटी डिपॉजिट वापस नहीं कर रहा'
      },
      'police-fir': {
        en: 'Police is refusing to register my FIR',
        hi: 'पुलिस मेरी FIR दर्ज नहीं कर रही है'
      },
      'rti-filing': {
        en: 'How to file RTI application in government office',
        hi: 'सरकारी कार्यालय में RTI कैसे दाखिल करें'
      },
      'workplace-harassment': {
        en: 'I am facing harassment at my workplace',
        hi: 'मुझे कार्यस्थल पर उत्पीड़न का सामना करना पड़ रहा है'
      },
      'consumer-complaint': {
        en: 'I received a defective product and seller is not responding',
        hi: 'मुझे खराब प्रोडक्ट मिला और विक्रेता जवाब नहीं दे रहा'
      },
      'domestic-violence': {
        en: 'I need help regarding domestic violence protection',
        hi: 'मुझे घरेलू हिंसा से सुरक्षा के लिए मदद चाहिए'
      }
    }
    
    const topicQuery = topicQueries[topicId]
    if (!topicQuery) return
    
    const exampleText = selectedLang === 'hi' ? topicQuery.hi : topicQuery.en
    setQuery(exampleText)
    handleSubmitQuery(exampleText)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Page Title */}
          <div className="mb-4 sm:mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              {t('nav.ask')}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-muted-foreground px-2">
              {t('ask.emptyDescription')}
            </p>
          </div>

          {/* Main Grid - Split Layout */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            
            {/* LEFT PANEL - Chat Interface */}
            <div className="space-y-4">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    {t('ask.yourQuestion')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-4 space-y-4">
                  {/* Query Input */}
                  <div className="relative">
                    <Textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={isListening ? t('voice.listening') + '...' : t('ask.placeholder')}
                      className={cn(
                        "min-h-[100px] resize-none text-base pr-12",
                        isListening && "border-accent"
                      )}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmitQuery()
                        }
                      }}
                    />
                    {/* Voice Input Button */}
                    {isSupported && (
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={cn(
                          "absolute top-3 right-3 p-2 rounded-lg transition-all duration-200",
                          isListening 
                            ? "bg-accent text-accent-foreground animate-pulse" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        aria-label={isListening ? t('voice.stopListening') : t('voice.startListening')}
                      >
                        {isListening ? (
                          <MicOff className="h-5 w-5" />
                        ) : (
                          <Mic className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Voice status indicators */}
                  {voiceError && (
                    <p className="text-sm text-destructive">{voiceError}</p>
                  )}
                  {isListening && (
                    <p className="text-sm text-accent flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      {t('voice.listening')}...
                    </p>
                  )}
                  
                  <Button 
                    onClick={() => handleSubmitQuery()}
                    disabled={!query.trim() || isProcessing}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('ask.processing')}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t('ask.submit')}
                      </>
                    )}
                  </Button>

                  {error && (
                    <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  {/* Quick Topics */}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">{t('ask.quickTopics')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {topicChips.map((chip) => (
                        <button
                          key={chip.id}
                          onClick={() => handleTopicClick(chip.id)}
                          disabled={isProcessing}
                          className="rounded-full border bg-background px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                        >
                          {selectedLang === 'hi' ? chip.labelHi : chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Response Summary in Chat */}
                  <div ref={chatRef} className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto space-y-3 pt-2 border-t">
                    {!hasSubmitted && !isProcessing && (
                      <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <Send className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {t('ask.emptyPrompt')}
                        </p>
                      </div>
                    )}

                    {isProcessing && (
                      <div className="flex flex-col items-center justify-center h-full py-8">
                        <div className="relative">
                          <div className="h-16 w-16 rounded-full border-4 border-muted animate-pulse" />
                          <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-spin" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-foreground">{t('ask.analyzingQuery')}...</p>
                        <p className="mt-1 text-xs text-muted-foreground">{t('ask.searchingLegal')}</p>
                      </div>
                    )}

                    {response && !isProcessing && (
                      <div className="space-y-3">
                        {/* User Query */}
                        <div className="flex justify-end">
                          <div className="max-w-[85%] rounded-2xl px-4 py-2 text-sm bg-primary/10 border border-primary/20">
                            {query}
                          </div>
                        </div>
                        
                        {/* AI Response Summary */}
                        <div className="flex justify-start">
                          <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-muted/50 border">
                            <div className="flex items-center gap-2 mb-2">
                              <LegalDomainBadge domain={response.domain} size="sm" />
                              <span className="text-xs text-muted-foreground">
                                {response.confidence_score}% {t('ask.confidence')}
                              </span>
                            </div>
                            <p className="text-foreground leading-relaxed">
                              {response.action_steps[0]}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              {t('ask.seeDetailedGuidance')} →
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT PANEL - Legal Guidance */}
            <div className="space-y-4">
              {/* Loading State */}
              {isProcessing && (
                <Card className="border-primary/20">
                  <CardContent className="py-12">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <Scale className="h-12 w-12 text-primary/20" />
                        <Loader2 className="absolute inset-0 m-auto h-6 w-6 text-primary animate-spin" />
                      </div>
                      <h3 className="text-lg font-semibold">{t('ask.searchingLegal')}</h3>
                      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {t('ask.analyzingQuery')}
                        </p>
                        <p className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t('ask.searchingStatutes')}
                        </p>
                        <p className="flex items-center gap-2 opacity-50">
                          <Clock className="h-4 w-4" />
                          {t('ask.generatingGuidance')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Empty State */}
              {!response && !isProcessing && (
                <Card className="border-dashed h-full min-h-[400px]">
                  <CardContent className="flex flex-col items-center justify-center h-full py-16 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                      {t('ask.legalGuidanceTitle')}
                    </h3>
                    <p className="mt-2 max-w-sm text-muted-foreground leading-relaxed">
                      {t('ask.guidanceDescription')}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Response Content */}
              {response && !isProcessing && (
                <div className="space-y-4">
                  {/* Confidence & Domain */}
                  <Card>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <LegalDomainBadge domain={response.domain} size="lg" />
                          <div>
                            <p className="text-sm font-medium">{response.domain}</p>
                            <p className="text-xs text-muted-foreground">
                              {response.detected_language} {t('ask.query')}
                            </p>
                          </div>
                        </div>
                        <ConfidenceMeter score={response.confidence_score} size="md" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Escalation Banner for low confidence */}
                  {response.confidence_score < 60 && (
                    <EscalationBanner
                      onFindClinic={() => alert('Opening legal aid clinic finder...')}
                      onRequestCallback={() => alert('Callback request submitted!')}
                    />
                  )}

                  {/* Relevant Laws */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        {t('ask.relevantLaws')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {response.cited_sections.map((section, idx) => (
                        <StatuteCard key={idx} section={section} />
                      ))}
                    </CardContent>
                  </Card>

                  {/* Action Steps */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <ListOrdered className="h-4 w-4 text-primary" />
                        {t('ask.actions')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-3">
                        {response.action_steps.map((step, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-foreground leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>

                  {/* Deadlines */}
                  {response.deadlines && response.deadlines.length > 0 && (
                    <Card className="border-warning/50 bg-warning/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-warning text-base">
                          <AlertTriangle className="h-4 w-4" />
                          {t('ask.deadlines')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {response.deadlines.map((deadline, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                              <span className="text-foreground">{deadline}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Audit Trail */}
                  {response.audit_log && response.audit_log.length > 0 && (
                    <Card className="overflow-hidden">
                      <AuditTrail logs={response.audit_log} />
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function AskPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <AskPageContent />
    </Suspense>
  )
}
