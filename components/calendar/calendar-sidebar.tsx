"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, FolderPlus, MoreHorizontal, Check } from "lucide-react"
import { useCalendarStore, formatDateKey } from "@/lib/calendar-store"
import { isCustomColor, type Folder } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CalendarSidebarProps {
  onCreateEvent: () => void
  onCreateFolder: () => void
  onEditFolder: (folder: Folder) => void
}

export function CalendarSidebar({
  onCreateEvent,
  onCreateFolder,
  onEditFolder,
}: CalendarSidebarProps) {
  const {
    selectedDate,
    setSelectedDate,
    folders,
    selectedFolderId,
    setSelectedFolderId,
    events,
  } = useCalendarStore()

  const [miniCalendarMonth, setMiniCalendarMonth] = useState(new Date())

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

  const getMiniCalendarDays = () => {
    const year = miniCalendarMonth.getFullYear()
    const month = miniCalendarMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const firstDayOfWeek = firstDay.getDay()
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    const days: Array<{ date: number | null; fullDate: Date | null }> = []

    // Empty slots before first day
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: null, fullDate: null })
    }

    // Days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, fullDate: new Date(year, month, i) })
    }

    return days
  }

  const miniCalendarDays = getMiniCalendarDays()

  const isSelectedDay = (date: Date | null) => {
    if (!date) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const hasEvents = (date: Date | null) => {
    if (!date) return false
    const dateKey = formatDateKey(date)
    return events.some((e) => e.date === dateKey)
  }

  const prevMonth = () => {
    const newMonth = new Date(miniCalendarMonth)
    newMonth.setMonth(newMonth.getMonth() - 1)
    setMiniCalendarMonth(newMonth)
  }

  const nextMonth = () => {
    const newMonth = new Date(miniCalendarMonth)
    newMonth.setMonth(newMonth.getMonth() + 1)
    setMiniCalendarMonth(newMonth)
  }

  const handleDayClick = (date: Date | null) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const getEventCountForFolder = (folderId: string) => {
    return events.filter((e) => e.folderId === folderId).length
  }

  // Get colors of events on a specific date for mini calendar indicators
  const getEventColorsForDate = (date: Date | null) => {
    if (!date) return []
    const dateKey = formatDateKey(date)
    const dayEvents = events.filter((e) => e.date === dateKey)
    const uniqueColors = [...new Set(dayEvents.map(e => e.color))]
    return uniqueColors.slice(0, 3)
  }

  const getColorStyle = (color: string) => {
    if (isCustomColor(color)) {
      return { backgroundColor: color }
    }
    return {}
  }

  const getColorClass = (color: string) => {
    if (isCustomColor(color)) {
      return ""
    }
    return color
  }

  return (
    <div className="w-64 h-full bg-white/10 backdrop-blur-lg p-4 shadow-xl border-r border-white/20 rounded-tr-3xl flex flex-col">
      {/* Create Event Button */}
      <button
        onClick={onCreateEvent}
        className="mb-6 flex items-center justify-center gap-2 rounded-full bg-accent-primary hover:opacity-90 transition-all px-4 py-3 accent-foreground w-full shadow-lg"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Create</span>
      </button>

      {/* Mini Calendar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">{formatMonthYear(miniCalendarMonth)}</h3>
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((day, i) => (
            <div key={i} className="text-xs text-white/70 font-medium py-1">
              {day}
            </div>
          ))}

          {miniCalendarDays.map((day, i) => {
            const eventColors = getEventColorsForDate(day.fullDate)
            return (
              <button
                key={i}
                onClick={() => handleDayClick(day.fullDate)}
                disabled={!day.date}
                className={`text-xs rounded-full w-7 h-7 flex items-center justify-center transition-colors relative ${
                  isSelectedDay(day.fullDate)
                    ? "bg-accent-primary accent-foreground"
                    : isToday(day.fullDate)
                    ? "bg-white/30 text-white"
                    : "text-white hover:bg-white/20"
                } ${!day.date ? "invisible" : ""}`}
              >
                {day.date}
                {eventColors.length > 0 && !isSelectedDay(day.fullDate) && (
                  <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    {eventColors.slice(0, 3).map((color, idx) => (
                      <span 
                        key={idx}
                        className={`w-1 h-1 rounded-full ${getColorClass(color)}`}
                        style={getColorStyle(color)}
                      />
                    ))}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Folders */}
      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">My Calendars</h3>
          <button
            onClick={onCreateFolder}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            title="Add folder"
          >
            <FolderPlus className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="space-y-1">
          {/* All Events Option */}
          <button
            onClick={() => setSelectedFolderId(null)}
            className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${
              selectedFolderId === null ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <div className="w-4 h-4 rounded-sm bg-accent-primary" />
            <span className="text-white text-sm flex-1 text-left">All Events</span>
            {selectedFolderId === null && (
              <Check className="h-4 w-4 text-white" />
            )}
          </button>

          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-colors group ${
                selectedFolderId === folder.id ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <button
                onClick={() => setSelectedFolderId(folder.id)}
                className="flex items-center gap-3 flex-1"
              >
                <div className={`w-4 h-4 rounded-sm ${folder.color}`} />
                <span className="text-white text-sm flex-1 text-left">{folder.name}</span>
                <span className="text-white/50 text-xs">
                  {getEventCountForFolder(folder.id)}
                </span>
                {selectedFolderId === folder.id && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all">
                    <MoreHorizontal className="h-4 w-4 text-white" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditFolder(folder)}>
                    Edit Folder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Add Button */}
      <button
        onClick={onCreateEvent}
        className="mt-4 flex items-center justify-center rounded-full bg-accent-primary hover:opacity-90 transition-all p-3 w-12 h-12 shadow-lg self-start accent-foreground"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  )
}
