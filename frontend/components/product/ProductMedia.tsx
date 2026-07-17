'use client'

import React, { useState } from 'react'
import Image from 'next/image'

/**
 * ProductMedia Component
 * Single Responsibility: Display product image/video only
 * Open/Closed: Extensible through props
 */
interface ProductMediaProps {
  imageUrl: string
  videoUrl?: string
  alt: string
  className?: string
}

const ProductMedia: React.FC<ProductMediaProps> = ({
  imageUrl,
  videoUrl,
  alt,
  className = '',
}) => {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full h-[600px] lg:h-[700px]  overflow-hidden ">
        {showVideo && videoUrl ? (
          <video
            className="w-full h-full object-cover"
            controls
            autoPlay
            src={videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <>
            <Image
              src={imageUrl || '/images/product/1.png'}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                aria-label="Play video"
              >
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <svg
                    className="w-10 h-10 text-primary ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductMedia
