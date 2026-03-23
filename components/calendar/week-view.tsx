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
  const { selectedDate, events, selectedFolderId, settings } = useCalendarStore()

  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 6) // 6 AM to 7 PM

  const formatTimeLabel = (hour: number) => {
    if (settings.timeFormat === '24h') {
      return `${hour.toString().padStart(2, '0')}:00`
    }
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour} ${ampm}`
  }

  const { weekDates, weekDateObjects, localizedWeekDays } = useMemo(() => {
    const day = selectedDate.getDay()
    let diff = selectedDate.getDate() - day
    
    if (settings.weekStartsOn === 'monday') {
      diff = selectedDate.getDate() - (day === 0 ? 6 : day - 1)
    }
    
    const weekStart = new Date(selectedDate)
    weekStart.setDate(diff)
    weekStart.setHours(0, 0, 0, 0)


    const objects: Date[] = []
    const dates: number[] = []

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(weekStart.getDate() + i)
      objects.push(d)
      dates.push(d.getDate())
    }

    const localizedDays = objects.map(d => 
      new Intl.DateTimeFormat(settings.language || 'en', { weekday: 'short' }).format(d).toUpperCase()
    )

    return { weekDates: dates, weekDateObjects: objects, localizedWeekDays: localizedDays }
  }, [selectedDate, settings.language, settings.weekStartsOn])

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
        <div className={`grid ${settings.showWeekNumbers ? "grid-cols-[40px_repeat(8,1fr)]" : "grid-cols-8"} border-b border-white/20 sticky top-0 bg-white/10 backdrop-blur-lg z-10 rounded-t-xl`}>
          {settings.showWeekNumbers && (
            <div className="p-2 text-center text-white/40 font-medium text-[10px] flex items-center justify-center border-r border-white/10 uppercase">
              Wk
            </div>
          )}
          <div className="p-2 text-center text-white/50 text-xs" />
          {localizedWeekDays.map((day, i) => {
            const indicators = getDayEventIndicators(i)
            return (
              <div key={i} className="p-2 text-center border-l border-white/20">
                <div className="text-xs text-white/70 font-medium">{day}</div>
                <div
                  className={`text-lg font-medium mt-1 text-white ${
                    isToday(weekDateObjects[i])
                      ? "bg-accent-primary accent-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto"
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
        <div className={`grid ${settings.showWeekNumbers ? "grid-cols-[40px_repeat(8,1fr)]" : "grid-cols-8"}`}>
          {settings.showWeekNumbers && (
            <div className="border-r border-white/10 bg-white/5 flex flex-col pt-1">
              {timeSlots.map((_, i) => (
                <div key={i} className="h-[60px] border-b border-white/10 flex items-start justify-center pt-1 text-[10px] font-bold text-white/20">
                  {(() => {
                    const d = weekDateObjects[0]
                    const firstDayOfYear = new Date(d.getFullYear(), 0, 1)
                    const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000
                    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
                  })()}
                </div>
              ))}
            </div>
          )}
          {/* Time Labels */}
          <div className="text-white/70">
            {timeSlots.map((time, i) => (
              <div key={i} className="h-[60px] border-b border-white/10 pr-2 text-right text-xs flex items-start justify-end pt-1">
                {formatTimeLabel(time)}
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
