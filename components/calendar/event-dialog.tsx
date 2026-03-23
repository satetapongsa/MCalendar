"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCalendarStore, formatDateKey } from "@/lib/calendar-store"
import { EVENT_COLORS, isCustomColor, type CalendarEvent } from "@/lib/types"
import { Clock, MapPin, Users, Palette, FolderOpen, Trash2, Pipette, Check } from "lucide-react"

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: CalendarEvent | null
  defaultDate?: Date
}

export function EventDialog({
  open,
  onOpenChange,
  event,
  defaultDate,
}: EventDialogProps) {
  const { addEvent, updateEvent, deleteEvent, folders } = useCalendarStore()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [location, setLocation] = useState("")
  const [color, setColor] = useState("bg-accent-primary")
  const [customColor, setCustomColor] = useState("#3b82f6")
  const [useCustomColor, setUseCustomColor] = useState(false)
  const [folderId, setFolderId] = useState<string>("default")
  const [attendees, setAttendees] = useState("")
  const [status, setStatus] = useState<'accepted' | 'declined' | 'tentative'>("accepted")
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description)
      setDate(event.date)
      setStartTime(event.startTime)
      setEndTime(event.endTime)
      setLocation(event.location)
      
      // Check if the event uses a custom color
      if (isCustomColor(event.color)) {
        setUseCustomColor(true)
        setCustomColor(event.color)
        setColor("")
      } else {
        setUseCustomColor(false)
        setColor(event.color)
      }
      
      setFolderId(event.folderId || "default")
      setAttendees(event.attendees.join(", "))
      setStatus(event.status || "accepted")
    } else {
      setTitle("")
      setDescription("")
      setDate(defaultDate ? formatDateKey(defaultDate) : formatDateKey(new Date()))
      setStartTime("09:00")
      setEndTime("10:00")
      setLocation("")
      setColor("bg-accent-primary")
      setCustomColor("#3b82f6")
      setUseCustomColor(false)
      setFolderId("default")
      setAttendees("")
      setStatus("accepted")
    }
  }, [event, defaultDate, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return

    const finalColor = useCustomColor ? customColor : color

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      date,
      startTime,
      endTime,
      location: location.trim(),
      color: finalColor,
      folderId,
      attendees: attendees.split(",").map((a) => a.trim()).filter(Boolean),
      organizer: "You",
      status,
    }

    if (event) {
      updateEvent(event.id, eventData)
    } else {
      addEvent(eventData)
    }

    onOpenChange(false)
  }

  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id)
      onOpenChange(false)
    }
  }

  const handlePresetColorSelect = (colorValue: string) => {
    setColor(colorValue)
    setUseCustomColor(false)
    setColorPickerOpen(false)
  }

  const handleCustomColorChange = (hex: string) => {
    setCustomColor(hex)
    setUseCustomColor(true)
    setColor("")
  }

  const getCurrentColorDisplay = () => {
    if (useCustomColor) {
      return { backgroundColor: customColor }
    }
    return {}
  }

  const getCurrentColorClass = () => {
    if (useCustomColor) {
      return ""
    }
    return color
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {event ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          <DialogDescription>
            {event ? "Update the event details below." : "Fill in the details for your new event."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="Enter event title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="folder" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Folder
              </Label>
              <Select value={folderId} onValueChange={setFolderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-sm ${folder.color}`} />
                        {folder.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="Enter location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="tentative">Tentative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendees" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Attendees
            </Label>
            <Input
              id="attendees"
              placeholder="Enter attendees (comma separated)..."
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
            />
          </div>

          {/* Enhanced Color Picker */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Event Color
            </Label>
            
            <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                >
                  <div 
                    className={`w-8 h-8 rounded-lg border-2 border-white shadow-md ${getCurrentColorClass()}`}
                    style={getCurrentColorDisplay()}
                  />
                  <span className="text-sm">
                    {useCustomColor 
                      ? `Custom: ${customColor.toUpperCase()}` 
                      : EVENT_COLORS.find(c => c.value === color)?.name || "Select Color"
                    }
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  {/* Color Palette Grid */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-gray-700">Preset Colors</h4>
                    <div className="grid grid-cols-8 gap-2">
                      {EVENT_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => handlePresetColorSelect(c.value)}
                          className={`w-7 h-7 rounded-md ${c.value} transition-all border-2 hover:scale-110 relative ${
                            color === c.value && !useCustomColor
                              ? "border-gray-900 scale-110 ring-2 ring-gray-900/20"
                              : "border-transparent hover:border-gray-300"
                          }`}
                          title={c.name}
                        >
                          {color === c.value && !useCustomColor && (
                            <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-md" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom Color Picker */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-3 text-gray-700 flex items-center gap-2">
                      <Pipette className="w-4 h-4" />
                      Custom Color
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="color"
                          value={customColor}
                          onChange={(e) => handleCustomColorChange(e.target.value)}
                          className="w-14 h-14 rounded-lg cursor-pointer border-2 border-gray-200 p-1"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          type="text"
                          value={customColor}
                          onChange={(e) => {
                            const val = e.target.value
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                              handleCustomColorChange(val)
                            }
                          }}
                          placeholder="#RRGGBB"
                          className="font-mono text-sm uppercase"
                        />
                        <div className="flex gap-1">
                          {/* Quick custom colors */}
                          {["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"].map((hex) => (
                            <button
                              key={hex}
                              type="button"
                              onClick={() => handleCustomColorChange(hex)}
                              className={`w-6 h-6 rounded-md transition-all border hover:scale-110 ${
                                customColor === hex && useCustomColor
                                  ? "border-gray-900 scale-110"
                                  : "border-transparent"
                              }`}
                              style={{ backgroundColor: hex }}
                              title={hex}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2 text-gray-700">Preview</h4>
                    <div 
                      className={`p-3 rounded-lg text-white font-medium text-sm flex items-center gap-2 ${getCurrentColorClass()}`}
                      style={getCurrentColorDisplay()}
                    >
                      <div className="w-2 h-2 rounded-full bg-white/80" />
                      {title || "Event Title"}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter event description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            {event && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="mr-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-accent-primary accent-foreground hover:opacity-90">
              {event ? "Update Event" : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
