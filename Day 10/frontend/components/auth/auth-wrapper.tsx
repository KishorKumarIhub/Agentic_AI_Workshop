"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { Dashboard } from "@/components/dashboard/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, Sparkles, TrendingUp, Users, Target, Zap, BarChart3, Star, Rocket } from "lucide-react"

export function AuthWrapper() {
  const { isAuthenticated } = useAuthStore()
  const [isLogin, setIsLogin] = useState(true)

  if (isAuthenticated) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen relative overflow-hidden ">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-3000"></div>

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className="border border-white/20 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-screen-2xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="text-white space-y-10">
            {/* Main Title */}
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-2xl">
                    <Lightbulb className="h-12 w-12 text-white animate-bounce" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl lg:text-7xl font-black">
                    <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent animate-pulse">
                      Idea
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                      Validator
                    </span>
                  </h1>
                  <div className="flex items-center space-x-2 mt-4">
                    <Star className="h-6 w-6 text-yellow-400 animate-spin" />
                    <p className="text-xl text-purple-200 font-semibold">AI-Powered Innovation</p>
                  </div>
                </div>
              </div>

              <p className="text-2xl lg:text-3xl text-white/90 leading-relaxed font-light">
                Transform your startup dreams into
                <span className="font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {" "}
                  data-driven reality{" "}
                </span>
                with our advanced AI market analysis platform
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <TrendingUp className="h-8 w-8 text-green-400 mb-4 group-hover:animate-bounce" />
                  <h3 className="text-xl font-bold text-white mb-2">Market Intelligence</h3>
                  <p className="text-white/80">Deep market trends and growth analysis</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <Users className="h-8 w-8 text-blue-400 mb-4 group-hover:animate-bounce" />
                  <h3 className="text-xl font-bold text-white mb-2">Competitor Insights</h3>
                  <p className="text-white/80">Comprehensive competitive landscape</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <Target className="h-8 w-8 text-purple-400 mb-4 group-hover:animate-bounce" />
                  <h3 className="text-xl font-bold text-white mb-2">Viability Scoring</h3>
                  <p className="text-white/80">AI-calculated success probability</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <Zap className="h-8 w-8 text-yellow-400 mb-4 group-hover:animate-bounce" />
                  <h3 className="text-xl font-bold text-white mb-2">Innovation Analysis</h3>
                  <p className="text-white/80">Novelty and differentiation insights</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            {/* <div className="flex items-center justify-center lg:justify-start space-x-12 pt-8">
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-white/80 font-semibold">Ideas Validated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  95%
                </div>
                <div className="text-white/80 font-semibold">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-white/80 font-semibold">AI Analysis</div>
              </div>
            </div>*/}
          </div> 

          {/* Right side - Auth form */}
          <div className="w-full max-w-2xl mx-auto">
            <div className="relative">
              {/* Glowing background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-3xl blur-2xl"></div>

              <Card className="relative backdrop-blur-2xl bg-white/95 shadow-2xl border-0 rounded-3xl overflow-hidden">
                {/* Card Header */}
                <CardHeader className="text-center pb-8 pt-12 relative">
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600"></div>

                  <div className="space-y-6">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        {isLogin ? (
                          <Rocket className="h-10 w-10 text-white animate-bounce" />
                        ) : (
                          <Sparkles className="h-10 w-10 text-white animate-spin" />
                        )}
                      </div>
                    </div>

                    <div>
                      <CardTitle className="text-4xl font-black text-gray-800 mb-4">
                        {isLogin ? (
                          <span>
                            Welcome{" "}
                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                              Back!
                            </span>
                          </span>
                        ) : (
                          <span>
                            Join{" "}
                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                              Innovation!
                            </span>
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-xl text-gray-600 leading-relaxed">
                        {isLogin
                          ? "Continue your journey of validating groundbreaking ideas"
                          : "Start your entrepreneurial journey with AI-powered insights"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-12 pb-12">
                  {/* Form Container */}
                  <div className="relative">{isLogin ? <LoginForm /> : <RegisterForm />}</div>

                  {/* Switch Form Button */}
                  <div className="mt-10 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500 font-semibold">OR</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => setIsLogin(!isLogin)}
                      className="mt-6 text-lg font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isLogin ? (
                        <span className="flex items-center space-x-2">
                          <Sparkles className="h-5 w-5" />
                          <span>Create new account</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <Rocket className="h-5 w-5" />
                          <span>Sign in to existing account</span>
                        </span>
                      )}
                    </Button>
                  </div>

                 
                  
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Elements */}
    
    </div>
  )
}
