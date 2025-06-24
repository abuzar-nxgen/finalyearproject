"use client"

import { useLanguage } from "@/components/language-provider"
import { AlertTriangle } from "lucide-react"

export function HealthAlerts() {
  const { t } = useLanguage()

  const alerts = [
    {
      type: "warning",
      title: "vaccinationDue",
      description: "vaccinationDueDescription",
      color: "text-amber-500",
      doctor: "Dr. Huzaifa",
    },
    {
      type: "danger",
      title: "illnessDetected",
      description: "illnessDetectedDescription",
      color: "text-red-500",
      doctor: "Dr. Hassan",
    },
    {
      type: "warning",
      title: "weightLoss",
      description: "weightLossDescription",
      color: "text-amber-500",
      doctor: "Dr. Rauf",
    },
  ]

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <div key={index} className="flex items-start gap-4 rounded-lg border p-3">
          <AlertTriangle className={`mt-0.5 h-5 w-5 ${alert.color}`} />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{t(alert.title)}</p>
            <p className="text-xs text-muted-foreground">{t(alert.description)}</p>
            <p className="text-xs font-medium">{alert.doctor} (UVAS Lahore)</p>
          </div>
        </div>
      ))}
    </div>
  )
}
