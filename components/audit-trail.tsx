'use client'

import { useState } from 'react'
import { ChevronUp, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AuditLogEntry } from '@/lib/types'

interface AuditTrailProps {
  logs: AuditLogEntry[]
  className?: string
}

export function AuditTrail({ logs, className }: AuditTrailProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExportPDF = () => {
    // Mock PDF export
    alert('PDF export functionality would be implemented here')
  }

  const getMethodBadge = (method: string) => {
    const styles = {
      semantic_search: 'bg-blue-100 text-blue-700',
      keyword_match: 'bg-green-100 text-green-700',
      hybrid: 'bg-purple-100 text-purple-700',
    }
    return styles[method as keyof typeof styles] || 'bg-gray-100 text-gray-700'
  }

  const formatMethod = (method: string) => {
    return method.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  return (
    <div className={cn('border-t bg-muted/50', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Audit Trail ({logs.length} matches)</span>
        </div>
        <ChevronUp className={cn('h-4 w-4 transition-transform', !isExpanded && 'rotate-180')} />
      </button>
      
      {isExpanded && (
        <div className="border-t px-4 py-3">
          <div className="mb-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Matched Statute</th>
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Score</th>
                  <th className="pb-2 font-medium text-muted-foreground">Method</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium text-foreground">{log.statute}</td>
                    <td className="py-2 pr-4">
                      <span className="font-mono text-foreground">{(log.score * 100).toFixed(0)}%</span>
                    </td>
                    <td className="py-2">
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', getMethodBadge(log.method))}>
                        {formatMethod(log.method)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
