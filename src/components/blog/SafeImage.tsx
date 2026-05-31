'use client'

import { useState } from 'react'

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallback?: React.ReactNode
}

export function SafeImage({ src, alt, fallback, ...rest }: SafeImageProps) {
  const [failed, setFailed] = useState(false)
  if (failed) return <>{fallback ?? null}</>
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      {...rest}
    />
  )
}
