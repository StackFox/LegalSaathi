'use client'

import { cn } from '@/lib/utils'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  // Parse and render markdown-like content
  const renderContent = (text: string) => {
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let listItems: string[] = []
    let listType: 'ol' | 'ul' | null = null
    let currentIndex = 0

    const flushList = () => {
      if (listItems.length > 0 && listType) {
        const ListTag = listType
        elements.push(
          <ListTag 
            key={`list-${currentIndex}`} 
            className={cn(
              'my-2 space-y-1',
              listType === 'ol' ? 'list-decimal list-inside' : 'list-disc list-inside'
            )}
          >
            {listItems.map((item, idx) => (
              <li key={idx} className="text-foreground leading-relaxed">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ListTag>
        )
        listItems = []
        listType = null
        currentIndex++
      }
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      // Empty line
      if (!trimmedLine) {
        flushList()
        return
      }

      // Numbered list (1. or **1.)
      const numberedMatch = trimmedLine.match(/^\*?\*?(\d+)\.\*?\*?\s+(.+)/)
      if (numberedMatch) {
        if (listType !== 'ol') {
          flushList()
          listType = 'ol'
        }
        listItems.push(numberedMatch[2])
        return
      }

      // Bullet list
      const bulletMatch = trimmedLine.match(/^[-*•]\s+(.+)/)
      if (bulletMatch) {
        if (listType !== 'ul') {
          flushList()
          listType = 'ul'
        }
        listItems.push(bulletMatch[1])
        return
      }

      // Not a list item - flush any pending list
      flushList()

      // Headers
      if (trimmedLine.startsWith('### ')) {
        elements.push(
          <h4 key={index} className="font-semibold text-foreground mt-4 mb-2">
            {renderInlineFormatting(trimmedLine.slice(4))}
          </h4>
        )
        return
      }
      if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h3 key={index} className="font-bold text-foreground mt-4 mb-2 text-lg">
            {renderInlineFormatting(trimmedLine.slice(3))}
          </h3>
        )
        return
      }
      if (trimmedLine.startsWith('# ')) {
        elements.push(
          <h2 key={index} className="font-bold text-foreground mt-4 mb-2 text-xl">
            {renderInlineFormatting(trimmedLine.slice(2))}
          </h2>
        )
        return
      }

      // Regular paragraph
      elements.push(
        <p key={index} className="text-foreground leading-relaxed mb-2">
          {renderInlineFormatting(trimmedLine)}
        </p>
      )
    })

    // Flush any remaining list
    flushList()

    return elements
  }

  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Split by bold markers (**text**)
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    
    return parts.map((part, index) => {
      // Bold text
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2)
        return (
          <strong key={index} className="font-semibold text-foreground">
            {boldText}
          </strong>
        )
      }
      
      // Check for inline code
      const codeParts = part.split(/(`[^`]+`)/g)
      return codeParts.map((codePart, codeIndex) => {
        if (codePart.startsWith('`') && codePart.endsWith('`')) {
          return (
            <code 
              key={`${index}-${codeIndex}`} 
              className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono"
            >
              {codePart.slice(1, -1)}
            </code>
          )
        }
        return codePart
      })
    })
  }

  return (
    <div className={cn('prose prose-sm max-w-none dark:prose-invert', className)}>
      {renderContent(content)}
    </div>
  )
}
