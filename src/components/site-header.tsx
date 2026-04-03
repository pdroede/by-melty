'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#features-intro', label: 'Discover' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#ready', label: 'Ready' },
  { href: '#gallery-3d', label: 'Gallery' },
] as const

type HeaderBuyProps = {
  className: string
  children: React.ReactNode
  href: string
  valid: boolean
  onAfterClick?: () => void
  onTrack: () => void
}

function HeaderBuyLink({ className, children, href, valid, onAfterClick, onTrack }: HeaderBuyProps) {
  return (
    <a
      href={href}
      target={valid ? '_blank' : undefined}
      rel={valid ? 'noopener noreferrer' : undefined}
      className={className}
      onClick={() => {
        onTrack()
        onAfterClick?.()
      }}
    >
      {children}
    </a>
  )
}

export type SiteHeaderProps = {
  stripeUrl: string
  onBuyClick: () => void
}

export function SiteHeader({ stripeUrl, onBuyClick }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const href = stripeUrl || '#buy'
  const valid = Boolean(stripeUrl)

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const buyClass = cn(
    'inline-flex min-h-11 min-w-[7.5rem] shrink-0 items-center justify-center rounded-full bg-marshmallow px-5 py-3 text-sm font-semibold text-chocolate-900 shadow-md transition active:scale-[0.98] hover:bg-melty-white sm:min-h-12 sm:px-6 sm:py-4',
  )

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b border-black/[0.06] bg-melty-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-melty-white/70',
          menuOpen && 'max-md:pointer-events-none max-md:invisible',
        )}
      >
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
          <a href="#" className="font-display text-xl text-chocolate-900 sm:text-2xl">
            ByMelty
          </a>

          <nav
            className="hidden min-h-11 items-center gap-4 text-sm font-semibold text-chocolate-700 md:flex md:gap-5"
            aria-label="Main"
          >
            {NAV_LINKS.map(({ href: to, label }) => (
              <a key={to} href={to} className="rounded-md px-1 py-2 transition hover:text-chocolate-900">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <HeaderBuyLink
              className={cn(buyClass, 'hidden md:inline-flex')}
              href={href}
              valid={valid}
              onTrack={onBuyClick}
            >
              Buy now
            </HeaderBuyLink>

            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-xl border border-chocolate-800/15 bg-marshmallow/80 text-chocolate-900 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div
          id="mobile-nav-panel"
          className="fixed inset-0 z-[100] flex flex-col bg-melty-white md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex items-center justify-between border-b border-black/[0.06] px-3 py-2.5 sm:px-6">
            <a href="#" className="font-display text-xl text-chocolate-900" onClick={closeMenu}>
              ByMelty
            </a>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-xl border border-chocolate-800/15 bg-marshmallow/80 text-chocolate-900"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <X className="size-6" aria-hidden />
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pt-4 pb-[max(2.5rem,env(safe-area-inset-bottom))]"
            aria-label="Mobile"
          >
            {NAV_LINKS.map(({ href: to, label }) => (
              <a
                key={to}
                href={to}
                className="touch-manipulation rounded-xl px-4 py-4 text-lg font-semibold text-chocolate-800 active:bg-marshmallow-deep/60"
                onClick={closeMenu}
              >
                {label}
              </a>
            ))}
            <div className="mt-6 border-t border-black/[0.08] pt-6">
              <HeaderBuyLink
                className={cn(buyClass, 'w-full')}
                href={href}
                valid={valid}
                onAfterClick={closeMenu}
                onTrack={onBuyClick}
              >
                Buy now
              </HeaderBuyLink>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  )
}
