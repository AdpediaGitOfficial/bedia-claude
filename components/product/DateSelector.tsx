'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { format, addDays } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateSelectorProps {
  onDateSelect: (date: Date) => void
  selectedDate?: Date | null
  className?: string
  nonAvailabilityDays?: string[]
}

// -----------------------------
// ✅ Utils (SRP)
// -----------------------------

const dayMap: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

const normalizeDate = (date: Date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const isSameDay = (d1: Date, d2: Date) =>
  normalizeDate(d1).getTime() === normalizeDate(d2).getTime()

// -----------------------------
// ✅ Hook: Responsive Days Count
// -----------------------------

const useDaysCount = () => {
  const [days, setDays] = useState(5)

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      if (width >= 1920) setDays(7)
      else if (width >= 1280) setDays(6)
      else if (width >= 1024) setDays(5)
      else if (width >= 768) setDays(3)
      else setDays(2)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return days
}

// -----------------------------
// ✅ Hook: Disabled Days
// -----------------------------

const useDisabledDays = (nonAvailabilityDays: string[]) => {
  return useMemo(
    () => nonAvailabilityDays.map((day) => dayMap[day.toLowerCase()]),
    [nonAvailabilityDays]
  )
}

// -----------------------------
// ✅ Hook: Generate Dates
// -----------------------------

const useWeekDates = (
  baseDate: Date,
  daysCount: number,
  disabledDays: number[]
) => {
  return useMemo(() => {
    const start = normalizeDate(baseDate)
    const dates: Date[] = []
    let i = 0

    while (dates.length < daysCount) {
      const d = addDays(start, i)
      if (!disabledDays.includes(d.getDay())) {
        dates.push(d)
      }
      i++
    }

    return dates
  }, [baseDate, daysCount, disabledDays])
}

// -----------------------------
// ✅ Main Component
// -----------------------------

const DateSelector: React.FC<DateSelectorProps> = ({
  onDateSelect,
  selectedDate,
  className = '',
  nonAvailabilityDays = ['monday'],
}) => {
  const disabledDays = useDisabledDays(nonAvailabilityDays)

  // Find first available day starting from today or selectedDate
  const getInitialAvailableDate = (base: Date) => {
    let target = normalizeDate(base)
    while (disabledDays.includes(target.getDay())) {
      target = addDays(target, 1)
    }
    return target
  }

  // Initialize state cleanly
  const [date, setDate] = useState<Date>(() => 
    getInitialAvailableDate(selectedDate || new Date())
  )
  const [open, setOpen] = useState(false)
  const daysCount = useDaysCount()
  const weekDates = useWeekDates(date, daysCount, disabledDays)

  // Automatically trigger the parent callback for the default selected day on mount
  useEffect(() => {
    if (!selectedDate || disabledDays.includes(selectedDate.getDay())) {
      const initialAvailable = getInitialAvailableDate(new Date())
      setDate(initialAvailable)
      onDateSelect(initialAvailable)
    }
  }, [disabledDays])

  const handleSelect = (selected: Date | undefined) => {
    if (!selected) return
    const nextAvailable = getInitialAvailableDate(selected)
    setDate(nextAvailable)
    onDateSelect(nextAvailable)
    setOpen(false)
  }

  const isDisabledDate = (d: Date) => {
    const today = normalizeDate(new Date())
    if (normalizeDate(d) < today) return true
    if (disabledDays.includes(d.getDay())) return true
    return false
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* ✅ Date Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 flex-1">
        {weekDates.map((d, i) => {
          const isSelected = isSameDay(d, date)

          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                setDate(d)
                onDateSelect(d)
              }}
              className={`w-full px-3.5 py-3 border text-center transition-all 
                ${isSelected
                  ? "bg-[#113224] text-white border-[#113224] font-bold"
                  : "bg-white text-[#113224] border-gray-200 hover:border-black opacity-70"
                }
              `}
            >
              <div className="text-sm opacity-90">{format(d, "EEE")}</div>
              <div className="text-lg font-semibold mt-0.5">
                {format(d, "MMM dd")}
              </div>
            </button>
          )
        })}
      </div>

      {/* ✅ Calendar Popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="p-2 hover:scale-105 transition flex-shrink-0">
            <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M4.75633 6.5L0.211256 11.6134C-0.0704188 11.9303 -0.0704188 12.4454 0.211256 12.7623C0.49293 13.0792 0.950831 13.0792 1.23251 12.7623L6.2882 7.07447C6.5706 6.75758 6.5706 6.24242 6.2882 5.92553L1.23251 0.237671C0.950831 -0.0792236 0.49293 -0.0792236 0.211256 0.237671C-0.0704188 0.554565 -0.0704188 1.06972 0.211256 1.38662L4.75633 6.5Z" fill="#113224"/>
            </svg>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={isDisabledDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DateSelector