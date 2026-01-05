'use client'

// Clearance: isolate Framer Motion configuration to the hero to keep App Router SSR safe and bundle impact localized.
import type React from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'

type HeroMotionProviderProps = {
  children: React.ReactNode
}

export function HeroMotionProvider({ children }: HeroMotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {/* Clearance: force animations to play even if user has 'reduce motion' enabled (reducedMotion="never") */}
      <MotionConfig reducedMotion="never">{children}</MotionConfig>
    </LazyMotion>
  )
}




