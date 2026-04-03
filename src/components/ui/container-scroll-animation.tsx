'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

import { cn } from '@/lib/utils'

export type ContainerScrollProps = {
  titleComponent: ReactNode
  children: ReactNode
  className?: string
}

export function ContainerScroll({ titleComponent, children, className }: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const scaleDimensions = (): [number, number] => {
    return isMobile ? [0.7, 0.9] : [1.05, 1]
  }

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions())
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex h-[60rem] items-center justify-center p-2 md:h-[80rem] md:p-20',
        className,
      )}
    >
      <div
        className="relative w-full py-10 md:py-40"
        style={{ perspective: '1000px' }}
      >
        <ScrollHeader translate={translate} titleComponent={titleComponent} />
        <ScrollCard rotate={rotate} scale={scale}>
          {children}
        </ScrollCard>
      </div>
    </div>
  )
}

function ScrollHeader({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>
  titleComponent: ReactNode
}) {
  return (
    <motion.div style={{ y: translate }} className="mx-auto max-w-5xl text-center">
      {titleComponent}
    </motion.div>
  )
}

function ScrollCard({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>
  scale: MotionValue<number>
  children: ReactNode
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
      }}
      className="mx-auto -mt-12 h-[30rem] w-full max-w-5xl rounded-[30px] border border-black/10 bg-white p-2 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.12)] md:h-[40rem] md:p-6"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-marshmallow/40 md:rounded-2xl md:p-4">
        {children}
      </div>
    </motion.div>
  )
}
