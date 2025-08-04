"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Download, Copy, Sparkles, Share2 } from "lucide-react"
import { useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import html2canvas from "html2canvas"

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
      
      // Create a temporary container with clean styling
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.top = '-9999px'
      tempContainer.style.width = '400px'
      tempContainer.style.height = '600px'
      tempContainer.style.background = 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)'
      tempContainer.style.borderRadius = '16px'
      tempContainer.style.border = '1px solid rgba(255, 255, 255, 0.2)'
      tempContainer.style.padding = '24px'
      tempContainer.style.fontFamily = 'Arial, sans-serif'
      tempContainer.style.color = '#ffffff'
      tempContainer.style.overflow = 'hidden'
      
      // Add decorative elements
      tempContainer.innerHTML = `
        <div style="position: absolute; top: 40px; right: 40px; width: 128px; height: 128px; background: radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%); border-radius: 50%; filter: blur(32px);"></div>
        <div style="position: absolute; bottom: 40px; left: 40px; width: 128px; height: 128px; background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%); border-radius: 50%; filter: blur(32px);"></div>
        
        <div style="position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
          <!-- Profile Section -->
          <div style="text-align: center;">
            <div style="position: relative; display: inline-block; margin-bottom: 16px;">
              <img src="${data.profile.profilePic || '/placeholder.svg'}" alt="Profile" style="width: 64px; height: 64px; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.3);" />
              ${data.profile.verified ? '<div style="position: absolute; bottom: -4px; right: -4px; background: #3b82f6; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 8px; color: white;">✓</div>' : ''}
            </div>
            <h3 style="font-size: 24px; font-weight: 900; margin: 0 0 8px 0;">@${data.profile.username}</h3>
            <div style="background: linear-gradient(to right, #8b5cf6, #4f46e5); padding: 8px 16px; border-radius: 20px; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: bold;">
              <span>${data.personality.emoji}</span>
              <span>${data.personality.title}</span>
            </div>
          </div>
          
          <!-- Stats Row -->
          <div style="display: flex; justify-content: center; gap: 24px; text-align: center; margin: 16px 0;">
            <div>
              <div style="font-size: 20px; font-weight: bold;">${data.profile.posts}</div>
              <div style="font-size: 12px; color: #94a3b8;">Posts</div>
            </div>
            <div>
              <div style="font-size: 20px; font-weight: bold;">${data.profile.followers.toLocaleString()}</div>
              <div style="font-size: 12px; color: #94a3b8;">Followers</div>
            </div>
            <div>
              <div style="font-size: 20px; font-weight: bold;">${data.profile.following.toLocaleString()}</div>
              <div style="font-size: 12px; color: #94a3b8;">Following</div>
            </div>
          </div>
          
          <!-- Metrics Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
            <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 12px; text-align: center;">
              <div style="font-size: 20px; font-weight: 900;">${data.metrics.profileWorth}</div>
              <div style="font-size: 10px; color: #cbd5e1;">Profile Worth 💰</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 12px; text-align: center;">
              <div style="font-size: 20px; font-weight: 900;">${data.metrics.reelsWatched.toLocaleString()}</div>
              <div style="font-size: 10px; color: #cbd5e1;">Reels Watched 🎬</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 12px; text-align: center;">
              <div style="font-size: 20px; font-weight: 900;">${data.metrics.loveMeter}</div>
              <div style="font-size: 10px; color: #cbd5e1;">Love Meter 💌</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 12px; text-align: center;">
              <div style="font-size: 20px; font-weight: 900;">${data.metrics.singleness}%</div>
              <div style="font-size: 10px; color: #cbd5e1;">Single Level 💔</div>
            </div>
          </div>
          
          <!-- Roast Summary -->
          <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="font-size: 12px; text-align: center; line-height: 1.4; margin: 0;">
              <span style="font-weight: bold; color: #22d3ee;">"${data.personality.desc}"</span> Your vibe is pure ${data.metrics.emojiEnergy} energy with a side of chaos. Profile rating: <span style="font-weight: bold; color: #a855f7;">${data.metrics.rating}/10</span> - not bad for someone who posts ${data.metrics.cringePosts} cringe posts! <span style="font-size: 16px;">💀</span>
            </p>
          </div>
          
          <!-- Watermark -->
          <div style="text-align: center; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <p style="font-size: 10px; font-weight: medium; color: #94a3b8; margin: 0;">
              <span style="background: linear-gradient(to right, #22d3ee, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: bold;">roastmygram.fun</span> 🔥
            </p>
          </div>
        </div>
      `
      
      document.body.appendChild(tempContainer)
      
      // Capture the temporary container
      const canvas = await html2canvas(tempContainer, {
        useCORS: true,
        allowTaint: true,
        width: 400,
        height: 600,
        background: '#000000',
        logging: false,
      })
      
      // Remove temporary container
      document.body.removeChild(tempContainer)
      
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
                  Download as PNG and share on Instagram Stories
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
                  onClick={handleDownloadPNG}
                  disabled={isGenerating}
                  className="w-full font-bold py-3 shadow-lg transition-all duration-300 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(to right, #ec4899, #9333ea, #2563eb)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  aria-label="Download as PNG"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 rounded-full animate-spin mr-2" style={{ borderColor: 'rgba(255, 255, 255, 0.3)', borderTopColor: '#ffffff' }}></div>
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {isGenerating ? 'Creating PNG...' : '📱 Download PNG for Stories'}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
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
                  <Button
                    onClick={() => window.open('https://instagram.com', '_blank')}
                    variant="outline"
                    className="text-white"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(4px)'
                    }}
                    aria-label="Open Instagram"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
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
