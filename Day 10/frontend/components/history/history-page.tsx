"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { useIdeaStore } from "@/lib/store/idea-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Calendar, TrendingUp, Search, Filter, BarChart3, Clock, Eye, RefreshCw } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { HistoryStats } from "./history-stats"

export function HistoryPage() {
  const { user } = useAuthStore()
  const { analyses, fetchUserAnalyses, setCurrentAnalysis } = useIdeaStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "viability" | "novelty">("date")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAnalyses = async () => {
      setIsLoading(true)
      setError(null)
      try {
        await fetchUserAnalyses()
      } catch (error) {
        console.error("Failed to load analyses:", error)
        setError("Failed to load your analysis history. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadAnalyses()
    }
  }, [user, fetchUserAnalyses])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setError(null)
    try {
      await fetchUserAnalyses()
    } catch (error) {
      console.error("Failed to refresh analyses:", error)
      setError("Failed to refresh data. Please try again.")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleViewReport = (analysis: any) => {
    setCurrentAnalysis(analysis)
  }

  // Filter and sort analyses with error handling
  const filteredAndSortedAnalyses = analyses
    .filter((analysis) => {
      if (!analysis.title) return false
      return analysis.title.toLowerCase().includes(searchTerm.toLowerCase())
    })
    .sort((a, b) => {
      try {
        switch (sortBy) {
          case "date":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case "viability":
            const scoreA = a.evaluation.analysis_results.final_report.viability_score || 0
            const scoreB = b.evaluation.analysis_results.final_report.viability_score || 0
            return scoreB - scoreA
          case "novelty":
            const noveltyA = a.evaluation.analysis_results.novelty.novelty_score || 0
            const noveltyB = b.evaluation.analysis_results.novelty.novelty_score || 0
            return noveltyB - noveltyA
          default:
            return 0
        }
      } catch (error) {
        console.error("Error sorting analyses:", error)
        return 0
      }
    })

  const formatDate = (date: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date))
    } catch (error) {
      return "Invalid date"
    }
  }

  const getDaysAgo = (date: string) => {
    try {
      const days = Math.ceil((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
      if (days === 0) return "Today"
      if (days === 1) return "Yesterday"
      return `${days} days ago`
    } catch (error) {
      return "Unknown"
    }
  }

  const getViabilityColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-200"
    if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getMarketPotentialColor = (potential: string) => {
    switch (potential?.toLowerCase()) {
      case "very high":
        return "text-green-600"
      case "high":
        return "text-blue-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">Analysis History</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Badge variant="secondary" className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                {analyses.length} {analyses.length === 1 ? "Analysis" : "Analyses"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Idea Validations</h2>
          <p className="text-gray-600">Track and review all your startup idea analyses</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Summary Stats */}
        {!isLoading && <HistoryStats analyses={analyses} />}

        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search your ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "viability" | "novelty")}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="viability">Sort by Viability</option>
              <option value="novelty">Sort by Novelty</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <Card>
            <CardContent className="text-center py-12">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-500">Loading your analysis history...</p>
            </CardContent>
          </Card>
        ) : filteredAndSortedAnalyses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No matching analyses found" : "No analyses found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Start by validating your first startup idea"}
              </p>
              <Link href="/">
                <Button>{searchTerm ? "Clear Search" : "Validate Your First Idea"}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Analysis Cards */
          <div className="grid gap-6">
            {filteredAndSortedAnalyses.map((analysis) => {
              const viabilityScore = analysis.evaluation.analysis_results.final_report.viability_score || 0
              const noveltyScore = analysis.evaluation.analysis_results.novelty.novelty_score || 0
              const marketPotential = analysis.evaluation.analysis_results.trends.market_potential.overall
              const saturationScore = analysis.evaluation.analysis_results.saturation.saturation_score
              const competitiveScore = analysis.evaluation.analysis_results.competitors.benchmark_score || 0

              return (
                <Card
                  key={analysis._id}
                  className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-2 mb-2">{analysis.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(analysis.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {getDaysAgo(analysis.createdAt)}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <Badge
                          variant="secondary"
                          className={`flex items-center gap-1 ${getViabilityColor(viabilityScore)}`}
                        >
                          <TrendingUp className="h-3 w-3" />
                          {viabilityScore}% Viable
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {noveltyScore}%
                        </div>
                        <div className="text-xs text-gray-600">Novelty</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-semibold ${getMarketPotentialColor(marketPotential)}`}>
                          {marketPotential}
                        </div>
                        <div className="text-xs text-gray-600">Market Potential</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          {saturationScore}
                        </div>
                        <div className="text-xs text-gray-600">Saturation</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-600">
                          {competitiveScore}%
                        </div>
                        <div className="text-xs text-gray-600">Competitive</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      {analysis.evaluation.analysis_results.final_report.success_probability && (
                        <div className="text-sm text-gray-600">
                          Success Probability:{" "}
                          <span className="font-medium">
                            {typeof analysis.evaluation.analysis_results.final_report.success_probability === "string" ||
                             typeof analysis.evaluation.analysis_results.final_report.success_probability === "number"
                              ? analysis.evaluation.analysis_results.final_report.success_probability
                              : JSON.stringify(analysis.evaluation.analysis_results.final_report.success_probability)}
                          </span>
                        </div>
                      )}
                      <Link href="/">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewReport(analysis)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Full Report
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
