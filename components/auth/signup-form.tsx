"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "standard" as "admin" | "standard",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signup, isLoading } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name Is Required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email Is Required")
      return false
    }
    if (!formData.password) {
      setError("Password Is Required")
      return false
    }
    if (!formData.confirmPassword) {
      setError("Please Confirm Your Password")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords Do Not Match")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password Must Be At Least 6 Characters Long")
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
      console.log("Submitting signup form with data:", {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      })

      // Call the signup function from auth provider
      await signup(formData.name, formData.email, formData.password, formData.role)

      console.log("Signup successful, should redirect to dashboard")
      // The signup function handles the redirect to dashboard
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message || "Signup Failed. Please Try Again.")
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
          <CardDescription className="text-green-600">Create Your Account To Get Started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter Your Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isFormLoading}
                className="w-full"
                required
              />
            </div>

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
                placeholder="Create A Strong Password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isFormLoading}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Your Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                disabled={isFormLoading}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Account Type
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
                disabled={isFormLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Your Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex flex-col">
                      <span className="font-medium">Admin</span>
                      <span className="text-xs text-gray-500">Full Access To All Features</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="standard">
                    <div className="flex flex-col">
                      <span className="font-medium">Standard User</span>
                      <span className="text-xs text-gray-500">Basic Access To Core Features</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isFormLoading}
            >
              {isFormLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already Have An Account?{" "}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500 hover:underline">
              Sign In Here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
