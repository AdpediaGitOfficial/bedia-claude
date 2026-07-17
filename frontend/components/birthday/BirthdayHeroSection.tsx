'use client'

import React from 'react'
import Image from 'next/image'
import { Title, Subtitle, Content } from '@/components/ui'
import ImageGrid from "../common/ImageGrid"
/**
 * BirthdayHeroSection Component
 * Single Responsibility: Display hero banner with birthday party information
 * Dependency: Only props-based, no service coupling
 */
interface BirthdayHeroSectionProps {
  title: string
  subtitle: string
  description: string
  image: string
  ageGroup: string
  duration: string
  capacity: string
}

const BirthdayHeroSection: React.FC<BirthdayHeroSectionProps> = ({
  title,
  subtitle,
  description,
  image,
  ageGroup,
  duration,
  capacity,
}) => {
  return (
    <section className="relative pb-16 lg:pb-24 bg-secondary-off overflow-hidden">
      <div className="page-wrapper px-[17px] ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
<ImageGrid
  images={[
    "/images/banner/banner-3.png",
    "/images/banner/banner-2.png",
    "/images/banner/banner-4.png",
    "/images/banner/banner-5.png",
  ]}
/>
          {/* Right Content */}
              <div className=" p-6 lg:p-8 space-y-6 ">
                     <div>
                           <Title className="2xl:mb-7 mb-5 font-normal">{title}</Title>
                       {description && (
                          <Content className=" leading-relaxed mb-7">
                                  {description}
                                   </Content>
                        
                       )}
                     </div>

         

            {/* Quick Info Cards */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Age Group</p>
                <p className="text-lg font-semibold text-primary">{ageGroup}</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="text-lg font-semibold text-primary">{duration}</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Capacity</p>
                <p className="text-lg font-semibold text-primary">{capacity}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BirthdayHeroSection
