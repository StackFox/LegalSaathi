'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, MicOff, Search, Scale, BookOpen, Shield, Lock, LogIn, MessageSquare, Brain, FileCheck, ArrowRight, Sparkles, Users, Globe, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useLanguage } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import { useVoiceInput } from '@/lib/use-voice-input'
import { topicChips } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  const [query, setQuery] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { t, language } = useLanguage()
  const { isAuthenticated } = useAuth()

  // Voice input hook
  const { isListening, isSupported, isMounted: voiceMounted, transcript, error: voiceError, toggleListening } = useVoiceInput({
    language,
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    
    router.push(`/ask?q=${encodeURIComponent(query)}`)
  }

  const handleTopicClick = (topicId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    router.push(`/ask?topic=${topicId}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const features = [
    {
      icon: BookOpen,
      title: t('features.citedLaws.title'),
      description: t('features.citedLaws.description'),
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Globe,
      title: t('features.multilingual.title'),
      description: t('features.multilingual.description'),
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Lock,
      title: t('features.free.title'),
      description: t('features.free.description'),
      gradient: 'from-green-500 to-emerald-600',
    },
  ]

  const howItWorks = [
    {
      step: '1',
      icon: MessageSquare,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
    },
    {
      step: '2',
      icon: Brain,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
    },
    {
      step: '3',
      icon: FileCheck,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
    },
  ]

  const stats = [
    { value: '50,000+', label: t('stats.questions') },
    { value: '15+', label: t('stats.domains') },
    { value: '10', label: t('stats.languages') },
    { value: '85%', label: t('stats.confidence') },
  ]

  if (!mounted) return null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section 
          className="relative overflow-hidden min-h-screen flex items-center bg-background" 
          aria-labelledby="hero-heading"
        >
          {/* Simplified background - static gradients */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-20 right-[15%] w-72 h-72 rounded-full bg-gradient-to-br from-accent/20 to-orange-400/10 blur-3xl" />
            <div className="absolute bottom-20 left-[10%] w-96 h-96 rounded-full bg-gradient-to-tr from-violet-500/15 to-blue-500/10 blur-3xl" />
          </div>
          
          <div className="container relative mx-auto px-4 py-12 sm:py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left animate-fade-in">
                {/* Badge */}
                <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full bg-muted/80 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-muted-foreground backdrop-blur-sm border border-border/50">
                  <Shield className="h-4 w-4" aria-hidden="true" />
                  <span>{t('hero.badge')}</span>
                </div>
                
                {/* Main Heading */}
                <h1 
                  id="hero-heading"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight mb-4"
                >
                  <span className="block text-accent">
                    {t('hero.title')}
                  </span>
                </h1>

                {/* Highlighted callout box */}
                <div className="mt-8 inline-block bg-accent/10 px-6 py-4 rounded-2xl border border-accent/20 backdrop-blur-sm">
                  <p className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-3">
                    <span className="inline-block w-3 h-3 rounded-full bg-accent animate-pulse" />
                    {t('hero.aiPowered')}
                  </p>
                </div>

                {/* Description */}
                <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  {t('hero.description')}
                </p>

                {/* Search Form */}
                <form 
                  onSubmit={handleSearch} 
                  className="mt-6 sm:mt-10"
                  role="search"
                >
                  <div className="relative mx-auto max-w-2xl">
                    <label htmlFor="search-input" className="sr-only">
                      {t('hero.searchPlaceholder')}
                    </label>
                    <div className="flex items-center rounded-xl sm:rounded-2xl bg-card shadow-2xl overflow-hidden border border-border">
                      <div className="flex-1 flex items-center min-w-0">
                        <Search className="ml-3 sm:ml-5 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                        <input
                          id="search-input"
                          type="text"
                          value={query}
                          onChange={handleInputChange}
                          placeholder={isListening ? t('voice.listening') : t('hero.searchPlaceholder')}
                          className={cn(
                            "flex-1 border-0 bg-transparent px-2 sm:px-4 py-3 sm:py-4 md:py-5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm sm:text-base min-w-0",
                            isListening && "placeholder:text-accent"
                          )}
                          aria-describedby="search-help"
                        />
                      </div>
                      {/* Voice Input Button - always show, disable if not supported */}
                      <button
                        type="button"
                        onClick={toggleListening}
                        disabled={!voiceMounted || !isSupported}
                        className={cn(
                          "flex items-center justify-center mr-2 sm:mr-3 rounded-lg p-2 sm:p-3 min-w-[36px] sm:min-w-[44px] min-h-[36px] sm:min-h-[44px] transition-all duration-200",
                          isListening 
                            ? "bg-accent text-accent-foreground animate-pulse" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          (!voiceMounted || !isSupported) && "opacity-50 cursor-not-allowed"
                        )}
                        aria-label={isListening ? t('voice.stopListening') : t('voice.startListening')}
                        title={!isSupported && voiceMounted ? "Voice input not supported in this browser" : undefined}
                      >
                        {isListening ? (
                          <MicOff className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                        ) : (
                          <Mic className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                        )}
                      </button>
                      <Button
                        type="submit"
                        className="mr-2 sm:mr-3 bg-accent hover:bg-accent/90 text-accent-foreground px-3 sm:px-6 py-2 sm:py-3 font-semibold rounded-lg sm:rounded-xl min-h-[36px] sm:min-h-[48px] text-sm sm:text-base shadow-lg shadow-accent/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span className="hidden sm:inline">{t('hero.search')}</span>
                        <ArrowRight className="w-4 h-4 sm:ml-2" />
                      </Button>
                    </div>
                    {/* Voice error message */}
                    {voiceError && (
                      <p className="mt-2 text-sm text-destructive text-center">{voiceError}</p>
                    )}
                    {/* Listening indicator */}
                    {isListening && (
                      <p className="mt-2 text-sm text-accent text-center flex items-center justify-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                        {t('voice.listening')}...
                      </p>
                    )}
                  </div>
                </form>

                {/* Topic Chips */}
                <div 
                  className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start"
                  role="list" 
                  aria-label={t('ask.quickTopics')}
                >
                  {topicChips.slice(0, 4).map((chip, index) => (
                    <button
                      key={chip.id}
                      onClick={() => handleTopicClick(chip.id)}
                      className="rounded-full bg-muted/80 px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 backdrop-blur-sm border border-border/50 min-h-[36px] sm:min-h-[44px] transition-all hover:-translate-y-0.5"
                      role="listitem"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {language === 'hi' ? chip.labelHi : chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Mockup - Simplified static version */}
              <div className="hidden lg:flex justify-center items-center animate-fade-in">
                <div className="relative">
                  {/* Phone frame */}
                  <div className="relative w-[280px] h-[580px] bg-card rounded-[3rem] p-2 shadow-2xl border border-border">
                    {/* Phone inner bezel */}
                    <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-card rounded-b-2xl z-10" />
                      
                      {/* Screen content */}
                      <div className="pt-10 px-4 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
                            <Scale className="w-4 h-4 text-accent-foreground" />
                          </div>
                          <span className="font-semibold text-foreground text-sm">Legal Saathi</span>
                        </div>
                        
                        {/* Chat bubbles */}
                        <div className="space-y-3 flex-1">
                          {/* User message */}
                          <div className="flex justify-end">
                            <div className="bg-accent text-accent-foreground text-xs px-3 py-2 rounded-2xl rounded-br-md max-w-[180px]">
                              {t('phone.userMessage')}
                            </div>
                          </div>
                          
                          {/* AI response */}
                          <div className="flex justify-start">
                            <div className="bg-muted text-foreground text-xs px-3 py-2 rounded-2xl rounded-bl-md max-w-[200px]">
                              <div className="flex items-center gap-1 mb-1">
                                <BookOpen className="w-3 h-3 text-accent" />
                                <span className="text-[10px] text-accent font-medium">{t('illustration.rentControlAct')}</span>
                              </div>
                              {t('phone.aiResponse')}
                            </div>
                          </div>
                          
                          {/* Legal citation */}
                          <div className="flex justify-start">
                            <div className="bg-green-500/10 border border-green-500/20 text-foreground text-xs px-3 py-2 rounded-xl max-w-[180px]">
                              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <CheckCircle className="w-3 h-3" />
                                <span className="text-[10px] font-medium">Section 4(1)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Input field mockup */}
                        <div className="mb-8 flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
                          <div className="flex-1 text-xs text-muted-foreground">
                            {t('phone.inputPlaceholder')}
                          </div>
                          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                            <ArrowRight className="w-3 h-3 text-accent-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements - static */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-card rounded-xl shadow-lg flex items-center justify-center border border-border">
                    <Shield className="w-6 h-6 text-green-500" />
                  </div>
                  
                  <div className="absolute top-1/3 -left-6 w-10 h-10 bg-card rounded-lg shadow-lg flex items-center justify-center border border-border">
                    <Globe className="w-5 h-5 text-blue-500" />
                  </div>
                  
                  <div className="absolute bottom-20 -right-8 w-14 h-14 bg-card rounded-2xl shadow-lg flex items-center justify-center border border-border">
                    <Sparkles className="w-7 h-7 text-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section 
          className="py-12 sm:py-20 md:py-32 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden" 
          aria-labelledby="features-heading"
        >
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 id="features-heading" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-balance">
                {t('features.title')}
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground px-2">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="mt-8 sm:mt-12 md:mt-16 grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card 
                    key={feature.title}
                    className="text-center border border-border/50 shadow-xl bg-card hover:shadow-2xl hover:border-accent/20 transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-2">
                      <div className={`mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" aria-hidden="true" />
                      </div>
                      <CardTitle className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm sm:text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section 
          className="py-12 sm:py-20 md:py-32 bg-background overflow-hidden" 
          aria-labelledby="how-it-works-heading"
        >
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-accent/10 text-accent text-xs sm:text-sm font-medium mb-4">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{t('howItWorks.simpleProcess')}</span>
              </div>
              <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                {t('howItWorks.title')}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('howItWorks.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => {
                const Icon = item.icon
                return (
                  <div 
                    key={item.step}
                    className="text-center"
                  >
                    <div className="inline-flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-accent text-accent-foreground text-base sm:text-xl font-bold shadow-lg">
                        {item.step}
                      </div>
                      <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-accent/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-accent" />
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-4">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 sm:mt-16 text-center">
              <Button 
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthModal(true)
                  } else {
                    router.push('/ask')
                  }
                }}
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-lg shadow-accent/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('howItWorks.cta')}
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section 
          className="py-12 sm:py-20 md:py-28 bg-gradient-to-t from-muted/30 to-background relative" 
          aria-label={t('stats.title')}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card 
                  key={stat.label}
                  className="text-center p-4 sm:p-8 border border-border/50 shadow-lg hover:shadow-xl hover:border-accent/30 transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-accent">
                    {stat.value}
                  </div>
                  <div className="mt-1 sm:mt-3 text-muted-foreground text-xs sm:text-base font-medium">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sign-in Required Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md mx-4 rounded-xl">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-accent/10 mb-3 sm:mb-4">
              <LogIn className="h-6 w-6 sm:h-8 sm:w-8 text-accent" aria-hidden="true" />
            </div>
            <DialogTitle className="text-center text-lg sm:text-xl">
              {t('modal.pleaseSignIn')}
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base pt-2">
              {t('modal.signInDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={() => router.push('/sign-in')}
              className="w-full min-h-[44px] sm:min-h-[52px] text-sm sm:text-base bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {t('auth.signIn')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/sign-up')}
              className="w-full min-h-[44px] sm:min-h-[52px] text-sm sm:text-base"
            >
              {t('modal.createAccount')}
            </Button>
            <p className="text-center text-xs sm:text-sm text-muted-foreground pt-2 flex items-center justify-center gap-2">
              <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
              {t('modal.infoSecure')}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
