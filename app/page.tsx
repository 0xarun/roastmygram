"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share, Flame, Crown, ArrowRight } from "lucide-react"
import { apiService } from "@/lib/api"

// Live activity data
const liveActivities = [
  { user: "@aestheticqueen", action: "just got roasted", time: "2s", emoji: "💀" },
  { user: "@techbro_vibes", action: "shared their roast", time: "5s", emoji: "🔥" },
  { user: "@coffeeshop_poet", action: "got called out", time: "8s", emoji: "😭" },
  { user: "@gym_influencer", action: "couldn't handle it", time: "12s", emoji: "💀" },
  { user: "@art_student", action: "posted to story", time: "15s", emoji: "✨" },
]

const viralMoments = [
  {
    user: "@main_character_energy",
    roast: "Your Instagram screams 'I peaked in high school but make it aesthetic' 💅",
    likes: "2.3K",
    comments: "847",
    shares: "1.2K",
  },
  {
    user: "@deep_quotes_daily",
    roast: "You post motivational quotes but can't motivate yourself to post original content 📸",
    likes: "5.7K",
    comments: "2.1K",
    shares: "3.4K",
  },
  {
    user: "@foodie_adventures",
    roast: "Your food pics are fire but your dating life is a burnt toast situation 🍞",
    likes: "8.9K",
    comments: "4.2K",
    shares: "6.1K",
  },
]

