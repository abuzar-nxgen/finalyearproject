"use client"

import { useLanguage } from "@/components/language-provider"
import { StatsCards } from "./stats-cards"
import { RecentActivities } from "./recent-activities"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardOverview() {
  const { t, isRTL } = useLanguage()

  return (
    <div className={`space-y-6 ${isRTL ? "font-arabic" : ""}`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h1>
          <p className="text-muted-foreground">{t("dashboardDescription")}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("farmInfo")}</CardTitle>
              <CardDescription>{t("owner")}: محمد احمد خان</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-sm text-muted-foreground">{t("totalLand")}:</span>
                <span className="text-sm font-medium">150 {t("acres")}</span>
              </div>
              <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-sm text-muted-foreground">{t("totalLivestock")}:</span>
                <span className="text-sm font-medium">1,248</span>
              </div>
              <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-sm text-muted-foreground">{t("established")}:</span>
                <span className="text-sm font-medium">2018</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("healthStatus")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-sm text-muted-foreground">{t("healthy")}:</span>
                <span className="text-sm font-medium text-green-600">1,220</span>
              </div>
              <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-sm text-muted-foreground">{t("underTreatment")}:</span>
                <span className="text-sm font-medium text-yellow-600">23</span>
              </div>
              <div className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-sm text-muted-foreground">{t("sick")}:</span>
                <span className="text-sm font-medium text-red-600">5</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
