'use client'

// Clearance: lightweight SVG cube with Framer Motion transforms (no canvas) to keep the hero animation performant on Vercel.
import type React from 'react'
import { m } from 'framer-motion'

type CyberCubeProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeToSvgClassName: Record<NonNullable<CyberCubeProps['size']>, string> = {
  sm: 'h-20 w-20',
  md: 'h-24 w-24',
  lg: 'h-44 w-44',
}

export function CyberCube({ className, size = 'lg' }: CyberCubeProps) {
  const svgClassName = sizeToSvgClassName[size]

  return (
    <m.div
      aria-hidden="true"
      className={className}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{
        opacity: 1,
        scale: [1, 1.05, 1], // Subtle scale pulse
        y: [0, -5, 0], // Subtle float
      }}
      transition={{
        scale: { duration: 2.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
        y: { duration: 4.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
      }}
    >
      <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
        <m.svg
          viewBox="0 0 120 110"
          className={`${svgClassName} drop-shadow-lg`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 12px rgba(255, 120, 0, 0.8))' }}
        >
          {/* Clearance: 3D octahedron with wider middle section for better depth perception during rotation */}
          
          {/* Far back left face (darkest) */}
          <path 
            d="M60 15 L35 50 L60 50 Z" 
            fill="#C86000" 
            fillOpacity="0.3"
            stroke="#C86000" 
            strokeWidth="1.5" 
            opacity="0.5"
          />
          
          {/* Far back right face */}
          <path 
            d="M60 15 L85 50 L60 50 Z" 
            fill="#D87010" 
            fillOpacity="0.35"
            stroke="#D87010" 
            strokeWidth="1.5" 
            opacity="0.55"
          />
          
          {/* Mid-depth left faces - top */}
          <path 
            d="M60 15 L25 50 L35 50 Z" 
            fill="#E88020" 
            fillOpacity="0.5"
            stroke="#E88020" 
            strokeWidth="2" 
            opacity="0.7"
          />
          
          {/* Mid-depth right faces - top */}
          <path 
            d="M60 15 L95 50 L85 50 Z" 
            fill="#F89030" 
            fillOpacity="0.6"
            stroke="#F89030" 
            strokeWidth="2" 
            opacity="0.75"
          />
          
          {/* Front faces - top left (bright) */}
          <path 
            d="M60 15 L25 50 L60 58 Z" 
            fill="#FF9940" 
            fillOpacity="0.7"
            stroke="#FFA040" 
            strokeWidth="2.5" 
            opacity="0.88"
          />
          
          {/* Front faces - top right (brightest) */}
          <path 
            d="M60 15 L95 50 L60 58 Z" 
            fill="#FFB060" 
            fillOpacity="0.85"
            stroke="#FFB060" 
            strokeWidth="3" 
            opacity="0.98"
          />
          
          {/* Bottom pyramid - far back left */}
          <path 
            d="M60 85 L35 50 L60 50 Z" 
            fill="#C86000" 
            fillOpacity="0.35"
            stroke="#C86000" 
            strokeWidth="1.5" 
            opacity="0.55"
          />
          
          {/* Bottom pyramid - far back right */}
          <path 
            d="M60 85 L85 50 L60 50 Z" 
            fill="#D87010" 
            fillOpacity="0.4"
            stroke="#D87010" 
            strokeWidth="1.5" 
            opacity="0.6"
          />
          
          {/* Bottom pyramid - mid-depth left */}
          <path 
            d="M60 85 L25 50 L35 50 Z" 
            fill="#E88020" 
            fillOpacity="0.55"
            stroke="#E88020" 
            strokeWidth="2" 
            opacity="0.72"
          />
          
          {/* Bottom pyramid - mid-depth right */}
          <path 
            d="M60 85 L95 50 L85 50 Z" 
            fill="#F89030" 
            fillOpacity="0.65"
            stroke="#F89030" 
            strokeWidth="2" 
            opacity="0.78"
          />
          
          {/* Bottom pyramid - front left */}
          <path 
            d="M60 85 L25 50 L60 58 Z" 
            fill="#FF9940" 
            fillOpacity="0.75"
            stroke="#FFA040" 
            strokeWidth="2.5" 
            opacity="0.9"
          />
          
          {/* Bottom pyramid - front right */}
          <path 
            d="M60 85 L95 50 L60 58 Z" 
            fill="#FFB060" 
            fillOpacity="0.9"
            stroke="#FFB060" 
            strokeWidth="3" 
            opacity="0.99"
          />
          
          {/* Main edge highlights (wireframe) */}
          <g stroke="#FFA040" strokeWidth="1.5" opacity="0.4">
            <line x1="60" y1="15" x2="25" y2="50" />
            <line x1="60" y1="15" x2="95" y2="50" />
            <line x1="60" y1="85" x2="25" y2="50" />
            <line x1="60" y1="85" x2="95" y2="50" />
            <line x1="25" y1="50" x2="95" y2="50" />
          </g>
          
          {/* Vertex points */}
          <g fill="#FFA040">
            <circle cx="60" cy="15" r="3" opacity="0.9" />
            <circle cx="60" cy="85" r="3" opacity="0.9" />
            <circle cx="25" cy="50" r="2.5" opacity="0.75" />
            <circle cx="95" cy="50" r="2.5" opacity="0.75" />
            <circle cx="60" cy="50" r="2" opacity="0.6" />
          </g>
        </m.svg>

        {/* Glow plate behind the octahedron with pulsing animation */}
        <m.div 
          className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-orange-500/30 via-orange-400/20 to-transparent blur-3xl" 
          style={{ boxShadow: '0 0 60px rgba(255, 120, 0, 0.4)' }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      </div>
    </m.div>
  )
}


