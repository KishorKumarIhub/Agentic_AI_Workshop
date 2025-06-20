export interface User {
  id: string
  username: string
  email: string
  password: string
  createdAt: Date
}

export interface IdeaAnalysis {
  id: string
  userId: string
  startup_idea: string
  analysis_results: {
    trends: {
      search_volume: {
        keywords: string[]
        level: string
        notes: string
      }
      growth_rate: {
        rate: string
        notes: string
      }
      top_regions: string[]
      related_terms: string[]
      demand_risk: {
        level: string
        factors: string[]
      }
      market_potential: {
        level: string
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
      trend_alignment: string
      suggested_pivots: string[]
      innovation_level: string
    }
    final_report: {
      viability_score: number
      market_opportunity: string
      key_risks: string[]
      recommended_strategy: {
        market_segmentation: string
        product_differentiation: string
        pricing_strategy: string
        marketing_and_sales: string
        customer_support: string
        technology_stack: string
      }
      potential_partners: string[]
      investment_requirement: {
        seed_funding: string
        series_a: string
      }
      timeline_to_market: {
        mvp: string
        full_product_launch: string
      }
      success_probability: string
    }
  }
  createdAt: Date
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
