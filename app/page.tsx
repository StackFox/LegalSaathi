'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Search, Scale, BookOpen, Shield, Lock, LogIn, MessageSquare, Brain, FileCheck, ArrowRight, Sparkles, Users, Globe, CheckCircle } from 'lucide-react'
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
import { topicChips } from '@/lib/mock-data'

// Animation hook for scroll-triggered animations
function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
      }
    }, { threshold: 0.1, ...options })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return { ref, isVisible }
}

export default function LandingPage() {
  const [query, setQuery] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { t, language } = useLanguage()
  const { isAuthenticated } = useAuth()

  // Animation observers for different sections
  const featuresSection = useIntersectionObserver()
  const howItWorksSection = useIntersectionObserver()
  const statsSection = useIntersectionObserver()

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
      illustration: (
        <div className="relative w-full h-48 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-950/30 dark:to-orange-900/20 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Chat bubble illustration */}
              <div className="w-64 h-40 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                    <div className="h-2 bg-gray-100 dark:bg-slate-600 rounded w-14 mt-1"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-orange-200 dark:bg-orange-800/50 rounded-full w-full animate-pulse"></div>
                  <div className="h-3 bg-orange-100 dark:bg-orange-900/30 rounded-full w-4/5"></div>
                  <div className="h-3 bg-orange-50 dark:bg-orange-950/50 rounded-full w-3/5"></div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-500 rounded-xl rotate-12 flex items-center justify-center shadow-lg animate-bounce-subtle">
                <Mic className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: '2',
      icon: Brain,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      illustration: (
        <div className="relative w-full h-48 bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-950/30 dark:to-blue-900/20 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* AI Processing illustration */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-2xl">
                <Brain className="w-16 h-16 text-white animate-pulse" />
              </div>
              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex items-center justify-center">
                  <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }}>
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s' }}>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              {/* Sparkles */}
              <Sparkles className="absolute -top-6 -left-6 w-6 h-6 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute -bottom-4 -right-8 w-5 h-5 text-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
      ),
    },
    {
      step: '3',
      icon: FileCheck,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      illustration: (
        <div className="relative w-full h-48 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-950/30 dark:to-emerald-900/20 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Document with checkmarks */}
              <div className="w-56 h-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-slate-700">
                  <FileCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Legal Guidance</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded w-4/5"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-700">
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">IPC Section 420, 406...</div>
                </div>
              </div>
              {/* Success badge */}
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-subtle">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const stats = [
    { value: '50,000+', label: t('stats.questions') },
    { value: '15+', label: t('stats.domains') },
    { value: '10', label: t('stats.languages') },
    { value: '85%', label: t('stats.confidence') },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main id="main-content" className="flex-1">
        {/* Hero Section with Light Gradient and Glowing Orange Circle */}
        <section 
          className="relative overflow-hidden min-h-screen flex items-center" 
          style={{
            background: 'linear-gradient(to bottom right, var(--hero-light), var(--hero-mid), var(--hero-light))',
            '--hero-light': 'rgb(230, 230, 250)',
            '--hero-mid': 'rgb(250, 248, 255)',
          } as React.CSSProperties & Record<string, string>}
          aria-labelledby="hero-heading"
        >
          {/* Dark mode background override */}
          <style jsx>{`
            html.dark section {
              --hero-light: rgb(15, 23, 42);
              --hero-mid: rgb(25, 41, 66);
            }
          `}</style>
          
          {/* Animated glowing elements */}
          <div className="absolute inset-0 bg-transparent dark:bg-background" aria-hidden="true">
            {/* Main glowing circle - right side */}
            <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-orange-400/40 dark:bg-orange-500/60 blur-3xl animate-pulse" />
            <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-orange-500/20 dark:bg-orange-400/30 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            {/* Secondary subtle elements */}
            <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-purple-300/20 dark:bg-purple-600/40 blur-3xl" />
            <div className="absolute top-0 left-1/3 h-64 w-64 rounded-full bg-indigo-200/30 dark:bg-indigo-900/50 blur-3xl" />
            
            {/* Additional floating orbs */}
            <div className="absolute top-1/3 left-1/4 h-32 w-32 rounded-full bg-orange-300/20 dark:bg-orange-600/30 blur-2xl animate-float" />
            <div className="absolute bottom-1/4 right-1/3 h-24 w-24 rounded-full bg-indigo-300/20 dark:bg-indigo-600/30 blur-xl animate-float" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="container relative mx-auto px-4 py-16 md:py-24">
            <div className="mx-auto max-w-3xl">
              {/* Badge - animated */}
              <div 
                className={`mb-8 inline-flex items-center gap-2 rounded-full bg-white/40 dark:bg-slate-700/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md border border-white/60 dark:border-slate-600/50 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: '0.1s' }}
              >
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>{t('hero.badge')}</span>
              </div>
              
              {/* Main Heading - animated */}
              <h1 
                id="hero-heading"
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-4 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: '0.2s' }}
              >
                <span className="block">{language === 'hi' ? 'आपकी भाषा में' : 'Free Legal Help in'}</span>
                <span className="block text-orange-500 dark:text-orange-400">
                  {language === 'hi' ? 'मुफ्त कानूनी सहायता' : 'Your Language'}
                </span>
              </h1>

              {/* Highlighted callout box - animated */}
              <div 
                className={`mt-8 inline-block bg-orange-100/60 dark:bg-orange-950/40 px-6 py-4 rounded-2xl border border-orange-200/80 dark:border-orange-800/60 backdrop-blur-sm ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: '0.3s' }}
              >
                <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-orange-100 flex items-center gap-3">
                  <span className="inline-block w-3 h-3 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse" aria-hidden="true"></span>
                  {language === 'hi' ? 'आपकी भाषा में मुफ्त कानूनी सहायता' : 'Free Legal Help in Your Language'}
                </p>
              </div>

              {/* Description - animated */}
              <p 
                className={`mt-8 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: '0.4s' }}
              >
                {t('hero.description')}
              </p>

              {/* Search Form - animated */}
              <form 
                onSubmit={handleSearch} 
                className={`mt-10 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: '0.5s' }}
                role="search"
              >
                <div className="relative mx-auto max-w-2xl">
                  <label htmlFor="search-input" className="sr-only">
                    {t('hero.searchPlaceholder')}
                  </label>
                  <div className="flex items-center rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden border border-gray-200/50 dark:border-slate-700 hover-glow transition-all duration-300">
                    <div className="flex-1 flex items-center">
                      <Search className="ml-5 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                      <input
                        id="search-input"
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder={t('hero.searchPlaceholder')}
                        className="flex-1 border-0 bg-transparent px-4 py-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 md:py-5 text-base sm:text-lg"
                        aria-describedby="search-help"
                      />
                    </div>
                    <button
                      type="button"
                      className="mr-3 rounded-lg p-3 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-600 dark:hover:text-gray-400 transition-colors min-w-[44px] min-h-[44px]"
                      aria-label={language === 'hi' ? 'आवाज़ से बोलें' : 'Voice input'}
                    >
                      <Mic className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <Button 
                      type="submit"
                      className="mr-3 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white px-6 py-3 font-semibold rounded-lg min-h-[48px] text-base group"
                    >
                      {t('hero.search')}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                  <p id="search-help" className="sr-only">
                    {language === 'hi' 
                      ? 'अपना कानूनी सवाल हिंदी या अंग्रेजी में टाइप करें और खोजें बटन दबाएं'
                      : 'Type your legal question in Hindi or English and press search'
                    }
                  </p>
                </div>
              </form>

              {/* Topic Chips - animated with stagger */}
              <div 
                className={`mt-8 flex flex-wrap gap-3 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: '0.6s' }}
                role="list" 
                aria-label={language === 'hi' ? 'लोकप्रिय विषय' : 'Popular topics'}
              >
                {topicChips.slice(0, 4).map((chip, index) => (
                  <button
                    key={chip.id}
                    onClick={() => handleTopicClick(chip.id)}
                    className="rounded-full bg-white/50 dark:bg-slate-700/50 px-5 py-3 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-all hover:bg-white/80 dark:hover:bg-slate-700 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 focus:ring-offset-2 backdrop-blur-sm border border-white/70 dark:border-slate-600 min-h-[44px]"
                    role="listitem"
                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                  >
                    {language === 'hi' ? chip.labelHi : chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Features Section - Enhanced with animations */}
        <section 
          ref={featuresSection.ref}
          className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30" 
          aria-labelledby="features-heading"
        >
          <div className="container mx-auto px-4">
            <div className={`mx-auto max-w-3xl text-center ${featuresSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-foreground md:text-4xl text-balance">
                {t('features.title')}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card 
                    key={feature.title} 
                    className={`text-center hover-lift border-0 shadow-lg bg-card/80 backdrop-blur-sm ${featuresSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${0.2 + index * 0.15}s` }}
                  >
                    <CardHeader>
                      <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" aria-hidden="true" />
                      </div>
                      <CardTitle className="mt-6 text-lg sm:text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* How it Works Section - Enhanced with illustrations and animations */}
        <section 
          ref={howItWorksSection.ref}
          className="py-20 md:py-32 bg-muted/50 overflow-hidden" 
          aria-labelledby="how-it-works-heading"
        >
          <div className="container mx-auto px-4">
            <div className={`mx-auto max-w-3xl text-center mb-16 ${howItWorksSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'hi' ? 'सरल प्रक्रिया' : 'Simple Process'}</span>
              </div>
              <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                {t('howItWorks.title')}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('howItWorks.subtitle')}
              </p>
            </div>

            <div className="space-y-16 md:space-y-24">
              {howItWorks.map((item, index) => {
                const Icon = item.icon
                const isEven = index % 2 === 0
                return (
                  <div 
                    key={item.step}
                    className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 ${howItWorksSection.isVisible ? (isEven ? 'animate-slide-in-left' : 'animate-slide-in-right') : 'opacity-0'}`}
                    style={{ animationDelay: `${0.3 + index * 0.2}s` }}
                  >
                    {/* Illustration */}
                    <div className="w-full md:w-1/2">
                      {item.illustration}
                    </div>
                    
                    {/* Content */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                      <div className="inline-flex items-center gap-4 mb-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white text-xl font-bold shadow-lg">
                          {item.step}
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={`mt-16 text-center ${howItWorksSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.9s' }}>
              <Button 
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthModal(true)
                  } else {
                    router.push('/ask')
                  }
                }}
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {t('howItWorks.cta')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section - Enhanced with animations */}
        <section 
          ref={statsSection.ref}
          className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background" 
          aria-label={language === 'hi' ? 'आंकड़े' : 'Statistics'}
        >
          <div className="container mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className={`text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm hover-lift ${statsSection.isVisible ? 'animate-count-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-muted-foreground text-base font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sign-in Required Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 animate-scale-in">
              <LogIn className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <DialogTitle className="text-center text-xl">
              {language === 'hi' ? 'कृपया साइन इन करें' : 'Please Sign In'}
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              {language === 'hi' 
                ? 'अपने कानूनी सवालों का जवाब पाने के लिए कृपया पहले साइन इन करें। यह मुफ्त है!'
                : 'Please sign in to get answers to your legal questions. It\'s free!'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={() => router.push('/sign-in')}
              className="w-full min-h-[52px] text-base group"
            >
              {language === 'hi' ? 'साइन इन करें' : 'Sign In'}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/sign-up')}
              className="w-full min-h-[52px] text-base"
            >
              {language === 'hi' ? 'नया खाता बनाएं' : 'Create New Account'}
            </Button>
            <p className="text-center text-sm text-muted-foreground pt-2 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              {language === 'hi' 
                ? 'आपकी जानकारी सुरक्षित है'
                : 'Your information is secure'
              }
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
