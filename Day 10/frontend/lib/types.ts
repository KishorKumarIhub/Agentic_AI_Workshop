export interface User {
  id: string
  username: string
  email: string
  password: string
  createdAt: Date
}

export interface IdeaAnalysis {
  _id: string
  user: string
  title: string
  evaluation: {
    analysis_results: {
      trends: {
        search_volume: {
          overall: string
          keywords: Array<{
            keyword: string
            volume: string
          }>
        }
        growth_rate: {
          overall: string
          factors: string[]
        }
        top_regions: string[]
        related_terms: string[]
        demand_risk: {
          overall: string
          factors: string[]
        }
        market_potential: {
          overall: string
          segments: Array<{
            segment: string
            potential: string
          }>
          notes: string
        }
      }
      competitors: {
        direct_competitors: Array<{
          name: string
          description: string
          benchmark_score: number
        }>
        competitive_advantages: string[]
        market_gaps: string[]
        ip_risks: string[]
        benchmark_score: number
        competitive_intensity: string
      }
      saturation: {
        saturation_score: string
        funding_trends: string[]
        top_cities: string[]
        barriers_to_entry: string[]
        market_maturity: string
      }
      novelty: {
        novelty_score: number
        differentiation_factors: string[]
        trend_alignment: number
        suggested_pivots: Array<{
          pivot: string
          description: string
        }>
        innovation_level: string
      }
      final_report: {
        viability_score: number
        market_opportunity: string
        key_risks: string[]
        recommended_strategy: {
          niche_focus: string
          unique_value_proposition: string
          strategic_partnerships: string
          affordable_pricing: string
          strong_marketing: string
          technology_scalability: string
          regulatory_compliance: string
        }
        potential_partners: string[]
        investment_requirement: string
        timeline_to_market: string
        success_probability: string | number | object
      }
    }
  }
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

export interface IdeaState {
  analyses: IdeaAnalysis[]
  currentAnalysis: IdeaAnalysis | null
  isLoading: boolean
  submitIdea: (idea: string) => Promise<void>
  setCurrentAnalysis: (analysis: IdeaAnalysis | null) => void
  fetchUserAnalyses: () => Promise<void>
  fetchAnalysisById: (id: string) => Promise<IdeaAnalysis | undefined>
}
