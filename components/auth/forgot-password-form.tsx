"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setEmailSent(true)
      toast({
        title: t("resetLinkSent"),
        description: t("checkEmail"),
      })
    }, 1000)
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">EZ Farming</h1>
        <p className="text-sm text-gray-300">{t("resetPassword")}</p>
      </div>
      <div className="mt-8">
        {!emailSent ? (
          <form onSubmit={onSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  {t("email")}
                </Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? t("sending") : t("sendResetLink")}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg bg-gray-800 p-4 text-sm text-gray-300">{t("resetLinkSentDescription")}</div>
            <Button className="w-full" variant="outline" onClick={() => setEmailSent(false)}>
              {t("tryAgain")}
            </Button>
          </div>
        )}
        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            &larr; {t("backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  )
}
