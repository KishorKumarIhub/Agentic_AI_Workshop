"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Target, Lightbulb, BarChart3, Users, Globe } from "lucide-react"
import type { IdeaAnalysis } from "@/lib/types"

interface HistoryStatsProps {
  analyses: IdeaAnalysis[]
}

export function HistoryStats({ analyses }: HistoryStatsProps) {
  if (analyses.length === 0) return null

  // Calculate average viability score
  const avgViability = Math.round(
    analyses.reduce((sum, analysis) => {
      const score = analysis.evaluation.analysis_results.final_report.viability_score
      return sum + (score || 0)
    }, 0) / analyses.length,
  )

  // Calculate average novelty score
  const avgNovelty = Math.round(
    analyses.reduce((sum, analysis) => {
      const score = analysis.evaluation.analysis_results.novelty.novelty_score
      return sum + (score || 0)
    }, 0) / analyses.length,
  )

  // Count high viability ideas (>= 70)
  const highViabilityCount = analyses.filter(
    (analysis) => (analysis.evaluation.analysis_results.final_report.viability_score || 0) >= 70,
  ).length

  // Count recent analyses (last 7 days)
  const recentAnalyses = analyses.filter(
    (analysis) => Date.now() - new Date(analysis.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000,
  ).length

  // Calculate average competitive score
  const avgCompetitiveScore = Math.round(
    analyses.reduce((sum, analysis) => {
      const score = analysis.evaluation.analysis_results.competitors.benchmark_score
      return sum + (score || 0)
    }, 0) / analyses.length,
  )

  // Count high market potential ideas
  const highMarketPotentialCount = analyses.filter(
    (analysis) => analysis.evaluation.analysis_results.trends.market_potential.overall === "High" || 
                   analysis.evaluation.analysis_results.trends.market_potential.overall === "Very High"
  ).length

  // Get top performing idea
  const topPerformingIdea = analyses.reduce((top, current) => {
    const currentScore = current.evaluation.analysis_results.final_report.viability_score || 0
    const topScore = top.evaluation.analysis_results.final_report.viability_score || 0
    return currentScore > topScore ? current : top
  }, analyses[0])

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyses.length}</div>
            <p className="text-xs text-muted-foreground">
              {recentAnalyses > 0 ? `${recentAnalyses} this week` : "Keep validating!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Viability</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgViability}%</div>
            <p className="text-xs text-muted-foreground">
              {avgViability >= 70
                ? "Excellent potential!"
                : avgViability >= 50
                  ? "Good potential"
                  : "Room for improvement"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Novelty</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgNovelty}%</div>
            <p className="text-xs text-muted-foreground">
              {avgNovelty >= 70 ? "Highly innovative!" : avgNovelty >= 50 ? "Good innovation" : "Consider pivoting"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Potential</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highViabilityCount}</div>
            <p className="text-xs text-muted-foreground">
              {highViabilityCount > 0
                ? `${Math.round((highViabilityCount / analyses.length) * 100)}% of ideas`
                : "None yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Competitive Score</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompetitiveScore}%</div>
            <p className="text-xs text-muted-foreground">
              {avgCompetitiveScore >= 70 ? "Strong positioning" : avgCompetitiveScore >= 50 ? "Moderate competition" : "High competition"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Market Potential</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highMarketPotentialCount}</div>
            <p className="text-xs text-muted-foreground">
              {highMarketPotentialCount > 0
                ? `${Math.round((highMarketPotentialCount / analyses.length) * 100)}% of ideas`
                : "Focus on market research"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topPerformingIdea ? topPerformingIdea.evaluation.analysis_results.final_report.viability_score : 0}%
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {topPerformingIdea ? topPerformingIdea.title : "No ideas yet"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
