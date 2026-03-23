"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Trash2 } from "lucide-react"
import { useCalendarStore } from "@/lib/calendar-store"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { events, folders } = useCalendarStore()

  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to clear all calendar data? This action cannot be undone.")) {
      localStorage.removeItem("calendar-storage")
      window.location.reload()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
          <DialogDescription>
            Manage your calendar preferences and data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Statistics */}
          <div>
            <h3 className="font-medium mb-3">Calendar Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-accent-primary">{events.length}</div>
                <div className="text-sm text-gray-500">Total Events</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{folders.length}</div>
                <div className="text-sm text-gray-500">Folders</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div>
            <h3 className="font-medium mb-3 text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Danger Zone
            </h3>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleClearAllData}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Calendar Data
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              This will permanently delete all events and folders. This action cannot be undone.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
