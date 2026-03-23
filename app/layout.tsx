import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AccentProvider } from "@/components/accent-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MCalendar - Your Personal Schedule",
  description: "A beautiful and functional calendar application to manage your events, tasks, and folders",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AccentProvider>
          {children}
        </AccentProvider>
      </body>
    </html>
  )
}

