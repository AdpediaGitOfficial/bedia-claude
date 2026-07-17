'use client'

import React from 'react'
import { ParentNote, parentNotes } from '@/constants/birthdayData'
import { Title, Content } from '@/components/ui'

/**
 * ParentNoteCard Component
 * Single Responsibility: Display individual parent note
 * Reusable: Can be used in different contexts
 */
interface ParentNoteCardProps {
  note: ParentNote
}

const ParentNoteCard: React.FC<ParentNoteCardProps> = ({ note }) => {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-primary mb-3">{note.title}</h3>
      <Content className="text-gray-600 leading-relaxed">{note.content}</Content>
    </div>
  )
}

/**
 * ParentNotesSection Component
 * Single Responsibility: Display collection of parent notes
 * Dependency Inversion: Accepts notes as props
 */
interface ParentNotesSectionProps {
  notes?: ParentNote[]
  title?: string
  subtitle?: string
}

const ParentNotesSection: React.FC<ParentNotesSectionProps> = ({
  notes = parentNotes,
  title = 'Important Notes for Parents',
  subtitle = 'Please read these important guidelines to prepare for the party',
}) => {
  return (
    <section className="py-16 lg:py-24 bg-secondary-off">
      <div className="page-wrapper px-[17px] ">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
            Parent Information
          </p>
          <Title className="mb-4 font-normal">{title}</Title>
          <Content className="text-gray-600 max-w-2xl mx-auto">{subtitle}</Content>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <ParentNoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ParentNotesSection
