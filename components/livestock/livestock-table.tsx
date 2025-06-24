"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { livestockAPI } from "@/services/api"
import { Loader2, Edit, Trash2, Eye } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface LivestockTableProps {
  data: any[]
  isLoading: boolean
  error: any
  searchTerm: string
  filterType: string
  filterStatus: string
  onRefresh: () => void
}

export function LivestockTable({
  data,
  isLoading,
  error,
  searchTerm,
  filterType,
  filterStatus,
  onRefresh,
}: LivestockTableProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Organized translations
  const translations = {
    tableHeaders: {
      tagNumber: t("ٹیگ نمبر"),
      type: t("قسم"),
      breed: t("نسل"),
      gender: t("جنس"),
      birthDate: t("تاریخ پیدائش"),
      weight: t("وزن (کلوگرام)"),
      status: t("حالت"),
      actions: t("اعمال")
    },
    status: {
      healthy: t("صحت مند"),
      sick: t("بیمار"),
      pregnant: t("حاملہ"),
      lactating: t("دودھ دینے والی"),
      sold: t("فروخت شدہ")
    },
    messages: {
      deleteConfirm: t("کیا آپ واقعی یہ مویشی ریکارڈ حذف کرنا چاہتے ہیں؟"),
      deleteSuccess: t("مویشی ریکارڈ کامیابی سے حذف ہو گیا"),
      deleteError: t("مویشی ریکارڈ حذف کرنے میں ناکامی"),
      fetchError: t("مویشی ڈیٹا حاصل کرنے میں ناکامی"),
      noRecords: t("کوئی مویشی ریکارڈز نہیں ملے"),
      retry: t("دوبارہ کوشش کریں")
    },
    actions: {
      view: t("دیکھیں"),
      edit: t("ترمیم"),
      delete: t("حذف کریں")
    }
  }

  // Filter data based on search term, type, and status
  useEffect(() => {
    if (!data) return

    let filtered = [...data]

    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item: any) =>
          item.tag_number?.toLowerCase().includes(lowerSearchTerm) ||
          item.animal_type?.toLowerCase().includes(lowerSearchTerm) ||
          item.breed?.toLowerCase().includes(lowerSearchTerm) ||
          item.notes?.toLowerCase().includes(lowerSearchTerm),
      )
    }

    // Filter by type
    if (filterType && filterType !== "all") {
      filtered = filtered.filter((item: any) => item.animal_type === filterType)
    }

    // Filter by status
    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter((item: any) => item.status === filterStatus)
    }

    setFilteredData(filtered)
  }, [data, searchTerm, filterType, filterStatus])

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm(translations.messages.deleteConfirm)) {
      return
    }

    try {
      setIsDeleting(id)
      await livestockAPI.delete(id)
      toast({
        title: translations.messages.deleteSuccess,
        description: translations.messages.deleteSuccess,
      })
      onRefresh() // Refresh the data
    } catch (error) {
      console.error("Failed to delete livestock:", error)
      toast({
        title: translations.messages.deleteError,
        description: translations.messages.deleteError,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{translations.messages.fetchError}</p>
        <Button onClick={onRefresh}>{translations.messages.retry}</Button>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground">{translations.messages.noRecords}</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{translations.tableHeaders.tagNumber}</TableHead>
              <TableHead>{translations.tableHeaders.type}</TableHead>
              <TableHead>{translations.tableHeaders.breed}</TableHead>
              <TableHead>{translations.tableHeaders.gender}</TableHead>
              <TableHead>{translations.tableHeaders.birthDate}</TableHead>
              <TableHead>{translations.tableHeaders.weight}</TableHead>
              <TableHead>{translations.tableHeaders.status}</TableHead>
              <TableHead className="text-right">{translations.tableHeaders.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.tag_number}</TableCell>
                <TableCell>{item.animal_type}</TableCell>
                <TableCell>{item.breed}</TableCell>
                <TableCell>{item.gender}</TableCell>
                <TableCell>{new Date(item.birth_date).toLocaleDateString()}</TableCell>
                <TableCell>{item.weight}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "Healthy"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Sick"
                          ? "bg-red-100 text-red-800"
                          : item.status === "Pregnant"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {translations.status[item.status.toLowerCase() as keyof typeof translations.status] || item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" title={translations.actions.view}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">{translations.actions.view}</span>
                    </Button>
                    <Button variant="outline" size="sm" title={translations.actions.edit}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">{translations.actions.edit}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting === item.id}
                      title={translations.actions.delete}
                    >
                      {isDeleting === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                      <span className="sr-only">{translations.actions.delete}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}