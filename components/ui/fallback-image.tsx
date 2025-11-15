// Client component for handling image fallbacks
'use client'

import { useState, useEffect } from 'react'

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

  // Update image source when src prop changes
  useEffect(() => {
    setImgSrc(src || fallbackSrc)
    setHasErrored(false)
  }, [src, fallbackSrc])

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
