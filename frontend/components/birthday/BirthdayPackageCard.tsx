'use client'

import React from 'react'
import Image from 'next/image'
import { BirthdayPackage } from '@/constants/birthdayData'
import { Content, PrimaryButton } from '@/components/ui'

/**
 * BirthdayPackageCard Component
 * Single Responsibility: Display birthday package details in card format
 * Reusable: Can be used in lists and grids
 */
interface BirthdayPackageCardProps {
  package: BirthdayPackage
  onSelect?: (packageId: string) => void
  variant?: 'default' | 'compact'
}

const BirthdayPackageCard: React.FC<BirthdayPackageCardProps> = ({
  package: pkg,
  onSelect,
  variant = 'default',
}) => {
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-40 bg-gray-200">
          <Image
            src={pkg.image}
            alt={pkg.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-primary mb-2">{pkg.name}</h3>
          <Content className="text-sm text-gray-600 mb-4 line-clamp-2">
            {pkg.description}
          </Content>
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-primary">${pkg.price}</span>
            {pkg.originalPrice && (
              <span className="text-sm line-through text-gray-400">
                ${pkg.originalPrice}
              </span>
            )}
          </div>
          <PrimaryButton
            onClick={() => onSelect?.(pkg.id)}
            className="w-full py-2 text-sm"
          >
            View Details
          </PrimaryButton>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-64 bg-gray-200">
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          className="object-cover"
        />
        {pkg.originalPrice && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Save ${pkg.originalPrice - pkg.price}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 lg:p-8">
        <h3 className="text-2xl font-bold text-primary mb-2">{pkg.name}</h3>
        <Content className="text-gray-600 mb-4 leading-relaxed">
          {pkg.description}
        </Content>

        {/* Info Badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Age Group</p>
            <p className="font-semibold text-primary">{pkg.ageGroup}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
            <p className="font-semibold text-primary">{pkg.duration}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Capacity</p>
            <p className="font-semibold text-primary">{pkg.capacity}</p>
          </div>
        </div>

        {/* Includes Section */}
        <div className="mb-6">
          <p className="font-semibold text-gray-900 mb-3">Package Includes:</p>
          <ul className="space-y-2">
            {pkg.includes.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">•</span>
                <span className="text-gray-600 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">${pkg.price}</span>
            {pkg.originalPrice && (
              <span className="text-lg line-through text-gray-400">
                ${pkg.originalPrice}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">per party</p>
        </div>

        {/* CTA Button */}
        <PrimaryButton
          onClick={() => onSelect?.(pkg.id)}
          className="w-full py-3 text-base font-semibold"
        >
          Book Birthday Party
        </PrimaryButton>
      </div>
    </div>
  )
}

export default BirthdayPackageCard
