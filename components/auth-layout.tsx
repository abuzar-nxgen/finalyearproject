"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { t, direction } = useLanguage()

  // Redirect to home if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/")
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
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <h1 className="text-xl font-bold">{t("appName")}</h1>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className={`w-full max-w-md ${direction === "rtl" ? "text-right" : "text-left"}`}>{children}</div>
      </main>
      <footer className="border-t p-4 text-center text-sm text-muted-foreground">{t("footerText")}</footer>
    </div>
  )
}
