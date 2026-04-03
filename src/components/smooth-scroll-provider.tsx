'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { type ReactNode, useEffect } from 'react'

const MOBILE_QUERY = '(max-width: 767px)'

/**
 * Lenis + GSAP ScrollTrigger on desktop. On small viewports we use native
 * scroll — Lenis + iOS often causes jank, rubber-banding fights, and stuck scroll.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const mq = window.matchMedia(MOBILE_QUERY)
    let lenis: Lenis | null = null
    let onTick: ((time: number) => void) | null = null

    const startLenis = () => {
      lenis = new Lenis({
        duration: 1.12,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1,
        syncTouch: false,
      })
      lenis.on('scroll', ScrollTrigger.update)
      onTick = (time: number) => {
        lenis?.raf(time * 1000)
      }
      gsap.ticker.add(onTick)
      gsap.ticker.lagSmoothing(0)
    }

    const stopLenis = () => {
      if (onTick) {
        gsap.ticker.remove(onTick)
        onTick = null
      }
      lenis?.destroy()
      lenis = null
    }

    const apply = () => {
      stopLenis()
      if (!mq.matches) startLenis()
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    apply()
    mq.addEventListener('change', apply)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      mq.removeEventListener('change', apply)
      window.removeEventListener('resize', onResize)
      stopLenis()
    }
  }, [])

  return <>{children}</>
}
