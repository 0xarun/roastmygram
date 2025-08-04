"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Download, Instagram, Copy, Sparkles, Share2 } from "lucide-react"
import { useRef, useState } from "react"
import html2canvas from "html2canvas"
import { useToast } from "@/hooks/use-toast"

interface ShareableCardProps {
  data: any
  onClose: () => void
}

export function ShareableCard({ data, onClose }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return
    
    try {
      setIsGenerating(true)
      
      // Configure html2canvas for high quality Instagram Story dimensions
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        width: 1080,
        height: 1920,
        background: '#000000', // Ensure black background
        logging: false,
      })

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          try {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `roast-${data.profile.username}-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            
            toast({
              title: "Download Complete!",
              description: "PNG image saved to your device. Ready for Instagram! 🎉",
            })
          } catch (error) {
            console.error('Download failed:', error)
            toast({
              title: "Download Failed",
              description: "Could not download image. Try right-clicking and 'Save Image As'.",
              variant: "destructive",
            })
          }
        }
      }, 'image/png', 1.0) // Maximum quality
      
    } catch (error) {
      console.error('Error generating PNG:', error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
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
        background: '#000000', // Ensure black background
        logging: false,
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
      toast({
        title: "Error",
        description: "Failed to share to Instagram. Opening Instagram app instead.",
        variant: "destructive",
      })
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
    toast({
      title: "Success!",
      description: "Link copied to clipboard! 📋",
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="max-w-md w-full max-h-[90vh] overflow-y-auto">
        <Card className="overflow-hidden shadow-2xl" style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(88, 28, 135, 0.95) 50%, rgba(15, 23, 42, 0.95) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(24px)'
        }}>
          <CardContent className="p-0 relative">
            {/* Close Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-20 text-white hover:bg-white/20 rounded-full"
              aria-label="Close share dialog"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Card Content */}
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-black text-white">Share Your Roast</h2>
                <p className="text-sm" style={{ color: '#cbd5e1' }}>
                  Download as PNG or share directly to Instagram Stories
                </p>
              </div>

              {/* Preview Card - This will be captured for PNG */}
              <div 
                ref={cardRef}
                className={`relative w-full rounded-2xl overflow-hidden border shadow-2xl transition-all duration-300 ${
                  isGenerating ? 'scale-105' : ''
                }`}
                style={{ 
                  width: '100%', 
                  height: '600px', // Fixed height for consistent PNG generation
                  maxWidth: '400px',
                  margin: '0 auto',
                  background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  boxShadow: isGenerating ? '0 25px 50px -12px rgba(168, 85, 247, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden">
                  <div 
                    className="absolute top-10 right-10 w-32 h-32 rounded-full blur-2xl animate-pulse"
                    style={{
                      background: 'radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)'
                    }}
                  ></div>
                  <div 
                    className="absolute bottom-10 left-10 w-32 h-32 rounded-full blur-2xl animate-pulse delay-1000"
                    style={{
                      background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)'
                    }}
                  ></div>
                </div>

                {/* Card Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  {/* Header with Profile */}
                  <div className="text-center space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={data.profile.profilePic || "/placeholder.svg"}
                        alt="Profile"
                        className="w-16 h-16 rounded-full border-3 shadow-lg mx-auto"
                        style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                      />
                      {data.profile.verified && (
                        <div className="absolute -bottom-1 -right-1 rounded-full p-1" style={{ backgroundColor: '#3b82f6' }}>
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">@{data.profile.username}</h3>
                      <div
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-white font-bold text-xs mt-2"
                        style={{
                          background: data.personality.color === 'from-purple-500 to-indigo-600' ? 'linear-gradient(to right, #8b5cf6, #4f46e5)' :
                                   data.personality.color === 'from-blue-500 to-cyan-600' ? 'linear-gradient(to right, #3b82f6, #0891b2)' :
                                   data.personality.color === 'from-pink-500 to-rose-600' ? 'linear-gradient(to right, #ec4899, #e11d48)' :
                                   data.personality.color === 'from-gray-500 to-slate-600' ? 'linear-gradient(to right, #6b7280, #475569)' :
                                   data.personality.color === 'from-indigo-500 to-purple-600' ? 'linear-gradient(to right, #6366f1, #8b5cf6)' :
                                   data.personality.color === 'from-green-500 to-emerald-600' ? 'linear-gradient(to right, #10b981, #059669)' :
                                   'linear-gradient(to right, #f97316, #dc2626)'
                        }}
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
                      <div className="text-xs" style={{ color: '#94a3b8' }}>Posts</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{data.profile.followers.toLocaleString()}</div>
                      <div className="text-xs" style={{ color: '#94a3b8' }}>Followers</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{data.profile.following.toLocaleString()}</div>
                      <div className="text-xs" style={{ color: '#94a3b8' }}>Following</div>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-3 text-center border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <div className="text-lg font-black text-white">{data.metrics.profileWorth}</div>
                      <div className="text-xs" style={{ color: '#cbd5e1' }}>Profile Worth 💰</div>
                    </div>
                    <div className="rounded-xl p-3 text-center border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <div className="text-lg font-black text-white">{data.metrics.reelsWatched.toLocaleString()}</div>
                      <div className="text-xs" style={{ color: '#cbd5e1' }}>Reels Watched 🎬</div>
                    </div>
                    <div className="rounded-xl p-3 text-center border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <div className="text-lg font-black text-white">{data.metrics.loveMeter}</div>
                      <div className="text-xs" style={{ color: '#cbd5e1' }}>Love Meter 💌</div>
                    </div>
                    <div className="rounded-xl p-3 text-center border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <div className="text-lg font-black text-white">{data.metrics.singleness}%</div>
                      <div className="text-xs" style={{ color: '#cbd5e1' }}>Single Level 💔</div>
                    </div>
                  </div>

                  {/* Roast Summary */}
                  <div className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <p className="text-white text-sm text-center leading-relaxed">
                      <span className="font-bold" style={{ color: '#22d3ee' }}>"{data.personality.desc}"</span> Your vibe is pure{" "}
                      {data.metrics.emojiEnergy} energy with a side of chaos. Profile rating:{" "}
                      <span className="font-bold" style={{ color: '#a855f7' }}>{data.metrics.rating}/10</span> - not bad for someone who
                      posts {data.metrics.cringePosts} cringe posts!
                      <span className="text-xl"> 💀</span>
                    </p>
                  </div>

                  {/* Watermark */}
                  <div className="text-center pt-2 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <p className="text-xs font-medium" style={{ color: '#94a3b8' }}>
                      <span className="font-bold" style={{ background: 'linear-gradient(to right, #22d3ee, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
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
                  className="w-full font-bold py-3 shadow-lg transition-all duration-300 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(to right, #ec4899, #9333ea, #2563eb)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  aria-label="Share to Instagram"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 rounded-full animate-spin mr-2" style={{ borderColor: 'rgba(255, 255, 255, 0.3)', borderTopColor: '#ffffff' }}></div>
                  ) : (
                    <Instagram className="w-4 h-4 mr-2" />
                  )}
                                     {isGenerating ? 'Preparing...' : '📱 Open Instagram'}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                                  <Button
                  onClick={handleDownloadPNG}
                  disabled={isGenerating}
                  variant="outline"
                  className="text-white disabled:opacity-50"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(4px)'
                  }}
                  aria-label="Download as PNG"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 rounded-full animate-spin mr-2" style={{ borderColor: 'rgba(255, 255, 255, 0.3)', borderTopColor: '#ffffff' }}></div>
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {isGenerating ? 'Creating PNG...' : 'Download PNG'}
                </Button>
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="text-white"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(4px)'
                    }}
                    aria-label="Copy share link"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center">
                <p className="text-xs" style={{ color: '#94a3b8' }}>
                  💡 Tip: Download the PNG and add it to your Instagram Story for the best experience!
                  {typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (
                    <span className="block mt-1">📱 On mobile? Use the Instagram button for direct sharing!</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
