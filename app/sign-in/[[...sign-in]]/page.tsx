'use client'

import { SignIn } from '@clerk/nextjs'
import { Scale } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Scale className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">Legal Saathi</span>
              <span className="text-xs text-muted-foreground">लीगल साथी</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access your legal queries and history</p>
          </div>
          <SignIn 
            appearance={{
              elements: {
                rootBox: 'mx-auto w-full',
                card: 'shadow-lg border border-border bg-card rounded-xl',
                headerTitle: 'text-foreground',
                headerSubtitle: 'text-muted-foreground',
                socialButtonsBlockButton: 'border-border hover:bg-muted',
                socialButtonsBlockButtonText: 'text-foreground font-medium',
                dividerLine: 'bg-border',
                dividerText: 'text-muted-foreground',
                formFieldLabel: 'text-foreground',
                formFieldInput: 'border-input bg-background text-foreground',
                formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                footerActionLink: 'text-accent hover:text-accent/80',
                identityPreviewText: 'text-foreground',
                identityPreviewEditButton: 'text-accent',
              },
            }}
          />
        </div>
      </main>
    </div>
  )
}

