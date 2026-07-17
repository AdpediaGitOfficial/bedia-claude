'use client'

import React, { useState } from 'react'
import { BirthdayService, IBirthdayService } from '@/services/birthday.service'
import BirthdayHeroSection from './BirthdayHeroSection'
import EventTimelineSection from './EventTimelineSection'
import BirthdayPackageCard from './BirthdayPackageCard'
import ParentNotesSection from './ParentNotesSection'
import PricingSection from './PricingSection'
import { Title, Content } from '@/components/ui'

/**
 * BirthdayPageClient Component
 * Single Responsibility: Orchestrate birthday page layout and flow
 * Dependency Inversion: Depends on IBirthdayService interface
 * Open/Closed: Can be extended with new sections easily
 */
interface BirthdayPageClientProps {
  birthdayService?: IBirthdayService
}

const BirthdayPageClient: React.FC<BirthdayPageClientProps> = ({
  birthdayService = new BirthdayService(),
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)

  // Data from service - easily swappable
  const packages = birthdayService.getPackages()
  const eventSteps = birthdayService.getEventTimeline()
  const parentNotes = birthdayService.getParentNotes()
  const pricingTiers = birthdayService.getPricingTiers()

  const primaryPackage = packages[0]

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackageId(packageId)
    // Can be extended with booking logic
    console.log('Selected package:', packageId)
  }

  const handlePricingSelect = (tierId: string) => {
    console.log('Selected pricing tier:', tierId)
    // Can be extended with navigation to booking form
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      {primaryPackage && (
        <BirthdayHeroSection
          title={primaryPackage.name}
          subtitle="Special Experience"
          description={primaryPackage.description}
          image={primaryPackage.image}
          ageGroup={primaryPackage.ageGroup}
          duration={primaryPackage.duration}
          capacity={primaryPackage.capacity}
        />
      )}

      {/* Event Timeline Section */}
      <EventTimelineSection steps={eventSteps} />

      {/* Parent Notes Section */}
      <ParentNotesSection notes={parentNotes} />

      {/* Packages Section */}
      <section className="py-16 lg:py-24 bg-secondary-off">
        <div className="page-wrapper px-[17px] ">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
              Our Offering
            </p>
            <Title className="mb-4 font-normal">Birthday Party Packages</Title>
            <Content className="text-gray-600 max-w-2xl mx-auto">
              Create unforgettable memories with our specially designed birthday party packages
            </Content>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <BirthdayPackageCard
                key={pkg.id}
                package={pkg}
                onSelect={handlePackageSelect}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection
        pricingTiers={pricingTiers}
        onSelectTier={handlePricingSelect}
        popularTierId="tier-1"
      />

      {/* FAQ/Additional Info Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="page-wrapper px-[17px] ">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-center">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
                FAQs
              </p>
              <Title className="mb-4 font-normal">Common Questions</Title>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-3">
                  Can we customize the party?
                </h3>
                <Content className="text-gray-600">
                  Absolutely! We can customize themes, activities, and add special touches to make
                  your celebration unique. Contact us for custom packages.
                </Content>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-3">
                  What if a child gets injured?
                </h3>
                <Content className="text-gray-600">
                  Safety is our priority. All activities are supervised, and we follow strict safety
                  protocols. Parent consent forms cover standard pottery activities.
                </Content>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-3">
                  How far in advance should we book?
                </h3>
                <Content className="text-gray-600">
                  We recommend booking at least 2-4 weeks in advance to secure your preferred date
                  and time. Last-minute bookings may be available based on schedule.
                </Content>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-3">
                  Can we bring our own decorations?
                </h3>
                <Content className="text-gray-600">
                  Yes! You're welcome to bring decorations. We can help set up the space to match
                  your theme while keeping it safe for pottery activities.
                </Content>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default BirthdayPageClient
