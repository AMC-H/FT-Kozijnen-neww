import React, { useState, useEffect } from 'react'
import { ImageIcon } from 'lucide-react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  className: string
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className }) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Reset error state when src changes
  useEffect(() => {
    if (src) {
      setHasError(false)
      setIsLoading(true)
    }
  }, [src])

  const handleImageError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  if (!src || hasError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">{alt}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`${className} bg-gray-200 flex items-center justify-center absolute inset-0`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </div>
  )
}

export default ImageWithFallback