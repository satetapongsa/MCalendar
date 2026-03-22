"use client"

import { useMemo } from "react"
import { useCalendarStore, formatDateKey } from "@/lib/calendar-store"
import { isCustomColor } from "@/lib/types"
import type { CalendarEvent } from "@/lib/types"

interface DayViewProps {
  onEventClick: (event: CalendarEvent) => void
  onSlotClick: (date: Date, time: string) => void
}

export function DayView({ onEventClick, onSlotClick }: DayViewProps) {
  const { selectedDate, events, selectedFolderId } = useCalendarStore()

  const timeSlots = Array.from({ length: 16 }, (_, i) => i + 6) // 6 AM to 9 PM

  const dayEvents = useMemo(() => {
    const dateKey = formatDateKey(selectedDate)
    let filtered = events.filter((e) => e.date === dateKey)
    if (selectedFolderId) {
      filtered = filtered.filter((e) => e.folderId === selectedFolderId)
    }
    return filtered
  }, [events, selectedDate, selectedFolderId])

  const calculateEventStyle = (startTime: string, endTime: string) => {
    const start = parseInt(startTime.split(":")[0]) + parseInt(startTime.split(":")[1]) / 60
    const end = parseInt(endTime.split(":")[0]) + parseInt(endTime.split(":")[1]) / 60
    const top = (start - 6) * 80 // 80px per hour, starting from 6 AM
    const height = Math.max((end - start) * 80, 40) // minimum 40px height
    return { top: `${top}px`, height: `${height}px` }
  }

  const formatDate = (date: Date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  const getEventStyle = (color: string) => {
    if (isCustomColor(color)) {
      return { backgroundColor: color }
    }
    return {}
  }

  const getEventClass = (color: string) => {
    if (isCustomColor(color)) {
      return ""
    }
    return color
  }

  const handleSlotClick = (hour: number) => {
    const time = `${hour.toString().padStart(2, "0")}:00`
    onSlotClick(selectedDate, time)
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl min-h-full">
        {/* Day Header */}
        <div className="p-4 border-b border-white/20 sticky top-0 bg-white/10 backdrop-blur-lg z-10 rounded-t-xl">
          <h2 className="text-xl font-semibold text-white text-center">
            {formatDate(selectedDate)}
          </h2>
          {/* Event color summary */}
          {dayEvents.length > 0 && (
            <div className="flex justify-center gap-2 mt-2">
              {dayEvents.map((event) => (
                <div 
                  key={event.id}
                  className={`h-2 w-8 rounded-full ${getEventClass(event.color)}`}
                  style={getEventStyle(event.color)}
                  title={event.title}
                />
              ))}
            </div>
          )}
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-[80px_1fr]">
          {/* Time Labels */}
          <div className="text-white/70">
            {timeSlots.map((time, i) => (
              <div
                key={i}
                className="h-20 border-b border-white/10 pr-2 text-right text-sm flex items-start justify-end pt-2"
              >
                {time > 12 ? `${time - 12} PM` : time === 12 ? "12 PM" : `${time} AM`}
              </div>
            ))}
          </div>

          {/* Day Column */}
          <div className="border-l border-white/20 relative">
            {timeSlots.map((hour, timeIndex) => (
              <div
                key={timeIndex}
                className="h-20 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => handleSlotClick(hour)}
              />
            ))}

            {/* Events */}
            {dayEvents.map((event) => {
              const eventStyle = calculateEventStyle(event.startTime, event.endTime)
              return (
                <div
                  key={event.id}
                  className={`absolute rounded-md p-3 text-white shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg ${getEventClass(event.color)}`}
                  style={{
                    ...eventStyle,
                    ...getEventStyle(event.color),
                    left: "8px",
                    right: "8px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEventClick(event)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />
                    <span className="font-semibold text-base">{event.title}</span>
                  </div>
                  <div className="opacity-90 text-sm mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                  {event.location && (
                    <div className="opacity-80 text-xs mt-1">{event.location}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
