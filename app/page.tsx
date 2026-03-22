'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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
import { 
  fadeInUp, 
  slideInLeft, 
  slideInRight, 
  staggerContainer, 
  staggerItem,
  AnimatedCard,
  StaggerContainer,
  StaggerItem,
  Float
} from '@/components/motion'

export default function LandingPage() {
  const [query, setQuery] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { t, language } = useLanguage()
  const { isAuthenticated } = useAuth()

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
            <Float duration={4} distance={10}>
              <div className="relative">
                <div className="w-64 h-40 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                      <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded w-20"></div>
                      <div className="h-2 bg-zinc-100 dark:bg-zinc-600 rounded w-14 mt-1"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <motion.div 
                      className="h-3 bg-orange-200 dark:bg-orange-800/50 rounded-full w-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="h-3 bg-orange-100 dark:bg-orange-900/30 rounded-full w-4/5"></div>
                    <div className="h-3 bg-orange-50 dark:bg-orange-950/50 rounded-full w-3/5"></div>
                  </div>
                </div>
                <motion.div 
                  className="absolute -top-4 -right-4 w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg"
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Mic className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </Float>
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
              <motion.div 
                className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-2xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Brain className="w-16 h-16 text-white" />
              </motion.div>
              <motion.div 
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg flex items-center justify-center">
                  <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </motion.div>
              <motion.div 
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </motion.div>
              <motion.div 
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
              </motion.div>
              <motion.div
                className="absolute -top-6 -left-6"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
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
            <Float duration={5} distance={8}>
              <div className="relative">
                <div className="w-56 h-40 bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    <FileCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('illustration.legalGuidance')}</span>
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div 
                        key={i}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.3, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <div className={`h-2 bg-zinc-200 dark:bg-zinc-700 rounded w-${i === 1 ? 'full' : i === 2 ? '4/5' : '3/4'}`}></div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">IPC Section 420, 406...</div>
                  </div>
                </div>
                <motion.div 
                  className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </Float>
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
          {/* Animated mesh gradient background */}
          <div className="mesh-gradient" aria-hidden="true" />
          
          {/* Grid pattern overlay */}
          <div className="grid-pattern" aria-hidden="true" />
          
          {/* Floating orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="orb-1 absolute top-20 right-[15%] w-72 h-72 rounded-full bg-gradient-to-br from-accent/20 to-orange-400/10 blur-3xl" />
            <div className="orb-2 absolute bottom-20 left-[10%] w-96 h-96 rounded-full bg-gradient-to-tr from-violet-500/15 to-blue-500/10 blur-3xl" />
            <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-accent/5 via-transparent to-blue-500/5 blur-3xl" />
          </div>
          
          <div className="container relative mx-auto px-4 py-12 sm:py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
              {/* Badge */}
              <motion.div 
                className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full bg-muted/80 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-muted-foreground backdrop-blur-sm border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>{t('hero.badge')}</span>
              </motion.div>
              
              {/* Main Heading */}
              <motion.h1 
                id="hero-heading"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="block text-accent">
                  {t('hero.title')}
                </span>
              </motion.h1>

              {/* Highlighted callout box */}
              <motion.div 
                className="mt-8 inline-block bg-accent/10 px-6 py-4 rounded-2xl border border-accent/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-3">
                  <motion.span 
                    className="inline-block w-3 h-3 rounded-full bg-accent"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {t('hero.aiPowered')}
                </p>
              </motion.div>

              {/* Description */}
              <motion.p 
                className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {t('hero.description')}
              </motion.p>

              {/* Search Form */}
              <motion.form 
                onSubmit={handleSearch} 
                className="mt-6 sm:mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
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
                        placeholder={t('hero.searchPlaceholder')}
                        className="flex-1 border-0 bg-transparent px-2 sm:px-4 py-3 sm:py-4 md:py-5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm sm:text-base min-w-0"
                        aria-describedby="search-help"
                      />
                    </div>
                    <motion.button
                      type="button"
                      className="hidden sm:flex mr-2 sm:mr-3 rounded-lg p-2 sm:p-3 text-muted-foreground hover:bg-muted hover:text-foreground min-w-[36px] sm:min-w-[44px] min-h-[36px] sm:min-h-[44px]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={t('hero.searchPlaceholder')}
                    >
                      <Mic className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    </motion.button>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit"
                        className="mr-2 sm:mr-3 bg-accent hover:bg-accent/90 text-accent-foreground px-3 sm:px-6 py-2 sm:py-3 font-semibold rounded-lg sm:rounded-xl min-h-[36px] sm:min-h-[48px] text-sm sm:text-base shadow-lg shadow-accent/20"
                      >
                        <span className="hidden sm:inline">{t('hero.search')}</span>
                        <ArrowRight className="w-4 h-4 sm:ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.form>

              {/* Topic Chips */}
              <motion.div 
                className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                role="list" 
                aria-label={t('ask.quickTopics')}
              >
                {topicChips.slice(0, 4).map((chip) => (
                  <motion.button
                    key={chip.id}
                    variants={staggerItem}
                    onClick={() => handleTopicClick(chip.id)}
                    className="rounded-full bg-muted/80 px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 backdrop-blur-sm border border-border/50 min-h-[36px] sm:min-h-[44px]"
                    whileHover={{ y: -2, backgroundColor: 'var(--muted)' }}
                    whileTap={{ scale: 0.98 }}
                    role="listitem"
                  >
                    {language === 'hi' ? chip.labelHi : chip.label}
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Phone Mockup */}
            <motion.div 
              className="hidden lg:flex justify-center items-center"
              initial={{ opacity: 0, x: 50, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative">
                {/* Phone frame */}
                <motion.div 
                  className="relative w-[280px] h-[580px] bg-card rounded-[3rem] p-2 phone-glow"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
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
                        <motion.div 
                          className="flex justify-end"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 }}
                        >
                          <div className="bg-accent text-accent-foreground text-xs px-3 py-2 rounded-2xl rounded-br-md max-w-[180px]">
                            {t('phone.userMessage')}
                          </div>
                        </motion.div>
                        
                        {/* AI response */}
                        <motion.div 
                          className="flex justify-start"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.6 }}
                        >
                          <div className="bg-muted text-foreground text-xs px-3 py-2 rounded-2xl rounded-bl-md max-w-[200px]">
                            <div className="flex items-center gap-1 mb-1">
                              <BookOpen className="w-3 h-3 text-accent" />
                              <span className="text-[10px] text-accent font-medium">{t('illustration.rentControlAct')}</span>
                            </div>
                            {t('phone.aiResponse')}
                          </div>
                        </motion.div>
                        
                        {/* Legal citation */}
                        <motion.div 
                          className="flex justify-start"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2 }}
                        >
                          <div className="bg-green-500/10 border border-green-500/20 text-foreground text-xs px-3 py-2 rounded-xl max-w-[180px]">
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <CheckCircle className="w-3 h-3" />
                              <span className="text-[10px] font-medium">Section 4(1)</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Input field mockup */}
                      <motion.div 
                        className="mb-8 flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.4 }}
                      >
                        <div className="flex-1 text-xs text-muted-foreground">
                          {t('phone.inputPlaceholder')}
                        </div>
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                          <ArrowRight className="w-3 h-3 text-accent-foreground" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating elements around phone */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-12 h-12 bg-card rounded-xl shadow-lg flex items-center justify-center"
                  animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Shield className="w-6 h-6 text-green-500" />
                </motion.div>
                
                <motion.div 
                  className="absolute top-1/3 -left-6 w-10 h-10 bg-card rounded-lg shadow-lg flex items-center justify-center"
                  animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <Globe className="w-5 h-5 text-blue-500" />
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-20 -right-8 w-14 h-14 bg-card rounded-2xl shadow-lg flex items-center justify-center"
                  animate={{ y: [0, -12, 0], rotate: [0, -3, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <Sparkles className="w-7 h-7 text-accent" />
                </motion.div>
              </div>
            </motion.div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
              <motion.div 
                className="w-1.5 h-3 bg-muted-foreground/50 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section 
          className="py-12 sm:py-20 md:py-32 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden" 
          aria-labelledby="features-heading"
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 grid-pattern opacity-50" aria-hidden="true" />
          <div className="container mx-auto px-4">
            <motion.div 
              className="mx-auto max-w-3xl text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
            >
              <h2 id="features-heading" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-balance">
                {t('features.title')}
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground px-2">
                {t('features.subtitle')}
              </p>
            </motion.div>

            <StaggerContainer className="mt-8 sm:mt-12 md:mt-16 grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <StaggerItem key={feature.title}>
                    <AnimatedCard 
                      className="text-center border border-border/50 shadow-xl bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-2xl hover:border-accent/20"
                      hoverEffect="lift"
                    >
                      <CardHeader className="pb-2 p-0 sm:p-6 sm:pb-2">
                        <div className={`mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                          <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" aria-hidden="true" />
                        </div>
                        <CardTitle className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 sm:p-6 sm:pt-0 pt-2">
                        <CardDescription className="text-sm sm:text-base leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </AnimatedCard>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* How it Works Section */}
        <section 
          className="py-12 sm:py-20 md:py-32 bg-background overflow-hidden" 
          aria-labelledby="how-it-works-heading"
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="mx-auto max-w-3xl text-center mb-10 sm:mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
            >
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
            </motion.div>

            <div className="space-y-10 sm:space-y-16 md:space-y-24">
              {howItWorks.map((item, index) => {
                const Icon = item.icon
                const isEven = index % 2 === 0
                return (
                  <motion.div 
                    key={item.step}
                    className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-6 sm:gap-8 md:gap-16`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={isEven ? slideInLeft : slideInRight}
                  >
                    <div className="w-full md:w-1/2">
                      {item.illustration}
                    </div>
                    
                    <div className="w-full md:w-1/2 text-center md:text-left">
                      <div className="inline-flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-accent text-accent-foreground text-base sm:text-xl font-bold shadow-lg">
                          {item.step}
                        </div>
                        <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-accent/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-accent" />
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-4">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.div 
              className="mt-10 sm:mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowAuthModal(true)
                    } else {
                      router.push('/ask')
                    }
                  }}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-lg shadow-accent/20"
                >
                  {t('howItWorks.cta')}
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section 
          className="py-12 sm:py-20 md:py-28 bg-gradient-to-t from-muted/30 to-background relative" 
          aria-label={t('stats.title')}
        >
          <div className="container mx-auto px-4">
            <StaggerContainer className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {stats.map((stat) => (
                <StaggerItem key={stat.label}>
                  <AnimatedCard 
                    className="text-center p-4 sm:p-8 rounded-xl sm:rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl hover:border-accent/30"
                    hoverEffect="lift"
                  >
                    <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-accent">
                      {stat.value}
                    </div>
                    <div className="mt-1 sm:mt-3 text-muted-foreground text-xs sm:text-base font-medium">{stat.label}</div>
                  </AnimatedCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sign-in Required Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md mx-4 rounded-xl">
          <DialogHeader>
            <motion.div 
              className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-accent/10 mb-3 sm:mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <LogIn className="h-6 w-6 sm:h-8 sm:w-8 text-accent" aria-hidden="true" />
            </motion.div>
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
