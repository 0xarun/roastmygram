"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShareableCard } from "@/components/shareable-card"
import Link from "next/link"
import { ArrowLeft, Share2, Sparkles } from "lucide-react"
import { apiService, type RoastResponse } from "@/lib/api"

interface RoastDashboardProps {
  username: string
}

interface DashboardData {
  profile: {
    username: string
    name: string
    followers: number
    following: number
    posts: number
    bio: string
    profilePic: string
    verified: boolean
  }
  personality: {
    id: string
    title: string
    emoji: string
    desc: string
    color: string
  }
  metrics: {
    loveMeter: number
    hateMeter: number
    stalkers: string
    cringePosts: number
    reelsWatched: number
    storiesPosted: number
    profileWorth: string
    rating: string
    singleness: number
    storyViews: number
    emojiEnergy: string
    viralPotential: number
    aestheticScore: string
    captionCringe: number
  }
  roast?: {
    text: string
    createdAt: string
  }
}

// Mock data generator
const generateMockData = (username: string) => {
  const personalities = [
    {
      id: "mysterious",
      title: "The Mysterious One",
      emoji: "🎭",
      desc: "Your posts say less. Your vibe says everything.",
      color: "from-purple-500 to-indigo-600",
    },
    {
      id: "networker",
      title: "The Networker",
      emoji: "💼",
      desc: "You follow 1,285 people. They follow back for clout.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: "main-character",
      title: "Main Character",
      emoji: "✨",
      desc: "Sunsets, coffee, rain — your aesthetic is a Pinterest board.",
      color: "from-pink-500 to-rose-600",
    },
    {
      id: "lurker",
      title: "The Lurker",
      emoji: "🕶",
      desc: "You post once a year. Yet you're always watching.",
      color: "from-gray-500 to-slate-600",
    },
    {
      id: "ghost",
      title: "The Ghost Follower",
      emoji: "👻",
      desc: "You've liked nothing since 2021.",
      color: "from-indigo-500 to-purple-600",
    },
    {
      id: "enlightened",
      title: "The Enlightened Bro",
      emoji: "🧘",
      desc: "Gym reels, quotes, and diet updates. Peaceful but loud.",
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "dslr",
      title: "The DSLR Kid",
      emoji: "📸",
      desc: "Sharp pics. But blurry life decisions.",
      color: "from-orange-500 to-red-600",
    },
  ]

  const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)]

  return {
    profile: {
      username: username,
      name: `${username.charAt(0).toUpperCase()}${username.slice(1)} Vibes`,
      followers: Math.floor(Math.random() * 5000) + 100,
      following: Math.floor(Math.random() * 2000) + 50,
      posts: Math.floor(Math.random() * 500) + 10,
      bio: "Living my best life ✨ | Coffee addict ☕ | Wanderlust 🌍 | DM for collabs 📩",
      profilePic: `/placeholder.svg?height=120&width=120&text=${username.charAt(0).toUpperCase()}`,
      verified: Math.random() > 0.7,
    },
    personality: randomPersonality,
    metrics: {
      loveMeter: Math.floor(Math.random() * 100) + 1,
      hateMeter: Math.floor(Math.random() * 50) + 1,
      stalkers: "Unmeasurable",
      cringePosts: Math.floor(Math.random() * 10) + 1,
      reelsWatched: Math.floor(Math.random() * 50000) + 1000,
      storiesPosted: Math.floor(Math.random() * 500) + 50,
      profileWorth: `₹${Math.floor(Math.random() * 20) + 1},00,000`,
      rating: (Math.random() * 3 + 7).toFixed(1),
      singleness: Math.floor(Math.random() * 100) + 1,
      storyViews: Math.floor(Math.random() * 100) + 10,
      emojiEnergy: ["💅", "🧘‍♂️", "📸", "✨", "🔥", "⚡", "🌙", "🦋"][Math.floor(Math.random() * 8)],
      viralPotential: Math.floor(Math.random() * 100) + 1,
      aestheticScore: (Math.random() * 3 + 7).toFixed(1),
      captionCringe: Math.floor(Math.random() * 10) + 1,
    },
  }
}

