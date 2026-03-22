'use client'

import { motion, HTMLMotionProps, Variants } from 'framer-motion'
import { forwardRef, ReactNode } from 'react'

// Lightweight animation variants - optimized for performance
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}

// Hover animation for cards - subtle lift
export const hoverLift = {
  y: -4,
  transition: { duration: 0.2, ease: 'easeOut' }
}

export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2, ease: 'easeOut' }
}

// Motion components with forwardRef support
interface MotionDivProps extends HTMLMotionProps<'div'> {
  children: ReactNode
}

export const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, ...props }, ref) => (
    <motion.div ref={ref} {...props}>
      {children}
    </motion.div>
  )
)
MotionDiv.displayName = 'MotionDiv'

// Animated section component with viewport trigger
interface AnimatedSectionProps extends HTMLMotionProps<'section'> {
  children: ReactNode
  className?: string
}

export const AnimatedSection = forwardRef<HTMLElement, AnimatedSectionProps>(
  ({ children, className, ...props }, ref) => (
    <motion.section
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeIn}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  )
)
AnimatedSection.displayName = 'AnimatedSection'

// Page transition wrapper
interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Card with hover animation
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'none'
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, hoverEffect = 'lift', ...props }, ref) => {
    const getHoverProps = () => {
      switch (hoverEffect) {
        case 'lift':
          return { whileHover: hoverLift }
        case 'scale':
          return { whileHover: hoverScale }
        case 'glow':
          return { whileHover: { ...hoverLift, boxShadow: '0 0 30px rgba(255, 122, 61, 0.2)' } }
        default:
          return {}
      }
    }

    return (
      <motion.div
        ref={ref}
        className={className}
        {...getHoverProps()}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
AnimatedCard.displayName = 'AnimatedCard'

// Button with tap animation
interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode
  className?: string
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, ...props }, ref) => (
    <motion.button
      ref={ref}
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {children}
    </motion.button>
  )
)
AnimatedButton.displayName = 'AnimatedButton'

// Stagger container for lists
interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, className, staggerDelay = 0.1, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
)
StaggerContainer.displayName = 'StaggerContainer'

// Individual stagger item
interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={staggerItem}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
)
StaggerItem.displayName = 'StaggerItem'

// Float animation for decorative elements
interface FloatProps {
  children: ReactNode
  className?: string
  duration?: number
  distance?: number
}

export function Float({ children, className, duration = 3, distance = 8 }: FloatProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-distance / 2, distance / 2, -distance / 2]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}

// Pulse animation for highlights
interface PulseProps {
  children: ReactNode
  className?: string
}

export function Pulse({ children, className }: PulseProps) {
  return (
    <motion.div
      className={className}
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}
