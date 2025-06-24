// Base API URL - change this to your Django backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Helper function for making API requests with JWT token
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`

  // Get the JWT token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    console.log(`Making API request to: ${url}`)
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      console.log("Unauthorized request, attempting to refresh token...")
      // Try to refresh the token
      const refreshed = await refreshToken()

      if (refreshed) {
        console.log("Token refreshed, retrying request...")
        // Retry the request with the new token
        const newToken = localStorage.getItem("token")
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
            ...options.headers,
          },
        })

        if (!retryResponse.ok) {
          const error = await retryResponse.json().catch(() => ({ detail: "Unknown error" }))
          console.error("Retry request failed:", error)
          throw new Error(error.detail || "An error occurred")
        }

        return retryResponse.json()
      } else {
        console.log("Token refresh failed, redirecting to login...")
        // Redirect to login if refresh failed
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
          window.location.href = "/login"
        }
        throw new Error("Session expired. Please login again.")
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }))
      console.error("API request failed:", error)
      throw new Error(error.detail || "An error occurred")
    }

    return response.json()
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Function to refresh the token
async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken")

  if (!refreshToken) {
    return false
  }

  try {
    console.log("Attempting to refresh token...")
    const response = await fetch(`${API_URL}/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) {
      console.error("Token refresh failed:", response.status)
      return false
    }

    const data = await response.json()
    localStorage.setItem("token", data.access)
    localStorage.setItem("refreshToken", data.refresh)
    console.log("Token refreshed successfully")
    return true
  } catch (error) {
    console.error("Token refresh error:", error)
    return false
  }
}

// Mock data storage with sample data
const mockLivestock = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    owner_id: "user-123",
    tag_number: "COW001",
    animal_type: "Cattle",
    breed: "Holstein",
    gender: "Female",
    birth_date: "2022-03-15",
    weight: 450,
    status: "Healthy",
    notes: "Good Milk Producer",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    owner_id: "user-123",
    tag_number: "GOAT001",
    animal_type: "Goat",
    breed: "Boer",
    gender: "Male",
    birth_date: "2023-01-20",
    weight: 65,
    status: "Healthy",
    notes: "Breeding Male",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Initialize with sample data
const mockFeedingRecords = [
  {
    id: "feed-001",
    livestock_id: "COW001",
    livestock_tag: "COW001",
    feed_type: "hay",
    quantity: 25,
    unit: "kg",
    cost: 50,
    feeding_date: "2024-01-15",
    notes: "Morning feeding",
    created_at: "2024-01-15T08:00:00Z",
  },
]

const mockBreedingRecords = [
  {
    id: "breed-001",
    male_tag: "BULL001",
    female_tag: "COW001",
    breeding_date: "2024-01-10",
    expected_due_date: "2024-10-20",
    breeding_method: "natural",
    status: "completed",
    notes: "First breeding attempt",
    created_at: "2024-01-10T10:00:00Z",
  },
]

const mockFinancialRecords = [
  {
    id: "finance-001",
    type: "expense",
    category: "Feed",
    amount: 150.0,
    description: "Monthly feed purchase",
    date: "2024-01-15",
    livestock_tag: "COW001",
    payment_method: "cash",
    created_at: "2024-01-15T14:00:00Z",
  },
]

