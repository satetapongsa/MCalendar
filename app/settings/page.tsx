"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Bell,
  Calendar,
  Globe,
  Moon,
  Sun,
  Palette,
  Clock,
  Trash2,
  AlertTriangle,
  Check,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useCalendarStore } from "@/lib/calendar-store"

interface Settings {
  theme: "light" | "dark" | "system"
  language: string
  timezone: string
  defaultView: "day" | "week" | "month"
  weekStartsOn: "sunday" | "monday"
  timeFormat: "12h" | "24h"
  notifications: boolean
  soundEnabled: boolean
  showWeekNumbers: boolean
  showDeclinedEvents: boolean
}

const defaultSettings: Settings = {
  theme: "system",
  language: "th",
  timezone: "Asia/Bangkok",
  defaultView: "month",
  weekStartsOn: "sunday",
  timeFormat: "24h",
  notifications: true,
  soundEnabled: true,
  showWeekNumbers: false,
  showDeclinedEvents: false,
}

export default function SettingsPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [saved, setSaved] = useState(false)
  const { events, folders, setCurrentView } = useCalendarStore()

  useEffect(() => {
    setIsLoaded(true)
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("calendar-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("calendar-settings", JSON.stringify(newSettings))
    
    // Apply default view if changed
    if (key === "defaultView") {
      setCurrentView(value as "day" | "week" | "month")
    }
    
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClearAllData = () => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถยกเลิกได้")) {
      localStorage.removeItem("calendar-storage")
      localStorage.removeItem("calendar-settings")
      window.location.href = "/"
    }
  }

  const languages = [
    { code: "th", name: "ไทย" },
    { code: "en", name: "English" },
    { code: "ja", name: "日本語" },
    { code: "zh", name: "中文" },
  ]

  const timezones = [
    { code: "Asia/Bangkok", name: "Bangkok (GMT+7)" },
    { code: "Asia/Tokyo", name: "Tokyo (GMT+9)" },
    { code: "Asia/Singapore", name: "Singapore (GMT+8)" },
    { code: "America/New_York", name: "New York (GMT-5)" },
    { code: "Europe/London", name: "London (GMT+0)" },
  ]

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
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </Link>
          <span className="text-2xl font-semibold text-white drop-shadow-lg">Settings</span>
        </div>

        <div className="flex items-center gap-4">
          {saved && (
            <div className="flex items-center gap-2 bg-green-500/80 px-4 py-2 rounded-lg text-white">
              <Check className="h-4 w-4" />
              <span className="text-sm">Saved</span>
            </div>
          )}
          <Link href="/profile">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md hover:ring-2 hover:ring-white/50 transition-all">
              U
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative min-h-screen w-full pt-24 pb-12 px-8">
        <div
          className={`max-w-3xl mx-auto opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.4s" }}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
            {/* Statistics */}
            <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <h2 className="text-lg font-semibold mb-4">Calendar Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="text-3xl font-bold">{events.length}</div>
                  <div className="text-sm opacity-80">Total Events</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="text-3xl font-bold">{folders.length}</div>
                  <div className="text-sm opacity-80">Folders</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="text-3xl font-bold">
                    {events.filter(e => {
                      const today = new Date()
                      const eventDate = new Date(e.date)
                      return eventDate >= today
                    }).length}
                  </div>
                  <div className="text-sm opacity-80">Upcoming</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="text-3xl font-bold">
                    {events.filter(e => {
                      const today = new Date()
                      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                      return e.date === todayStr
                    }).length}
                  </div>
                  <div className="text-sm opacity-80">Today</div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Appearance */}
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-blue-500" />
                  Appearance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-700">Theme</div>
                      <div className="text-sm text-gray-500">Choose your preferred theme</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSettingChange("theme", "light")}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          settings.theme === "light"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Sun className="h-5 w-5 text-yellow-500" />
                      </button>
                      <button
                        onClick={() => handleSettingChange("theme", "dark")}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          settings.theme === "dark"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Moon className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleSettingChange("theme", "system")}
                        className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          settings.theme === "system"
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        Auto
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Calendar Settings */}
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Calendar
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-700">Default View</div>
                      <div className="text-sm text-gray-500">Set your preferred calendar view</div>
                    </div>
                    <select
                      value={settings.defaultView}
                      onChange={(e) => handleSettingChange("defaultView", e.target.value as Settings["defaultView"])}
                      className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-700">Week Starts On</div>
                      <div className="text-sm text-gray-500">First day of the week</div>
                    </div>
                    <select
                      value={settings.weekStartsOn}
                      onChange={(e) => handleSettingChange("weekStartsOn", e.target.value as Settings["weekStartsOn"])}
                      className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="sunday">Sunday</option>
                      <option value="monday">Monday</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-700">Time Format</div>
                      <div className="text-sm text-gray-500">12-hour or 24-hour clock</div>
                    </div>
                    <select
                      value={settings.timeFormat}
                      onChange={(e) => handleSettingChange("timeFormat", e.target.value as Settings["timeFormat"])}
                      className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="12h">12-hour (AM/PM)</option>
                      <option value="24h">24-hour</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-700">Show Week Numbers</div>
                        <div className="text-sm text-gray-500">Display week numbers in calendar</div>
                      </div>
                    </div>
                    <Switch
                      checked={settings.showWeekNumbers}
                      onCheckedChange={(checked) => handleSettingChange("showWeekNumbers", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <EyeOff className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-700">Show Declined Events</div>
                        <div className="text-sm text-gray-500">Show events you've declined</div>
                      </div>
                    </div>
                    <Switch
                      checked={settings.showDeclinedEvents}
                      onCheckedChange={(checked) => handleSettingChange("showDeclinedEvents", checked)}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Regional Settings */}
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Regional
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-700">Language</div>
                      <div className="text-sm text-gray-500">Display language</div>
                    </div>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange("language", e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-700">Timezone</div>
                      <div className="text-sm text-gray-500">Your local timezone</div>
                    </div>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange("timezone", e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {timezones.map((tz) => (
                        <option key={tz.code} value={tz.code}>
                          {tz.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Notifications */}
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-700">Enable Notifications</div>
                        <div className="text-sm text-gray-500">Receive event reminders</div>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {settings.soundEnabled ? (
                        <Volume2 className="h-4 w-4 text-gray-500" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-gray-500" />
                      )}
                      <div>
                        <div className="font-medium text-gray-700">Sound Effects</div>
                        <div className="text-sm text-gray-500">Play sounds for notifications</div>
                      </div>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Danger Zone */}
              <section>
                <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-red-700">Delete All Data</div>
                      <div className="text-sm text-red-600">
                        Permanently delete all events, folders, and settings
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleClearAllData}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete All
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
