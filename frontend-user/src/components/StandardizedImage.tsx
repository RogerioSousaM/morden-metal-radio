import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface StandardizedImageProps {
  src: string
  alt: string
  fallbackText?: string
  variant?: 'small' | 'feature' | 'compact' | 'standard'
  filter?: 'subtle' | 'moderate' | 'heavy' | 'none'
  showOverlay?: boolean
  showVignette?: boolean
  className?: string
  onLoad?: () => void
  onError?: () => void
}

const StandardizedImage: React.FC<StandardizedImageProps> = ({
  src,
  alt,
  fallbackText = 'Imagem',
  variant = 'standard',
  filter = 'subtle',
  showOverlay = true,
  showVignette = true,
  className = '',
  onLoad,
  onError
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [imageSrc, setImageSrc] = useState(src)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setImageSrc(src)
    setImageState('loading')
  }, [src])

  const handleImageLoad = () => {
    setImageState('loaded')
    onLoad?.()
  }

  const handleImageError = () => {
    setImageState('error')
    onError?.()
  }

  // Fallback SVG com wordmark Orbitron
  const renderFallback = () => (
    <div className="image-fallback">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <div className="image-fallback-text">
        {fallbackText}
      </div>
    </div>
  )

  // Determinar classes baseadas na variante
  const getVariantClasses = () => {
    switch (variant) {
      case 'small':
        return 'thumbnail-small'
      case 'feature':
        return 'thumbnail-feature'
      case 'compact':
        return 'thumbnail-compact'
      default:
        return 'thumbnail-standard'
    }
  }

  // Determinar classes de filtro
  const getFilterClasses = () => {
    if (filter === 'none') return ''
    return `image-filter-${filter}`
  }

  // Renderizar imagem ou fallback
  if (imageState === 'error') {
    return (
      <div className={`image-container image-error ${className}`}>
        {renderFallback()}
      </div>
    )
  }

  return (
    <div className={`image-container ${className}`}>
      {/* Imagem principal com lazy loading e srcset */}
      <motion.img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`${getVariantClasses()} ${getFilterClasses()} image-responsive image-optimized image-accessible ${
          imageState === 'loaded' ? 'image-fade-in' : ''
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        decoding="async"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        srcSet={`
          ${imageSrc}?w=300&h=200&fit=crop 300w,
          ${imageSrc}?w=600&h=400&fit=crop 600w,
          ${imageSrc}?w=900&h=600&fit=crop 900w
        `}
        style={{
          opacity: imageState === 'loaded' ? 1 : 0,
          transition: 'opacity 300ms ease-in-out'
        }}
      />
      
      {/* Loading state */}
      {imageState === 'loading' && (
        <div className="image-loading skeleton absolute inset-0" />
      )}
      
      {/* Overlay de gradiente */}
      {showOverlay && (
        <div className="image-overlay" />
      )}
      
      {/* Vignette overlay */}
      {showVignette && (
        <div className={`image-vignette ${filter === 'heavy' ? 'vignette-crimson' : 'vignette-subtle'}`} />
      )}
    </div>
  )
}

export default StandardizedImage