export function RoastDashboard({ username }: RoastDashboardProps) {
  const [showShareCard, setShowShareCard] = useState(false)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoastData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch real data from API
        const response = await apiService.getRoast(username)
        
        // Transform API data to dashboard format
        const transformedData: DashboardData = {
          profile: {
            username: response.data.profile.username,
            name: response.data.profile.fullName || `${username.charAt(0).toUpperCase()}${username.slice(1)} Vibes`,
            followers: response.data.profile.followersCount,
            following: response.data.profile.followingCount,
            posts: response.data.profile.postsCount,
            bio: response.data.profile.bio || "Living my best life ✨ | Coffee addict ☕ | Wanderlust 🌍 | DM for collabs 📩",
            profilePic: response.data.profile.profilePicUrl || `/placeholder.svg?height=120&width=120&text=${username.charAt(0).toUpperCase()}`,
            verified: response.data.profile.isVerified,
          },
          personality: generateMockData(username).personality, // Keep personality generation for now
          metrics: generateMockData(username).metrics, // Keep metrics generation for now
          roast: {
            text: response.data.roast.text,
            createdAt: response.data.roast.createdAt,
          }
        }
        
        setData(transformedData)
      } catch (err) {
        console.error('Failed to fetch roast data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load roast data')
        // Fallback to mock data
        setData(generateMockData(username))
      } finally {
        setLoading(false)
      }
    }

    fetchRoastData()
  }, [username])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-300 text-lg">Analyzing your chaos...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">Failed to load roast data</p>
          <Link href="/input" className="text-cyan-400 hover:text-cyan-300">
            Try again
          </Link>
        </div>
      </div>
    )
  }

  // Use fallback data if API failed
  const displayData = data || generateMockData(username)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-400/5 to-purple-600/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/input"
            className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Roast someone else
          </Link>
          <Button
            onClick={() => setShowShareCard(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Roast
          </Button>
        </div>

        {/* Profile Section */}
        <Card className="backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <img
                  src={displayData.profile.profilePic || "/placeholder.svg"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-cyan-400 to-purple-600 shadow-2xl"
                />
                {displayData.profile.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <h2 className="text-3xl md:text-4xl font-black text-white">@{displayData.profile.username}</h2>
                  {displayData.profile.verified && <span className="text-blue-400">✓</span>}
                </div>
                <p className="text-xl text-slate-300 mb-4">{displayData.profile.name}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4 text-slate-300">
                  <span className="flex items-center space-x-1">
                    <strong className="text-white">{displayData.profile.posts.toLocaleString()}</strong>
                    <span>posts</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <strong className="text-white">{displayData.profile.followers.toLocaleString()}</strong>
                    <span>followers</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <strong className="text-white">{displayData.profile.following.toLocaleString()}</strong>
                    <span>following</span>
                  </span>
                </div>
                <p className="text-slate-300 max-w-md">{displayData.profile.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personality Badge */}
        <Card className="backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500">
          <CardContent className="p-8 text-center">
            <div
              className={`inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${displayData.personality.color} text-white font-bold text-xl shadow-lg`}
            >
              <span className="text-2xl">{displayData.personality.emoji}</span>
              <span>{displayData.personality.title}</span>
            </div>
            <p className="text-slate-300 mt-4 text-lg">{displayData.personality.desc}</p>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <MetricCard
            icon="💌"
            title="Love Meter"
            value={`${displayData.metrics.loveMeter}`}
            subtitle="people love you (mostly for your playlist links)"
            gradient="from-pink-500 to-rose-600"
          />
          <MetricCard
            icon="🔥"
            title="Hate Meter"
            value={`${displayData.metrics.hateMeter}`}
            subtitle="people hate you (mostly your ex's ex)"
            gradient="from-red-500 to-orange-600"
          />
          <MetricCard
            icon="👁️"
            title="Stalkers"
            value={displayData.metrics.stalkers}
            subtitle="your vibe is irresistible"
            gradient="from-purple-500 to-indigo-600"
          />
          <MetricCard
            icon="🫣"
            title="Cringe Posts"
            value={`${displayData.metrics.cringePosts}`}
            subtitle="but who's judging? okay, we are"
            gradient="from-yellow-500 to-orange-600"
          />
          <MetricCard
            icon="🎬"
            title="Reels Watched"
            value={`${displayData.metrics.reelsWatched.toLocaleString()}`}
            subtitle="seek professional help"
            gradient="from-cyan-500 to-blue-600"
          />
          <MetricCard
            icon="📱"
            title="Stories Posted"
            value={`${displayData.metrics.storiesPosted}`}
            subtitle="most were food pics"
            gradient="from-green-500 to-emerald-600"
          />
          <MetricCard
            icon="💰"
            title="Profile Worth"
            value={displayData.metrics.profileWorth}
            subtitle="includes 7 fake followers and a dog"
            gradient="from-emerald-500 to-teal-600"
          />
          <MetricCard
            icon="⭐"
            title="Profile Rating"
            value={`${displayData.metrics.rating}/10`}
            subtitle="missing blue tick but have potential"
            gradient="from-blue-500 to-purple-600"
          />
          <MetricCard
            icon="💔"
            title="Single Level"
            value={`${displayData.metrics.singleness}%`}
            subtitle="but your captions got potential"
            gradient="from-pink-500 to-purple-600"
          />
          <MetricCard
            icon="🕵️"
            title="Story Addiction"
            value={`${displayData.metrics.storyViews}x`}
            subtitle="checked your own story in an hour"
            gradient="from-indigo-500 to-purple-600"
          />
          <MetricCard
            icon="✨"
            title="Emoji Energy"
            value={`${displayData.metrics.emojiEnergy}🧘‍♂️📸`}
            subtitle="that's your aura. accept it"
            gradient="from-purple-500 to-pink-600"
          />
          <MetricCard
            icon="🚀"
            title="Viral Potential"
            value={`${displayData.metrics.viralPotential}%`}
            subtitle="one good post away from fame"
            gradient="from-orange-500 to-red-600"
          />
        </div>

        {/* Share Card Modal */}
        {showShareCard && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="max-w-md w-full">
              <ShareableCard data={displayData} onClose={() => setShowShareCard(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  title,
  value,
  subtitle,
  gradient,
}: {
  icon: string
  title: string
  value: string
  subtitle: string
  gradient: string
}) {
  return (
    <Card className="backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500 group hover:scale-105 hover:shadow-2xl">
      <CardContent className="p-6 text-center relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        ></div>
        <div className="relative z-10">
          <div className="text-3xl mb-3">{icon}</div>
          <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
          <p className="text-white text-2xl font-black mb-2">{value}</p>
          <p className="text-slate-400 text-xs leading-relaxed">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )
}
