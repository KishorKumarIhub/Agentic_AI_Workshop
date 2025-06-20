"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useIdeaStore } from "@/lib/store/idea-store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ValidationProcess } from "./validation-process"
import { Lightbulb, Sparkles, TrendingUp, Users, Target, BarChart3 } from "lucide-react"

export function IdeaSubmissionForm() {
  const [idea, setIdea] = useState("")
  const [showValidation, setShowValidation] = useState(false)
  const { submitIdea, isLoading } = useIdeaStore()
  const { toast } = useToast()

  // Reset showValidation on page refresh/mount
  useEffect(() => {
    setShowValidation(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!idea.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your startup idea to continue.",
        variant: "destructive",
      })
      return
    }

    if (idea.trim().length < 10) {
      toast({
        title: "More Details Needed",
        description: "Please provide a more detailed description of your idea (at least 10 characters).",
        variant: "destructive",
      })
      return
    }

    // Show validation process
    setShowValidation(true)

    try {
      await submitIdea(idea)
      // ValidationProcess will handle the completion
    } catch (error) {
      console.error("Submit idea error:", error)
      setShowValidation(false)
      toast({
        title: "Validation Failed",
        description: "Failed to validate your idea. Please check your connection and try again.",
        variant: "destructive",
      })
    }
  }

  const handleValidationComplete = () => {
    setShowValidation(false)
    toast({
      title: "Analysis Complete! 🎉",
      description: "Your idea has been successfully analyzed. Check the Analysis Report tab to view the results.",
    })
    setIdea("")
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="idea" className="text-xl font-bold text-gray-800">
            Describe Your Startup Idea
          </Label>
          <p className="text-lg text-gray-600 leading-relaxed">
            Provide a comprehensive description of your startup concept. Include the problem you're solving, your target
            market, proposed solution, and any unique value propositions.
          </p>
          <Textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
           
            className="min-h-[200px] text-lg p-6 border-2 border-gray-200 focus:border-purple-500 rounded-2xl resize-none leading-relaxed"
            disabled={isLoading || showValidation}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-base">
            {idea.length > 0 && (
              <span className={`font-semibold ${idea.length < 10 ? "text-red-500" : "text-green-600"}`}>
                {idea.length} characters
                {idea.length < 10 && <span className="text-red-500 ml-2">(minimum 10 required)</span>}
                {idea.length >= 10 && <span className="text-green-600 ml-2">✓ Ready for analysis</span>}
              </span>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading || showValidation || !idea.trim() || idea.trim().length < 10}
            size="lg"
            className="h-16 px-10 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading || showValidation ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                <Sparkles className="h-6 w-6 animate-pulse" />
                <span>Validating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Lightbulb className="h-6 w-6" />
                <span>Validate My Idea</span>
              </div>
            )}
          </Button>
        </div>

        {idea.length > 10 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-purple-800 mb-3">Ready for AI Analysis</h4>
                <p className="text-lg text-purple-700 mb-4 leading-relaxed">
                  Our advanced AI will analyze your idea across multiple dimensions to provide comprehensive insights.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2 text-purple-700">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">Market Trends</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-700">
                    <Users className="h-5 w-5" />
                    <span className="font-semibold">Competition</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-700">
                    <Target className="h-5 w-5" />
                    <span className="font-semibold">Market Fit</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-700">
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-semibold">Viability</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      <ValidationProcess isVisible={showValidation} onComplete={handleValidationComplete} />
    </>
  )
}
