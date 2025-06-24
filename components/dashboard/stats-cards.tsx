"use client"

import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, MilkIcon as Cow, Stethoscope, Truck, Wheat } from "lucide-react"

export function StatsCards() {
  const { t, isRTL } = useLanguage()

  const stats = [
    {
      title: t("totalLivestock"),
      value: "1,248",
      change: "+12%",
      changeType: "increase" as const,
      icon: Cow,
      description: t("fromLastMonth"),
    },
    {
      title: t("feedStock"),
      value: `24.5 ${t("tons")}`,
      change: "-8%",
      changeType: "decrease" as const,
      icon: Wheat,
      description: t("fromLastMonth"),
    },
    {
      title: t("healthStatus"),
      value: "97.8%",
      change: "+2.1%",
      changeType: "increase" as const,
      icon: Stethoscope,
      description: t("healthy"),
    },
    {
      title: t("transportReady"),
      value: "89",
      change: "+10%",
      changeType: "increase" as const,
      icon: Truck,
      description: t("fromLastWeek"),
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`${isRTL ? "text-right" : "text-left"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={`inline-flex items-center ${
                  stat.changeType === "increase" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.changeType === "increase" ? (
                  <ArrowUp className={`h-3 w-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                ) : (
                  <ArrowDown className={`h-3 w-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                )}
                {stat.change}
              </span>{" "}
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
