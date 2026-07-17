'use client'

import React, { useState } from 'react'
import { Content } from '../ui'

/**
 * MaterialDescription Component
 * Single Responsibility: Display and toggle material description
 * Open/Closed: Extensible through props
 */
interface MaterialDescriptionProps {
  materialName: string
  description: string
  className?: string
}

const MaterialDescription: React.FC<MaterialDescriptionProps> = ({
  materialName,
  description,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={` bg-[#EDE8E266] border border-[#0D463D33] ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-lg"
      >
     
         <Content className=" leading-relaxed  font-semibold">
                        Description: {materialName}
                        </Content>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4  border-t border-gray-200 pt-4">
           <Content className=" leading-relaxed ">
                                   {description}
                                  </Content>
        
        </div>
      )}
    </div>
  )
}

export default MaterialDescription
