"use client"

import React, { useMemo } from "react"
import { useCalendarStore, formatDateKey } from "@/lib/calendar-store"
import { isCustomColor } from "@/lib/types"
import type { CalendarEvent } from "@/lib/types"
import { MapPin } from "lucide-react"

interface MonthViewProps {
  onEventClick: (event: CalendarEvent) => void
  onDayClick: (date: Date) => void
}

export function MonthView({ onEventClick, onDayClick }: MonthViewProps) {
  const { selectedDate, events, selectedFolderId, setSelectedDate, setCurrentView, settings } =
    useCalendarStore()

  const weekDays = settings.weekStartsOn === "monday" 
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] 
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const t = {
    th: { more: "เพิ่มเติม" },
    en: { more: "more" },
    ja: { more: "さらに" },
    zh: { more: "更多" }
  }[settings.language || "en"]

  const { calendarDays, monthEvents } = useMemo(() => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    let firstDayOfWeek = firstDay.getDay()
    
    // Adjust for Monday start
    if (settings.weekStartsOn === "monday") {
      firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    }

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    // Last day of previous month
    const lastDayPrevMonth = new Date(year, month, 0).getDate()

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = []

    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, lastDayPrevMonth - i),
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    // Next month days to complete the grid (6 rows)
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      })
    }

    // Get events for this month view
    const dateKeys = days.map((d) => formatDateKey(d.date))
    let filtered = events.filter((e) => dateKeys.includes(e.date))
    if (selectedFolderId) {
      filtered = filtered.filter((e) => e.folderId === selectedFolderId)
    }

    return { calendarDays: days, monthEvents: filtered }
  }, [selectedDate, events, selectedFolderId])

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const getEventsForDay = (date: Date) => {
    const dateKey = formatDateKey(date)
    return monthEvents.filter((e) => e.date === dateKey)
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

  // Get the primary color indicator for the day (from the first event or mix)
  const getDayColorIndicators = (dayEvents: CalendarEvent[]) => {
    if (dayEvents.length === 0) return null
    
    // Get unique colors from events
    const uniqueColors = [...new Set(dayEvents.map(e => e.color))]
    return uniqueColors.slice(0, 4) // Show up to 4 color pins
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    onDayClick(date)
  }

  const handleDayDoubleClick = (date: Date) => {
    setSelectedDate(date)
    setCurrentView("day")
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl h-full flex flex-col">
        {/* Week Header */}
        <div className={`grid ${settings.showWeekNumbers ? "grid-cols-[40px_repeat(7,1fr)]" : "grid-cols-7"} border-b border-white/20`}>
          {settings.showWeekNumbers && (
            <div className="p-3 text-center text-white/40 font-medium text-[10px] flex items-center justify-center border-r border-white/10 uppercase tracking-tight">
              Wk
            </div>
          )}
          {weekDays.map((day, i) => (
            <div
              key={i}
              className="p-3 text-center text-white font-medium text-sm border-r border-white/10 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className={`flex-1 grid ${settings.showWeekNumbers ? "grid-cols-[40px_repeat(7,1fr)]" : "grid-cols-7"} grid-rows-6`}>
          {calendarDays.map((day, i) => {
            const dayEvents = getEventsForDay(day.date)
            const colorIndicators = getDayColorIndicators(dayEvents)
            const maxVisibleEvents = 2

            // Calculate week number if first day of the week
            const showWeekNum = settings.showWeekNumbers && i % 7 === 0
            
            // Basic week number calculation
            const getWeekNumber = (d: Date) => {
              const firstDayOfYear = new Date(d.getFullYear(), 0, 1)
              const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000
              return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
            }

            return (
              <React.Fragment key={i}>
                {showWeekNum && (
                  <div className="border-b border-r border-white/10 bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/30 select-none">
                    {getWeekNumber(day.date)}
                  </div>
                )}
                <div
                  className={`border-b border-r border-white/10 p-1.5 hover:bg-white/5 cursor-pointer transition-colors min-h-[100px] relative group ${
                    !day.isCurrentMonth ? "opacity-40" : ""
                  }`}
                  onClick={() => handleDayClick(day.date)}
                  onDoubleClick={() => handleDayDoubleClick(day.date)}
                >
                {/* Day Number with Color Indicators */}
                <div className="flex items-start justify-between">
                  <div
                    className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                      isToday(day.date)
                        ? "bg-accent-primary accent-foreground"
                        : "text-white"
                    }`}
                  >
                    {day.date.getDate()}
                  </div>
                  
                  {/* Pin Indicators for Events */}
                  {colorIndicators && colorIndicators.length > 0 && (
                    <div className="flex items-center gap-0.5 -mr-0.5">
                      {colorIndicators.map((color, idx) => (
                        <div 
                          key={idx} 
                          className="relative"
                          style={{ marginRight: idx < colorIndicators.length - 1 ? '-4px' : '0' }}
                        >
                          <MapPin 
                            className={`w-4 h-4 drop-shadow-md ${getEventClass(color)}`}
                            style={{
                              ...getEventStyle(color),
                              color: isCustomColor(color) ? color : undefined,
                              fill: isCustomColor(color) ? color : 'currentColor',
                              stroke: 'white',
                              strokeWidth: 1,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Color bar indicator at the bottom of the day cell */}
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 flex">
                    {dayEvents.slice(0, 5).map((event, idx) => (
                      <div 
                        key={event.id}
                        className={`flex-1 ${getEventClass(event.color)}`}
                        style={{
                          ...getEventStyle(event.color),
                          opacity: 0.8,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Event List */}
                <div className="space-y-0.5 mt-1">
                  {dayEvents.slice(0, maxVisibleEvents).map((event) => (
                    <div
                      key={event.id}
                      className={`text-white text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-90 transition-all flex items-center gap-1 ${getEventClass(event.color)}`}
                      style={getEventStyle(event.color)}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white/80 flex-shrink-0" />
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > maxVisibleEvents && (
                    <div className="text-xs text-white/70 px-1.5 font-medium">
                      +{dayEvents.length - maxVisibleEvents} {t.more}
                    </div>
                  )}
                </div>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
