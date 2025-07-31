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
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center rotate-12">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-black text-2xl">roastmygram.fun</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-500/20 text-red-400 border-red-400/30 animate-pulse">
                🔴 {roastCount.toLocaleString()} roasts served
              </Badge>
            </div>
          </div>
        </nav>

        {/* Hero Section - Social Media Style */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Viral Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500/20 to-pink-600/20 rounded-full px-6 py-3 border border-red-400/30">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-bold">TRENDING #1 ON SOCIAL</span>
            </div>

            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tight">
                GET
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse font-extrabold">
                  ROASTED
                </span>
                <br />
                <span className="font-black">BY AI</span> 🔥
              </h1>

              <p className="text-2xl md:text-3xl text-slate-300 font-bold">
                Your Instagram just called.
                <br />
                <span className="text-cyan-400">It wants to be roasted.</span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="mb-12">
              <Link href="/input">
                <Button
                  size="lg"
                  className="px-16 py-8 text-2xl font-black bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 hover:from-red-400 hover:via-pink-500 hover:to-purple-500 border-0 rounded-3xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-110 animate-pulse"
                >
                  🚀 ROAST ME NOW
                  <ArrowRight className="ml-3 w-8 h-8" />
                </Button>
              </Link>
            </div>

            {/* Live Activity Feed */}
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 max-w-md mx-auto">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-bold text-sm">LIVE ACTIVITY</span>
              </div>
              <div className="text-white">
                <span className="text-cyan-400 font-bold">{liveActivities[currentActivity].user}</span>
                <span className="mx-2">{liveActivities[currentActivity].action}</span>
                <span className="text-slate-400 text-sm">{liveActivities[currentActivity].time}</span>
                <span className="ml-2 text-xl">{liveActivities[currentActivity].emoji}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Viral Moments Feed */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              <span className="text-pink-400">VIRAL</span> ROASTS 🔥
            </h2>
            <p className="text-xl text-slate-300">These roasts broke the internet (and some egos)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {viralMoments.map((moment, index) => (
              <ViralRoastCard key={index} {...moment} />
            ))}
          </div>
        </section>

        {/* Social Proof - Scattered Style */}
        <section className="container mx-auto px-4 py-16 relative">
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
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/20 via-pink-600/20 to-purple-600/20 rounded-3xl p-12 border border-white/20 relative overflow-hidden">
              {/* Animated elements */}
              <div className="absolute top-4 right-4 text-2xl animate-spin">🔥</div>
              <div className="absolute bottom-4 left-4 text-2xl animate-bounce">💀</div>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                YOUR TURN TO
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
                  GET ROASTED
                </span>
              </h2>

              <p className="text-xl text-slate-300 mb-8">
                Join the chaos. Get your vibe checked.
                <br />
                <span className="text-pink-400 font-bold">It's free. It's brutal. It's accurate.</span>
              </p>

              <Link href="/input">
                <Button
                  size="lg"
                  className="px-12 py-6 text-xl font-black bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600 hover:from-yellow-300 hover:via-red-400 hover:to-pink-500 text-black border-0 rounded-2xl shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  🔥 I'M READY FOR THE SMOKE
                </Button>
              </Link>

              <div className="mt-6 text-slate-400 text-sm">
                ⚠️ Side effects may include: uncontrollable laughter, existential crisis, and viral fame
              </div>
            </div>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
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
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <span className="text-cyan-400 font-bold text-sm">{user}</span>
          <Badge className="bg-red-500/20 text-red-400 text-xs">VIRAL</Badge>
        </div>

        <p className="text-white mb-4 leading-relaxed font-medium">"{roast}"</p>

        <div className="flex items-center justify-between text-slate-400 text-sm">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Share className="w-4 h-4" />
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
          <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"></div>
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
