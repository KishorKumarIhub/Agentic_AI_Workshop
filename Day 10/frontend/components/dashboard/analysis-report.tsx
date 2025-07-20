"use client"

import React from "react"
import type { IdeaAnalysis } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Target, Lightbulb, DollarSign } from "lucide-react"

interface AnalysisReportProps {
  analysis: IdeaAnalysis
}

export function AnalysisReport({ analysis }: AnalysisReportProps) {
  // Add null checks for the analysis data
  if (!analysis || !analysis.evaluation || !analysis.evaluation.analysis_results) {
    return (
      <div className="space-y-6 text-lg">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No analysis data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { analysis_results } = analysis.evaluation

  // Helper function to safely render arrays
  const renderArray = (array: any[] | undefined, renderItem: (item: any, index: number) => React.ReactNode) => {
    if (!array || !Array.isArray(array) || array.length === 0) {
      return <p className="text-sm text-gray-500">No data available</p>
    }
    return array.map(renderItem)
  }

  // Helper function to safely get nested values
  const getNestedValue = (obj: any, path: string[], defaultValue: any = "N/A") => {
    try {
      return path.reduce((current, key) => current?.[key], obj) ?? defaultValue
    } catch {
      return defaultValue
    }
  }

  return (
    <div className="space-y-6 text-lg">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Analysis Report
          </CardTitle>
          <CardDescription>Comprehensive analysis for: {analysis.title || "Untitled Idea"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getNestedValue(analysis_results, ["final_report", "viability_score"], 0)}%
              </div>
              <div className="text-sm text-gray-600">Viability Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getNestedValue(analysis_results, ["novelty", "novelty_score"], 0)}%
              </div>
              <div className="text-sm text-gray-600">Novelty Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {getNestedValue(analysis_results, ["competitors", "benchmark_score"], 0)}%
              </div>
              <div className="text-sm text-gray-600">Competitive Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="saturation">Saturation</TabsTrigger>
          <TabsTrigger value="novelty">Novelty</TabsTrigger>
          <TabsTrigger value="final">Final Report</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Market Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Search Volume</h4>
                  <Badge variant="secondary">
                    {getNestedValue(analysis_results, ["trends", "search_volume", "overall"], "N/A")}
                  </Badge>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {renderArray(
                      getNestedValue(analysis_results, ["trends", "search_volume", "keywords"], []),
                      (item: { keyword: string; volume: string }, index: number) => (
                        <Badge key={index} variant="outline">
                          {item?.keyword || "Unknown"} ({item?.volume || "N/A"})
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Growth Rate</h4>
                  <Badge variant="secondary">
                    {getNestedValue(analysis_results, ["trends", "growth_rate", "overall"], "N/A")}
                  </Badge>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                    {renderArray(
                      getNestedValue(analysis_results, ["trends", "growth_rate", "factors"], []),
                      (factor: string, index: number) => (
                        <li key={index}>{factor || "Unknown factor"}</li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Top Regions</h4>
                  <div className="flex flex-wrap gap-2">
                    {renderArray(
                      getNestedValue(analysis_results, ["trends", "top_regions"], []),
                      (region: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {region || "Unknown region"}
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Market Potential</h4>
                  <Badge variant="secondary">
                    {getNestedValue(analysis_results, ["trends", "market_potential", "overall"], "N/A")}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    {getNestedValue(analysis_results, ["trends", "market_potential", "notes"], "No notes available")}
                  </p>
                  <div className="mt-2">
                    <h5 className="font-medium mb-1">Key Segments:</h5>
                    <div className="flex flex-wrap gap-2">
                      {renderArray(
                        getNestedValue(analysis_results, ["trends", "market_potential", "segments"], []),
                        (segment: { segment: string; potential: string }, index: number) => (
                          <Badge key={index} variant="outline">
                            {segment?.segment || "Unknown"} ({segment?.potential || "N/A"})
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Demand Risk</h4>
                  <Badge variant="secondary">
                    {getNestedValue(analysis_results, ["trends", "demand_risk", "overall"], "N/A")}
                  </Badge>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                    {renderArray(
                      getNestedValue(analysis_results, ["trends", "demand_risk", "factors"], []),
                      (factor: string, idx: number) => (
                        <li key={idx}>{factor || "Unknown risk factor"}</li>
                      )
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitors">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Competitive Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Direct Competitors</h4>
                    <div className="space-y-3">
                      {renderArray(
                        getNestedValue(analysis_results, ["competitors", "direct_competitors"], []),
                        (competitor: { name: string; description: string; benchmark_score: number }, index: number) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium">{competitor?.name || "Unknown Competitor"}</h5>
                              <Badge variant="secondary">{competitor?.benchmark_score || 0}%</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{competitor?.description || "No description available"}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Competitive Advantages</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {renderArray(
                        getNestedValue(analysis_results, ["competitors", "competitive_advantages"], []),
                        (advantage: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600">
                            {advantage || "Unknown advantage"}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Market Gaps</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {renderArray(
                        getNestedValue(analysis_results, ["competitors", "market_gaps"], []),
                        (gap: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600">
                            {gap || "Unknown market gap"}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">IP Risks</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {renderArray(
                        getNestedValue(analysis_results, ["competitors", "ip_risks"], []),
                        (risk: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600">
                            {risk || "Unknown IP risk"}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Competitive Intensity</h4>
                    <p className="text-sm text-gray-600">
                      {getNestedValue(analysis_results, ["competitors", "competitive_intensity"], "No data available")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="saturation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Market Saturation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Saturation Level</h4>
                <Badge variant="secondary">
                  {getNestedValue(analysis_results, ["saturation", "saturation_score"], "N/A")}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recent Funding Trends</h4>
                <ul className="list-disc list-inside space-y-1">
                  {renderArray(
                    getNestedValue(analysis_results, ["saturation", "funding_trends"], []),
                    (trend: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600">
                        {trend || "Unknown trend"}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Top Cities</h4>
                <div className="flex flex-wrap gap-2">
                  {renderArray(
                    getNestedValue(analysis_results, ["saturation", "top_cities"], []),
                    (city: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {city || "Unknown city"}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Barriers to Entry</h4>
                <ul className="list-disc list-inside space-y-1">
                  {renderArray(
                    getNestedValue(analysis_results, ["saturation", "barriers_to_entry"], []),
                    (barrier: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600">
                        {barrier || "Unknown barrier"}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Market Maturity</h4>
                <Badge variant="secondary">
                  {getNestedValue(analysis_results, ["saturation", "market_maturity"], "N/A")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="novelty">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Innovation & Novelty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Novelty Score</h4>
                <div className="flex items-center gap-4">
                  <Progress value={getNestedValue(analysis_results, ["novelty", "novelty_score"], 0)} className="flex-1" />
                  <span className="font-medium">{getNestedValue(analysis_results, ["novelty", "novelty_score"], 0)}%</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Differentiation Factors</h4>
                <ul className="list-disc list-inside space-y-1">
                  {renderArray(
                    getNestedValue(analysis_results, ["novelty", "differentiation_factors"], []),
                    (factor: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600">
                        {factor || "Unknown factor"}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Suggested Pivots</h4>
                <div className="space-y-3">
                  {renderArray(
                    getNestedValue(analysis_results, ["novelty", "suggested_pivots"], []),
                    (pivot: { pivot: string; description: string }, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <h5 className="font-medium mb-1">{pivot?.pivot || "Unknown Pivot"}</h5>
                        <p className="text-sm text-gray-600">{pivot?.description || "No description available"}</p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Trend Alignment</h4>
                  <Badge variant="secondary">
                    {getNestedValue(analysis_results, ["novelty", "trend_alignment"], 0)}%
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Innovation Level</h4>
                  <Badge variant="secondary">
                    {getNestedValue(analysis_results, ["novelty", "innovation_level"], "N/A")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="final">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Final Report & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Market Opportunity</h4>
                  <p className="text-sm text-gray-600">
                    {getNestedValue(analysis_results, ["final_report", "market_opportunity"], "No data available")}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Risks</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {renderArray(
                      getNestedValue(analysis_results, ["final_report", "key_risks"], []),
                      (risk: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">
                          {risk || "Unknown risk"}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Recommended Strategy</h4>
                  <div className="grid gap-4">
                    {(() => {
                      const strategy = getNestedValue(analysis_results, ["final_report", "recommended_strategy"], {})
                      if (typeof strategy === "object" && strategy !== null && Object.keys(strategy).length > 0) {
                        try {
                          return Object.entries(strategy).map(([key, value]) => (
                            <div key={key} className="border rounded-lg p-3">
                              <h5 className="font-medium capitalize mb-1">{key.replace("_", " ")}</h5>
                              <p className="text-sm text-gray-600">{String(value) || "No data available"}</p>
                            </div>
                          ))
                        } catch (error) {
                          return <p className="text-sm text-gray-500">Error loading strategy data</p>
                        }
                      }
                      return <p className="text-sm text-gray-500">No strategy data available</p>
                    })()}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Potential Partners</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {renderArray(
                      getNestedValue(analysis_results, ["final_report", "potential_partners"], []),
                      (partner: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">
                          {partner || "Unknown partner"}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Investment Requirements</h4>
                  <p className="text-sm text-gray-600">
                    {getNestedValue(analysis_results, ["final_report", "investment_requirement"], "No data available")}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Timeline to Market</h4>
                  <p className="text-sm text-gray-600">
                    {getNestedValue(analysis_results, ["final_report", "timeline_to_market"], "No data available")}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Success Probability</h4>
                  <p className="text-sm text-gray-600">
                    {(() => {
                      const probability = getNestedValue(analysis_results, ["final_report", "success_probability"], "N/A")
                      if (typeof probability === "string" || typeof probability === "number") {
                        return probability
                      } else if (typeof probability === "object" && probability !== null) {
                        return (probability as any).with_recommended_strategy || 
                               (probability as any).without_niche_focus || 
                               JSON.stringify(probability)
                      }
                      return "N/A"
                    })()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
