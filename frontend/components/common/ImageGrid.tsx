'use client'

import React from 'react'

interface ImageGridProps {
  images: string[]
  className?: string
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, className = '' }) => {
  if (!images ) return null

  return (
    <div className={`flex flex-col gap-2 lg:h-screen ${className} mt-[20px] lg:mt-[20px]`}>

      {/* Big Image → 70% */}
      <div className="flex-[7] min-h-0">
        <img
          src={images[0]}
          alt="Main"
          className="w-full h-[400px] lg:h-full object-cover"
        />
      </div>

      {/* Bottom Images → 30% */}
      <div className="md:flex hidden gap-2 flex-[3] min-h-0 h-[100px] lg:h-auto ">
        {images.slice(1, 4).map((img, i) => (
          <div key={i} className="flex-1">
            <img
              src={img}
              alt={`img-${i}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

    </div>
  )
}

export default ImageGrid