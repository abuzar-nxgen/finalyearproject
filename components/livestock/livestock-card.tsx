"use client"
import { useLanguage } from "@/components/language-provider"
import { MilkIcon as Cow, Rabbit, WheatIcon as Sheep } from "lucide-react"

interface LivestockCardProps {
  type: "cattle" | "sheep" | "goat"
  count: number
  healthStatus: {
    healthy: number
    sick: number
    treatment: number
  }
  recentAdditions: number
}

export function LivestockCard({ type, count, healthStatus, recentAdditions }: LivestockCardProps) {
  const { t } = useLanguage()

  // Organized translations
  const translations = {
    types: {
      cattle: t("گائے"),
      sheep: t("بھیڑ"),
      goat: t("بکری")
    },
    status: {
      total: t("کل"),
      healthy: t("صحت مند"),
      sick: t("بیمار"),
      treatment: t("علاج میں"),
      recent: t("حالیہ اضافے")
    }
  }

  const getBackgroundClass = () => {
    return `livestock-card ${type}-card`
  }

  const getIcon = () => {
    switch (type) {
      case "cattle":
        return <Cow className="h-8 w-8 text-green-600" />
      case "sheep":
        return <Sheep className="h-8 w-8 text-blue-600" />
      case "goat":
        return <Rabbit className="h-8 w-8 text-amber-600" />
      default:
        return <Cow className="h-8 w-8 text-green-600" />
    }
  }

  return (
    <div className={`${getBackgroundClass()} rounded-lg border p-4 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{translations.types[type]}</h3>
          <p className="text-2xl font-bold">{count}</p>
          <p className="text-sm text-muted-foreground">{translations.status.total}</p>
        </div>
        {getIcon()}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm font-medium">{healthStatus.healthy}</p>
          <p className="text-xs text-muted-foreground">{translations.status.healthy}</p>
        </div>
        <div>
          <p className="text-sm font-medium">{healthStatus.sick}</p>
          <p className="text-xs text-muted-foreground">{translations.status.sick}</p>
        </div>
        <div>
          <p className="text-sm font-medium">{healthStatus.treatment}</p>
          <p className="text-xs text-muted-foreground">{translations.status.treatment}</p>
        </div>
        <div>
          <p className="text-sm font-medium">{recentAdditions}</p>
          <p className="text-xs text-muted-foreground">{translations.status.recent}</p>
        </div>
      </div>
    </div>
  )
}