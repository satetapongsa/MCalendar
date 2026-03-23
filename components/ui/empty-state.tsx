"use client"

import { Calendar as CalendarIcon, ClipboardList } from "lucide-react"

interface EmptyStateProps {
  title?: string
  message?: string
}

export function EmptyState({ 
  title = "Clean Schedule!", 
  message = "No events scheduled for this day. Take some time to relax!" 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-700">
      <div className="relative mb-6">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-accent-primary/30 blur-3xl rounded-full animate-pulse" />
        
        {/* Main Icon Container */}
        <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-2xl overflow-hidden group">
          {/* Decorative background circle */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent-primary/20 rounded-full blur-xl group-hover:bg-accent-primary/40 transition-colors" />
          
          <CalendarIcon className="h-20 w-20 text-accent-primary drop-shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.5)]" />
          
          {/* Floating secondary icon */}
          <div className="absolute -bottom-1 -right-1 bg-accent-primary p-2.5 rounded-2xl shadow-xl border-2 border-white/30 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <ClipboardList className="h-6 w-6 text-accent-foreground" />
          </div>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-2 tracking-tight drop-shadow-md">
        {title}
      </h3>
      <p className="text-white/60 max-w-[280px] text-lg font-medium leading-relaxed">
        {message}
      </p>
      
      {/* Decorative dots */}
      <div className="mt-8 flex gap-3">
        <div className="w-2 h-2 rounded-full bg-accent-primary/30 animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-accent-primary/60 animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-accent-primary animate-bounce" />
      </div>
    </div>
  )
}
