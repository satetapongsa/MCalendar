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
  Plus,
  Image as ImageIcon,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const backgrounds = [
  "4k desktop wallpaper.jpg",
  "AI generated Luxury office interior with panoramic window and city view_.jpg",
  "Bureau de M_ Pendulum.jpg",
  "Debbie Balboa.gif",
  "Discovering an urban oasis where luxury meets sophistication.jpg",
  "FOCUS.avif",
  "LARGE OFFICE CORPORATE BACKGROUND ANIME STYLE.jpg",
  "Skyline Splendor - with a mesmerizing view of the city skyline from my hotel room.jpg",
  "game time.jpg",
  "the-eternal-moonshine.gif",
  "ดาวน์โหลด (1).avif",
  "ดาวน์โหลด (1).jpg",
  "ดาวน์โหลด (2).avif",
  "ดาวน์โหลด (2).jpg",
  "ดาวน์โหลด (3).avif",
  "ดาวน์โหลด (3).jpg",
  "ดาวน์โหลด (4).jpg",
  "ดาวน์โหลด.avif",
  "ดาวน์โหลด.jpg",
]

import { useCalendarStore, type Settings } from "@/lib/calendar-store"

export default function SettingsPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [saved, setSaved] = useState(false)
  const [customUrl, setCustomUrl] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const { 
    events, 
    folders, 
    setCurrentView, 
    backgroundImage, 
    setBackgroundImage,
    settings,
    updateSettings 
  } = useCalendarStore()
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string)
        setIsDialogOpen(false)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    updateSettings({ [key]: value })
    
    if (key === "defaultView") {
      setCurrentView(value as "day" | "week" | "month")
    }
    
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
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
        src={backgroundImage}
        alt="Background"
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
            <div className="flex items-center gap-2 px-4 py-2 text-white">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Saved</span>
            </div>
          )}
          <Link href="/profile">
            <div className="h-10 w-10 rounded-full bg-accent-primary flex items-center justify-center accent-foreground font-bold shadow-md hover:ring-2 hover:ring-white/50 transition-all">
              U
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative min-h-screen w-full pt-24 pb-12 px-8">
        <div
          className={`max-w-5xl w-full mx-auto opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.4s" }}
        >
          <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
            {/* Statistics */}
            <div className={`p-6 bg-accent-primary accent-foreground transition-all duration-500`}>
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
                  <Palette className="h-5 w-5 text-accent-primary" />
                  Appearance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-700">Theme</div>
                      <div className="text-sm text-gray-500">Choose your preferred theme</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'white', color: 'bg-white border-gray-200' },
                        { id: 'blue', color: 'bg-accent-primary' },
                        { id: 'orange', color: 'bg-orange-500' },
                        { id: 'green', color: 'bg-green-500' },
                        { id: 'yellow', color: 'bg-yellow-400' },
                        { id: 'pink', color: 'bg-pink-500' },
                        { id: 'purple', color: 'bg-purple-500' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSettingChange("accentColor", item.id as any)}
                          className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 ${item.color} ${
                            settings.accentColor === item.id
                              ? "border-white ring-2 ring-white/50 shadow-lg"
                              : "border-transparent"
                          }`}
                          title={item.id.charAt(0).toUpperCase() + item.id.slice(1)}
                        />
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-700">Background Image</div>
                        <div className="text-sm text-gray-500">Choose from gallery or use custom URL</div>
                      </div>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Select Background
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                          <DialogHeader>
                            <DialogTitle>Background Gallery</DialogTitle>
                          </DialogHeader>
                          
                          <div className="flex-1 overflow-y-auto p-4">
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                              {/* Custom URL Button */}
                              <div className="space-y-2 col-span-full mb-6 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 text-center justify-center">
                                  <ImageIcon className="h-4 w-4" />
                                  Add Custom Image URL
                                </div>
                                <div className="flex gap-2">
                                  <Input 
                                    placeholder="https://images.unsplash.com/..." 
                                    value={customUrl}
                                    onChange={(e) => setCustomUrl(e.target.value)}
                                    className="flex-1 bg-white"
                                  />
                                  <Button 
                                    onClick={() => {
                                      if (customUrl) {
                                        setBackgroundImage(customUrl)
                                        setIsDialogOpen(false)
                                      }
                                    }}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>

                              {/* Upload Button */}
                              <label className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group">
                                <Plus className="h-8 w-8 text-gray-400 group-hover:text-accent-primary" />
                                <span className="text-xs text-gray-500 group-hover:text-accent-primary font-medium">Upload File</span>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                />
                              </label>

                              {backgrounds.map((bg) => (
                                <button
                                  key={bg}
                                  onClick={() => {
                                    setBackgroundImage(`/wallpaper/${bg}`)
                                    setIsDialogOpen(false)
                                  }}
                                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                                    backgroundImage === `/wallpaper/${bg}`
                                      ? "border-blue-500 ring-4 ring-blue-500/20"
                                      : "border-transparent hover:border-gray-300"
                                  }`}
                                >
                                  <Image
                                    src={`/wallpaper/${bg}`}
                                    alt={bg}
                                    fill
                                    className="object-cover"
                                  />
                                  {backgroundImage === `/wallpaper/${bg}` && (
                                    <div className="absolute inset-0 bg-accent-primary/20 flex items-center justify-center">
                                      <Check className="h-6 w-6 text-white" />
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Calendar Settings */}
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent-primary" />
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
                      className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
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
                      className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
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
                      className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
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
                  <Globe className="h-5 w-5 text-accent-primary" />
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
                      onChange={(e) => handleSettingChange("language", e.target.value as any)}
                      className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
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
                      className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
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
                  <Bell className="h-5 w-5 text-accent-primary" />
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

                  {settings.notifications && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-700">Reminder Time</div>
                          <div className="text-sm text-gray-500">When to show notifications</div>
                        </div>
                      </div>
                      <select
                        value={settings.reminderLeadTime || "1d"}
                        onChange={(e) => handleSettingChange("reminderLeadTime" as any, e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      >
                        <option value="1h">1 Hour Before</option>
                        <option value="1d">1 Day Before</option>
                        <option value="1w">1 Week Before</option>
                        <option value="at">At time of event</option>
                      </select>
                    </div>
                  )}
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
