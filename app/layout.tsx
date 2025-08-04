import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Roast My Insta - Get Your Vibe Exposed 🔥",
  description: "Enter your Instagram username and get a hilarious, personalized roast of your profile. Gen-Z approved sarcasm!",
  keywords: ["Instagram roast", "AI roast", "social media", "funny", "viral", "meme"],
  authors: [{ name: "RoastMyGram" }],
  creator: "RoastMyGram",
  publisher: "RoastMyGram",
  generator: 'v0.dev',
  metadataBase: new URL('https://roastmygram.fun'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Roast My Insta - Get Your Vibe Exposed 🔥",
    description: "Enter your Instagram username and get a hilarious, personalized roast of your profile. Gen-Z approved sarcasm!",
    url: 'https://roastmygram.fun',
    siteName: 'RoastMyGram',
    images: [
      {
        url: '/cover.png',
        width: 1200,
        height: 630,
        alt: 'RoastMyGram - Get Your Instagram Roasted by AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Roast My Insta - Get Your Vibe Exposed 🔥",
    description: "Enter your Instagram username and get a hilarious, personalized roast of your profile. Gen-Z approved sarcasm!",
    images: ['/cover.png'],
    creator: '@roastmygram',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/roastmygram-logo.jpeg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/roastmygram-logo.jpeg', sizes: '16x16', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/roastmygram-logo.jpeg', sizes: '180x180', type: 'image/jpeg' },
    ],
    shortcut: '/roastmygram-logo.jpeg',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for better social sharing */}
        <meta name="theme-color" content="#581c87" />
        <meta name="msapplication-TileColor" content="#581c87" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RoastMyGram" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/roastmygram-logo.jpeg" as="image" />
        <link rel="preload" href="/heroimage.png" as="image" />
        <link rel="preload" href="/landing-profile.png" as="image" />
        
        {/* Structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "RoastMyGram",
              "description": "Get your Instagram roasted by AI with hilarious, personalized roasts",
              "url": "https://roastmygram.fun",
              "applicationCategory": "EntertainmentApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "RoastMyGram"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="04fa11fb-1e57-48ec-9168-ed21f63eed9e"
          strategy="lazyOnload"
        />
        <Toaster />
      </body>
    </html>
  )
}
