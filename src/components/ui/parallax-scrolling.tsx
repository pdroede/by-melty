'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

function AnimatedHeadline({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <motion.h2
      className="font-display text-4xl text-marshmallow drop-shadow-lg sm:text-6xl md:text-7xl"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className="inline-block"
          style={{ marginRight: '0.22em' }}
          variants={{
            hidden: { opacity: 0, y: 28, rotateX: -18 },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: { type: 'spring', stiffness: 180, damping: 22 },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  )
}

export type ParallaxScrollingProps = {
  /** Primary hero video (served from /public) */
  videoSrc?: string
  /**
   * Loop only this time range (seconds). Omits native `loop` and seeks back to `startSec`
   * when the playhead reaches `endSec` — keeps the hero clip short without re-encoding.
   */
  videoClip?: { startSec: number; endSec: number }
  headline?: string
  subheadline?: string
  className?: string
}

export function ParallaxScrolling({
  videoSrc = '/caneca.mp4',
  videoClip,
  headline = 'ByMelty',
  subheadline = 'Chocolate melted just right',
  className,
}: ParallaxScrollingProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoARef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoClip || videoClip.endSec <= videoClip.startSec) return

    const { startSec, endSec } = videoClip
    const videos = [videoARef.current].filter(
      (v): v is HTMLVideoElement => v != null,
    )
    if (videos.length === 0) return

    const clampEnd = (v: HTMLVideoElement) => {
      const dur = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : endSec
      return Math.min(endSec, Math.max(startSec + 0.1, dur - 0.05))
    }

    const onTimeUpdate = () => {
      const loopEnd = clampEnd(videos[0])
      for (const v of videos) {
        if (v.currentTime >= loopEnd) {
          v.currentTime = startSec
          void v.play().catch(() => {})
        }
      }
    }

    const onLoaded = () => {
      for (const v of videos) {
        const loopEnd = clampEnd(v)
        if (v.currentTime < startSec || v.currentTime > loopEnd) {
          v.currentTime = startSec
        }
      }
    }

    for (const v of videos) {
      v.addEventListener('timeupdate', onTimeUpdate)
      v.addEventListener('loadedmetadata', onLoaded)
    }
    onLoaded()

    return () => {
      for (const v of videos) {
        v.removeEventListener('timeupdate', onTimeUpdate)
        v.removeEventListener('loadedmetadata', onLoaded)
      }
    }
  }, [videoClip])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    // Hero has no scroll-driven parallax — video and text stay fixed while the
    // sticky section scrolls away. Keeps scroll snappy with no GSAP overhead here.
    return () => {}
  }, [])

  const loopAttr = !videoClip

  return (
    <div ref={rootRef} className={cn('parallax w-full', className)}>
      <section className="parallax__header relative min-h-[125vh] md:min-h-[160vh]">
        <div className="parallax__visuals sticky top-0 h-svh w-full overflow-hidden">
          <div className="parallax__black-line-overflow pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-chocolate-900" />
          <div
            data-parallax-layers
            className="parallax__layers relative h-full w-full overflow-hidden bg-chocolate-900"
          >
            {/* Video — full-screen background, stays fixed */}
            <video
              ref={videoARef}
              className="absolute inset-0 h-full w-full object-cover"
              src={videoSrc}
              muted
              playsInline
              loop={loopAttr}
              autoPlay
              preload="auto"
              aria-hidden
            />

            {/* Centered headline text */}
            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
              <motion.p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-marshmallow/90"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18, ease: 'easeOut' }}
              >
                Fondue mug
              </motion.p>
              <AnimatedHeadline text={headline} />
              <motion.p
                className="mt-4 max-w-md px-1 text-base text-marshmallow-muted sm:text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.95, ease: 'easeOut' }}
              >
                {subheadline}
              </motion.p>
            </div>
          </div>
          <div className="parallax__fade pointer-events-none absolute inset-x-0 bottom-0 z-30 h-48 bg-gradient-to-t from-marshmallow from-40% to-transparent" />
        </div>
      </section>
    </div>
  )
}
