"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LivestockTable } from "@/components/livestock/livestock-table"
import { LivestockForm } from "@/components/livestock/livestock-form"
import { useApiData } from "@/hooks/use-api-data"
import { livestockAPI } from "@/services/api"
import { Plus, Search } from "lucide-react"

export function LivestockInventory() {
  const { t } = useLanguage()
  const [isAddingLivestock, setIsAddingLivestock] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Organized translations
  const translations = {
    header: {
      title: t("مویشیوں کا انوینٹری"),
      description: t("اپنے مویشیوں کے ریکارڈز کا نظم کریں")
    },
    buttons: {
      addLivestock: t("مویشی شامل کریں")
    },
    search: {
      placeholder: t("مویشی تلاش کریں...")
    },
    filters: {
      type: {
        label: t("قسم کے لحاظ سے فلٹر کریں"),
        all: t("تمام اقسام"),
        cattle: t("گائے"),
        sheep: t("بھیڑ"),
        goat: t("بکری"),
        horse: t("گھوڑا"),
        pig: t("سور"),
        chicken: t("مرغی")
      },
      status: {
        label: t("حالت کے لحاظ سے فلٹر کریں"),
        all: t("تمام حالتیں"),
        healthy: t("صحت مند"),
        sick: t("بیمار"),
        pregnant: t("حاملہ"),
        lactating: t("دودھ دینے والی"),
        sold: t("فروخت شدہ")
      }
    },
    form: {
      title: t("نیا مویشی شامل کریں"),
      description: t("نئے مویشی کی تفصیلات درج کریں")
    },
    table: {
      title: t("مویشیوں کے ریکارڈز"),
      description: t("اپنے مویشیوں کی انوینٹری دیکھیں اور منظم کریں")
    }
  }

  // Fetch livestock data
  const {
    data: livestock,
    isLoading,
    error,
    refresh,
  } = useApiData(() => livestockAPI.getAll(), {
    initialData: [],
    onError: (err) => {
      console.error("Failed to fetch livestock:", err)
    },
  })

  const handleAddSuccess = () => {
    setIsAddingLivestock(false)
    refresh() // Refresh the data after adding
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{translations.header.title}</h1>
          <p className="text-muted-foreground">{translations.header.description}</p>
        </div>
        <Button onClick={() => setIsAddingLivestock(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {translations.buttons.addLivestock}
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={translations.search.placeholder}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={translations.filters.type.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{translations.filters.type.all}</SelectItem>
            <SelectItem value="Cattle">{translations.filters.type.cattle}</SelectItem>
            <SelectItem value="Sheep">{translations.filters.type.sheep}</SelectItem>
            <SelectItem value="Goat">{translations.filters.type.goat}</SelectItem>
            <SelectItem value="Horse">{translations.filters.type.horse}</SelectItem>
            <SelectItem value="Pig">{translations.filters.type.pig}</SelectItem>
            <SelectItem value="Chicken">{translations.filters.type.chicken}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={translations.filters.status.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{translations.filters.status.all}</SelectItem>
            <SelectItem value="Healthy">{translations.filters.status.healthy}</SelectItem>
            <SelectItem value="Sick">{translations.filters.status.sick}</SelectItem>
            <SelectItem value="Pregnant">{translations.filters.status.pregnant}</SelectItem>
            <SelectItem value="Lactating">{translations.filters.status.lactating}</SelectItem>
            <SelectItem value="Sold">{translations.filters.status.sold}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add Livestock Form */}
      {isAddingLivestock && (
        <Card>
          <CardHeader>
            <CardTitle>{translations.form.title}</CardTitle>
            <CardDescription>{translations.form.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <LivestockForm onCancel={() => setIsAddingLivestock(false)} onSuccess={handleAddSuccess} />
          </CardContent>
        </Card>
      )}

      {/* Livestock Table */}
      <Card>
        <CardHeader>
          <CardTitle>{translations.table.title}</CardTitle>
          <CardDescription>{translations.table.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <LivestockTable
            data={livestock || []}
            isLoading={isLoading}
            error={error}
            searchTerm={searchTerm}
            filterType={filterType}
            filterStatus={filterStatus}
            onRefresh={refresh}
          />
        </CardContent>
      </Card>
    </div>
  )
}