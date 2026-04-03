'use client'

import { useEffect, useState, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

type PhotoCardProps = {
  src: string
  alt: string
  rotation: number
  caption: string
  index: number
  style?: CSSProperties
}

function PhotoCard({ src, alt, rotation, caption, index, style }: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const active = isHovered || isPressed

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 400 + index * 280)
    return () => clearTimeout(t)
  }, [index])

  const cardStyle: CSSProperties = {
    position: 'absolute',
    transform: `rotate(${rotation}deg) ${active ? `rotate(${rotation + 2}deg) scale(1.04)` : `rotate(${rotation}deg) scale(1)`}`,
    zIndex: active ? 20 : index === 1 ? 2 : 1,
    transition: 'transform 0.35s ease-out, box-shadow 0.35s ease-out',
    opacity: isVisible ? 1 : 0,
    ...style,
  }

  return (
    <div
      className={cn(
        'w-[min(88vw,300px)] touch-manipulation cursor-pointer rounded-md border border-chocolate-800/25 bg-marshmallow p-2.5 shadow-2xl sm:w-[min(80vw,380px)] sm:p-3 md:w-[min(72vw,420px)] md:p-3.5',
        active && 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]',
      )}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerCancel={() => setIsPressed(false)}
    >
      <div className="h-[85%] overflow-hidden rounded-sm bg-chocolate-900/5">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300"
          style={{ transform: active ? 'scale(1.04)' : 'scale(1)' }}
        />
      </div>
      <div className="flex h-[15%] items-center justify-center px-1">
        <p
          className="text-center text-sm tracking-tight text-chocolate-700 sm:text-base"
          style={{ fontFamily: '"Zeyada", cursive' }}
        >
          {caption}
        </p>
      </div>
    </div>
  )
}

export type PhotoCards3DProps = {
  cards: Omit<PhotoCardProps, 'index'>[]
  className?: string
}

export function PhotoCards3D({ cards, className }: PhotoCards3DProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-[min(52vh,480px)] w-full items-center justify-center px-2 py-4 sm:min-h-[min(56vh,560px)] sm:px-4 sm:py-8',
        className,
      )}
    >
      <div className="relative mx-auto flex h-[min(48vh,520px)] w-full max-w-[min(100%,760px)] items-center justify-center">
        {cards.map((card, index) => (
          <PhotoCard
            key={`${card.src}-${card.caption}`}
            {...card}
            index={index}
            style={index === 0 ? { top: 40, left: 0 } : { top: 20, right: 0 }}
          />
        ))}
      </div>
    </div>
  )
}
