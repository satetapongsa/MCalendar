"use client"

import { useEffect } from "react"
import { useCalendarStore } from "@/lib/calendar-store"

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useCalendarStore()

  useEffect(() => {
    const colorMap = {
      blue: "#3b82f6",
      orange: "#f97316",
      green: "#22c55e",
      white: "#ffffff",
      yellow: "#facc15",
      pink: "#ec4899",
      purple: "#a855f7"
    }
    
    const root = document.documentElement
    const color = colorMap[settings.accentColor || 'blue']
    root.style.setProperty('--accent-primary', color)
    
    if (settings.accentColor === 'white') {
      root.style.setProperty('--accent-foreground', '#1f2937') // gray-800
    } else {
      root.style.setProperty('--accent-foreground', '#ffffff')
    }
  }, [settings.accentColor])

  return <>{children}</>
}
