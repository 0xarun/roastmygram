"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { apiService } from "@/lib/api"

export default function InputPage() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)
    try {
      // Call the real API
      const cleanUsername = username.replace("@", "").trim()
      await apiService.getRoast(cleanUsername)
      
      // If successful, navigate to roast page
      router.push(`/roast/${cleanUsername}`)
    } catch (error) {
      console.error('Failed to get roast:', error)
      // You could show an error message here
      // For now, we'll still navigate but you might want to show an error toast
      router.push(`/roast/${username.replace("@", "").trim()}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-60 h-60 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md mx-auto w-full space-y-8 relative z-10">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to safety
        </Link>

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Let's check your{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">vibe</span>{" "}
                ✨
              </h1>
              <p className="text-slate-300 text-lg">
                We'll be gentle. <span className="text-red-400">Maybe.</span> 😈
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-slate-300 font-medium text-left block">Enter your Instagram Username</label>
                <Input
                  type="text"
                  placeholder="@yourhandle"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-6 text-lg bg-white/10 border-white/20 rounded-2xl text-white placeholder:text-slate-400 focus:bg-white/20 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur-sm"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={!username.trim() || isLoading}
                className="w-full py-6 text-xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white border-0 rounded-2xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none hover:shadow-2xl"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing your chaos...</span>
                  </div>
                ) : (
                  "🔍 Check the Roast"
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-slate-400 text-sm">🤖 Our AI is trained on pure sarcasm and Gen-Z energy</p>
              <p className="text-slate-500 text-xs">
                Don't worry, we won't actually stalk your profile... <span className="text-cyan-400">much</span> 👀
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
