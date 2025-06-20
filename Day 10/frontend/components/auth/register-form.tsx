"use client"

import type React from "react"
import { useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Lock, UserPlus, Eye, EyeOff, Sparkles, CheckCircle, XCircle } from "lucide-react"

export function RegisterForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { register } = useAuthStore()
  const { toast } = useToast()

  // Password validation
  const passwordValidation = {
    length: password.length >= 6,
    match: password === confirmPassword && confirmPassword.length > 0,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /\d/.test(password),
  }

  const isPasswordValid = Object.values(passwordValidation).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "❌ Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "⚠️ Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await register(username, email, password)
      if (success) {
        toast({
          title: "🎉 Account Created!",
          description: `Welcome ${username}! Your journey to validate amazing ideas begins now.`,
        })
      } else {
        toast({
          title: "❌ Registration Failed",
          description: "Unable to create account. Email might already be in use.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Registration error:", error)

      let errorMessage = "Unable to connect to the server. Please try again later."

      if (error?.message) {
        if (error.message.includes("400")) {
          errorMessage = "Please check your input data."
        } else if (error.message.includes("409") || error.message.includes("already exists")) {
          errorMessage = "Email already exists. Please use a different email."
        } else if (error.message.includes("500")) {
          errorMessage = "Server error. Please try again later."
        } else {
          errorMessage = error.message
        }
      }

      toast({
        title: "⚠️ Registration Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username Field */}
      <div className="space-y-3">
        <Label htmlFor="username" className="text-lg font-bold text-gray-800 flex items-center space-x-2">
          <User className="h-5 w-5 text-purple-600" />
          <span>Username</span>
        </Label>
        <div className="relative group">
          <div
            className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${focusedField === "username" ? "opacity-30" : ""}`}
          ></div>
          <div className="relative">
            <User
              className={`absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 transition-colors duration-300 ${focusedField === "username" ? "text-purple-600" : "text-gray-400"}`}
            />
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField(null)}
              required
              placeholder="Choose a unique username"
              className={`pl-14 h-16 text-lg border-3 rounded-2xl transition-all duration-300 ${
                focusedField === "username"
                  ? "border-purple-500 shadow-lg shadow-purple-500/25 bg-purple-50/50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            />
          </div>
        </div>
      </div>

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
              placeholder="Create a strong password"
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

        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm font-semibold text-gray-700">Password Requirements:</p>
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`flex items-center space-x-2 text-sm ${passwordValidation.length ? "text-green-600" : "text-gray-400"}`}
              >
                {passwordValidation.length ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <span>At least 6 characters</span>
              </div>
              <div
                className={`flex items-center space-x-2 text-sm ${passwordValidation.hasLetter ? "text-green-600" : "text-gray-400"}`}
              >
                {passwordValidation.hasLetter ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <span>Contains letters</span>
              </div>
              <div
                className={`flex items-center space-x-2 text-sm ${passwordValidation.hasNumber ? "text-green-600" : "text-gray-400"}`}
              >
                {passwordValidation.hasNumber ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <span>Contains numbers</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-3">
        <Label htmlFor="confirmPassword" className="text-lg font-bold text-gray-800 flex items-center space-x-2">
          <Lock className="h-5 w-5 text-purple-600" />
          <span>Confirm Password</span>
        </Label>
        <div className="relative group">
          <div
            className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${focusedField === "confirmPassword" ? "opacity-30" : ""}`}
          ></div>
          <div className="relative">
            <Lock
              className={`absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 transition-colors duration-300 ${focusedField === "confirmPassword" ? "text-purple-600" : "text-gray-400"}`}
            />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
              required
              placeholder="Confirm your password"
              className={`pl-14 pr-14 h-16 text-lg border-3 rounded-2xl transition-all duration-300 ${
                focusedField === "confirmPassword"
                  ? "border-purple-500 shadow-lg shadow-purple-500/25 bg-purple-50/50"
                  : "border-gray-200 hover:border-purple-300"
              } ${
                confirmPassword.length > 0 && passwordValidation.match
                  ? "border-green-500 bg-green-50/50"
                  : confirmPassword.length > 0 && !passwordValidation.match
                    ? "border-red-500 bg-red-50/50"
                    : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-300"
            >
              {showConfirmPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Password Match Indicator */}
        {confirmPassword.length > 0 && (
          <div
            className={`flex items-center space-x-2 text-sm ${passwordValidation.match ? "text-green-600" : "text-red-600"}`}
          >
            {passwordValidation.match ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <span>{passwordValidation.match ? "Passwords match!" : "Passwords do not match"}</span>
          </div>
        )}
      </div>

     

      {/* Submit Button */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        <Button
          type="submit"
          className="relative w-full h-18 text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 border-0"
          disabled={isLoading || !isPasswordValid}
        >
          {isLoading ? (
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-7 w-7 border-3 border-white border-t-transparent"></div>
              <Sparkles className="h-7 w-7 animate-pulse" />
              <span>Creating your account...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <UserPlus className="h-7 w-7" />
              <span>Create Account & Start Journey</span>
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          )}
        </Button>
      </div>

     
      
    </form>
  )
}
