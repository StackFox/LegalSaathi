import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware((auth, req) => {
  // Protect admin dashboard routes
  if (isDashboardRoute(req)) auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and common static assets
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Apply to API routes as well
    '/(api|trpc)(.*)',
  ],
}

