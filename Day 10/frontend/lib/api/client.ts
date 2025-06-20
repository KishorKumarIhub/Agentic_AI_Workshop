// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface ApiResponse<T> {
  success?: boolean
  data?: T
  message?: string
  error?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface IdeaValidationRequest {
  title: string
}

// Update AuthResponse to match your API format
export interface AuthResponse {
  user: {
    id: string
    username: string
    email: string
  }
  token: string
}

// Add interface for your validation response
export interface IdeaValidationResponse {
  idea: {
    user: string
    title: string
    evaluation: {
      success: boolean
      data: {
        startup_idea: string
        analysis_results: any
      }
    }
    _id: string
    createdAt: string
    __v: number
  }
}

// Interface for user ideas list response
export interface UserIdea {
  _id: string
  user: string
  title: string
  evaluation: {
    success: boolean
    data: {
      startup_idea: string
      analysis_results: any
    }
  }
  createdAt: string
  __v: number
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    // Get token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async logout(): Promise<void> {
    try {
      await this.request<void>("/auth/logout", {
        method: "POST",
      })
    } finally {
      this.clearToken()
    }
  }

  // Idea validation endpoint
  async validateIdea(userId: string, request: IdeaValidationRequest): Promise<IdeaValidationResponse> {
    return this.request<IdeaValidationResponse>(`/ideas/validate/${userId}`, {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  // Updated user ideas endpoint
  async getUserAnalyses(userId: string): Promise<UserIdea[]> {
    return this.request<UserIdea[]>(`/ideas/${userId}`)
  }

  // Get specific analysis by ID (if needed)
  async getAnalysisById(id: string): Promise<UserIdea> {
    return this.request<UserIdea>(`/ideas/analysis/${id}`)
  }

  // User profile endpoints
  async getUserProfile(): Promise<any> {
    return this.request<any>("/user/profile")
  }

  async updateUserProfile(data: any): Promise<any> {
    return this.request<any>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
