'use client'

import { Scale, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'

export function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        {/* Disclaimer */}
        <div className="mb-8 rounded-lg bg-warning/10 border border-warning/20 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground text-base">{t('footer.disclaimer.title')}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {t('footer.disclaimer.text')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Scale className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground text-lg">{t('header.title')}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.brand')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 font-semibold text-foreground">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ask" className="text-muted-foreground hover:text-foreground transition-colors">{t('nav.ask')}</Link></li>
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">{t('nav.dashboard')}</Link></li>
              <li><Link href="/api-docs" className="text-muted-foreground hover:text-foreground transition-colors">{t('nav.apiDocs')}</Link></li>
            </ul>
          </div>

          {/* Legal Topics */}
          <div>
            <h4 className="mb-3 font-semibold text-foreground">{t('footer.legalTopics')}</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground">RTI Filing</span></li>
              <li><span className="text-muted-foreground">Consumer Rights</span></li>
              <li><span className="text-muted-foreground">Tenant Rights</span></li>
              <li><span className="text-muted-foreground">FIR Registration</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 font-semibold text-foreground">{t('footer.helplines')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Women Helpline: <span className="font-semibold text-foreground">181</span></li>
              <li>Police: <span className="font-semibold text-foreground">100</span></li>
              <li>Legal Aid: <span className="font-semibold text-foreground">15100</span></li>
              <li>NCW: <span className="font-semibold text-foreground">7827-170-170</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {t('header.title')}. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
