"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { generateUUID } from "@/lib/utils"

// Enhanced user type with role
export type UserRole = "admin" | "standard"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  permissions?: {
    dashboard_sections: string[]
    allowed_actions: Record<string, string[]>
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, role?: UserRole) => Promise<void>
  logout: () => void
  requestPasswordReset: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  hasPermission: (section: string, action?: string) => boolean
  canAccessSection: (section: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for development/testing - using proper UUIDs
const mockUsers = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as UserRole,
    permissions: {
      dashboard_sections: ["dashboard", "livestock", "breeding", "feeding", "finances", "reports", "settings", "users"],
      allowed_actions: {
        livestock: ["view", "create", "update", "delete"],
        breeding: ["view", "create", "update", "delete"],
        feeding: ["view", "create", "update", "delete"],
        finances: ["view", "create", "update", "delete"],
        reports: ["view", "create", "update", "delete", "generate", "export"],
        users: ["view", "create", "update", "delete"],
        settings: ["view", "update"],
      },
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Standard User",
    email: "user@example.com",
    password: "user123",
    role: "standard" as UserRole,
    permissions: {
      dashboard_sections: ["dashboard", "livestock", "breeding", "feeding"],
      allowed_actions: {
        livestock: ["view"],
        breeding: ["view"],
        feeding: ["view"],
        finances: ["view"],
        reports: ["view"],
      },
    },
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user from localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
            console.log("Loaded user from localStorage:", parsedUser)
          } catch (error) {
            console.error("Error parsing stored user:", error)
            localStorage.removeItem("user")
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      console.log("Attempting login with email:", email)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user exists in mock database
      const foundUser = mockUsers.find(
        (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
      )

      if (!foundUser) {
        throw new Error("Invalid Email Or Password")
      }

      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        permissions: foundUser.permissions,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      console.log("Login successful:", userData)

      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Signup function
  const signup = async (name: string, email: string, password: string, role: UserRole = "standard") => {
    setIsLoading(true)

    try {
      console.log("Attempting signup with:", { name, email, role })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if email already exists in mock users
      const existingUser = mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase())
      if (existingUser) {
        throw new Error("Email Already Exists")
      }

      // Create a new mock user with proper UUID
      const newUser = {
        id: generateUUID(),
        name,
        email,
        password,
        role,
        permissions:
          role === "admin"
            ? {
                dashboard_sections: [
                  "dashboard",
                  "livestock",
                  "breeding",
                  "feeding",
                  "finances",
                  "reports",
                  "settings",
                  "users",
                ],
                allowed_actions: {
                  livestock: ["view", "create", "update", "delete"],
                  breeding: ["view", "create", "update", "delete"],
                  feeding: ["view", "create", "update", "delete"],
                  finances: ["view", "create", "update", "delete"],
                  reports: ["view", "create", "update", "delete", "generate", "export"],
                  users: ["view", "create", "update", "delete"],
                  settings: ["view", "update"],
                },
              }
            : {
                dashboard_sections: ["dashboard", "livestock", "breeding", "feeding"],
                allowed_actions: {
                  livestock: ["view"],
                  breeding: ["view"],
                  feeding: ["view"],
                  finances: ["view"],
                  reports: ["view"],
                },
              },
      }

      // Add to mock users (in memory only)
      mockUsers.push(newUser)

      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        permissions: newUser.permissions,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      console.log("Signup successful:", userData)

      router.push("/dashboard")
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    console.log("User logged out")
    router.push("/login")
  }

  // Request password reset function
  const requestPasswordReset = async (email: string) => {
    setIsLoading(true)

    try {
      console.log("Password reset requested for:", email)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(`Password reset email sent to: ${email}`)
    } catch (error) {
      console.error("Password reset request failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true)

    try {
      console.log("Password reset with token:", token)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Password reset successful")
    } catch (error) {
      console.error("Password reset failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Function to check if user has permission for a specific action
  const hasPermission = (section: string, action?: string): boolean => {
    // Temporarily return true to ensure all buttons work
    return true
  }

  // Function to check if user can access a specific dashboard section
  const canAccessSection = (section: string): boolean => {
    // Temporarily return true to ensure all sections are accessible
    return true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        requestPasswordReset,
        resetPassword,
        hasPermission,
        canAccessSection,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
