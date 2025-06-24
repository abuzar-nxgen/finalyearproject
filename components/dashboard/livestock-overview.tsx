"use client"
import { LivestockCard } from "@/components/livestock/livestock-card"
import { useLanguage } from "@/components/language-provider"

export function LivestockOverview() {
  const { t } = useLanguage()

  const livestockData = {
    cattle: {
      count: 120,
      healthStatus: {
        healthy: 105,
        sick: 8,
        treatment: 7,
      },
      recentAdditions: 5,
    },
    sheep: {
      count: 250,
      healthStatus: {
        healthy: 235,
        sick: 10,
        treatment: 5,
      },
      recentAdditions: 15,
    },
    goat: {
      count: 180,
      healthStatus: {
        healthy: 165,
        sick: 8,
        treatment: 7,
      },
      recentAdditions: 12,
    },
    camel: {
      count: 25,
      healthStatus: {
        healthy: 23,
        sick: 1,
        treatment: 1,
      },
      recentAdditions: 2,
    },
    horse: {
      count: 15,
      healthStatus: {
        healthy: 14,
        sick: 0,
        treatment: 1,
      },
      recentAdditions: 0,
    },
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">{t("livestockOverview")}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <LivestockCard
          type="cattle"
          count={livestockData.cattle.count}
          healthStatus={livestockData.cattle.healthStatus}
          recentAdditions={livestockData.cattle.recentAdditions}
        />
        <LivestockCard
          type="sheep"
          count={livestockData.sheep.count}
          healthStatus={livestockData.sheep.healthStatus}
          recentAdditions={livestockData.sheep.recentAdditions}
        />
        <LivestockCard
          type="goat"
          count={livestockData.goat.count}
          healthStatus={livestockData.goat.healthStatus}
          recentAdditions={livestockData.goat.recentAdditions}
        />
        <LivestockCard
          type="camel"
          count={livestockData.camel.count}
          healthStatus={livestockData.camel.healthStatus}
          recentAdditions={livestockData.camel.recentAdditions}
        />
        <LivestockCard
          type="horse"
          count={livestockData.horse.count}
          healthStatus={livestockData.horse.healthStatus}
          recentAdditions={livestockData.horse.recentAdditions}
        />
      </div>
    </div>
  )
}
