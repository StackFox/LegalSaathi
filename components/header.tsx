'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Scale, Menu, Sun, Moon, Type, Globe, LogOut, LogIn, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useLanguage, type Language } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'

const uiLanguages: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t, fontSize, setFontSize } = useLanguage()
  const { isAuthenticated, user, signOut } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAskClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      setShowAuthModal(true)
    }
  }

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/ask', label: t('nav.ask') },
    { href: '/api-docs', label: t('nav.apiDocs') },
  ]

  if (!mounted) return null

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
      >
        Skip to main content
      </a>
      
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg group-hover:shadow-primary/25 transition-shadow duration-300">
              <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-bold text-foreground leading-tight">{t('header.title')}</span>
              <span className="text-[9px] sm:text-[11px] text-muted-foreground leading-tight">{t('header.subtitle')}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={link.href === '/ask' ? handleAskClick : undefined}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-1"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/queries"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-1"
              >
                {t('nav.myQueries')}
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex items-center gap-1 px-2 min-h-[44px] min-w-[44px]"
                  aria-label={`${t('accessibility.language')}: ${uiLanguages.find(l => l.code === language)?.nativeLabel || 'English'}`}
                >
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs uppercase">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
                {uiLanguages.map((lang) => (
                  <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)}>
                    {lang.nativeLabel} ({lang.label}) {language === lang.code && '✓'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Font Size Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex items-center gap-1 px-2 min-h-[44px] min-w-[44px]"
                  aria-label={`${t('accessibility.fontSize')}: ${fontSize}`}
                >
                  <Type className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFontSize('normal')}>
                  Normal {fontSize === 'normal' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFontSize('large')}>
                  Large (बड़ा) {fontSize === 'large' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFontSize('xlarge')}>
                  Extra Large (बहुत बड़ा) {fontSize === 'xlarge' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? t('accessibility.lightMode') : t('accessibility.darkMode')}
              className="min-h-[44px] min-w-[44px]"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>

            {/* Authentication */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Button asChild size="sm" variant="ghost" className="min-h-[44px] text-foreground hover:text-foreground hover:bg-muted">
                  <Link href="/sign-in">{t('auth.signIn')}</Link>
                </Button>
                <Button asChild size="sm" className="min-h-[44px] bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all duration-300">
                  <Link href="/sign-up">{t('auth.signUp')}</Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="pl-2 pr-1 min-h-[44px]" aria-label="User menu">
                    <Avatar className="h-8 w-8">
                      {user?.avatar && <AvatarImage src={user.avatar} alt={user.name || 'User'} />}
                      <AvatarFallback className="text-xs">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{user?.name || 'User'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/queries">{t('auth.myQueries')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('auth.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden min-h-[44px] min-w-[44px]" aria-label="Open menu">
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm p-0 overflow-y-auto">
                {/* Mobile Menu Header with Logo */}
                <div className="sticky top-0 bg-card border-b border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                      <Scale className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-foreground leading-tight">{t('header.title')}</span>
                      <span className="text-[11px] text-muted-foreground leading-tight">{t('header.subtitle')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 space-y-1">
                  {/* Navigation Links */}
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center py-3 px-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                        onClick={(e) => {
                          if (link.href === '/ask' && !isAuthenticated) {
                            e.preventDefault()
                            setIsOpen(false)
                            setShowAuthModal(true)
                          } else {
                            setIsOpen(false)
                          }
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                    {isAuthenticated && (
                      <Link
                        href="/queries"
                        className="flex items-center py-3 px-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {t('nav.myQueries')}
                      </Link>
                    )}
                  </div>
                  
                  <div className="border-t border-border my-4" />
                  
                  {/* Language Selection */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground px-1">{t('accessibility.language')}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {uiLanguages.slice(0, 6).map((lang) => (
                        <Button
                          key={lang.code}
                          variant={language === lang.code ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setLanguage(lang.code)}
                          className="min-h-[36px] text-xs px-2"
                        >
                          {lang.nativeLabel}
                        </Button>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {uiLanguages.slice(6).map((lang) => (
                        <Button
                          key={lang.code}
                          variant={language === lang.code ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setLanguage(lang.code)}
                          className="min-h-[36px] text-xs px-2"
                        >
                          {lang.nativeLabel}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-border my-4" />
                  
                  {/* Font Size & Theme Row */}
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground px-1">{t('accessibility.fontSize')}</p>
                      <div className="flex gap-1">
                        <Button
                          variant={fontSize === 'normal' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFontSize('normal')}
                          className="flex-1 min-h-[36px] text-xs"
                        >
                          A
                        </Button>
                        <Button
                          variant={fontSize === 'large' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFontSize('large')}
                          className="flex-1 min-h-[36px] text-sm"
                        >
                          A
                        </Button>
                        <Button
                          variant={fontSize === 'xlarge' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFontSize('xlarge')}
                          className="flex-1 min-h-[36px] text-base font-bold"
                        >
                          A
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground px-1">{t('accessibility.theme')}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="w-full min-h-[36px]"
                      >
                        {theme === 'dark' ? (
                          <Sun className="h-4 w-4 mr-2" />
                        ) : (
                          <Moon className="h-4 w-4 mr-2" />
                        )}
                        {theme === 'dark' ? t('accessibility.lightMode') : t('accessibility.darkMode')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t border-border my-4" />
                  
                  {/* Auth Buttons */}
                  {!isAuthenticated ? (
                    <div className="space-y-2">
                      <Button asChild variant="outline" className="w-full min-h-[44px]" onClick={() => setIsOpen(false)}>
                        <Link href="/sign-in">{t('auth.signIn')}</Link>
                      </Button>
                      <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground min-h-[44px]" onClick={() => setIsOpen(false)}>
                        <Link href="/sign-up">{t('auth.signUp')}</Link>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full text-destructive hover:text-destructive min-h-[44px]"
                      onClick={() => {
                        signOut()
                        setIsOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                      {t('auth.signOut')}
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

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
              onClick={() => {
                setShowAuthModal(false)
                router.push('/sign-in')
              }}
              className="w-full min-h-[44px] sm:min-h-[52px] text-sm sm:text-base bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {t('auth.signIn')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAuthModal(false)
                router.push('/sign-up')
              }}
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
    </>
  )
}
