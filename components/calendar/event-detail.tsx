"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCalendarStore } from "@/lib/calendar-store"
import { isCustomColor, type CalendarEvent } from "@/lib/types"
import { Clock, MapPin, Users, Calendar, User, Edit, Trash2 } from "lucide-react"

interface EventDetailProps {
  event: CalendarEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
}

export function EventDetail({ event, open, onOpenChange, onEdit }: EventDetailProps) {
  const { deleteEvent, folders } = useCalendarStore()

  if (!event) return null

  const folder = folders.find((f) => f.id === event.folderId)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleDelete = () => {
    deleteEvent(event.id)
    onOpenChange(false)
  }

  const handleEdit = () => {
    onOpenChange(false)
    onEdit()
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
        {/* Color Header */}
        <div 
          className={`${getEventClass(event.color)} p-6`}
          style={getEventStyle(event.color)}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/80" />
              {event.title}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="h-5 w-5" />
            <span>
              {event.startTime} - {event.endTime}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>{formatDate(event.date)}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
          )}

          {folder && (
            <div className="flex items-center gap-3 text-gray-600">
              <div className={`w-5 h-5 rounded ${folder.color}`} />
              <span>{folder.name}</span>
            </div>
          )}

          {event.attendees.length > 0 && (
            <div className="flex items-start gap-3 text-gray-600">
              <Users className="h-5 w-5 mt-0.5" />
              <div>
                <div className="font-medium mb-1">Attendees</div>
                <div className="text-sm">{event.attendees.join(", ")}</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-gray-600">
            <User className="h-5 w-5" />
            <span>Organized by {event.organizer}</span>
          </div>

          {event.description && (
            <div className="pt-4 border-t">
              <div className="font-medium text-gray-700 mb-2">Description</div>
              <p className="text-gray-600 text-sm">{event.description}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
