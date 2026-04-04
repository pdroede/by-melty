'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Magnetic cursor — desktop only (pointer: fine).
 * Mounts 'custom-cursor' class on <body> to hide the native cursor via CSS.
 */
export function MagneticCursor() {
  const [shouldRender, setShouldRender] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  const x = useSpring(mouseX, { stiffness: 500, damping: 32, mass: 0.4 })
  const y = useSpring(mouseY, { stiffness: 500, damping: 32, mass: 0.4 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    setShouldRender(true)
    document.body.classList.add('custom-cursor')

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setIsVisible(true)
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsHovering(
        Boolean(
          target.closest(
            'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]',
          ),
        ),
      )
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)

    return () => {
      document.body.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [mouseX, mouseY])

  if (!shouldRender) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[9999] rounded-full"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: isHovering ? 46 : 14,
        height: isHovering ? 46 : 14,
        opacity: isVisible ? 1 : 0,
        backgroundColor: isHovering ? 'rgba(58,47,40,0.18)' : 'rgba(58,47,40,0.82)',
        boxShadow: isHovering ? 'inset 0 0 0 1.5px rgba(58,47,40,0.55)' : 'none',
      }}
      transition={{
        width: { type: 'spring', stiffness: 380, damping: 26 },
        height: { type: 'spring', stiffness: 380, damping: 26 },
        opacity: { duration: 0.18 },
        backgroundColor: { duration: 0.14 },
        boxShadow: { duration: 0.14 },
      }}
    />
  )
}
