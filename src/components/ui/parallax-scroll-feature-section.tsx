'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { FeatureImage } from '@/lib/feature-images'
import {
  LIFESTYLE_GRID_SRC,
  quadrantBackgroundPosition,
  type LifestyleQuadrant,
} from '@/lib/lifestyle-image'

export type FeatureScrollItem = {
  id: number
  title: string
  description: string
  image: FeatureImage
  reverse: boolean
}

const DEFAULT_FEATURES: FeatureScrollItem[] = [
  {
    id: 1,
    title: 'Hygge at home',
    description:
      'Warm light, soft throws, and the glow of the fire — the same calm you want when chocolate starts to melt. ByMelty fits that pause.',
    image: { kind: 'quadrant', quadrant: 'tl' },
    reverse: false,
  },
  {
    id: 2,
    title: 'Floating indulgence',
    description:
      'Three colours, one ritual — melt, dip, and share. Marshmallows, berries, and chocolate that stays where you want it.',
    image: { kind: 'cover', src: '/bymelty-studio-hero.png' },
    reverse: true,
  },
  {
    id: 3,
    title: 'Rustic slows down',
    description:
      'Wood grain, soft daylight, a slower pace — the same mug in a different mood. Evenings that stretch and chocolate that stays warm.',
    image: { kind: 'cover', src: '/bymelty-lifestyle-duo.png', fit: 'contain' },
    reverse: false,
  },
]

function LifestyleQuadrantFrame({
  quadrant,
  className,
}: {
  quadrant: LifestyleQuadrant
  className?: string
}) {
  return (
    <div
      className={cn('bg-neutral-800', className)}
      style={{
        backgroundImage: `url(${LIFESTYLE_GRID_SRC})`,
        backgroundSize: '200% 200%',
        backgroundPosition: quadrantBackgroundPosition[quadrant],
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}

function FeatureImageFrame({ image, className }: { image: FeatureImage; className?: string }) {
  if (image.kind === 'quadrant') {
    return <LifestyleQuadrantFrame quadrant={image.quadrant} className={className} />
  }
  const fit = image.fit ?? 'cover'
  return (
    <img
      src={image.src}
      alt=""
      className={cn(
        fit === 'contain' ? 'bg-marshmallow object-contain' : 'bg-neutral-800 object-cover',
        className,
      )}
      loading="lazy"
    />
  )
}

function coverFrameClass(image: FeatureImage): string {
  if (image.kind === 'cover' && image.fit === 'contain') {
    return 'h-72 w-full max-w-[min(100%,40rem)] sm:h-80 md:h-[22rem]'
  }
  return 'size-72 sm:size-80 md:size-96'
}

function FeatureScrollRow({ section }: { section: FeatureScrollItem }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1])
  const clipPath = useTransform(scrollYProgress, [0, 0.7], [
    'inset(0 100% 0 0)',
    'inset(0 0% 0 0)',
  ])
  const translateContent = useTransform(scrollYProgress, [0, 1], [-50, 0])

  return (
    <div
      ref={ref}
      className={cn(
        'flex min-h-screen flex-col items-center justify-center gap-12 border-b border-black/[0.06] bg-marshmallow px-6 py-20 md:flex-row md:gap-16 lg:gap-32',
        section.reverse ? 'md:flex-row-reverse' : 'md:flex-row',
      )}
    >
      <motion.div style={{ y: translateContent }} className="max-w-md md:max-w-sm lg:max-w-md">
        <h3 className="font-display text-4xl text-chocolate-900 sm:text-5xl lg:text-6xl">
          {section.title}
        </h3>
        <motion.p
          style={{ y: translateContent }}
          className="mt-8 text-base leading-relaxed text-chocolate-700 sm:text-lg"
        >
          {section.description}
        </motion.p>
      </motion.div>

      <motion.div
        style={{
          opacity,
          clipPath,
        }}
        className="relative shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10"
      >
        <FeatureImageFrame image={section.image} className={coverFrameClass(section.image)} />
      </motion.div>
    </div>
  )
}

export type ParallaxScrollFeatureSectionProps = {
  features?: FeatureScrollItem[]
  className?: string
}

export function ParallaxScrollFeatureSection({
  features = DEFAULT_FEATURES,
  className,
}: ParallaxScrollFeatureSectionProps) {
  return (
    <div className={cn(className)}>
      <div
        id="features-intro"
        className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${LIFESTYLE_GRID_SRC})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/60" />
        <div className="relative z-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-marshmallow-muted">
            Discover
          </p>
          <h2 className="mt-4 font-display text-5xl text-marshmallow sm:text-6xl md:text-7xl">
            Why ByMelty feels different
          </h2>
          <p className="mt-6 text-lg text-marshmallow-muted">
            Scroll to explore how the mug fits into your evening — layer by layer.
          </p>
          <p className="mt-16 flex animate-bounce items-center justify-center gap-2 text-sm font-medium text-marshmallow-muted">
            Scroll
            <ArrowDown className="size-4" aria-hidden />
          </p>
        </div>
      </div>

      <div id="how-it-works" className="flex flex-col md:px-0">
        {features.map((section) => (
          <FeatureScrollRow key={section.id} section={section} />
        ))}
      </div>
    </div>
  )
}
