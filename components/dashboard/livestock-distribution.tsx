"use client"

import { useLanguage } from "@/components/language-provider"
import { Progress } from "@/components/ui/progress"

export function LivestockDistribution() {
  const { t } = useLanguage()

  const distribution = [
    { type: "cattle", percentage: 60, color: "bg-green-500" },
    { type: "sheep", percentage: 15, color: "bg-blue-500" },
    { type: "goats", percentage: 10, color: "bg-amber-500" },
    { type: "horses", percentage: 10, color: "bg-purple-500" },
    { type: "camels", percentage: 5, color: "bg-orange-500" },
  ]

  return (
    <div className="space-y-4">
      {distribution.map((item) => (
        <div key={item.type} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <span className={`h-3 w-3 rounded-full ${item.color} mr-2`}></span>
              <span>{t(item.type)}</span>
            </div>
            <span className="font-medium">{item.percentage}%</span>
          </div>
          <Progress value={item.percentage} className="h-2" />
        </div>
      ))}
    </div>
  )
}
