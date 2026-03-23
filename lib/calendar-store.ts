"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CalendarEvent, Folder } from './types'

export interface Settings {
  accentColor: 'blue' | 'orange' | 'green' | 'white' | 'yellow' | 'pink' | 'purple'
  language: 'th' | 'en' | 'ja' | 'zh'
  timezone: string
  defaultView: 'day' | 'week' | 'month'
  weekStartsOn: 'sunday' | 'monday'
  timeFormat: '12h' | '24h'
  notifications: boolean
  reminderLeadTime: '1h' | '1d' | '1w' | 'at'
  showWeekNumbers: boolean
  showDeclinedEvents: boolean
}

const defaultSettings: Settings = {
  accentColor: 'blue',
  language: 'th',
  timezone: 'Asia/Bangkok',
  defaultView: 'month',
  weekStartsOn: 'sunday',
  timeFormat: '24h',
  notifications: true,
  reminderLeadTime: '1d',
  showWeekNumbers: false,
  showDeclinedEvents: false,
}

interface CalendarState {
  events: CalendarEvent[]
  folders: Folder[]
  selectedDate: Date
  currentView: 'day' | 'week' | 'month'
  selectedFolderId: string | null
  sidebarOpen: boolean
  backgroundImage: string
  settings: Settings
  
  // Settings actions
  updateSettings: (settings: Partial<Settings>) => void
  
  // Event actions
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
  
  // Folder actions
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => void
  updateFolder: (id: string, folder: Partial<Folder>) => void
  deleteFolder: (id: string) => void
  
  // Navigation actions
  setSelectedDate: (date: Date) => void
  setCurrentView: (view: 'day' | 'week' | 'month') => void
  setSelectedFolderId: (id: string | null) => void
  setSidebarOpen: (open: boolean) => void
  setBackgroundImage: (image: string) => void
  
  // Navigation helpers
  goToToday: () => void
  goToPrevious: () => void
  goToNext: () => void
  
  // Queries
  getEventsForDate: (date: Date) => CalendarEvent[]
  getEventsForWeek: (date: Date) => CalendarEvent[]
  getEventsForMonth: (date: Date) => CalendarEvent[]
  getEventsForFolder: (folderId: string) => CalendarEvent[]
}

const generateId = () => Math.random().toString(36).substring(2, 15)

const formatDateKey = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const getWeekDates = (date: Date, weekStartsOn: 'sunday' | 'monday' = 'sunday') => {
  const startDayOffset = weekStartsOn === 'monday' ? 1 : 0
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 && startDayOffset === 1 ? -6 : startDayOffset)
  // Fix for Sunday when week starts on Monday
  const adjustedDiff = weekStartsOn === 'monday' ? (date.getDate() - (day === 0 ? 6 : day - 1)) : (date.getDate() - day)
  
  const weekStart = new Date(date)
  weekStart.setDate(adjustedDiff)
  
  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    dates.push(formatDateKey(d))
  }
  return dates
}

const getMonthDates = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const dates: string[] = []
  for (let d = firstDay.getDate(); d <= lastDay.getDate(); d++) {
    dates.push(formatDateKey(new Date(year, month, d)))
  }
  return dates
}

// Default folders
const defaultFolders: Folder[] = [
  { id: 'default', name: 'My Calendar', color: 'bg-blue-500', createdAt: new Date().toISOString() },
  { id: 'work', name: 'Work', color: 'bg-green-500', createdAt: new Date().toISOString() },
  { id: 'personal', name: 'Personal', color: 'bg-purple-500', createdAt: new Date().toISOString() },
  { id: 'family', name: 'Family', color: 'bg-orange-500', createdAt: new Date().toISOString() },
]

