'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export type BuyButton3DProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  target?: string
  rel?: string
}

/**
 * Physical “pressed” 3D button — chocolate depth + marshmallow face.
 * Use for primary checkout CTAs (Stripe link or anchor).
 */
export function BuyButton3D({
  children,
  href,
  onClick,
  className,
  disabled,
  target = '_blank',
  rel = 'noopener noreferrer',
}: BuyButton3DProps) {
  const inner = (
    <span className="relative flex items-center justify-center gap-2">
      {children}
      <ArrowRight className="size-5 shrink-0" aria-hidden />
    </span>
  )

  const base = cn(
    'group relative inline-flex min-h-12 min-w-[min(100%,17.5rem)] select-none rounded-2xl text-base font-bold tracking-tight sm:min-h-14 sm:text-lg',
    'touch-manipulation text-marshmallow shadow-lg transition-colors',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marshmallow/60',
    disabled && 'pointer-events-none opacity-50',
    className,
  )

  const face = (
    <span className="relative z-[1] block rounded-2xl border border-chocolate-700/50 bg-gradient-to-b from-chocolate-600 to-chocolate-800 px-6 py-3.5 group-hover:from-chocolate-500 group-hover:to-chocolate-700 sm:px-10 sm:py-4">
      {inner}
    </span>
  )

  const depth = (
    <span
      className="absolute inset-0 rounded-2xl bg-chocolate-950"
      style={{ transform: 'translateY(6px)' }}
      aria-hidden
    />
  )

  const body = (
    <motion.span
      className="relative inline-block"
      whileHover={{ y: -2 }}
      whileTap={{ y: 4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {depth}
      {face}
    </motion.span>
  )

  if (href && !disabled) {
    return (
      <a href={href} className={base} target={target} rel={rel} onClick={onClick}>
        {body}
      </a>
    )
  }

  return (
    <button type="button" className={base} onClick={onClick} disabled={disabled}>
      {body}
    </button>
  )
}
