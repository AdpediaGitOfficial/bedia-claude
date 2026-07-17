'use client'

import React from 'react'
import { PricingTier, pricingTiers } from '@/constants/birthdayData'
import { Title, Content, PrimaryButton } from '@/components/ui'

/**
 * PricingTierCard Component
 * Single Responsibility: Display individual pricing tier
 * Open/Closed: Can be extended with onSelect prop
 */
interface PricingTierCardProps {
  tier: PricingTier
  isPopular?: boolean
  onSelect?: (tierId: string) => void
}

const PricingTierCard: React.FC<PricingTierCardProps> = ({
  tier,
  isPopular = false,
  onSelect,
}) => {
  return (
    <div
      className={`relative p-8 rounded-lg transition-all duration-300 ${
        isPopular
          ? 'bg-primary text-white scale-105 shadow-2xl'
          : 'bg-white text-gray-900 border border-gray-200 hover:shadow-lg'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-yellow-400 text-primary px-4 py-1 rounded-full text-sm font-bold uppercase">
            Most Popular
          </span>
        </div>
      )}

      <h3 className="text-2xl font-bold mb-2">{tier.title}</h3>
      <p className={`mb-6 text-sm ${isPopular ? 'text-white/80' : 'text-gray-600'}`}>
        {tier.description}
      </p>

      <div className="mb-6">
        <span className="text-4xl font-bold">${tier.price}</span>
        <span className={isPopular ? 'text-white/80' : 'text-gray-600 ml-2'}>
          per party
        </span>
      </div>

      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className={`text-lg ${isPopular ? 'text-yellow-400' : 'text-primary'}`}>
              ✓
            </span>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <PrimaryButton
        onClick={() => onSelect?.(tier.id)}
        className={`w-full py-3 font-semibold transition-all ${
          isPopular
            ? 'bg-white text-primary hover:bg-gray-100'
            : 'bg-primary text-white hover:bg-primary/90'
        }`}
      >
        Book Now
      </PrimaryButton>
    </div>
  )
}

/**
 * PricingSection Component
 * Single Responsibility: Display pricing information
 * Dependency Inversion: Accepts pricing tiers as props
 */
interface PricingSectionProps {
  pricingTiers?: PricingTier[]
  title?: string
  subtitle?: string
  onSelectTier?: (tierId: string) => void
  popularTierId?: string
}

const PricingSection: React.FC<PricingSectionProps> = ({
  pricingTiers: tiers = pricingTiers,
  title = 'Birthday Party Pricing',
  subtitle = 'Choose the perfect package for your celebration',
  onSelectTier,
  popularTierId,
}) => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="page-wrapper px-[17px] ">
        <div className="mb-16 text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
            Pricing
          </p>
          <Title className="mb-4 font-normal">{title}</Title>
          <Content className="text-gray-600 max-w-2xl mx-auto">{subtitle}</Content>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <PricingTierCard
              key={tier.id}
              tier={tier}
              isPopular={tier.id === popularTierId}
              onSelect={onSelectTier}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection
