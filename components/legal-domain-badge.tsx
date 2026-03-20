import { cn } from '@/lib/utils'
import type { LegalDomain } from '@/lib/types'

const domainStyles: Record<LegalDomain, { bg: string; text: string; border: string }> = {
  'IPC': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  'RTI': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  'General': { bg: 'bg-muted/50', text: 'text-foreground', border: 'border-border' },
  'Consumer': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  'Tenancy': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  'Workplace': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  'Family Law': { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
  'Police/FIR': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
}

interface LegalDomainBadgeProps {
  domain: LegalDomain
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LegalDomainBadge({ domain, size = 'md', className }: LegalDomainBadgeProps) {
  const styles = domainStyles[domain]
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        styles.bg,
        styles.text,
        styles.border,
        sizeClasses[size],
        className
      )}
    >
      {domain}
    </span>
  )
}
