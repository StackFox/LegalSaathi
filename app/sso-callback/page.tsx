'use client'

import { useClerk, useSignIn, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Page() {
  const clerk = useClerk()
  const { signIn } = useSignIn()
  const { signUp } = useSignUp()
  const router = useRouter()
  const hasRun = useRef(false)

  const navigateToSignIn = () => {
    router.push('/sign-in')
  }

  const navigateToSignUp = () => {
    router.push('/sign-up')
  }

  useEffect(() => {
    ;(async () => {
      if (!clerk.loaded || hasRun.current) return
      hasRun.current = true

      // If this was a sign-in and it's complete, finalize.
      if ((signIn as any)?.status === 'complete') {
        await (signIn as any).finalize?.()
        router.push('/')
        return
      }

      // If the sign-up used an existing account, transfer it to a sign-in.
      if ((signUp as any)?.isTransferable) {
        await (signIn as any).create?.({ transfer: true })
        if ((signIn as any)?.status === 'complete') {
          await (signIn as any).finalize?.()
          router.push('/')
          return
        }
        return navigateToSignIn()
      }

      const status = (signIn as any)?.status

      if (status === 'needs_first_factor') {
        return navigateToSignIn()
      }

      if (status === 'needs_second_factor' || status === 'needs_new_password') {
        return navigateToSignIn()
      }

      // Activate existing session if present.
      const existingSessionId =
        (signIn as any)?.existingSession?.sessionId || (signUp as any)?.existingSession?.sessionId

      if (existingSessionId) {
        await clerk.setActive({ session: existingSessionId })
        router.push('/')
        return
      }

      // Fallback
      router.push('/')
    })().catch(() => {
      router.push('/sign-in')
    })
  }, [clerk, signIn, signUp, router])

  // Required for some sign-in/sign-up flows.
  return (
    <div>
      <div id="clerk-captcha" />
    </div>
  )
}

