'use client'

import { useEffect, useRef } from 'react'

import { attachVideoSegmentLoop } from '@/lib/video-segment-loop'
import { cn } from '@/lib/utils'

export type MugGalleryVideoProps = {
  src: string
  className?: string
  /** Optional loop window; omit to loop the full file */
  videoClip?: { startSec: number; endSec: number }
  /** Min height for the video area */
  minHeight?: string
}

/**
 * Full-bleed mug clip — no rounded frame, no WebGL. Use with a section background
 * that matches the video backdrop (see `--color-mug-gallery-bg`) so it reads like one surface.
 */
export function MugGalleryVideo({
  src,
  className,
  videoClip,
  minHeight = 'min(58vh, 560px)',
}: MugGalleryVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v || !videoClip || videoClip.endSec <= videoClip.startSec) return
    return attachVideoSegmentLoop(v, videoClip)
  }, [src, videoClip])

  const loopNative = !videoClip

  return (
    <div className={cn('relative w-full', className)}>
      <video
        ref={videoRef}
        className="block w-full object-cover"
        style={{ minHeight }}
        src={src}
        muted
        playsInline
        loop={loopNative}
        autoPlay
        preload="auto"
        aria-label="ByMelty mug rotating"
      />
    </div>
  )
}
