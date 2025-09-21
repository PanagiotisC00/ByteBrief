// Simple image component with guaranteed fallback
'use client'

interface ImageWithFallbackProps {
  src?: string | null
  alt: string
  className?: string
  width?: number
  height?: number
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className = '',
  width,
  height 
}: ImageWithFallbackProps) {
  // Always use the logo if no src is provided
  const imageSrc = src && src.trim() ? src : '/placeholder-logo.svg'

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={(e) => {
        // If the image fails to load, use our fallback logo
        const target = e.target as HTMLImageElement
        if (target.src !== '/placeholder-logo.svg') {
          target.src = '/placeholder-logo.svg'
        }
      }}
    />
  )
}
