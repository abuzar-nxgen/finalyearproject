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
}

// Create a default context value
const defaultContextValue: LanguageContextType = {
  language: "en",
  direction: "ltr",
  t: (key) => key,
  changeLanguage: () => {},
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [direction, setDirection] = useState<Direction>("ltr")

  // Function to translate text based on current language
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Check if translations and the language key exist
    if (!translations || !translations[language]) {
      return key
    }

    let text =
      (translations[language] as Record<string, string>)[key] || key

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
    if (lang === "ur") {
      setDirection("rtl")
      if (typeof document !== "undefined") {
        document.documentElement.dir = "rtl"
      }
    } else {
      setDirection("ltr")
      if (typeof document !== "undefined") {
        document.documentElement.dir = "ltr"
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
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      <div dir={direction} className="min-h-screen">
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export function useTranslation() {
  const { t } = useContext(LanguageContext)
  return { t }
}
