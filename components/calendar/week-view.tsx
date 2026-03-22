"use client"

import { useMemo } from "react"
import { useCalendarStore, formatDateKey } from "@/lib/calendar-store"
import { isCustomColor } from "@/lib/types"
import type { CalendarEvent } from "@/lib/types"
import { MapPin } from "lucide-react"

interface WeekViewProps {
  onEventClick: (event: CalendarEvent) => void
  onSlotClick: (date: Date, time: string) => void
}

export function WeekView({ onEventClick, onSlotClick }: WeekViewProps) {
  const { selectedDate, events, selectedFolderId } = useCalendarStore()

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 6) // 6 AM to 7 PM

  const { weekDates, weekDateObjects } = useMemo(() => {
    const day = selectedDate.getDay()
    const diff = selectedDate.getDate() - day
    const weekStart = new Date(selectedDate)
    weekStart.setDate(diff)

    const objects: Date[] = []
    const dates: number[] = []

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(weekStart.getDate() + i)
      objects.push(d)
      dates.push(d.getDate())
    }

    return { weekDates: dates, weekDateObjects: objects }
  }, [selectedDate])

  const filteredEvents = useMemo(() => {
    let filtered = events
    if (selectedFolderId) {
      filtered = events.filter((e) => e.folderId === selectedFolderId)
    }
    const weekDateKeys = weekDateObjects.map((d) => formatDateKey(d))
    return filtered.filter((e) => weekDateKeys.includes(e.date))
  }, [events, selectedFolderId, weekDateObjects])

  const calculateEventStyle = (startTime: string, endTime: string) => {
    const start = parseInt(startTime.split(":")[0]) + parseInt(startTime.split(":")[1]) / 60
    const end = parseInt(endTime.split(":")[0]) + parseInt(endTime.split(":")[1]) / 60
    const top = (start - 6) * 60 // 60px per hour, starting from 6 AM
    const height = Math.max((end - start) * 60, 30) // minimum 30px height
    return { top: `${top}px`, height: `${height}px` }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const getEventsForDay = (dayIndex: number) => {
    const dateKey = formatDateKey(weekDateObjects[dayIndex])
    return filteredEvents.filter((e) => e.date === dateKey)
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

  // Get event indicators for a day
  const getDayEventIndicators = (dayIndex: number) => {
    const dayEvents = getEventsForDay(dayIndex)
    if (dayEvents.length === 0) return null
    const uniqueColors = [...new Set(dayEvents.map(e => e.color))]
    return uniqueColors.slice(0, 3)
  }

  const handleSlotClick = (dayIndex: number, hour: number) => {
    const date = weekDateObjects[dayIndex]
    const time = `${hour.toString().padStart(2, "0")}:00`
    onSlotClick(date, time)
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl min-h-full">
        {/* Week Header */}
        <div className="grid grid-cols-8 border-b border-white/20 sticky top-0 bg-white/10 backdrop-blur-lg z-10 rounded-t-xl">
          <div className="p-2 text-center text-white/50 text-xs" />
          {weekDays.map((day, i) => {
            const indicators = getDayEventIndicators(i)
            return (
              <div key={i} className="p-2 text-center border-l border-white/20">
                <div className="text-xs text-white/70 font-medium">{day}</div>
                <div
                  className={`text-lg font-medium mt-1 text-white ${
                    isToday(weekDateObjects[i])
                      ? "bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                      : ""
                  }`}
                >
                  {weekDates[i]}
                </div>
                {/* Color Indicators under date */}
                {indicators && indicators.length > 0 && (
                  <div className="flex justify-center gap-0.5 mt-1">
                    {indicators.map((color, idx) => (
                      <MapPin 
                        key={idx}
                        className={`w-3 h-3 ${getEventClass(color)}`}
                        style={{
                          ...getEventStyle(color),
                          color: isCustomColor(color) ? color : undefined,
                          fill: isCustomColor(color) ? color : 'currentColor',
                          stroke: 'white',
                          strokeWidth: 0.5,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-8">
          {/* Time Labels */}
          <div className="text-white/70">
            {timeSlots.map((time, i) => (
              <div key={i} className="h-[60px] border-b border-white/10 pr-2 text-right text-xs flex items-start justify-end pt-1">
                {time > 12 ? `${time - 12} PM` : time === 12 ? "12 PM" : `${time} AM`}
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <div key={dayIndex} className="border-l border-white/20 relative">
              {timeSlots.map((hour, timeIndex) => (
                <div
                  key={timeIndex}
                  className="h-[60px] border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => handleSlotClick(dayIndex, hour)}
                />
              ))}

              {/* Events */}
              {getEventsForDay(dayIndex).map((event) => {
                const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                return (
                  <div
                    key={event.id}
                    className={`absolute rounded-md p-2 text-white text-xs shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg overflow-hidden ${getEventClass(event.color)}`}
                    style={{
                      ...eventStyle,
                      ...getEventStyle(event.color),
                      left: "4px",
                      right: "4px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/80 flex-shrink-0" />
                      <span className="font-medium truncate">{event.title}</span>
                    </div>
                    <div className="opacity-80 text-[10px] mt-0.5">{`${event.startTime} - ${event.endTime}`}</div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
