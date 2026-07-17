'use client'

import { WorkshopOption } from '@/services/workshop.service'
import React from 'react'


/**
 * MaterialSelector Component
 * Single Responsibility: Handle material type selection only
 * Interface Segregation: Only depends on MaterialOption interface
 */
interface MaterialSelectorProps {
  materials: WorkshopOption[]
  selectedMaterialId: string
  onMaterialSelect: (materialId: string) => void
  className?: string
}

const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  materials,
  selectedMaterialId,
  onMaterialSelect,
  className = '',
}) => {
  if (materials.length === 0) {
    return null
  }

  return (
<div className={`space-y-3 mb-6 ${className}`}>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    {materials.map((material) => (
      <button
        key={material._id}
        onClick={() => onMaterialSelect(material._id)}
        className={`
          w-full
          px-4 py-3 md:px-6 md:py-4 2xl:py-5
          font-medium text-sm md:text-base
          transition-colors duration-200
          ${
            selectedMaterialId === material._id
              ? "bg-primary text-secondary-dark"
              : "bg-[#0D463D1A] text-primary hover:bg-primary hover:text-secondary-dark"
          }
        `}
      >
        {material.title}
      </button>
    ))}
  </div>
</div>
  )
}

export default MaterialSelector
