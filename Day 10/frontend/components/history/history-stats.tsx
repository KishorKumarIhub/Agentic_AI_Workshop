"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Target, Lightbulb, BarChart3 } from "lucide-react"
import type { IdeaAnalysis } from "@/lib/types"

interface HistoryStatsProps {
  analyses: IdeaAnalysis[]
}

export function HistoryStats({ analyses }: HistoryStatsProps) {
  if (analyses.length === 0) return null

  const avgViability = Math.round(
    analyses.reduce((sum, analysis) => sum + analysis.analysis_results.final_report.viability_score, 0) /
      analyses.length,
  )

  const avgNovelty = Math.round(
    analyses.reduce((sum, analysis) => sum + analysis.analysis_results.novelty.novelty_score, 0) / analyses.length,
  )

  const highViabilityCount = analyses.filter(
    (analysis) => analysis.analysis_results.final_report.viability_score >= 70,
  ).length

  const recentAnalyses = analyses.filter(
    (analysis) => Date.now() - new Date(analysis.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000,
  ).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
  )
}
