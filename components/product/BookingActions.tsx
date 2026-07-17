'use client'

import React from 'react'

/**
 * BookingActions Component
 * Single Responsibility: Handle booking action buttons only
 * Open/Closed: Extensible through props, closed for modification
 */
interface BookingActionsProps {
  onBookNow: () => void
  isBookingDisabled?: boolean
  className?: string
}

const BookingActions: React.FC<BookingActionsProps> = ({
  onBookNow,
  isBookingDisabled = false,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className} md:pb-0 pb-6`}>
      <button
        type="button"
        onClick={onBookNow}
        className={`w-full px-6 py-4 font-medium transition-colors duration-200  ${
          isBookingDisabled
            ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary-dark'
        }`}
      >
        Book Now
      </button>
    </div>
  )
}

export default BookingActions