// Authentication API functions
export const authAPI = {
  // Login
  login: async (email: string, password: string) => {
    console.log("Attempting login with:", email)
    try {
      const response = await fetch(`${API_URL}/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Unknown error" }))
        console.error("Login failed:", error)
        throw new Error(error.detail || "Invalid credentials")
      }

      const data = await response.json()
      localStorage.setItem("token", data.access)
      localStorage.setItem("refreshToken", data.refresh)
      console.log("Login successful, tokens stored")
      return data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  // Register
  register: async (name: string, email: string, password: string, role: string) => {
    console.log("Attempting registration for:", email)
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Unknown error" }))
        console.error("Registration failed:", error)
        throw new Error(error.detail || "Registration failed")
      }

      console.log("Registration successful")
      return response.json()
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    console.log("Logged out, tokens removed")
  },

  // Get current user
  getCurrentUser: async () => {
    return fetchAPI("/users/me/")
  },

  // Get user permissions
  getUserPermissions: async () => {
    return fetchAPI("/users/permissions/")
  },
}

// Livestock API functions
export const livestockAPI = {
  async getAll(userId?: string) {
    console.log("Fetching all livestock...")
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockLivestock]
  },

  async getById(id: string) {
    console.log("Fetching livestock:", id)
    await new Promise((resolve) => setTimeout(resolve, 300))
    const livestock = mockLivestock.find((item) => item.id === id)
    if (!livestock) {
      throw new Error("Livestock not found")
    }
    return livestock
  },

  async create(data: any) {
    console.log("Creating livestock:", data)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newLivestock = {
      id: `550e8400-e29b-41d4-a716-${Date.now()}`,
      owner_id: "user-123",
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockLivestock.push(newLivestock)
    console.log("Livestock created successfully:", newLivestock)
    return newLivestock
  },

  async update(id: string, data: any) {
    console.log("Updating livestock:", id, data)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockLivestock.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error("Livestock not found")
    }
    mockLivestock[index] = { ...mockLivestock[index], ...data, updated_at: new Date().toISOString() }
    return mockLivestock[index]
  },

  async delete(id: string) {
    console.log("Deleting livestock:", id)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockLivestock.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error("Livestock not found")
    }
    mockLivestock.splice(index, 1)
    return { success: true }
  },

  async getStats(userId?: string) {
    console.log("Fetching livestock stats...")
    await new Promise((resolve) => setTimeout(resolve, 300))

    const stats = {
      total: mockLivestock.length,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      healthy: 0,
      sick: 0,
    }

    mockLivestock.forEach((item) => {
      stats.byType[item.animal_type] = (stats.byType[item.animal_type] || 0) + 1
      stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1
      if (item.status.toLowerCase() === "healthy") stats.healthy++
      if (item.status.toLowerCase() === "sick") stats.sick++
    })

    return stats
  },
}

// Feeding API functions
export const feedingAPI = {
  async getAll() {
    console.log("Fetching all feeding records...")
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockFeedingRecords]
  },

  async create(data: any) {
    console.log("Creating feeding record:", data)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newRecord = {
      id: `feed-${Date.now()}`,
      livestock_tag: data.livestock_id, // Use livestock_id as livestock_tag
      ...data,
      created_at: new Date().toISOString(),
    }

    mockFeedingRecords.push(newRecord)
    console.log("Feeding record created successfully:", newRecord)
    return newRecord
  },

  async delete(id: string) {
    console.log("Deleting feeding record:", id)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockFeedingRecords.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error("Feeding record not found")
    }
    mockFeedingRecords.splice(index, 1)
    return { success: true }
  },
}

// Breeding API functions
export const breedingAPI = {
  async getAll() {
    console.log("Fetching all breeding records...")
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockBreedingRecords]
  },

  async create(data: any) {
    console.log("Creating breeding record:", data)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newRecord = {
      id: `breed-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
    }

    mockBreedingRecords.push(newRecord)
    console.log("Breeding record created successfully:", newRecord)
    return newRecord
  },

  async delete(id: string) {
    console.log("Deleting breeding record:", id)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockBreedingRecords.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error("Breeding record not found")
    }
    mockBreedingRecords.splice(index, 1)
    return { success: true }
  },
}

// Financial API functions
export const financialAPI = {
  async getAll() {
    console.log("Fetching all financial records...")
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockFinancialRecords]
  },

  async create(data: any) {
    console.log("Creating financial record:", data)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newRecord = {
      id: `finance-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
    }

    mockFinancialRecords.push(newRecord)
    console.log("Financial record created successfully:", newRecord)
    return newRecord
  },

  async delete(id: string) {
    console.log("Deleting financial record:", id)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockFinancialRecords.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error("Financial record not found")
    }
    mockFinancialRecords.splice(index, 1)
    return { success: true }
  },
}

// Reports API functions
export const reportsAPI = {
  async generate(type: string, filters: any) {
    console.log("Generating report:", type, filters)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock report generation
    const report = {
      id: `report-${Date.now()}`,
      type,
      filters,
      generated_at: new Date().toISOString(),
      data: {
        livestock_count: mockLivestock.length,
        feeding_records: mockFeedingRecords.length,
        breeding_records: mockBreedingRecords.length,
        financial_records: mockFinancialRecords.length,
      },
    }

    return report
  },
}
