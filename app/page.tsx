"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
  Menu,
  Sparkles,
  X,
  Pause,
} from "lucide-react"
import { useCalendarStore, formatDateKey } from "@/lib/calendar-store"
import type { CalendarEvent, Folder } from "@/lib/types"
import { CalendarSidebar } from "@/components/calendar/calendar-sidebar"
import { WeekView } from "@/components/calendar/week-view"
import { DayView } from "@/components/calendar/day-view"
import { MonthView } from "@/components/calendar/month-view"
import { EventDialog } from "@/components/calendar/event-dialog"
import { FolderDialog } from "@/components/calendar/folder-dialog"
import { EventDetail } from "@/components/calendar/event-detail"
import { SettingsDialog } from "@/components/calendar/settings-dialog"

export default function CalendarApp() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAIPopup, setShowAIPopup] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Dialog states
  const [eventDialogOpen, setEventDialogOpen] = useState(false)
  const [folderDialogOpen, setFolderDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [eventDetailOpen, setEventDetailOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const [defaultEventDate, setDefaultEventDate] = useState<Date | undefined>()
  const [defaultEventTime, setDefaultEventTime] = useState<string | undefined>()

  // Store
  const {
    selectedDate,
    currentView,
    setCurrentView,
    goToToday,
    goToPrevious,
    goToNext,
    sidebarOpen,
    setSidebarOpen,
    events,
  } = useCalendarStore()

  useEffect(() => {
    setIsLoaded(true)

    // Show AI popup after 3 seconds
    const popupTimer = setTimeout(() => {
      setShowAIPopup(true)
    }, 3000)

    return () => clearTimeout(popupTimer)
  }, [])

  useEffect(() => {
    if (showAIPopup) {
      const text =
        "Looks like you don't have that many meetings today. Shall I play some Hans Zimmer essentials to help you get into your Flow State?"
      let i = 0
      setTypedText("")
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setTypedText((prev) => prev + text.charAt(i))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, 30)

      return () => clearInterval(typingInterval)
    }
  }, [showAIPopup])

  const formatDateHeader = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]

    if (currentView === "day") {
      return `${months[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
    } else if (currentView === "week") {
      return `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    } else {
      return `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    }
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setEventDetailOpen(true)
  }

  const handleSlotClick = (date: Date, time: string) => {
    setDefaultEventDate(date)
    setDefaultEventTime(time)
    setSelectedEvent(null)
    setEventDialogOpen(true)
  }

  const handleDayClick = (date: Date) => {
    // Just selects the date, could open day view or event dialog
  }

  const handleCreateEvent = () => {
    setSelectedEvent(null)
    setDefaultEventDate(selectedDate)
    setDefaultEventTime(undefined)
    setEventDialogOpen(true)
  }

  const handleEditEvent = () => {
    if (selectedEvent) {
      setEventDialogOpen(true)
    }
  }

  const handleCreateFolder = () => {
    setSelectedFolder(null)
    setFolderDialogOpen(true)
  }

  const handleEditFolder = (folder: Folder) => {
    setSelectedFolder(folder)
    setFolderDialogOpen(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Filter events by search
  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isToday = () => {
    const today = new Date()
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
        alt="Beautiful mountain landscape"
        fill
        className="object-cover"
        priority
      />

      {/* Navigation */}
      <header
        className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6 opacity-0 ${
          isLoaded ? "animate-fade-in" : ""
        }`}
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
          <span className="text-2xl font-semibold text-white drop-shadow-lg">Calendar</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full bg-white/10 backdrop-blur-sm pl-10 pr-4 py-2 text-white placeholder:text-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 w-64"
            />
          </div>
          <Link
            href="/settings"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Settings className="h-6 w-6 text-white drop-shadow-md" />
          </Link>
          <Link href="/profile">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md hover:ring-2 hover:ring-white/50 transition-all">
              U
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative h-screen w-full pt-20 flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <div
            className={`opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
            style={{ animationDelay: "0.4s" }}
          >
            <CalendarSidebar
              onCreateEvent={handleCreateEvent}
              onCreateFolder={handleCreateFolder}
              onEditFolder={handleEditFolder}
            />
          </div>
        )}

        {/* Calendar View */}
        <div
          className={`flex-1 flex flex-col opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.6s" }}
        >
          {/* Calendar Controls */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-4">
              <button
                onClick={goToToday}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isToday()
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Today
              </button>
              <div className="flex">
                <button
                  onClick={goToPrevious}
                  className="p-2 text-white hover:bg-white/10 rounded-l-md transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="p-2 text-white hover:bg-white/10 rounded-r-md transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-white">{formatDateHeader()}</h2>
            </div>

            <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setCurrentView("day")}
                className={`px-4 py-1.5 rounded-md transition-colors ${
                  currentView === "day"
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white"
                } text-sm font-medium`}
              >
                Day
              </button>
              <button
                onClick={() => setCurrentView("week")}
                className={`px-4 py-1.5 rounded-md transition-colors ${
                  currentView === "week"
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white"
                } text-sm font-medium`}
              >
                Week
              </button>
              <button
                onClick={() => setCurrentView("month")}
                className={`px-4 py-1.5 rounded-md transition-colors ${
                  currentView === "month"
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white"
                } text-sm font-medium`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Calendar Views */}
          {currentView === "week" && (
            <WeekView onEventClick={handleEventClick} onSlotClick={handleSlotClick} />
          )}
          {currentView === "day" && (
            <DayView onEventClick={handleEventClick} onSlotClick={handleSlotClick} />
          )}
          {currentView === "month" && (
            <MonthView onEventClick={handleEventClick} onDayClick={handleDayClick} />
          )}
        </div>

        {/* AI Popup */}
        {showAIPopup && (
          <div className="fixed bottom-8 right-8 z-20">
            <div className="w-[450px] relative bg-gradient-to-br from-blue-400/30 via-blue-500/30 to-blue-600/30 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-blue-300/30 text-white">
              <button
                onClick={() => setShowAIPopup(false)}
                className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-blue-300" />
                </div>
                <div className="min-h-[80px]">
                  <p className="text-base font-light">{typedText}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={togglePlay}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors font-medium"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowAIPopup(false)}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors font-medium"
                >
                  No
                </button>
              </div>
              {isPlaying && (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-white text-sm hover:bg-white/20 transition-colors"
                    onClick={togglePlay}
                  >
                    <Pause className="h-4 w-4" />
                    <span>Pause Hans Zimmer</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Results Overlay */}
        {searchQuery && (
          <div className="fixed inset-0 bg-black/50 z-30 flex items-start justify-center pt-24">
            <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl w-full max-w-2xl max-h-[70vh] overflow-auto">
              <div className="p-4 border-b sticky top-0 bg-white/95 backdrop-blur-xl flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  Search Results ({filteredEvents.length})
                </h3>
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="p-2">
                {filteredEvents.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No events found matching "{searchQuery}"
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => {
                        setSearchQuery("")
                        handleEventClick(event)
                      }}
                      className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <div className={`w-3 h-3 rounded-full ${event.color}`} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{event.title}</div>
                        <div className="text-sm text-gray-500">
                          {event.date} at {event.startTime}
                          {event.location && ` - ${event.location}`}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Dialogs */}
      <EventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        event={selectedEvent}
        defaultDate={defaultEventDate}
      />

      <FolderDialog
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
        folder={selectedFolder}
      />

      <EventDetail
        event={selectedEvent}
        open={eventDetailOpen}
        onOpenChange={setEventDetailOpen}
        onEdit={handleEditEvent}
      />

      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
    </div>
  )
}
