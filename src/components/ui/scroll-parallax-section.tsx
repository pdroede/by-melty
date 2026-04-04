'use client'

import { type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type ScrollParallaxSectionProps = {
  id?: string
  children: ReactNode
  className?: string
  backgroundClassName?: string
  parallaxRange?: number
}

/**
 * Section wrapper. The background parallax was removed — it ran a Framer Motion
 * useScroll + useTransform on every scroll tick for every section, causing jank.
 * Sections now use a clean static background.
 */
export function ScrollParallaxSection({
  id,
  children,
  className,
  backgroundClassName = 'bg-marshmallow',
}: ScrollParallaxSectionProps) {
  return (
    <section id={id} className={cn('relative overflow-hidden', backgroundClassName, className)}>
      {children}
    </section>
  )
}
