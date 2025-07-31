"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Download, Instagram, Copy, Sparkles, Share2 } from "lucide-react"
import { useRef, useState } from "react"
import html2canvas from "html2canvas"

interface ShareableCardProps {
  data: any
  onClose: () => void
}

export function ShareableCard({ data, onClose }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return
    
    try {
      setIsGenerating(true)
      
      // Configure html2canvas for high quality
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        width: 1080,
        height: 1920,
      })

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `roast-${data.profile.username}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
      }, 'image/png', 0.95)
      
    } catch (error) {
      console.error('Error generating PNG:', error)
      alert('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShareInstagram = async () => {
    try {
      setIsGenerating(true)
      
      // Generate the image first
      if (!cardRef.current) return
      
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        width: 1080,
        height: 1920,
      })

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          // Create a file from the blob
          const file = new File([blob], `roast-${data.profile.username}.png`, { type: 'image/png' })
          
          // Check if we're on mobile and Web Share API is available
          const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
          
          if (isMobile && navigator.share && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: `My Instagram Roast - @${data.profile.username}`,
                text: `Check out my Instagram roast! 🔥`,
                files: [file],
                url: `https://roastmygram.fun/roast/${data.profile.username}`
              })
            } catch (error) {
              console.log('Share cancelled or failed:', error)
              // Fallback to Instagram app opening
              openInstagramApp()
            }
          } else {
            // Fallback for desktop or unsupported browsers
            openInstagramApp()
          }
        }
      }, 'image/png', 0.95)
      
    } catch (error) {
      console.error('Error sharing to Instagram:', error)
      openInstagramApp()
    } finally {
      setIsGenerating(false)
    }
  }

  const openInstagramApp = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isAndroid = /Android/i.test(navigator.userAgent)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    
    if (isAndroid) {
      // Android: Use Intent URL to open Instagram app
      const intentUrl = 'intent://instagram.com/#Intent;package=com.instagram.android;scheme=https;end'
      window.location.href = intentUrl
    } else if (isIOS) {
      // iOS: Use custom URL scheme
      const instagramUrl = 'instagram://story-camera'
      const fallbackUrl = 'https://instagram.com'
      
      // Create hidden link to trigger app opening
      const link = document.createElement('a')
      link.href = instagramUrl
      link.style.display = 'none'
      document.body.appendChild(link)
      
      // Try to open Instagram app
      link.click()
      document.body.removeChild(link)
      
      // Fallback after delay if app doesn't open
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
          window.open(fallbackUrl, '_blank')
        }
      }, 1500)
    } else {
      // Desktop: Open Instagram web
      window.open('https://instagram.com', '_blank')
    }
  }

  const handleCopyLink = () => {
    const shareUrl = `https://roastmygram.fun/roast/${data.profile.username}`
    navigator.clipboard.writeText(shareUrl)
    alert("Link copied to clipboard! 📋")
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full max-h-[90vh] overflow-y-auto">
        <Card className="backdrop-blur-xl bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 border border-white/20 overflow-hidden shadow-2xl">
          <CardContent className="p-0 relative">
            {/* Close Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-20 text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Card Content */}
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-black text-white">Share Your Roast</h2>
                <p className="text-slate-300 text-sm">
                  Download as PNG or share directly to Instagram Stories
                </p>
              </div>

              {/* Preview Card - This will be captured for PNG */}
              <div 
                ref={cardRef}
                className="relative w-full aspect-[9/16] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
                style={{ width: '100%', height: 'auto', minHeight: '400px' }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                </div>

                {/* Card Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  {/* Header with Profile */}
                  <div className="text-center space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={data.profile.profilePic || "/placeholder.svg"}
                        alt="Profile"
                        className="w-16 h-16 rounded-full border-3 border-white/30 shadow-lg mx-auto"
                      />
                      {data.profile.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">@{data.profile.username}</h3>
                      <div
                        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r ${data.personality.color} text-white font-bold text-xs mt-2`}
                      >
                        <span>{data.personality.emoji}</span>
                        <span>{data.personality.title}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex justify-center space-x-6 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{data.profile.posts}</div>
                      <div className="text-xs text-slate-400">Posts</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{data.profile.followers.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Followers</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{data.profile.following.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Following</div>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="backdrop-blur-sm bg-white/10 rounded-xl p-3 text-center border border-white/10">
                      <div className="text-lg font-black text-white">{data.metrics.profileWorth}</div>
                      <div className="text-xs text-slate-300">Profile Worth 💰</div>
                    </div>
                    <div className="backdrop-blur-sm bg-white/10 rounded-xl p-3 text-center border border-white/10">
                      <div className="text-lg font-black text-white">{data.metrics.reelsWatched.toLocaleString()}</div>
                      <div className="text-xs text-slate-300">Reels Watched 🎬</div>
                    </div>
                    <div className="backdrop-blur-sm bg-white/10 rounded-xl p-3 text-center border border-white/10">
                      <div className="text-lg font-black text-white">{data.metrics.loveMeter}</div>
                      <div className="text-xs text-slate-300">Love Meter 💌</div>
                    </div>
                    <div className="backdrop-blur-sm bg-white/10 rounded-xl p-3 text-center border border-white/10">
                      <div className="text-lg font-black text-white">{data.metrics.singleness}%</div>
                      <div className="text-xs text-slate-300">Single Level 💔</div>
                    </div>
                  </div>

                  {/* Roast Summary */}
                  <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/10">
                    <p className="text-white text-sm text-center leading-relaxed">
                      <span className="font-bold text-cyan-400">"{data.personality.desc}"</span> Your vibe is pure{" "}
                      {data.metrics.emojiEnergy} energy with a side of chaos. Profile rating:{" "}
                      <span className="font-bold text-purple-400">{data.metrics.rating}/10</span> - not bad for someone who
                      posts {data.metrics.cringePosts} cringe posts!
                      <span className="text-xl"> 💀</span>
                    </p>
                  </div>

                  {/* Watermark */}
                  <div className="text-center pt-2 border-t border-white/10">
                    <p className="text-slate-400 text-xs font-medium">
                      <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent font-bold">
                        roastmygram.fun
                      </span>{" "}
                      🔥
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleShareInstagram}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-400 hover:via-purple-500 hover:to-blue-500 font-bold py-3 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Instagram className="w-4 h-4 mr-2" />
                  )}
                                     {isGenerating ? 'Generating...' : '📱 Open Instagram'}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleDownloadPNG}
                    disabled={isGenerating}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {isGenerating ? 'Generating...' : 'Download PNG'}
                  </Button>
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center">
                <p className="text-slate-400 text-xs">
                  💡 Tip: Download the PNG and add it to your Instagram Story for the best experience!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
