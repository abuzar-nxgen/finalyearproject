"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations } from "@/lib/translations"

type Language = "en" | "ur"
type Direction = "ltr" | "rtl"

interface LanguageContextType {
  language: Language
  direction: Direction
  t: (key: string, params?: Record<string, string | number>) => string
  changeLanguage: (lang: Language) => void
  isRTL: boolean
}

const defaultContextValue: LanguageContextType = {
  language: "en",
  direction: "ltr",
  t: (key) => key,
  changeLanguage: () => {},
  isRTL: false,
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [direction, setDirection] = useState<Direction>("ltr")

  // Function to translate text based on current language
  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!translations || !translations[language]) {
      return key
    }

    let text = translations[language][key as keyof typeof translations.en] || key

    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{{${paramKey}}}`, String(paramValue))
      })
    }

    return text
  }

  // Function to change language
  const changeLanguage = (lang: Language) => {
    setLanguage(lang)

    // Only set localStorage on the client
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
    }

    // Set direction based on language
    const newDirection = lang === "ur" ? "rtl" : "ltr"
    setDirection(newDirection)

    if (typeof document !== "undefined") {
      document.documentElement.dir = newDirection
      document.documentElement.lang = lang

      // Add RTL class to body for additional styling
      if (lang === "ur") {
        document.body.classList.add("rtl")
        document.body.classList.remove("ltr")
      } else {
        document.body.classList.add("ltr")
        document.body.classList.remove("rtl")
      }
    }
  }

  // Initialize language from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language | null
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ur")) {
        changeLanguage(savedLanguage)
      }
    }
  }, [])

  const contextValue = {
    language,
    direction,
    t,
    changeLanguage,
    isRTL: direction === "rtl",
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      <div dir={direction} className={`min-h-screen ${direction === "rtl" ? "font-arabic" : ""}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export function useTranslation() {
  const { t } = useContext(LanguageContext)
  return { t }
}
