"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/components/language-provider"
import { Logo } from "@/components/ui/logo"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { t, direction } = useLanguage()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="auth-background flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-white/80 p-4 backdrop-blur-sm">
        <Logo />
        <LanguageSwitcher />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div
          className={`w-full max-w-md rounded-lg border bg-white/90 p-6 shadow-lg backdrop-blur-sm ${direction === "rtl" ? "text-right" : "text-left"}`}
        >
          {children}
        </div>
      </main>
      <footer className="border-t bg-white/80 p-4 text-center text-sm text-muted-foreground backdrop-blur-sm">
        <div className="container mx-auto">
          <p>{t("footerText")} | EZ Farming | Contact: 3227064186</p>
        </div>
      </footer>
    </div>
  )
}