export default function LandingPage() {
  const [currentActivity, setCurrentActivity] = useState(0)
  const [roastCount, setRoastCount] = useState(47832)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real stats from API
    const fetchStats = async () => {
      try {
        const stats = await apiService.getStats()
        setRoastCount(stats.data.totalRoasts)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        // Keep default value if API fails
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Update activity counter
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % liveActivities.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-bounce delay-1000">💀</div>
        <div className="absolute top-40 right-20 text-3xl animate-pulse delay-2000">🔥</div>
        <div className="absolute bottom-40 left-20 text-5xl animate-bounce delay-3000">😭</div>
        <div className="absolute bottom-20 right-10 text-3xl animate-pulse delay-4000">✨</div>
        <div className="absolute top-60 left-1/2 text-4xl animate-bounce delay-5000">💅</div>
      </div>

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Minimal Nav */}
        <nav className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <img 
                src="/roastmygram-logo.png" 
                alt="RoastMyGram Logo" 
                className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl shadow-lg"
              />
              <span className="text-white font-black text-lg md:text-2xl">roastmygram.fun</span>
            </div>
            <div className="flex items-center">
              <Badge className="bg-red-500/20 text-red-400 border-red-400/30 animate-pulse text-xs md:text-sm px-2 md:px-3 py-1">
                🔴 {roastCount.toLocaleString()} roasts
              </Badge>
            </div>
          </div>
        </nav>

        {/* Hero Section - Social Media Style */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero with Cover Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left space-y-6 md:space-y-8">
                {/* Viral Badge */}
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500/20 to-pink-600/20 rounded-full px-3 py-1.5 md:px-4 md:py-2 lg:px-6 lg:py-3 border border-red-400/30">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-bold text-xs md:text-sm lg:text-base">ROASTING #1 ON SOCIAL</span>
                </div>

                {/* Main Title */}
                <div className="space-y-3 md:space-y-4 lg:space-y-6">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black text-white leading-none tracking-tight">
                    GET
                    <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse font-extrabold">
                      ROASTED
                    </span>
                    <br />
                    <span className="font-black">FOR FUN</span> 🔥
                  </h1>

                  <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-slate-300 font-bold">
                    Your Instagram just called.
                    <br />
                    <span className="text-cyan-400">It wants to be roasted.</span>
                  </p>
                  
                  {/* Disclaimer */}
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2.5 md:p-3 lg:p-4">
                    <p className="text-yellow-400 text-xs md:text-sm lg:text-base font-medium">
                      ⚠️ All data is fake & generated for entertainment. Pure sarcasm, no AI involved! 😂
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mb-4 md:mb-6 lg:mb-8">
                  <Link href="/input">
                    <Button
                      size="lg"
                      className="w-full md:w-auto px-6 md:px-8 lg:px-12 py-3 md:py-4 lg:py-6 text-base md:text-lg lg:text-xl font-black bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 hover:from-red-400 hover:via-pink-500 hover:to-purple-500 border-0 rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 animate-pulse"
                    >
                      🚀 ROAST ME NOW
                      <ArrowRight className="ml-2 md:ml-3 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                    </Button>
                  </Link>
                </div>

                {/* Live Activity Feed */}
                <div className="backdrop-blur-xl bg-white/5 rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-white/10 max-w-sm md:max-w-md mx-auto lg:mx-0">
                  <div className="flex items-center space-x-2 mb-2 md:mb-3 lg:mb-4">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-bold text-xs md:text-sm">LIVE ACTIVITY</span>
                  </div>
                  <div className="text-white text-xs md:text-sm lg:text-base">
                    <span className="text-cyan-400 font-bold">{liveActivities[currentActivity].user}</span>
                    <span className="mx-1 md:mx-2">{liveActivities[currentActivity].action}</span>
                    <span className="text-slate-400 text-xs md:text-sm">{liveActivities[currentActivity].time}</span>
                    <span className="ml-1 md:ml-2 text-base md:text-lg lg:text-xl">{liveActivities[currentActivity].emoji}</span>
                  </div>
                </div>

                {/* Direct Ad Link */}
                <div className="text-center">
                  <a 
                    href="https://www.profitableratecpm.com/yujq2nyh?key=a3aa0716ee08aaed2c607a78145187c0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-full transition-all duration-300 hover:scale-105 font-medium"
                    style={{ 
                      background: 'linear-gradient(to right, #10b981, #059669)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    🎯 Discover Amazing Deals Here
                  </a>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative flex justify-center">
                <div className="relative rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl transform rotate-1 md:rotate-2 hover:rotate-0 transition-transform duration-500 max-w-full">
                  <img 
                    src="/heroimage.png" 
                    alt="RoastMyGram Hero - Get Your Instagram Roasted for Fun" 
                    className="w-full h-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[400px] object-contain"
                  />
                  {/* Overlay with logo */}
                  <div className="absolute top-2 md:top-4 left-2 md:left-4">
                    <img 
                      src="/roastmygram-logo.png"
                      alt="RoastMyGram Logo" 
                      className="w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 rounded-md md:rounded-lg lg:rounded-xl shadow-lg"
                    />
                  </div>
                  {/* Floating elements on hero image */}
                  <div className="absolute top-1/4 right-2 md:right-4 text-lg md:text-2xl lg:text-3xl animate-bounce">💀</div>
                  <div className="absolute bottom-1/4 left-2 md:left-4 text-base md:text-xl lg:text-2xl animate-pulse">🔥</div>
                  <div className="absolute bottom-1/3 right-1/4 text-sm md:text-lg lg:text-xl animate-bounce delay-1000">😭</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Viral Moments Feed */}
        <section className="container mx-auto px-4 py-8 md:py-12 lg:py-16 relative">
          {/* Floating Profile Example - Desktop */}
          <div className="absolute top-20 right-4 md:right-8 hidden lg:block">
            <div className="relative transform rotate-6 hover:rotate-0 transition-transform duration-500">
              <img 
                src="/landing-profile.png" 
                alt="Example Roast Profile" 
                className="w-32 h-auto rounded-xl shadow-2xl"
              />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                EXAMPLE
              </div>
            </div>
          </div>

          <div className="text-center mb-6 md:mb-8 lg:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-2 md:mb-3 lg:mb-4">
              <span className="text-pink-400">VIRAL</span> ROASTS 🔥
            </h2>
            <p className="text-sm md:text-lg lg:text-xl text-slate-300 mb-3 md:mb-4">These roasts broke the internet (and some egos)</p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2.5 md:p-3 max-w-sm md:max-w-md mx-auto">
              <p className="text-yellow-400 text-xs md:text-sm font-medium">
                🎭 All usernames & stats are fictional for maximum laughs!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-8 max-w-6xl mx-auto">
            {viralMoments.map((moment, index) => (
              <ViralRoastCard key={index} {...moment} />
            ))}
          </div>
        </section>

        {/* Social Proof - Scattered Style */}
        <section className="container mx-auto px-4 py-16 relative">
          {/* Mobile Profile Example */}
          <div className="absolute top-10 left-4 md:left-8 lg:hidden">
            <div className="relative transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <img 
                src="/landing-profile.png" 
                alt="Example Roast Profile" 
                className="w-24 h-auto rounded-lg shadow-xl"
              />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full font-bold animate-pulse">
                SAMPLE
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              WHAT THE <span className="text-yellow-400">INTERNET</span> SAYS
            </h2>
          </div>

          {/* Scattered testimonials container */}
          <div className="relative h-[800px] max-w-7xl mx-auto overflow-hidden">
            {/* Large card - top left */}
            <ScatteredTestimonial
              username="@travisscott"
              content="this AI really called out my entire aesthetic and said 'your vibe is giving main character energy but make it chaos' and I can't even be mad because that's literally my brand 🔥🔥🔥 the accuracy is UNREAL"
              position="absolute top-0 left-0 w-80 rotate-[-8deg]"
              size="large"
            />

            {/* Medium card - top right */}
            <ScatteredTestimonial
              username="@arianagrande"
              content="got roasted for posting too many selfies with the same angle... the AI said 'we get it, you found your good side' 💀"
              position="absolute top-12 right-8 w-72 rotate-[12deg]"
              size="medium"
            />

            {/* Small card - middle left */}
            <ScatteredTestimonial
              username="@justinbieber"
              content="called me out for my captions being too deep 😭"
              position="absolute top-48 left-16 w-56 rotate-[-15deg]"
              size="small"
            />

            {/* Large card - center */}
            <ScatteredTestimonial
              username="@kyliejenner"
              content="this AI said my Instagram is 'giving expensive but make it relatable' and honestly that's the most accurate personality read I've ever gotten. Posted this to my story and got 2M views 🚀✨"
              position="absolute top-32 left-1/2 transform -translate-x-1/2 w-84 rotate-[5deg]"
              size="large"
            />

            {/* Medium card - bottom left */}
            <ScatteredTestimonial
              username="@selenagomez"
              content="roasted my entire feed and said I post like I'm writing a diary for the world to see... which is literally what Instagram is for??? 📸"
              position="absolute bottom-32 left-12 w-76 rotate-[18deg]"
              size="medium"
            />

            {/* Small card - middle right */}
            <ScatteredTestimonial
              username="@therock"
              content="even roasted my workout posts 💪😂"
              position="absolute top-64 right-16 w-52 rotate-[-22deg]"
              size="small"
            />

            {/* Medium card - bottom right */}
            <ScatteredTestimonial
              username="@zendaya"
              content="the AI analyzed my posts and said 'your aesthetic is giving Pinterest board that came to life' and I'm LIVING for this energy honestly 🦋"
              position="absolute bottom-16 right-4 w-78 rotate-[-10deg]"
              size="medium"
            />

            {/* Small card - bottom center */}
            <ScatteredTestimonial
              username="@chancetherapper"
              content="got called out for my inspirational posts 🙏"
              position="absolute bottom-8 left-1/3 w-48 rotate-[25deg]"
              size="small"
            />
          </div>
        </section>

        {/* Final CTA - TikTok Style */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/20 via-pink-600/20 to-purple-600/20 rounded-2xl md:rounded-3xl p-6 md:p-12 border border-white/20 relative overflow-hidden">
              {/* Animated elements */}
              <div className="absolute top-2 md:top-4 right-2 md:right-4 text-xl md:text-2xl animate-spin">🔥</div>
              <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 text-xl md:text-2xl animate-bounce">💀</div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-6">
                YOUR TURN TO
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
                  GET ROASTED
                </span>
              </h2>

              <p className="text-lg md:text-xl text-slate-300 mb-6 md:mb-8">
                Join the chaos. Get your vibe checked.
                <br />
                <span className="text-pink-400 font-bold">It's free. It's brutal. It's fun!</span>
              </p>

              <Link href="/input">
                <Button
                  size="lg"
                  className="w-full md:w-auto px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-black bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600 hover:from-yellow-300 hover:via-red-400 hover:to-pink-500 text-black border-0 rounded-xl md:rounded-2xl shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  🔥 I'M READY FOR THE SMOKE
                </Button>
              </Link>

              <div className="mt-4 md:mt-6 text-slate-400 text-xs md:text-sm space-y-2">
                <div>⚠️ Side effects may include: uncontrollable laughter, existential crisis, and viral fame</div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                  <p className="text-yellow-400 text-xs font-medium">
                    🎭 Remember: All roasts are fictional & for entertainment only!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Banner Ad */}
        <div className="text-center py-8">
          <div className="flex justify-center">
            <div id="banner-ad-container"></div>
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="/roastmygram-logo.png" 
              alt="RoastMyGram Logo" 
              className="w-8 h-8 rounded-lg shadow-md"
            />
            <span className="text-white font-bold">roastmygram.fun</span>
          </div>
          <p className="text-slate-400 text-sm">Made with 💀 and zero chill. Your Instagram will never recover.</p>
        </footer>
      </div>
    </div>
  )
}

// Component definitions
function ViralRoastCard({
  user,
  roast,
  likes,
  comments,
  shares,
}: {
  user: string
  roast: string
  likes: string
  comments: string
  shares: string
}) {
  return (
    <Card className="backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500 group hover:scale-105">
      <CardContent className="p-3 md:p-4 lg:p-6">
        <div className="flex items-center space-x-2 mb-2 md:mb-3 lg:mb-4">
          <img 
            src="/roastmygram-logo.png" 
            alt="RoastMyGram Logo" 
            className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-full shadow-md"
          />
          <span className="text-cyan-400 font-bold text-xs md:text-sm">{user}</span>
          <Badge className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5">VIRAL</Badge>
        </div>

        <p className="text-white mb-2 md:mb-3 lg:mb-4 leading-relaxed font-medium text-xs md:text-sm lg:text-base">"{roast}"</p>

        <div className="flex items-center justify-between text-slate-400 text-xs md:text-sm">
          <div className="flex items-center space-x-1">
            <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Share className="w-3 h-3 md:w-4 md:h-4" />
            <span>{shares}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ScatteredTestimonial({
  username,
  content,
  position,
  size,
}: {
  username: string
  content: string
  position: string
  size: "small" | "medium" | "large"
}) {
  const sizeClasses = {
    small: "p-4 text-sm",
    medium: "p-6 text-base",
    large: "p-8 text-lg",
  }

  const gradients = [
    "from-cyan-500/20 to-blue-600/20",
    "from-purple-500/20 to-pink-600/20",
    "from-green-500/20 to-emerald-600/20",
    "from-orange-500/20 to-red-600/20",
    "from-indigo-500/20 to-purple-600/20",
  ]

  // Use a hash-based approach to get consistent values for each username
  const hash = username.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const gradientIndex = Math.abs(hash) % gradients.length
  const randomGradient = gradients[gradientIndex]
  
  // Use hash to generate consistent engagement numbers
  const likes = Math.abs(hash % 40) + 10
  const comments = Math.abs((hash * 2) % 15) + 5
  const shares = Math.abs((hash * 3) % 13) + 2

  return (
    <Card
      className={`${position} backdrop-blur-xl bg-gradient-to-br ${randomGradient} border-white/20 hover:bg-white/10 transition-all duration-500 group hover:scale-105 hover:rotate-0 cursor-pointer shadow-2xl`}
    >
      <CardContent className={sizeClasses[size]}>
        <div className="flex items-center space-x-2 mb-3">
          <img 
            src="/roastmygram-logo.png" 
            alt="RoastMyGram Logo" 
            className="w-6 h-6 rounded-full shadow-sm"
          />
          <span className="text-white font-bold text-sm">{username}</span>
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs">✓</div>
        </div>

        <p className="text-white leading-relaxed font-medium">{content}</p>

        <div className="flex items-center space-x-4 text-slate-400 text-xs mt-4">
          <div className="flex items-center space-x-1 hover:text-red-400 transition-colors">
            <Heart className="w-3 h-3" />
            <span>{likes}K</span>
          </div>
          <div className="flex items-center space-x-1 hover:text-cyan-400 transition-colors">
            <MessageCircle className="w-3 h-3" />
            <span>{comments}K</span>
          </div>
          <div className="flex items-center space-x-1 hover:text-green-400 transition-colors">
            <Share className="w-3 h-3" />
            <span>{shares}K</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
