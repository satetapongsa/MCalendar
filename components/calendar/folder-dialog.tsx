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
import { Label } from "@/components/ui/label"
import { useCalendarStore } from "@/lib/calendar-store"
import { FOLDER_COLORS, type Folder } from "@/lib/types"
import { Palette, Trash2 } from "lucide-react"

interface FolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folder?: Folder | null
}

export function FolderDialog({ open, onOpenChange, folder }: FolderDialogProps) {
  const { addFolder, updateFolder, deleteFolder } = useCalendarStore()

  const [name, setName] = useState("")
  const [color, setColor] = useState("bg-accent-primary")

  useEffect(() => {
    if (folder) {
      setName(folder.name)
      setColor(folder.color)
    } else {
      setName("")
      setColor("bg-accent-primary")
    }
  }, [folder, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) return

    const folderData = {
      name: name.trim(),
      color,
    }

    if (folder) {
      updateFolder(folder.id, folderData)
    } else {
      addFolder(folderData)
    }

    onOpenChange(false)
  }

  const handleDelete = () => {
    if (folder && folder.id !== "default") {
      deleteFolder(folder.id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {folder ? "Edit Folder" : "Create New Folder"}
          </DialogTitle>
          <DialogDescription>
            {folder ? "Update the folder details below." : "Create a new folder to organize your events."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Folder Name</Label>
            <Input
              id="name"
              placeholder="Enter folder name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Color
            </Label>
            <div className="flex flex-wrap gap-2">
              {FOLDER_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.value} transition-all ${
                    color === c.value
                      ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                      : "hover:scale-105"
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            {folder && folder.id !== "default" && (
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
              {folder ? "Update Folder" : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
