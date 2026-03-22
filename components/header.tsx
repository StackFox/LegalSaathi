'use client'

import Link from 'next/link'
import { Scale, Menu, Sun, Moon, Type, Globe, LogOut } from 'lucide-react'
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
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t, fontSize, setFontSize } = useLanguage()
  const { isAuthenticated, user, signOut } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

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
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Scale className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
            </div>
            <div className="flex flex-col hidden sm:block">
              <span className="text-lg font-bold text-foreground">{t('header.title')}</span>
              <span className="text-xs text-muted-foreground">{t('header.subtitle')}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
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
                <Button asChild size="sm" variant="outline" className="min-h-[44px]">
                  <Link href="/sign-in">{t('auth.signIn')}</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90 min-h-[44px]">
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
              <SheetContent side="right" className="w-full sm:w-96">
                <div className="space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-3 text-lg text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <Link
                      href="/queries"
                      className="block py-3 text-lg text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.myQueries')}
                    </Link>
                  )}
                  <div className="border-t pt-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-3">Language / भाषा</p>
                        <div className="flex flex-wrap gap-2">
                          {uiLanguages.map((lang) => (
                            <Button
                              key={lang.code}
                              variant={language === lang.code ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setLanguage(lang.code)}
                              className="min-h-[40px] text-sm"
                            >
                              {lang.nativeLabel}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-3">Font Size / फ़ॉन्ट आकार</p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={fontSize === 'normal' ? 'default' : 'outline'}
                            size="lg"
                            onClick={() => setFontSize('normal')}
                            className="min-h-[48px] text-base"
                          >
                            Normal
                          </Button>
                          <Button
                            variant={fontSize === 'large' ? 'default' : 'outline'}
                            size="lg"
                            onClick={() => setFontSize('large')}
                            className="min-h-[48px] text-base"
                          >
                            Large
                          </Button>
                          <Button
                            variant={fontSize === 'xlarge' ? 'default' : 'outline'}
                            size="lg"
                            onClick={() => setFontSize('xlarge')}
                            className="min-h-[48px] text-base"
                          >
                            XL
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-3">Theme / थीम</p>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                          className="w-full min-h-[48px] text-base"
                        >
                          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  {!isAuthenticated ? (
                    <div className="border-t pt-4 space-y-3">
                      <Button asChild variant="outline" className="w-full min-h-[52px] text-base" onClick={() => setIsOpen(false)}>
                        <Link href="/sign-in">{t('auth.signIn')}</Link>
                      </Button>
                      <Button asChild className="w-full bg-primary hover:bg-primary/90 min-h-[52px] text-base" onClick={() => setIsOpen(false)}>
                        <Link href="/sign-up">{t('auth.signUp')}</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t pt-4">
                      <Button
                        variant="outline"
                        className="w-full text-destructive hover:text-destructive min-h-[52px] text-base"
                        onClick={() => {
                          signOut()
                          setIsOpen(false)
                        }}
                      >
                        <LogOut className="h-5 w-5 mr-2" aria-hidden="true" />
                        {t('auth.signOut')}
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
