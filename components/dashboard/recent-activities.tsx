"use client"

import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, AlertCircle, Info, Calendar } from "lucide-react"

export function RecentActivities() {
  const { t, isRTL } = useLanguage()

  const activities = [
    {
      id: 1,
      title: t("vaccinationCompleted"),
      time: "2 " + t("hoursAgo"),
      type: "success" as const,
      icon: CheckCircle,
    },
    {
      id: 2,
      title: t("movedSheep"),
      time: "4 " + t("hoursAgo"),
      type: "info" as const,
      icon: Info,
    },
    {
      id: 3,
      title: t("newCalfBorn"),
      time: "6 " + t("hoursAgo"),
      type: "success" as const,
      icon: CheckCircle,
    },
    {
      id: 4,
      title: t("completedInspection"),
      time: t("yesterday"),
      type: "info" as const,
      icon: Info,
    },
    {
      id: 5,
      title: t("scheduledHealthChecks"),
      time: t("yesterday"),
      type: "warning" as const,
      icon: AlertCircle,
    },
    {
      id: 6,
      title: t("feedDeliveryScheduled"),
      time: "2 " + t("daysAgo"),
      type: "info" as const,
      icon: Calendar,
    },
  ]

  const getActivityColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    }
  }

  return (
    <Card className={`${isRTL ? "text-right" : "text-left"}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t("recentActivities")}
        </CardTitle>
        <CardDescription>{t("recentActivitiesDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`flex-shrink-0 ${getActivityColor(activity.type)} p-1 rounded-full`}>
                <activity.icon className="h-3 w-3" />
              </div>
              <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : "text-left"}`}>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{activity.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
