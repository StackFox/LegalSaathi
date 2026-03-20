'use client'

import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language-context'

export function GoogleSignInButton({ className }: { className?: string }) {
  const { t } = useLanguage()
  const { signIn } = useSignIn()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    if (!signIn) return

    setIsLoading(true)
    try {
      // Configure Google as a social connection in Clerk Dashboard,
      // then initiate an OAuth flow with `oauth_google`.
      const { error } = await signIn.sso({
        strategy: 'oauth_google',
        redirectCallbackUrl: '/sso-callback',
        redirectUrl: '/',
      } as any)
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Google sign-in error:', error)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Google sign-in exception:', e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted text-xs font-bold">
          G
        </span>
      )}
      {t('auth.signInWithGoogle')}
    </Button>
  )
}

