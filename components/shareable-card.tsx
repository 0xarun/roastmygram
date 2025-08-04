"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Download, Copy, Sparkles, Share2 } from "lucide-react"
import { useRef, useState } from "react"
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
    try {
      setIsGenerating(true)
      
      // Create canvas element
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Could not get canvas context')
      }

      // Set dimensions for Instagram Story (9:16 aspect ratio)
      canvas.width = 1080
      canvas.height = 1920

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#0f172a')
      gradient.addColorStop(0.5, '#581c87')
      gradient.addColorStop(1, '#0f172a')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add decorative blur circles
      ctx.fillStyle = 'rgba(34, 211, 238, 0.2)'
      ctx.beginPath()
      ctx.arc(800, 200, 100, 0, 2 * Math.PI)
      ctx.fill()

      ctx.fillStyle = 'rgba(168, 85, 247, 0.2)'
      ctx.beginPath()
      ctx.arc(200, 1600, 100, 0, 2 * Math.PI)
      ctx.fill()

      // Add profile image placeholder
      ctx.fillStyle = '#374151'
      ctx.beginPath()
      ctx.arc(canvas.width / 2, 200, 80, 0, 2 * Math.PI)
      ctx.fill()
      
      // Profile image border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 4
      ctx.stroke()

      // Username
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 72px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`@${data.profile.username}`, canvas.width / 2, 380)

      // Personality badge
      const badgeGradient = ctx.createLinearGradient(canvas.width / 2 - 200, 400, canvas.width / 2 + 200, 460)
      badgeGradient.addColorStop(0, '#8b5cf6')
      badgeGradient.addColorStop(1, '#4f46e5')
      ctx.fillStyle = badgeGradient
      ctx.fillRect(canvas.width / 2 - 200, 400, 400, 60)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 32px Arial'
      ctx.fillText(`${data.personality.emoji} ${data.personality.title}`, canvas.width / 2, 440)

      // Stats
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 48px Arial'
      ctx.fillText(`${data.profile.posts} Posts`, canvas.width / 2 - 250, 540)
      ctx.fillText(`${data.profile.followers.toLocaleString()} Followers`, canvas.width / 2, 540)
      ctx.fillText(`${data.profile.following.toLocaleString()} Following`, canvas.width / 2 + 250, 540)

      // Metrics boxes
      const metrics = [
        { value: data.metrics.profileWorth, label: 'Profile Worth 💰', x: 200 },
        { value: data.metrics.reelsWatched.toLocaleString(), label: 'Reels Watched 🎬', x: 400 },
        { value: data.metrics.loveMeter, label: 'Love Meter 💌', x: 600 },
        { value: `${data.metrics.singleness}%`, label: 'Single Level 💔', x: 800 }
      ]

      metrics.forEach(metric => {
        // Box background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.fillRect(metric.x - 100, 600, 200, 120)
        
        // Box border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.lineWidth = 1
        ctx.strokeRect(metric.x - 100, 600, 200, 120)
        
        // Value
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 48px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(metric.value, metric.x, 650)
        
        // Label
        ctx.fillStyle = '#cbd5e1'
        ctx.font = 'bold 20px Arial'
        ctx.fillText(metric.label, metric.x, 680)
      })

      // Roast text box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.fillRect(100, 800, 800, 250)
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.strokeRect(100, 800, 800, 250)

      // Personality description
      ctx.fillStyle = '#22d3ee'
      ctx.font = 'bold 36px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`"${data.personality.desc}"`, canvas.width / 2, 850)

      // Main roast text
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 28px Arial'
      const roastText = `Your vibe is pure ${data.metrics.emojiEnergy} energy with a side of chaos. Profile rating: ${data.metrics.rating}/10 - not bad for someone who posts ${data.metrics.cringePosts} cringe posts! 💀`
      
      // Text wrapping
      const words = roastText.split(' ')
      let line = ''
      let y = 920
      const maxWidth = 750
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, canvas.width / 2, y)
          line = words[i] + ' '
          y += 40
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, canvas.width / 2, y)

      // Watermark
      const watermarkGradient = ctx.createLinearGradient(canvas.width / 2 - 100, 1150, canvas.width / 2 + 100, 1150)
      watermarkGradient.addColorStop(0, '#22d3ee')
      watermarkGradient.addColorStop(1, '#a855f7')
      ctx.fillStyle = watermarkGradient
      ctx.font = 'bold 32px Arial'
      ctx.fillText('roastmygram.fun 🔥', canvas.width / 2, 1180)

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
              description: "PNG image saved to your device. Ready for Instagram Stories! 🎉",
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
      }, 'image/png', 1.0)
      
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



  const handleCopyLink = () => {
    const shareUrl = `https://roastmygram.fun/roast/${data.profile.username}`
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Success!",
      description: "Link copied to clipboard! 📋",
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="w-full max-w-sm sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
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
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-white hover:bg-white/20 rounded-full"
              aria-label="Close share dialog"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Card Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="text-center space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-black text-white">Share Your Roast</h2>
                <p className="text-xs sm:text-sm" style={{ color: '#cbd5e1' }}>
                  Download as PNG and share on Instagram Stories
                </p>
              </div>

              {/* Preview Card - This will be captured for PNG */}
              <div 
                ref={cardRef}
                className={`relative w-full rounded-xl sm:rounded-2xl overflow-hidden border shadow-2xl transition-all duration-300 ${
                  isGenerating ? 'scale-105' : ''
                }`}
                style={{ 
                  width: '100%', 
                  height: '500px', // Reduced height for mobile
                  maxWidth: '350px',
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
                <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between">
                  {/* Header with Profile */}
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={data.profile.profilePic || "/placeholder.svg"}
                        alt="Profile"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-3 shadow-lg mx-auto"
                        style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                      />
                      {data.profile.verified && (
                        <div className="absolute -bottom-1 -right-1 rounded-full p-1" style={{ backgroundColor: '#3b82f6' }}>
                          <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-white">@{data.profile.username}</h3>
                      <div
                        className="inline-flex items-center space-x-2 px-2 sm:px-3 py-1 rounded-full text-white font-bold text-xs mt-2"
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
                  <div className="flex justify-center space-x-4 sm:space-x-6 text-center">
                    <div>
                      <div className="text-sm sm:text-lg font-bold text-white">{data.profile.posts}</div>
                      <div className="text-xs" style={{ color: '#94a3b8' }}>Posts</div>
                    </div>
                    <div>
                      <div className="text-sm sm:text-lg font-bold text-white">{data.profile.followers.toLocaleString()}</div>
                      <div className="text-xs" style={{ color: '#94a3b8' }}>Followers</div>
                    </div>
                    <div>
                      <div className="text-sm sm:text-lg font-bold text-white">{data.profile.following.toLocaleString()}</div>
                      <div className="text-xs" style={{ color: '#94a3b8' }}>Following</div>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <div className="text-sm sm:text-lg font-black text-white">{data.metrics.profileWorth}</div>
                      <div className="text-xs" style={{ color: '#cbd5e1' }}>Profile Worth 💰</div>
                    </div>
                    <div className="rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <div className="text-sm sm:text-lg font-black text-white">{data.metrics.reelsWatched.toLocaleString()}</div>
                      <div className="text-xs" style={{ color: '#cbd5e1' }}>Reels Watched 🎬</div>
                    </div>
                    <div className="rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <div className="text-sm sm:text-lg font-black text-white">{data.metrics.loveMeter}</div>
                      <div className="text-xs" style={{ color: '#cbd5e1' }}>Love Meter 💌</div>
                    </div>
                    <div className="rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <div className="text-sm sm:text-lg font-black text-white">{data.metrics.singleness}%</div>
                      <div className="text-xs" style={{ color: '#cbd5e1' }}>Single Level 💔</div>
                    </div>
                  </div>

                  {/* Roast Summary */}
                  <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <p className="text-white text-xs sm:text-sm text-center leading-relaxed">
                      <span className="font-bold" style={{ color: '#22d3ee' }}>"{data.personality.desc}"</span> Your vibe is pure{" "}
                      {data.metrics.emojiEnergy} energy with a side of chaos. Profile rating:{" "}
                      <span className="font-bold" style={{ color: '#a855f7' }}>{data.metrics.rating}/10</span> - not bad for someone who
                      posts {data.metrics.cringePosts} cringe posts!
                      <span className="text-lg sm:text-xl"> 💀</span>
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
              <div className="space-y-2 sm:space-y-3">
                <Button
                  onClick={handleDownloadPNG}
                  disabled={isGenerating}
                  className="w-full font-bold py-2.5 sm:py-3 shadow-lg transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                  style={{
                    background: 'linear-gradient(to right, #ec4899, #9333ea, #2563eb)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  aria-label="Download as PNG"
                >
                  {isGenerating ? (
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 rounded-full animate-spin mr-2" style={{ borderColor: 'rgba(255, 255, 255, 0.3)', borderTopColor: '#ffffff' }}></div>
                  ) : (
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  )}
                  {isGenerating ? 'Creating PNG...' : '📱 Download PNG for Stories'}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="text-white text-xs sm:text-sm py-2 sm:py-2.5"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(4px)'
                    }}
                    aria-label="Copy share link"
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Copy Link
                  </Button>
                  <Button
                    onClick={() => window.open('https://instagram.com', '_blank')}
                    variant="outline"
                    className="text-white text-xs sm:text-sm py-2 sm:py-2.5"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(4px)'
                    }}
                    aria-label="Open Instagram"
                  >
                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Open Instagram
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center">
                <p className="text-xs" style={{ color: '#94a3b8' }}>
                  💡 Tip: Download the PNG and add it to your Instagram Story for the best experience!
                  <span className="block mt-1">📱 Perfect for Instagram Stories - just download and share!</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
