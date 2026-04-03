'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import { LIFESTYLE_GRID_SRC, quadrantBackgroundPosition, type LifestyleQuadrant } from '@/lib/lifestyle-image'

export type ParallaxScrollingProps = {
  /** Primary parallax video (served from /public) */
  videoSrc?: string
  /**
   * Loop only this time range (seconds). Omits native `loop` and seeks back to `startSec`
   * when the playhead reaches `endSec` — keeps the hero clip short without re-encoding.
   */
  videoClip?: { startSec: number; endSec: number }
  middleLayerQuadrant?: LifestyleQuadrant
  headline?: string
  subheadline?: string
  className?: string
}

export function ParallaxScrolling({
  videoSrc = '/caneca.mp4',
  videoClip,
  middleLayerQuadrant = 'tr',
  headline = 'ByMelty',
  subheadline = 'Chocolate melted just right',
  className,
}: ParallaxScrollingProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoARef = useRef<HTMLVideoElement>(null)
  const videoBRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoClip || videoClip.endSec <= videoClip.startSec) return

    const { startSec, endSec } = videoClip
    const videos = [videoARef.current, videoBRef.current].filter(
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

    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger)

      const triggerElement = root.querySelector<HTMLElement>('[data-parallax-layers]')
      if (!triggerElement) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: '0% 0%',
          end: '100% 0%',
          scrub: 0,
        },
      })

      const layers = [
        { layer: '1', yPercent: 70 },
        { layer: '2', yPercent: 55 },
        { layer: '3', yPercent: 40 },
        { layer: '4', yPercent: 10 },
      ]

      layers.forEach((layerObj, idx) => {
        const targets = triggerElement.querySelectorAll(
          `[data-parallax-layer="${layerObj.layer}"]`,
        )
        tl.to(
          targets,
          {
            yPercent: layerObj.yPercent,
            ease: 'none',
          },
          idx === 0 ? undefined : '<',
        )
      })
    }, root)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [])

  const loopAttr = !videoClip

  return (
    <div ref={rootRef} className={cn('parallax w-full', className)}>
      <section className="parallax__header relative min-h-[160vh]">
        <div className="parallax__visuals sticky top-0 h-svh w-full overflow-hidden">
          <div className="parallax__black-line-overflow pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-chocolate-900" />
          <div
            data-parallax-layers
            className="parallax__layers relative h-full w-full overflow-hidden bg-chocolate-900"
          >
            <div data-parallax-layer="1" className="parallax__layer will-change-transform absolute inset-0">
              <video
                ref={videoARef}
                className="parallax__layer-video absolute inset-0 h-full w-full object-cover"
                src={videoSrc}
                muted
                playsInline
                loop={loopAttr}
                autoPlay
                preload="auto"
                aria-hidden
              />
            </div>

            <div
              data-parallax-layer="2"
              className="parallax__layer-img pointer-events-none absolute inset-0 h-full w-full opacity-40 mix-blend-soft-light"
              style={{
                backgroundImage: `url(${LIFESTYLE_GRID_SRC})`,
                backgroundSize: '200% 200%',
                backgroundPosition: quadrantBackgroundPosition[middleLayerQuadrant],
              }}
              aria-hidden
            />

            <div
              data-parallax-layer="3"
              className="parallax__layer-title pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-marshmallow/90">
                Fondue mug
              </p>
              <h2 className="font-display text-5xl text-marshmallow drop-shadow-lg sm:text-6xl md:text-7xl">
                {headline}
              </h2>
              <p className="mt-4 max-w-md text-lg text-marshmallow-muted">{subheadline}</p>
            </div>

            <div data-parallax-layer="4" className="parallax__layer will-change-transform absolute inset-0">
              <video
                ref={videoBRef}
                className="parallax__layer-video absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-screen"
                src={videoSrc}
                muted
                playsInline
                loop={loopAttr}
                autoPlay
                preload="auto"
                aria-hidden
              />
            </div>
          </div>
          <div className="parallax__fade pointer-events-none absolute inset-x-0 bottom-0 z-30 h-48 bg-gradient-to-t from-marshmallow from-40% to-transparent" />
        </div>
      </section>
    </div>
  )
}
