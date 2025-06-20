"use client"

import type React from "react"
import { useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, LogIn, Eye, EyeOff, Zap } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { login } = useAuthStore()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        toast({
          title: "🚀 Welcome back!",
          description: "You've successfully logged in. Let's validate some amazing ideas!",
        })
      } else {
        toast({
          title: "❌ Login Failed",
          description: "Invalid email or password. Please check your credentials and try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Login error:", error)

      let errorMessage = "Unable to connect to the server. Please try again later."

      if (error?.message) {
        if (error.message.includes("401") || error.message.includes("Unauthorized")) {
          errorMessage = "Invalid email or password."
        } else if (error.message.includes("400")) {
          errorMessage = "Please check your email and password format."
        } else if (error.message.includes("500")) {
          errorMessage = "Server error. Please try again later."
        } else {
          errorMessage = error.message
        }
      }

      toast({
        title: "⚠️ Login Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 ">
      {/* Email Field */}
      <div className="space-y-3">
        <Label htmlFor="email" className="text-lg font-bold text-gray-800 flex items-center space-x-2">
          <Mail className="h-5 w-5 text-purple-600" />
          <span>Email Address</span>
        </Label>
        <div className="relative group">
          <div
            className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${focusedField === "email" ? "opacity-30" : ""}`}
          ></div>
          <div className="relative">
            <Mail
              className={`absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 transition-colors duration-300 ${focusedField === "email" ? "text-purple-600" : "text-gray-400"}`}
            />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              required
              placeholder="Enter your email address"
              className={`pl-14 h-16 text-lg border-3 rounded-2xl transition-all duration-300 ${
                focusedField === "email"
                  ? "border-purple-500 shadow-lg shadow-purple-500/25 bg-purple-50/50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-3">
        <Label htmlFor="password" className="text-lg font-bold text-gray-800 flex items-center space-x-2">
          <Lock className="h-5 w-5 text-purple-600" />
          <span>Password</span>
        </Label>
        <div className="relative group">
          <div
            className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${focusedField === "password" ? "opacity-30" : ""}`}
          ></div>
          <div className="relative">
            <Lock
              className={`absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 transition-colors duration-300 ${focusedField === "password" ? "text-purple-600" : "text-gray-400"}`}
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              required
              placeholder="Enter your password"
              className={`pl-14 pr-14 h-16 text-lg border-3 rounded-2xl transition-all duration-300 ${
                focusedField === "password"
                  ? "border-purple-500 shadow-lg shadow-purple-500/25 bg-purple-50/50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-300"
            >
              {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password */}
      <div className="flex justify-end">
        <button
          type="button"
          className="text-purple-600 hover:text-purple-700 font-semibold text-base hover:underline transition-all duration-300"
        >
          Forgot your password?
        </button>
      </div>

      {/* Submit Button */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        <Button
          type="submit"
          className="relative w-full h-18 text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 border-0"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-7 w-7 border-3 border-white border-t-transparent"></div>
              <Zap className="h-7 w-7 animate-pulse" />
              <span>Signing you in...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <LogIn className="h-7 w-7" />
              <span>Sign In & Start Validating</span>
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          )}
        </Button>
      </div>

    
    </form>
  )
}
