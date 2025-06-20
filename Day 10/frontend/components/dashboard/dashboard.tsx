"use client"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { useIdeaStore } from "@/lib/store/idea-store"
import { IdeaSubmissionForm } from "./idea-submission-form"
import { AnalysisReport } from "./analysis-report"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, History, Lightbulb, BarChart3, Sparkles } from "lucide-react"
import Link from "next/link"

export function Dashboard() {
  const { user, logout } = useAuthStore()
  const { currentAnalysis, isLoading, analyses } = useIdeaStore()
  const [activeTab, setActiveTab] = useState("submit")

  // Switch to report tab when analysis is completed
  useEffect(() => {
    if (currentAnalysis && !isLoading) {
      setActiveTab("report")
    }
  }, [currentAnalysis, isLoading])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className=" mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Idea Validator
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Market Analysis</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Welcome back,</p>
                  <p className="text-lg font-bold text-purple-600">{user?.username || "User"}</p>
                </div>
              </div>

              <Link href="/history">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                >
                  <History className="h-5 w-5 mr-2" />
                  <span className="text-base font-semibold">History</span>
                  {analyses?.length > 0 && (
                    <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      {analyses.length}
                    </span>
                  )}
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                onClick={logout}
                className="h-12 px-6 border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span className="text-base font-semibold">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className=" mx-auto py-8 px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800">
              Validate Your <span className="gradient-text">Next Big Idea</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get comprehensive AI-powered analysis of your startup concept with market trends, competitive insights,
              and viability scoring.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-16 p-2 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <TabsTrigger
              value="submit"
              className="flex items-center gap-3 h-12 text-base font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Sparkles className="h-5 w-5" />
              Submit Idea
            </TabsTrigger>
            <TabsTrigger
              value="report"
              disabled={!currentAnalysis}
              className="flex items-center gap-3 h-12 text-base font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <BarChart3 className="h-5 w-5" />
              Analysis Report
              {currentAnalysis && (
                <span className="ml-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">New</span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="space-y-0">
            <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
                <CardTitle className="flex items-center gap-4 text-3xl font-bold">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Lightbulb className="h-8 w-8" />
                  </div>
                  Submit Your Startup Idea
                </CardTitle>
                <CardDescription className="text-xl text-purple-100 mt-4 leading-relaxed">
                  Describe your startup concept in detail and let our AI analyze its market potential, competitive
                  landscape, and success probability.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <IdeaSubmissionForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report" className="space-y-0">
            {currentAnalysis ? (
              <AnalysisReport analysis={currentAnalysis} />
            ) : (
              <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl">
                <CardContent className="text-center py-16 px-8">
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <BarChart3 className="h-12 w-12 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">No Analysis Available</h3>
                      <p className="text-lg text-gray-600 mb-6">
                        Submit your first startup idea to get comprehensive market analysis and insights.
                      </p>
                    </div>
                    <Button
                      onClick={() => setActiveTab("submit")}
                      size="lg"
                      className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Submit Your First Idea
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
