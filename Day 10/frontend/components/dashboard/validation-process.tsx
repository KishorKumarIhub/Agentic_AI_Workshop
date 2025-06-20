"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Zap, TrendingUp, Users, Target, Lightbulb, BarChart3 } from "lucide-react"

interface ValidationStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  duration: number
  color: string
}

const validationSteps: ValidationStep[] = [
  {
    id: "analyzing",
    title: "Analyzing Your Idea",
    description: "Processing your startup concept and extracting key insights",
    icon: <Lightbulb className="h-6 w-6" />,
    duration: 3000,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "trends",
    title: "Market Trends Research",
    description: "Analyzing search volumes, growth rates, and market potential",
    icon: <TrendingUp className="h-6 w-6" />,
    duration: 3000,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "competitors",
    title: "Competitive Analysis",
    description: "Identifying competitors and market positioning opportunities",
    icon: <Users className="h-6 w-6" />,
    duration: 2500,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "saturation",
    title: "Market Saturation Check",
    description: "Evaluating market maturity and barriers to entry",
    icon: <Target className="h-6 w-6" />,
    duration: 3000,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "novelty",
    title: "Innovation Assessment",
    description: "Measuring novelty score and differentiation factors",
    icon: <Zap className="h-6 w-6" />,
    duration: 3500,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "report",
    title: "Generating Final Report",
    description: "Compiling comprehensive analysis and recommendations",
    icon: <BarChart3 className="h-6 w-6" />,
    duration: 4000,
    color: "from-red-500 to-pink-500",
  },
]

interface ValidationProcessProps {
  isVisible: boolean
  onComplete: () => void
}

export function ValidationProcess({ isVisible, onComplete }: ValidationProcessProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0)
      setProgress(0)
      setCompletedSteps([])
      return
    }

    let stepTimeout: NodeJS.Timeout
    let progressInterval: NodeJS.Timeout

    const runStep = (stepIndex: number) => {
      if (stepIndex >= validationSteps.length) {
        onComplete()
        return
      }

      const step = validationSteps[stepIndex]
      const stepProgress = (stepIndex / validationSteps.length) * 100

      setCurrentStep(stepIndex)

      // Animate progress for current step
      let currentProgress = stepProgress
      const progressIncrement = 100 / validationSteps.length / (step.duration / 50)

      progressInterval = setInterval(() => {
        currentProgress += progressIncrement
        setProgress(Math.min(currentProgress, ((stepIndex + 1) / validationSteps.length) * 100))
      }, 50)

      stepTimeout = setTimeout(() => {
        clearInterval(progressInterval)
        setCompletedSteps((prev) => [...prev, step.id])
        setProgress(((stepIndex + 1) / validationSteps.length) * 100)
        runStep(stepIndex + 1)
      }, step.duration)
    }

    runStep(0)

    return () => {
      clearTimeout(stepTimeout)
      clearInterval(progressInterval)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6 shadow-lg">
              <BarChart3 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Validating Your Idea</h2>
            <p className="text-lg text-gray-600">Our AI is analyzing your startup concept across multiple dimensions</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-lg font-semibold text-gray-700 mb-3">
              <span>Analysis Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-4 bg-gray-200 rounded-full overflow-hidden" />
          </div>

          <div className="space-y-4">
            {validationSteps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id)
              const isCurrent = currentStep === index
              const isPending = index > currentStep

              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-500 ${
                    isCurrent
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg scale-105"
                      : isCompleted
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200"
                        : "bg-gray-50 border-2 border-gray-200"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                        : isCurrent
                          ? `bg-gradient-to-r ${step.color} text-white shadow-lg animate-pulse`
                          : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : isCurrent ? (
                      step.icon
                    ) : (
                      <Clock className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-lg font-bold ${
                        isCompleted ? "text-green-700" : isCurrent ? "text-blue-700" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`text-base ${
                        isCompleted ? "text-green-600" : isCurrent ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                  {isCurrent && (
                    <div className="flex-shrink-0">
                      <div className="animate-spin rounded-full h-6 w-6 border-3 border-blue-500 border-t-transparent"></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
