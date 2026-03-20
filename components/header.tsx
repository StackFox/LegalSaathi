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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import { GoogleSignInButton } from '@/components/google-signin-button'

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
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Scale className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col hidden sm:block">
              <span className="text-lg font-bold text-foreground">{t('header.title')}</span>
              <span className="text-xs text-muted-foreground">{t('header.subtitle')}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/queries"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
                  className="hidden sm:flex items-center gap-1 px-2"
                  aria-label={t('accessibility.language')}
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs uppercase">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English {language === 'en' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('hi')}>
                  हिंदी {language === 'hi' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Font Size Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex items-center gap-1 px-2"
                  aria-label={t('accessibility.fontSize')}
                >
                  <Type className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFontSize('normal')}>
                  Normal {fontSize === 'normal' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFontSize('large')}>
                  Large {fontSize === 'large' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFontSize('xlarge')}>
                  Extra Large {fontSize === 'xlarge' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={t('accessibility.theme')}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Authentication */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <GoogleSignInButton />
                <Button asChild size="sm" variant="outline">
                  <Link href="/sign-in">{t('auth.signIn')}</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                  <Link href="/sign-up">{t('auth.signUp')}</Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="pl-2 pr-1">
                    <Avatar className="h-8 w-8">
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
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('auth.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96">
                <div className="space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-2 text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <Link
                      href="/queries"
                      className="block py-2 text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.myQueries')}
                    </Link>
                  )}
                  <div className="border-t pt-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Language</p>
                        <div className="flex gap-2">
                          <Button
                            variant={language === 'en' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setLanguage('en')}
                          >
                            EN
                          </Button>
                          <Button
                            variant={language === 'hi' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setLanguage('hi')}
                          >
                            HI
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Font Size</p>
                        <div className="flex gap-2">
                          <Button
                            variant={fontSize === 'normal' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFontSize('normal')}
                          >
                            Normal
                          </Button>
                          <Button
                            variant={fontSize === 'large' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFontSize('large')}
                          >
                            Large
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Theme</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                          className="w-full"
                        >
                          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  {!isAuthenticated ? (
                    <div className="border-t pt-4 space-y-2">
                      <GoogleSignInButton className="w-full" />
                      <Button asChild variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                        <Link href="/sign-in">{t('auth.signIn')}</Link>
                      </Button>
                      <Button asChild className="w-full bg-primary hover:bg-primary/90" onClick={() => setIsOpen(false)}>
                        <Link href="/sign-up">{t('auth.signUp')}</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t pt-4">
                      <Button
                        variant="outline"
                        className="w-full text-destructive hover:text-destructive"
                        onClick={() => {
                          signOut()
                          setIsOpen(false)
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
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
