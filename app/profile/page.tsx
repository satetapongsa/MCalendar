"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit2,
  Save,
  X,
  User,
  Link as LinkIcon,
  Clock,
  CheckCircle,
  FolderOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCalendarStore } from "@/lib/calendar-store"

interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  occupation: string
  bio: string
  website: string
  avatar: string
  joinDate: string
}

const defaultProfile: UserProfile = {
  name: "เวฟนิกก้า",
  email: "satetapongs@gmail.com",
  phone: "+66866666666",
  location: "Bangkok, Thailand",
  occupation: "wave nigga",
  bio: "",
  website: "https://satetapong-portfolio.vercel.app/",
  avatar: "",
  joinDate: "2026-03-23T04:24:47.000Z", // Fixed date for Match 23, 2569 (CE 2026)
}

export default function ProfilePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile>(defaultProfile)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { events, folders, backgroundImage } = useCalendarStore()

  useEffect(() => {
    setIsLoaded(true)
    setHasMounted(true)
    // Load profile from localStorage
    const savedProfile = localStorage.getItem("calendar-profile")
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfile(parsed)
      setEditedProfile(parsed)
    }
  }, [])

  if (!hasMounted) return null

  const handleSave = () => {
    try {
      setProfile(editedProfile)
      localStorage.setItem("calendar-profile", JSON.stringify(editedProfile))
      setIsEditing(false)
    } catch (err) {
      console.error("Failed to save profile:", err)
      // If still fails (rare with compression), try saving without avatar
      if (err instanceof Error && err.name === "QuotaExceededError") {
        try {
          const profileWithoutAvatar = { ...editedProfile, avatar: "" }
          setProfile(profileWithoutAvatar)
          localStorage.setItem("calendar-profile", JSON.stringify(profileWithoutAvatar))
          setIsEditing(false)
          alert("Profile text saved, but the image is still too large. Please use a smaller image.")
        } catch (innerErr) {
          alert("Could not save profile. Your browser storage is full.")
        }
      }
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click()
    }
  }
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const compressImage = (base64Str: string, maxWidth = 400, maxHeight = 400): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      img.src = base64Str
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
    })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string)
        setEditedProfile({ ...editedProfile, avatar: compressed })
      }
      reader.readAsDataURL(file)
    }
  }


  // Calculate statistics
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  
  const stats = {
    totalEvents: events.length,
    totalFolders: folders.length,
    upcomingEvents: events.filter(e => e.date >= todayStr).length,
    completedEvents: events.filter(e => e.date < todayStr).length,
  }

  // Recent activity - last 5 events
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

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
          <span className="text-2xl font-semibold text-white drop-shadow-lg">Profile</span>
        </div>

        <div className="flex items-center gap-4">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-accent-primary hover:opacity-90 transition-all accent-foreground"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              variant="outline"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative min-h-screen w-full pt-24 pb-12 px-8">
        <div
          className={`max-w-4xl mx-auto opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.4s" }}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className={`relative bg-accent-primary p-8 accent-foreground transition-all duration-500`}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <button
                    onClick={handleAvatarClick}
                    disabled={!isEditing}
                    className={`relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl ${
                      isEditing ? "cursor-pointer hover:opacity-80" : ""
                    }`}
                  >
                    {(isEditing ? editedProfile.avatar : profile.avatar) ? (
                      <Image
                        src={isEditing ? editedProfile.avatar : profile.avatar}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent-primary flex items-center justify-center accent-foreground text-4xl font-bold opacity-80">
                        {getInitials(isEditing ? editedProfile.name : profile.name)}
                      </div>
                    )}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                {/* Name & Title */}
                <div className="text-center md:text-left flex-1">
                  {isEditing ? (
                    <Input
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="text-2xl font-bold bg-white/20 border-white/30 text-white placeholder:white/70 mb-2"
                      placeholder="Your Name"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold accent-foreground mb-2">{profile.name}</h1>
                  )}
                  {isEditing ? (
                    <Input
                      value={editedProfile.occupation}
                      onChange={(e) => setEditedProfile({ ...editedProfile, occupation: e.target.value })}
                      className="bg-white/20 border-white/30 text-white placeholder:white/70"
                      placeholder="Your Occupation"
                    />
                  ) : (
                    profile.occupation && (
                      <p className="text-lg accent-foreground/90 flex items-center gap-2 justify-center md:justify-start">
                        <Briefcase className="h-4 w-4" />
                        {profile.occupation}
                      </p>
                    )
                  )}
                  <p className="text-sm accent-foreground/70 mt-2 flex items-center gap-2 justify-center md:justify-start">
                    <Calendar className="h-4 w-4" />
                    Member since {formatDate(profile.joinDate)}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold accent-foreground">{stats.totalEvents}</div>
                    <div className="text-xs accent-foreground/80">Events</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold accent-foreground">{stats.totalFolders}</div>
                    <div className="text-xs accent-foreground/80">Folders</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 grid md:grid-cols-3 gap-6">
              {/* Left Column - Contact Info */}
              <div className="md:col-span-2 space-y-6">
                {/* Contact Information */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-accent-primary" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Mail className="h-5 w-5 text-gray-400" />
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                          placeholder="your@email.com"
                          className="flex-1"
                        />
                      ) : (
                        <span className="text-gray-700">{profile.email || "Not set"}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <Phone className="h-5 w-5 text-gray-400" />
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                          placeholder="+66 xxx xxx xxxx"
                          className="flex-1"
                        />
                      ) : (
                        <span className="text-gray-700">{profile.phone || "Not set"}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      {isEditing ? (
                        <Input
                          value={editedProfile.location}
                          onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                          placeholder="City, Country"
                          className="flex-1"
                        />
                      ) : (
                        <span className="text-gray-700">{profile.location || "Not set"}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                      {isEditing ? (
                        <Input
                          type="url"
                          value={editedProfile.website}
                          onChange={(e) => setEditedProfile({ ...editedProfile, website: e.target.value })}
                          placeholder="https://yourwebsite.com"
                          className="flex-1"
                        />
                      ) : profile.website ? (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-primary hover:underline"
                        >
                          {profile.website}
                        </a>
                      ) : (
                        <span className="text-gray-700">Not set</span>
                      )}
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Bio */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      placeholder="Write something about yourself..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profile.bio || "No bio yet. Click 'Edit Profile' to add one."}
                    </p>
                  )}
                </section>

                <Separator />

                {/* Recent Activity */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent-primary" />
                    Recent Activity
                  </h3>
                  {recentEvents.length > 0 ? (
                    <div className="space-y-3">
                      {recentEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${event.color}`}
                            style={event.color.startsWith("#") ? { backgroundColor: event.color } : {}}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{event.title}</div>
                            <div className="text-sm text-gray-500">
                              {event.date} at {event.startTime}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No recent activity</p>
                  )}
                </section>
              </div>

              {/* Right Column - Statistics */}
              <div className="space-y-6">
                {/* Activity Overview */}
                <section className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Activity Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Total Events</span>
                      </div>
                      <span className="font-semibold text-gray-800">{stats.totalEvents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FolderOpen className="h-4 w-4" />
                        <span>Folders</span>
                      </div>
                      <span className="font-semibold text-gray-800">{stats.totalFolders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Upcoming</span>
                      </div>
                      <span className="font-semibold text-blue-600">{stats.upcomingEvents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed</span>
                      </div>
                      <span className="font-semibold text-green-600">{stats.completedEvents}</span>
                    </div>
                  </div>
                </section>

                {/* Folders */}
                <section className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">My Folders</h3>
                  <div className="space-y-2">
                    {folders.map((folder) => {
                      const folderEventCount = events.filter(e => e.folderId === folder.id).length
                      return (
                        <div
                          key={folder.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${folder.color}`}
                              style={folder.color.startsWith("#") ? { backgroundColor: folder.color } : {}}
                            />
                            <span className="text-gray-700">{folder.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{folderEventCount}</span>
                        </div>
                      )
                    })}
                  </div>
                </section>

                {/* Quick Links */}
                <section className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    <Link
                      href="/"
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Go to Calendar</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                    >
                      <User className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
