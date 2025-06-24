"use client"

import { useLanguage } from "@/components/language-provider"
import { Cloud, CloudRain, Sun, Wind } from "lucide-react"

export function WeatherForecast() {
  const { t } = useLanguage()

  const forecast = [
    {
      day: "today",
      icon: Sun,
      temp: "28°C",
      description: "sunny",
    },
    {
      day: "tomorrow",
      icon: Cloud,
      temp: "24°C",
      description: "partlyCloudy",
    },
    {
      day: "dayAfterTomorrow",
      icon: CloudRain,
      temp: "22°C",
      description: "lightRain",
    },
    {
      day: "inTwoDays",
      icon: Wind,
      temp: "23°C",
      description: "windy",
    },
    {
      day: "inThreeDays",
      icon: Sun,
      temp: "26°C",
      description: "sunny",
    },
  ]

  return (
    <div className="flex flex-wrap gap-4 justify-between">
      {forecast.map((item) => (
        <div key={item.day} className="flex flex-col items-center space-y-2 p-2">
          <p className="text-sm font-medium">{t(item.day)}</p>
          <item.icon className="h-8 w-8" />
          <p className="text-lg font-bold">{item.temp}</p>
          <p className="text-xs text-muted-foreground">{t(item.description)}</p>
        </div>
      ))}
    </div>
  )
}
