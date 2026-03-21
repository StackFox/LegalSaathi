'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Search, Scale, BookOpen, Shield, Lock, LogIn } from 'lucide-react'
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

export default function LandingPage() {
  const [query, setQuery] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()
  const { t, language } = useLanguage()
  const { isAuthenticated } = useAuth()

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
    },
    {
      icon: Scale,
      title: t('features.multilingual.title'),
      description: t('features.multilingual.description'),
    },
    {
      icon: Lock,
      title: t('features.free.title'),
      description: t('features.free.description'),
    },
  ]

  const howItWorks = [
    {
      step: '1',
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
    },
    {
      step: '2',
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
    },
    {
      step: '3',
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
    },
  ]

  const stats = [
    { value: '50,000+', label: t('stats.questions') },
    { value: '15+', label: t('stats.domains') },
    { value: '6', label: t('stats.languages') },
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
          
          {/* Animated glowing orange circle - more prominent */}
          <div className="absolute inset-0 bg-transparent dark:bg-background" aria-hidden="true">
            {/* Main glowing circle - right side */}
            <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-orange-400/40 dark:bg-orange-500/60 blur-3xl animate-pulse" />
            <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-orange-500/20 dark:bg-orange-400/30 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            {/* Secondary subtle elements */}
            <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-purple-300/20 dark:bg-purple-600/40 blur-3xl" />
            <div className="absolute top-0 left-1/3 h-64 w-64 rounded-full bg-indigo-200/30 dark:bg-indigo-900/50 blur-3xl" />
          </div>
          
          <div className="container relative mx-auto px-4 py-16 md:py-24">
            <div className="mx-auto max-w-3xl">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/40 dark:bg-slate-700/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md border border-white/60 dark:border-slate-600/50">
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>{t('hero.badge')}</span>
              </div>
              
              {/* Main Heading */}
              <h1 
                id="hero-heading"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-4"
              >
                <span className="block">{language === 'hi' ? 'आपकी भाषा में' : 'Free Legal Help in'}</span>
                <span className="block text-orange-500 dark:text-orange-400">
                  {language === 'hi' ? 'मुफ्त कानूनी सहायता' : 'Your Language'}
                </span>
              </h1>

              {/* Highlighted callout box - beige background */}
              <div className="mt-8 inline-block bg-orange-100/60 dark:bg-orange-950/40 px-6 py-4 rounded-2xl border border-orange-200/80 dark:border-orange-800/60 backdrop-blur-sm">
                <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-orange-100 flex items-center gap-3">
                  <span className="inline-block w-3 h-3 rounded-full bg-orange-500 dark:bg-orange-400" aria-hidden="true"></span>
                  {language === 'hi' ? 'आपकी भाषा में मुफ्त कानूनी सहायता' : 'Free Legal Help in Your Language'}
                </p>
              </div>

              {/* Description */}
              <p className="mt-8 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                {t('hero.description')}
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="mt-10" role="search">
                <div className="relative mx-auto max-w-2xl">
                  <label htmlFor="search-input" className="sr-only">
                    {t('hero.searchPlaceholder')}
                  </label>
                  <div className="flex items-center rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden border border-gray-200/50 dark:border-slate-700">
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
                      className="mr-3 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white px-6 py-3 font-semibold rounded-lg min-h-[48px] text-base"
                    >
                      {t('hero.search')}
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

              {/* Topic Chips */}
              <div className="mt-8 flex flex-wrap gap-3" role="list" aria-label={language === 'hi' ? 'लोकप्रिय विषय' : 'Popular topics'}>
                {topicChips.slice(0, 4).map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => handleTopicClick(chip.id)}
                    className="rounded-full bg-white/50 dark:bg-slate-700/50 px-5 py-3 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 transition-all hover:bg-white/80 dark:hover:bg-slate-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 focus:ring-offset-2 backdrop-blur-sm border border-white/70 dark:border-slate-600 min-h-[44px]"
                    role="listitem"
                  >
                    {language === 'hi' ? chip.labelHi : chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24" aria-labelledby="features-heading">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-foreground md:text-4xl text-balance">
                {t('features.title')}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card key={feature.title} className="text-center">
                    <CardHeader>
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                      </div>
                      <CardTitle className="mt-4 text-lg sm:text-xl">{feature.title}</CardTitle>
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

        {/* How it Works Section */}
        <section className="bg-muted/50 py-16 md:py-24" aria-labelledby="how-it-works-heading">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-bold text-foreground md:text-4xl">
                {t('howItWorks.title')}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                {t('howItWorks.subtitle')}
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {howItWorks.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-white" aria-hidden="true">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-lg sm:text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button 
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthModal(true)
                  } else {
                    router.push('/ask')
                  }
                }}
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 text-base min-h-[52px]"
              >
                {t('howItWorks.cta')}
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16" aria-label={language === 'hi' ? 'आंकड़े' : 'Statistics'}>
          <div className="container mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="mt-1 text-muted-foreground text-base">{stat.label}</div>
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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
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
              className="w-full min-h-[52px] text-base"
            >
              {language === 'hi' ? 'साइन इन करें' : 'Sign In'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/sign-up')}
              className="w-full min-h-[52px] text-base"
            >
              {language === 'hi' ? 'नया खाता बनाएं' : 'Create New Account'}
            </Button>
            <p className="text-center text-sm text-muted-foreground pt-2">
              {language === 'hi' 
                ? '🔒 आपकी जानकारी सुरक्षित है'
                : '🔒 Your information is secure'
              }
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
