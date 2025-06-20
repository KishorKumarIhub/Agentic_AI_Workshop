import { create } from "zustand"
import type { IdeaState, IdeaAnalysis } from "@/lib/types"
import { apiClient, type UserIdea } from "@/lib/api/client"
import { useAuthStore } from "./auth-store"

export const useIdeaStore = create<IdeaState>((set, get) => ({
  analyses: [],
  currentAnalysis: null,
  isLoading: false,

  submitIdea: async (idea: string) => {
    set({ isLoading: true })

    try {
      // Get current user from auth store
      const user = useAuthStore.getState().user
      if (!user) {
        throw new Error("User not authenticated")
      }

      const response = await apiClient.validateIdea(user.id, { title: idea })

      if (response && response.idea && response.idea.evaluation.success) {
        const { idea: ideaData } = response
        const analysisData = ideaData.evaluation.data

        // Create new analysis object matching our IdeaAnalysis interface
        const newAnalysis: IdeaAnalysis = {
          id: ideaData._id,
          userId: ideaData.user,
          startup_idea: analysisData.startup_idea,
          analysis_results: analysisData.analysis_results,
          createdAt: new Date(ideaData.createdAt),
        }

        set((state) => ({
          analyses: [newAnalysis, ...state.analyses],
          currentAnalysis: newAnalysis,
          isLoading: false,
        }))
      } else {
        throw new Error("Failed to validate idea")
      }
    } catch (error) {
      set({ isLoading: false })
      console.error("Submit idea error:", error)
      throw error
    }
  },

  setCurrentAnalysis: (analysis: IdeaAnalysis | null) => {
    set({ currentAnalysis: analysis })
  },

  fetchUserAnalyses: async () => {
    try {
      const user = useAuthStore.getState().user
      if (!user) {
        console.error("No authenticated user found")
        return
      }

      const response = await apiClient.getUserAnalyses(user.id)

      if (response && Array.isArray(response)) {
        const analyses: IdeaAnalysis[] = response.map((item: UserIdea) => ({
          id: item._id,
          userId: item.user,
          startup_idea: item.evaluation.data.startup_idea,
          analysis_results: item.evaluation.data.analysis_results,
          createdAt: new Date(item.createdAt),
        }))

        set({ analyses })
      }
    } catch (error) {
      console.error("Fetch analyses error:", error)
    }
  },

  fetchAnalysisById: async (id: string) => {
    try {
      const response = await apiClient.getAnalysisById(id)

      if (response) {
        const analysis: IdeaAnalysis = {
          id: response._id,
          userId: response.user,
          startup_idea: response.evaluation.data.startup_idea,
          analysis_results: response.evaluation.data.analysis_results,
          createdAt: new Date(response.createdAt),
        }

        set({ currentAnalysis: analysis })
        return analysis
      }
    } catch (error) {
      console.error("Fetch analysis by ID error:", error)
      throw error
    }
  },
}))
