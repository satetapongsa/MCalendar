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
  User,
  Bell,
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
  const [showNotifications, setShowNotifications] = useState(false)

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
    backgroundImage,
    settings,
  } = useCalendarStore()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

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

  const getActiveNotifications = () => {
    if (!settings.notifications) return []
    const now = new Date()
    return events.filter(e => {
      const eventDateStr = e.startTime ? `${e.date}T${e.startTime}:00` : `${e.date}T00:00:00`
      const eventDate = new Date(eventDateStr)
      if (eventDate < now) return false // past event
      
      const diffMs = eventDate.getTime() - now.getTime()
      const diffHours = diffMs / (1000 * 60 * 60)
      
      if (settings.reminderLeadTime === "1h") return diffHours <= 1
      if (settings.reminderLeadTime === "1d") return diffHours <= 24
      if (settings.reminderLeadTime === "1w") return diffHours <= 168
      if (settings.reminderLeadTime === "at") return diffHours <= 0.5 // show up to 30 mins before
      
      return false
    }).sort((a,b) => {
      const dateA = new Date(a.startTime ? `${a.date}T${a.startTime}:00` : `${a.date}T00:00:00`)
      const dateB = new Date(b.startTime ? `${b.date}T${b.startTime}:00` : `${b.date}T00:00:00`)
      return dateA.getTime() - dateB.getTime()
    })
  }

  const activeNotifications = getActiveNotifications()
  const [sentNotifications, setSentNotifications] = useState<string[]>([])

  // Notification logic
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission()
      }
    }
  }, [])

  useEffect(() => {
    if (settings.notifications && activeNotifications.length > 0) {
      activeNotifications.forEach(event => {
        if (!sentNotifications.includes(event.id)) {
          // Send Browser Notification
          if ("Notification" in window && Notification.permission === "granted") {
            try {
              new Notification(`Reminder: ${event.title}`, {
                body: `${event.startTime} - ${event.location || 'No location'}`,
                icon: '/favicon.ico'
              })
            } catch (err) {
              console.error("Browser notification failed:", err)
            }
          }
          
          setSentNotifications(prev => [...prev, event.id])
        }
      })
    }
  }, [activeNotifications, settings.notifications, sentNotifications])

  // Localization
  const translations: Record<string, any> = {
    th: {
      today: "วันนี้",
      day: "วัน",
      week: "สัปดาห์",
      month: "เดือน",
      settings: "ตั้งค่า",
      search: "ค้นหาเหตุการณ์...",
      noNotifications: "ไม่มีการแจ้งเตือนใหม่",
      notifications: "การแจ้งเตือน",
    },
    en: {
      today: "Today",
      day: "Day",
      week: "Week",
      month: "Month",
      settings: "Settings",
      search: "Search events...",
      noNotifications: "No new notifications",
      notifications: "Notifications",
    },
    ja: {
      today: "今日",
      day: "日",
      week: "週",
      month: "月",
      settings: "設定",
      search: "イベントを検索...",
      noNotifications: "新しい通知はありません",
      notifications: "通知",
    },
    zh: {
      today: "今天",
      day: "天",
      week: "周",
      month: "月",
      settings: "设置",
      search: "搜索事件...",
      noNotifications: "没有新通知",
      notifications: "通知",
    }
  }
  
  const lang = settings.language || 'en'
  const t = translations[lang] || translations.en

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
        src={backgroundImage}
        alt="Customizable background"
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
          <Image
            src="/logo.png"
            alt="MCalendar Logo"
            width={32}
            height={32}
            className="rounded-lg shadow-sm"
          />
          <span className="text-2xl font-semibold text-white drop-shadow-lg">MCalendar</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full bg-white/10 backdrop-blur-sm pl-10 pr-4 py-2 text-white placeholder:text-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-primary w-64 text-sm"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
            >
              <Bell className="h-6 w-6 text-white drop-shadow-md" />
              {activeNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 p-2 z-50 text-gray-800">
                <div className="flex items-center justify-between p-2 border-b">
                  <h3 className="text-sm font-semibold">{t.notifications}</h3>
                  <button onClick={() => setShowNotifications(false)}>
                    <X className="h-4 w-4 text-gray-500 hover:text-gray-800" />
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-auto mt-2">
                  {activeNotifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">{t.noNotifications}</div>
                  ) : (
                    activeNotifications.map(event => (
                      <button
                        key={event.id}
                        onClick={() => {
                          setShowNotifications(false)
                          handleEventClick(event)
                        }}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-start gap-3 border-b border-gray-50 last:border-0"
                      >
                        <div className={`w-3 h-3 mt-1 rounded-full shrink-0 ${event.color === 'bg-blue-500' ? 'bg-accent-primary' : event.color}`} style={event.color.startsWith("#") ? { backgroundColor: event.color } : {}}/>
                        <div>
                          <div className="font-medium text-sm text-gray-800 line-clamp-1">{event.title}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {event.date} {event.startTime && `at ${event.startTime}`}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <Link
            href="/settings"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Settings className="h-6 w-6 text-white drop-shadow-md" />
          </Link>
          <Link href="/profile">
            <div className="h-10 w-10 rounded-full bg-accent-primary flex items-center justify-center accent-foreground shadow-md hover:ring-2 hover:ring-white/50 transition-all">
              <User className="h-6 w-6" />
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
                className={`px-4 py-2 rounded-md transition-colors text-sm ${
                  isToday()
                    ? "bg-accent-primary accent-foreground"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {t.today}
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
                {t.day}
              </button>
              <button
                onClick={() => setCurrentView("week")}
                className={`px-4 py-1.5 rounded-md transition-colors ${
                  currentView === "week"
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white"
                } text-sm font-medium`}
              >
                {t.week}
              </button>
              <button
                onClick={() => setCurrentView("month")}
                className={`px-4 py-1.5 rounded-md transition-colors ${
                  currentView === "month"
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white"
                } text-sm font-medium`}
              >
                {t.month}
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

        {/* AI Popup Removed */}

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
