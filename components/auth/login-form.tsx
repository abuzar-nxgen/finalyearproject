"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email Is Required")
      return false
    }
    if (!formData.password) {
      setError("Password Is Required")
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please Enter A Valid Email Address")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      console.log("Submitting login form with email:", formData.email)

      // Call the login function from auth provider
      await login(formData.email, formData.password)

      console.log("Login successful, should redirect to dashboard")
      // The login function handles the redirect to dashboard
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Login Failed. Please Check Your Credentials.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormLoading = isLoading || isSubmitting

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-green-700 p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-green-800">EZ Farming</CardTitle>
          <CardDescription className="text-green-600">Sign In To Your Account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Your Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isFormLoading}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Your Password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isFormLoading}
                className="w-full"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isFormLoading}
            >
              {isFormLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <Link href="/forgot-password" className="text-green-600 hover:text-green-500 hover:underline">
              Forgot Your Password?
            </Link>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't Have An Account?{" "}
            <Link href="/signup" className="font-medium text-green-600 hover:text-green-500 hover:underline">
              Create Account
            </Link>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Test Accounts:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Admin: admin@example.com / admin123</div>
              <div>User: user@example.com / user123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
