import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Roast My Insta - Get Your Vibe Exposed 🔥",
  description:
    "Enter your Instagram username and get a hilarious, personalized roast of your profile. Gen-Z approved sarcasm!",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="04fa11fb-1e57-48ec-9168-ed21f63eed9e"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
