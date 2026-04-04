'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin scroll-progress bar pinned at the very top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[2px] origin-left bg-chocolate-700/50"
      style={{ scaleX }}
    />
  )
}
