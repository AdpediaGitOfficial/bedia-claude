'use client'

import React from 'react'
import { EventStep, eventTimeline } from '@/constants/birthdayData'
import { Title, Content } from '@/components/ui'

/**
 * EventTimelineStep Component
 * Single Responsibility: Render individual timeline step
 * Dependency: Props-based, reusable and testable
 */
interface EventTimelineStepProps {
  step: EventStep
  isLast: boolean
}

const EventTimelineStep: React.FC<EventTimelineStepProps> = ({ step, isLast }) => {
  return (
    <div className="flex gap-6 pb-8">
      {/* Step Number Circle */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
          {step.number}
        </div>
        {!isLast && (
          <div className="w-1 h-20 bg-gray-300 mt-2" />
        )}
      </div>

      {/* Step Content */}
      <div className="pt-2 pb-4">
        <h3 className="text-xl font-semibold text-primary mb-2">{step.title}</h3>
        <Content className="text-gray-600 mb-2">{step.description}</Content>
        <p className="text-sm text-gray-500 font-medium">⏱️ {step.duration}</p>
      </div>
    </div>
  )
}

/**
 * EventTimelineSection Component
 * Single Responsibility: Display event timeline
 * Dependency Inversion: Accepts steps as props, no direct data coupling
 */
interface EventTimelineSectionProps {
  steps?: EventStep[]
  title?: string
  subtitle?: string
}

const EventTimelineSection: React.FC<EventTimelineSectionProps> = ({
  steps = eventTimeline,
  title = 'Birthday Party Timeline',
  subtitle = 'Here\'s how your celebration will unfold',
}) => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="page-wrapper px-[17px] ">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
            Event Schedule
          </p>
          <Title className="mb-4 font-normal">{title}</Title>
          <Content className="text-gray-600">{subtitle}</Content>
        </div>

        <div className="max-w-2xl mx-auto bg-gray-50 p-4 lg:p-8 rounded-lg">
          {steps.map((step, index) => (
            <EventTimelineStep
              key={step.id}
              step={step}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventTimelineSection
