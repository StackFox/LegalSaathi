'use client'

import { useState } from 'react'
import { ChevronDown, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CitedSection } from '@/lib/types'

interface StatuteCardProps {
  section: CitedSection
  className?: string
}

const relevanceStyles = {
  High: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  Medium: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  Low: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
}

export function StatuteCard({ section, className }: StatuteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = `${section.act} - ${section.section}\n${section.title}\n\n${section.snippet}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const styles = relevanceStyles[section.relevance]

  return (
    <Card className={cn('overflow-hidden transition-all', className)}>
      <CardHeader 
        className="cursor-pointer p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-foreground">{section.act}</h4>
              <span className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border',
                styles.bg, styles.text, styles.border
              )}>
                {section.relevance}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-primary">{section.section}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{section.title}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                handleCopy()
              }}
              className="h-8 w-8 shrink-0"
              aria-label="Copy section"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <ChevronDown 
              className={cn(
                'h-5 w-5 text-muted-foreground transition-transform',
                isExpanded && 'rotate-180'
              )} 
            />
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="border-t bg-muted/30 p-4">
          <p className="text-sm leading-relaxed text-foreground">
            {section.snippet}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
