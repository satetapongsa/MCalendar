export interface CalendarEvent {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  date: string // ISO date string YYYY-MM-DD
  location: string
  color: string
  folderId: string | null
  attendees: string[]
  organizer: string
  createdAt: string
  updatedAt: string
}

export interface Folder {
  id: string
  name: string
  color: string
  createdAt: string
}

export interface CalendarStore {
  events: CalendarEvent[]
  folders: Folder[]
  selectedDate: Date
  currentView: 'day' | 'week' | 'month'
  selectedFolderId: string | null
}

export const EVENT_COLORS = [
  // Row 1 - Primary colors
  { name: 'Red', value: 'bg-red-500', hex: '#ef4444' },
  { name: 'Orange', value: 'bg-orange-500', hex: '#f97316' },
  { name: 'Amber', value: 'bg-amber-500', hex: '#f59e0b' },
  { name: 'Yellow', value: 'bg-yellow-500', hex: '#eab308' },
  { name: 'Lime', value: 'bg-lime-500', hex: '#84cc16' },
  { name: 'Green', value: 'bg-green-500', hex: '#22c55e' },
  { name: 'Emerald', value: 'bg-emerald-500', hex: '#10b981' },
  { name: 'Teal', value: 'bg-teal-500', hex: '#14b8a6' },
  // Row 2 - Secondary colors
  { name: 'Cyan', value: 'bg-cyan-500', hex: '#06b6d4' },
  { name: 'Sky', value: 'bg-sky-500', hex: '#0ea5e9' },
  { name: 'Blue', value: 'bg-blue-500', hex: '#3b82f6' },
  { name: 'Indigo', value: 'bg-indigo-500', hex: '#6366f1' },
  { name: 'Violet', value: 'bg-violet-500', hex: '#8b5cf6' },
  { name: 'Purple', value: 'bg-purple-500', hex: '#a855f7' },
  { name: 'Fuchsia', value: 'bg-fuchsia-500', hex: '#d946ef' },
  { name: 'Pink', value: 'bg-pink-500', hex: '#ec4899' },
  // Row 3 - Dark shades
  { name: 'Rose', value: 'bg-rose-500', hex: '#f43f5e' },
  { name: 'Stone', value: 'bg-stone-500', hex: '#78716c' },
  { name: 'Neutral', value: 'bg-neutral-600', hex: '#525252' },
  { name: 'Zinc', value: 'bg-zinc-600', hex: '#52525b' },
  { name: 'Slate', value: 'bg-slate-600', hex: '#475569' },
  { name: 'Gray', value: 'bg-gray-600', hex: '#4b5563' },
  { name: 'Dark Red', value: 'bg-red-700', hex: '#b91c1c' },
  { name: 'Dark Blue', value: 'bg-blue-700', hex: '#1d4ed8' },
]

// Helper function to check if a color value is a custom hex color
export const isCustomColor = (value: string) => value.startsWith('#')

// Helper function to get the display style for a color
export const getColorStyle = (value: string) => {
  if (isCustomColor(value)) {
    return { backgroundColor: value }
  }
  return {}
}

// Helper function to get color class or style for event rendering
export const getEventColorClass = (value: string) => {
  if (isCustomColor(value)) {
    return ''
  }
  return value
}

export const FOLDER_COLORS = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Teal', value: 'bg-teal-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
]
