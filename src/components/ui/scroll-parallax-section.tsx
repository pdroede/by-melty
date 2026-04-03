'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { type ReactNode, useRef } from 'react'

import { cn } from '@/lib/utils'

export type ScrollParallaxSectionProps = {
  id?: string
  children: ReactNode
  className?: string
  /** Moving layer behind content — include bg / gradient Tailwind classes */
  backgroundClassName?: string
  /**
   * Vertical parallax range in px — background drifts with scroll through the section.
   */
  parallaxRange?: number
}

/**
 * Section whose background layer shifts with scroll progress (not a static slab).
 */
export function ScrollParallaxSection({
  id,
  children,
  className,
  backgroundClassName = 'bg-marshmallow',
  parallaxRange = 56,
}: ScrollParallaxSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [parallaxRange, -parallaxRange])

  return (
    <section ref={ref} id={id} className={cn('relative overflow-hidden', className)}>
      <motion.div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 scale-[1.12] will-change-transform',
          backgroundClassName,
        )}
        style={{ y: bgY }}
      />
      <div className="relative z-[1]">{children}</div>
    </section>
  )
}
