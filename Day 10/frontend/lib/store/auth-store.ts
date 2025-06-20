import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthState, User } from "@/lib/types"
import { apiClient } from "@/lib/api/client"

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await apiClient.login({ email, password })

          if (response && response.token && response.user) {
            const { user, token } = response

            // Set token in API client
            apiClient.setToken(token)

            // Convert API user format to our User type
            const userData: User = {
              id: user.id,
              username: user.username,
              email: user.email,
              password: "", // Don't store password
              createdAt: new Date(), // API doesn't return createdAt, so use current date
            }

            set({ user: userData, isAuthenticated: true })
            return true
          }

          return false
        } catch (error) {
          console.error("Login error:", error)
          return false
        }
      },

      register: async (username: string, email: string, password: string) => {
        try {
          const response = await apiClient.register({ username, email, password })

          if (response && response.token && response.user) {
            const { user, token } = response

            // Set token in API client
            apiClient.setToken(token)

            // Convert API user format to our User type
            const userData: User = {
              id: user.id,
              username: user.username,
              email: user.email,
              password: "", // Don't store password
              createdAt: new Date(), // API doesn't return createdAt, so use current date
            }

            set({ user: userData, isAuthenticated: true })
            return true
          }

          return false
        } catch (error) {
          console.error("Registration error:", error)
          return false
        }
      },

      logout: async () => {
        try {
          await apiClient.logout()
        } catch (error) {
          console.error("Logout error:", error)
        } finally {
          // Clear local state regardless of API call success
          apiClient.clearToken()
          set({ user: null, isAuthenticated: false })
        }
      },
    }),
    {
      name: "auth-storage",
      // Only persist user data, not sensitive information
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
