"use client"

import { useLanguage } from "@/components/language-provider"

export function Logo() {
  const { t } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
        <span className="flex h-full w-full items-center justify-center text-white font-bold">EZ</span>
      </div>
      <h1 className="text-xl font-bold text-primary">{t("appName")}</h1>
    </div>
  )
}
