'use client'

import { motion } from 'framer-motion'
import { Search, BookOpen, Sparkles, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QueryProcessorProps {
  currentStep: number
  className?: string
}

const steps = [
  { icon: Search, label: 'Classifying intent', labelHi: 'मंशा का वर्गीकरण' },
  { icon: BookOpen, label: 'Fetching relevant statutes', labelHi: 'संबंधित कानूनों की खोज' },
  { icon: Sparkles, label: 'Generating guidance', labelHi: 'मार्गदर्शन तैयार करना' },
]

export function QueryProcessor({ currentStep, className }: QueryProcessorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-foreground">Analyzing legal context...</h3>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isComplete = index < currentStep
          const isActive = index === currentStep

          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 transition-all',
                isComplete && 'border-green-200 bg-green-50',
                isActive && 'border-primary/50 bg-primary/5',
                !isComplete && !isActive && 'border-border bg-card'
              )}
            >
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                isComplete && 'bg-green-100',
                isActive && 'bg-primary/10',
                !isComplete && !isActive && 'bg-muted'
              )}>
                {isComplete ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Icon className={cn(
                    'h-5 w-5',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )} />
                )}
              </div>
              <div className="flex-1">
                <p className={cn(
                  'font-medium',
                  isComplete && 'text-green-700',
                  isActive && 'text-foreground',
                  !isComplete && !isActive && 'text-muted-foreground'
                )}>
                  {step.label}
                </p>
                <p className={cn(
                  'text-sm font-devanagari',
                  isComplete && 'text-green-600',
                  isActive && 'text-muted-foreground',
                  !isComplete && !isActive && 'text-muted-foreground/70'
                )}>
                  {step.labelHi}
                </p>
              </div>
              {isActive && (
                <motion.div
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