// Sample events for demo
const today = new Date()
const sampleEvents: CalendarEvent[] = [
  {
    id: generateId(),
    title: 'Team Meeting',
    description: 'Weekly team sync-up',
    startTime: '09:00',
    endTime: '10:00',
    date: formatDateKey(today),
    location: 'Conference Room A',
    color: 'bg-blue-500',
    folderId: 'work',
    attendees: ['John Doe', 'Jane Smith'],
    organizer: 'You',
    status: 'accepted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: 'Lunch Break',
    description: 'Time to relax',
    startTime: '12:00',
    endTime: '13:00',
    date: formatDateKey(today),
    location: 'Cafeteria',
    color: 'bg-green-500',
    folderId: 'personal',
    attendees: [],
    organizer: 'You',
    status: 'accepted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: 'Project Review',
    description: 'Q2 project progress review',
    startTime: '14:00',
    endTime: '15:30',
    date: formatDateKey(new Date(today.getTime() + 86400000 * 2)),
    location: 'Meeting Room 3',
    color: 'bg-purple-500',
    folderId: 'work',
    attendees: ['Team Alpha', 'Stakeholders'],
    organizer: 'Project Manager',
    status: 'accepted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: sampleEvents,
      folders: defaultFolders,
      selectedDate: new Date(),
      currentView: 'month',
      selectedFolderId: null,
      sidebarOpen: true,
      backgroundImage: '/wallpaper/ดาวน์โหลด.jpg',
      settings: defaultSettings,
      
      // Settings actions
      updateSettings: (newSettings) => set((state) => ({ 
        settings: { ...state.settings, ...newSettings } 
      })),
      
      // Event actions
      addEvent: (eventData) => {
        const event: CalendarEvent = {
          ...eventData,
          status: eventData.status || 'accepted',
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ events: [...state.events, event] }))
      },
      
      updateEvent: (id, eventData) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id
              ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
              : event
          ),
        }))
      },
      
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }))
      },
      
      // Folder actions
      addFolder: (folderData) => {
        const folder: Folder = {
          ...folderData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ folders: [...state.folders, folder] }))
      },
      
      updateFolder: (id, folderData) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, ...folderData } : folder
          ),
        }))
      },
      
      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          events: state.events.map((event) =>
            event.folderId === id ? { ...event, folderId: 'default' } : event
          ),
        }))
      },
      
      // Navigation actions
      setSelectedDate: (date) => set({ selectedDate: date }),
      setCurrentView: (view) => set({ currentView: view }),
      setSelectedFolderId: (id) => set({ selectedFolderId: id }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setBackgroundImage: (image) => set({ backgroundImage: image }),
      
      // Navigation helpers
      goToToday: () => set({ selectedDate: new Date() }),
      
      goToPrevious: () => {
        const { currentView, selectedDate } = get()
        const newDate = new Date(selectedDate)
        
        if (currentView === 'day') {
          newDate.setDate(newDate.getDate() - 1)
        } else if (currentView === 'week') {
          newDate.setDate(newDate.getDate() - 7)
        } else {
          newDate.setMonth(newDate.getMonth() - 1)
        }
        
        set({ selectedDate: newDate })
      },
      
      goToNext: () => {
        const { currentView, selectedDate } = get()
        const newDate = new Date(selectedDate)
        
        if (currentView === 'day') {
          newDate.setDate(newDate.getDate() + 1)
        } else if (currentView === 'week') {
          newDate.setDate(newDate.getDate() + 7)
        } else {
          newDate.setMonth(newDate.getMonth() + 1)
        }
        
        set({ selectedDate: newDate })
      },
      
      // Queries
      getEventsForDate: (date) => {
        const dateKey = formatDateKey(date)
        const { settings } = get()
        return get().events.filter((event) => {
          if (!settings.showDeclinedEvents && event.status === 'declined') return false
          return event.date === dateKey
        })
      },
      
      getEventsForWeek: (date) => {
        const { settings } = get()
        const weekDates = getWeekDates(date, settings.weekStartsOn)
        return get().events.filter((event) => {
          if (!settings.showDeclinedEvents && event.status === 'declined') return false
          return weekDates.includes(event.date)
        })
      },
      
      getEventsForMonth: (date) => {
        const { settings } = get()
        const monthDates = getMonthDates(date)
        return get().events.filter((event) => {
          if (!settings.showDeclinedEvents && event.status === 'declined') return false
          return monthDates.includes(event.date)
        })
      },
      
      getEventsForFolder: (folderId) => {
        const { settings } = get()
        return get().events.filter((event) => {
          if (!settings.showDeclinedEvents && event.status === 'declined') return false
          return event.folderId === folderId
        })
      },
    }),
    {
      name: 'calendar-storage',
      partialize: (state) => ({
        events: state.events,
        folders: state.folders,
        backgroundImage: state.backgroundImage,
        settings: state.settings,
      }),
    }
  )
)

export { formatDateKey, getWeekDates, getMonthDates }
