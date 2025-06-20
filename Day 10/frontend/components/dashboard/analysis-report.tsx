"use client"

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
  const { analysis_results } = analysis

 

  return (
    <div className="space-y-6 text-lg">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Analysis Report
          </CardTitle>
          <CardDescription>Comprehensive analysis for: {analysis.startup_idea}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analysis_results.final_report.viability_score}%</div>
              <div className="text-sm text-gray-600">Viability Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analysis_results.novelty.novelty_score}%</div>
              <div className="text-sm text-gray-600">Novelty Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analysis_results.competitors.benchmark_score}%</div>
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
                  <Badge variant="secondary">{analysis_results.trends.search_volume.level}</Badge>
                  <p className="text-sm text-gray-600 mt-2">{analysis_results.trends.search_volume.notes}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Array.isArray(analysis_results.trends.search_volume.keywords) && analysis_results.trends.search_volume.keywords.map((item: any, index: number) => (
                      <Badge key={index} variant="outline">
                        {typeof item === "string"
                          ? item
                          : typeof item === "object" && item !== null && "keyword" in item
                            ? `${item.keyword}${item.volume ? ` (${item.volume})` : ""}`
                            : JSON.stringify(item)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Growth Rate</h4>
                  <Badge variant="secondary">{analysis_results.trends.growth_rate.rate}</Badge>
                  <p className="text-sm text-gray-600 mt-2">{analysis_results.trends.growth_rate.notes}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Top Regions</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis_results.trends.top_regions.map((region, index) => (
                      <Badge key={index} variant="outline">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Market Potential</h4>
                  <Badge variant="secondary">{analysis_results.trends.market_potential.level}</Badge>
                  <p className="text-sm text-gray-600 mt-2">{analysis_results.trends.market_potential.notes}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Demand Risk</h4>
                  <Badge variant="secondary">{analysis_results.trends.demand_risk.level}</Badge>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                    {analysis_results.trends.demand_risk.factors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
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
                      {analysis_results.competitors.direct_competitors.map((competitor, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium">{competitor.name}</h5>
                            <Badge variant="secondary">{competitor.benchmark_score}%</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{competitor.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Competitive Advantages</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis_results.competitors.competitive_advantages.map((advantage, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Market Gaps</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis_results.competitors.market_gaps.map((gap, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {gap}
                        </li>
                      ))}
                    </ul>
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
                <Badge variant="secondary">{analysis_results.saturation.saturation_score}</Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recent Funding Trends</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis_results.saturation.funding_trends.map((trend, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {trend}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Top Cities</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis_results.saturation.top_cities.map((city, index) => (
                    <Badge key={index} variant="outline">
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Barriers to Entry</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis_results.saturation.barriers_to_entry.map((barrier, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {barrier}
                    </li>
                  ))}
                </ul>
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
                  <Progress value={analysis_results.novelty.novelty_score} className="flex-1" />
                  <span className="font-medium">{analysis_results.novelty.novelty_score}%</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Differentiation Factors</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis_results.novelty.differentiation_factors.map((factor, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Suggested Pivots</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis_results.novelty.suggested_pivots.map((pivot, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {pivot}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Trend Alignment</h4>
                  <Badge variant="secondary">{analysis_results.novelty.trend_alignment}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Innovation Level</h4>
                  <Badge variant="secondary">{analysis_results.novelty.innovation_level}</Badge>
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
                  <p className="text-sm text-gray-600">{analysis_results.final_report.market_opportunity}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Risks</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis_results.final_report.key_risks.map((risk, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Recommended Strategy</h4>
                  <div className="grid gap-4">
                    {Object.entries(analysis_results.final_report.recommended_strategy).map(([key, value]) => (
                      <div key={key} className="border rounded-lg p-3">
                        <h5 className="font-medium capitalize mb-1">{key.replace("_", " ")}</h5>
                        <p className="text-sm text-gray-600">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Investment Requirements</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium">Seed Funding</h5>
                      <p className="text-sm text-gray-600">
                        {analysis_results.final_report.investment_requirement.seed_funding}
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium">Series A</h5>
                      <p className="text-sm text-gray-600">
                        {analysis_results.final_report.investment_requirement.series_a}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Timeline to Market</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium">MVP</h5>
                      <p className="text-sm text-gray-600">{analysis_results.final_report.timeline_to_market.mvp}</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium">Full Product Launch</h5>
                      <p className="text-sm text-gray-600">
                        {analysis_results.final_report.timeline_to_market.full_product_launch}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Success Probability</h4>
                  <p className="text-sm text-gray-600">
                    {typeof analysis_results.final_report.success_probability === "string" || typeof analysis_results.final_report.success_probability === "number"
                      ? analysis_results.final_report.success_probability
                      : typeof analysis_results.final_report.success_probability === "object" && analysis_results.final_report.success_probability !== null
                        ? (analysis_results.final_report.success_probability as any).with_recommended_strategy || (analysis_results.final_report.success_probability as any).without_niche_focus || JSON.stringify(analysis_results.final_report.success_probability)
                        : "N/A"}
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
