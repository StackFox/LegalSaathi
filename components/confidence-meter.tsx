'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ConfidenceMeterProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function ConfidenceMeter({ score, size = 'md', showLabel = true, className }: ConfidenceMeterProps) {
  const getColor = (score: number) => {
    if (score >= 80) return { stroke: '#2D9C4E', bg: 'bg-green-100', text: 'text-green-700' }
    if (score >= 60) return { stroke: '#F5A623', bg: 'bg-amber-100', text: 'text-amber-700' }
    return { stroke: '#dc2626', bg: 'bg-red-100', text: 'text-red-700' }
  }

  const getLabel = (score: number) => {
    if (score >= 80) return 'High Confidence'
    if (score >= 60) return 'Needs Review'
    return 'Escalate'
  }

  const colors = getColor(score)
  
  const sizes = {
    sm: { width: 60, strokeWidth: 4, fontSize: 'text-xs' },
    md: { width: 100, strokeWidth: 6, fontSize: 'text-sm' },
    lg: { width: 140, strokeWidth: 8, fontSize: 'text-base' },
  }

  const { width, strokeWidth, fontSize } = sizes[size]
  const radius = (width - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative" style={{ width, height: width }}>
        <svg
          width={width}
          height={width}
          className="-rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Progress circle */}
          <motion.circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={cn('font-bold', fontSize)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      {showLabel && (
        <span className={cn('rounded-full px-2 py-0.5 font-medium', fontSize, colors.bg, colors.text)}>
          {getLabel(score)}
        </span>
      )}
    </div>
  )
}
