import React from 'react'

/**
 * PriceDisplay Component
 * Single Responsibility: Display product price with optional original price
 * Open/Closed: Extensible through props, closed for modification
 */
interface PriceDisplayProps {
  price: number
  originalPrice?: number
  className?: string
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="2xl:text-[28px] text-2xl  text-primary capitalize font-semibold">
        {price} AED
      </span>
      {originalPrice && (
        <span className="2xl:text-2xl text-xl text-primary font-normal line-through">
          {originalPrice} AED
        </span>
      )}
    </div>
  )
}

export default PriceDisplay
