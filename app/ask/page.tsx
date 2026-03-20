'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Send, Clock, AlertTriangle, CheckCircle, ListOrdered } from 'lucide-react'
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
import { QueryProcessor } from '@/components/query-processor'
import { useLanguage } from '@/lib/language-context'
import { mockResponses, languageOptions, topicChips } from '@/lib/mock-data'
import type { LegalResponse, Language as LangType } from '@/lib/types'

function AskPageContent() {
  const searchParams = useSearchParams()
  const { t, language: uiLanguage } = useLanguage()
  const [query, setQuery] = useState('')
  const [selectedLang, setSelectedLang] = useState<LangType>(uiLanguage as LangType)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [response, setResponse] = useState<LegalResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([])
  const threadRef = useRef<HTMLDivElement | null>(null)

  // Handle initial query from URL params
  useEffect(() => {
    const q = searchParams.get('q')
    const topic = searchParams.get('topic')
    
    if (q) {
      setQuery(q)
      handleSubmitQuery(q)
    } else if (topic && mockResponses[topic]) {
      const topicResponse = mockResponses[topic]
      const exampleText = uiLanguage === 'hi' ? topicResponse.query : topicResponse.translated_query
      setQuery(exampleText)
      handleSubmitQuery(exampleText)
    }
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep selector aligned with UI language for initial state changes
  useEffect(() => {
    setSelectedLang(uiLanguage as LangType)
  }, [uiLanguage])

  useEffect(() => {
    const el = threadRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length, isProcessing])

  const handleSubmitQuery = async (queryText?: string) => {
    const actualQuery = queryText || query
    if (!actualQuery.trim()) return

    setIsProcessing(true)
    setProcessingStep(0)
    setResponse(null)
    setError(null)

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user' as const,
      content: actualQuery,
    }
    setMessages((prev) => [...prev, userMsg])

    // Update processing steps while the API is running
    const stepsPromise = (async () => {
      for (let i = 0; i <= 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 350))
        setProcessingStep(i)
      }
    })()

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
      await stepsPromise

      if (!json?.success || !json?.data) {
        throw new Error(json?.error?.message || 'Request failed')
      }

      const data: LegalResponse = json.data
      setResponse(data)

      const sources = data.cited_sections
        .slice(0, 2)
        .map((s) => `${s.act} ${s.section}`.trim())
        .join(', ')

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: `Domain: ${data.domain}\nConfidence: ${data.confidence_score}%\n\n${data.action_steps[0] ? `Top guidance: ${data.action_steps[0]}` : ''}${sources ? `\n\nSources: ${sources}` : ''}`.trim(),
        },
      ])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setError(msg)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTopicClick = (topicId: string) => {
    const topicResponse = mockResponses[topicId]
    if (!topicResponse) return
    const exampleText = selectedLang === 'hi' ? topicResponse.query : topicResponse.translated_query
    setQuery(exampleText)
    handleSubmitQuery(exampleText)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-[400px,1fr] xl:grid-cols-[450px,1fr]">
            {/* Left Panel - Input */}
            <div className="space-y-6">
              {/* Language Selector */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{t('ask.selectLanguage')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLang(lang.code as LangType)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          selectedLang === lang.code
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {lang.nativeLabel}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Query Input */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{t('ask.yourQuestion')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('ask.placeholder')}
                    className="min-h-[120px] resize-none text-base"
                  />
                  <Button 
                  onClick={() => handleSubmitQuery()}
                    disabled={!query.trim() || isProcessing}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {t('ask.submit')}
                  </Button>
                {error && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                )}
                </CardContent>
              </Card>

              {/* Topic Chips */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{t('ask.quickTopics')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {topicChips.map((chip) => (
                      <button
                        key={chip.id}
                        onClick={() => handleTopicClick(chip.id)}
                        className="rounded-full border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        {selectedLang === 'hi' ? chip.labelHi : chip.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Confidence Meter - shown after response */}
              {response && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{t('ask.confidence')}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <ConfidenceMeter score={response.confidence_score} size="lg" />
                  </CardContent>
                </Card>
              )}

              {/* Escalation Banner */}
              {response && response.confidence_score < 60 && (
                <EscalationBanner
                  onFindClinic={() => alert('Opening legal aid clinic finder...')}
                  onRequestCallback={() => alert('Callback request submitted!')}
                />
              )}
            </div>

            {/* Right Panel - Response */}
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{t('nav.ask')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div
                    ref={threadRef}
                    className="max-h-[340px] space-y-3 overflow-y-auto pr-2"
                  >
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <Send className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                          {t('ask.emptyDescription')}
                        </p>
                      </div>
                    ) : (
                      messages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                              m.role === 'user'
                                ? 'bg-primary/10 text-foreground border border-primary/20'
                                : 'bg-muted/50 text-foreground border border-border'
                            }`}
                          >
                            {m.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Processing State */}
              {isProcessing && (
                <Card>
                  <CardContent className="py-8">
                    <QueryProcessor currentStep={processingStep} />
                  </CardContent>
                </Card>
              )}

              {/* Response Card */}
              {response && !isProcessing && (
                <>
                  {/* Header with Domain Badge */}
                  <Card>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <LegalDomainBadge domain={response.domain} size="lg" />
                          <span className="text-sm text-muted-foreground">
                            {response.detected_language} Query
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Just now</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Plain Language Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        {t('ask.summary')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-medium text-foreground">
                        {response.translated_query}
                      </p>
                      <p className="mt-2 text-muted-foreground">
                        {selectedLang === 'hi' ? response.query : response.translated_query}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Relevant Laws */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('ask.relevantLaws')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {response.cited_sections.map((section, idx) => (
                        <StatuteCard key={idx} section={section} />
                      ))}
                    </CardContent>
                  </Card>

                  {/* Action Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ListOrdered className="h-5 w-5 text-primary" />
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
                            <span className="text-foreground leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>

                  {/* Important Deadlines */}
                  {response.deadlines.length > 0 && (
                    <Card className="border-warning/50 bg-warning/5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-warning text-lg">
                          <AlertTriangle className="h-5 w-5" />
                          {t('ask.deadlines')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {response.deadlines.map((deadline, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                              <span className="text-foreground">{deadline}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Audit Trail */}
                  <Card className="overflow-hidden">
                    <AuditTrail logs={response.audit_log} />
                  </Card>
                </>
              )}

              {/* Empty State */}
              {!response && !isProcessing && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Send className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                      {t('ask.emptyTitle')}
                    </h3>
                    <p className="mt-2 max-w-sm text-muted-foreground leading-relaxed">
                      {t('ask.emptyDescription')}
                    </p>
                  </CardContent>
                </Card>
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
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <AskPageContent />
    </Suspense>
  )
}
