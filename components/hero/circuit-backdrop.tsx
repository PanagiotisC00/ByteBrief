'use client'

// Clearance: Asteroid-like particles moving in zig-zag patterns with neon orange theme.
import type React from 'react'
import { m } from 'framer-motion'

type CircuitBackdropProps = {
  className?: string
}

export function CircuitBackdrop({ className }: CircuitBackdropProps) {
  // Clearance: asteroid particles with different zig-zag trajectories moving in/out of screen
  const asteroidPaths = [
    { d: 'M-50 100 L200 80 L450 140 L700 110 L950 160 L1250 130', delay: 0, duration: 8 },
    { d: 'M-80 250 L180 280 L420 240 L660 290 L900 260 L1280 300', delay: 1.5, duration: 9 },
    { d: 'M1280 150 L1000 180 L750 140 L500 190 L250 160 L-80 200', delay: 3, duration: 10 },
    { d: 'M-60 380 L220 350 L480 400 L740 370 L1000 420 L1260 390', delay: 2, duration: 7.5 },
    { d: 'M1300 420 L1050 440 L800 400 L550 450 L300 410 L-100 460', delay: 4.5, duration: 11 },
  ]

  return (
    <m.div
      aria-hidden="true"
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <m.svg
        viewBox="0 0 1200 520"
        // Clearance: neon orange glow with screen blend mode for vibrant asteroid effect.
        className="h-full w-full mix-blend-screen"
        fill="none"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 8px rgba(255, 120, 0, 0.6))' }}
      >
        {/* Asteroid particles moving in zig-zag paths */}
        {/* Clearance: neon orange color (#FF7800) with varying opacity for depth. */}
        {asteroidPaths.map((pathData, index) => (
          <m.g key={index}>
            {/* Trail path with gradient opacity */}
            <m.path
              d={pathData.d}
              stroke="#FF7800"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.4}
              strokeDasharray="8 12"
              initial={{ strokeDashoffset: 0, pathLength: 0 }}
              animate={{ 
                strokeDashoffset: [-100, 100],
                pathLength: [0, 1, 0.8, 0]
              }}
              transition={{
                strokeDashoffset: { duration: pathData.duration, repeat: Infinity, ease: 'linear' },
                pathLength: { duration: pathData.duration, repeat: Infinity, ease: 'easeInOut', delay: pathData.delay }
              }}
            />
          </m.g>
        ))}
        
        {/* Additional scattered glow particles */}
        {/* Clearance: small static particles with subtle pulse for depth effect. */}
        <g fill="#FF7800" opacity={0.3}>
          <m.circle cx="150" cy="120" r="2"
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <m.circle cx="400" cy="200" r="2.5"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.4, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <m.circle cx="650" cy="150" r="2"
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <m.circle cx="900" cy="280" r="3"
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.5, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          />
          <m.circle cx="1050" cy="180" r="2"
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.3, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <m.circle cx="300" cy="380" r="2.5"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.4, 1] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
          />
          <m.circle cx="750" cy="450" r="2"
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
        </g>
      </m.svg>
    </m.div>
  )
}


