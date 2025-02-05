import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "WikiSwipe",
  description: "Explore today's most popular Wikipedia articles",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="https://en.wikipedia.org/static/favicon/wikipedia.ico" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

