// Client component for handling image fallbacks
'use client'

import { useState } from 'react'

interface FallbackImageProps {
  src: string | null
  alt: string
  className?: string
  fallbackSrc?: string
}

export function FallbackImage({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/bytebrief-logo.png' 
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc)
  const [hasErrored, setHasErrored] = useState(false)

  const handleError = () => {
    if (!hasErrored) {
      setHasErrored(true)
      setImgSrc(fallbackSrc)
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={!src && !hasErrored ? `object-contain p-16 bg-background w-full h-full` : className}
      onError={handleError}
    />
  )
}
