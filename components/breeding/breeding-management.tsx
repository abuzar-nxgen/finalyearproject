"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Calendar } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { breedingAPI } from "@/services/api"

interface BreedingRecord {
  id: string
  male_tag: string
  female_tag: string
  breeding_date: string
  expected_due_date: string
  breeding_method: string
  status: string
  notes?: string
  created_at: string
}

export function BreedingManagement() {
  const { t } = useLanguage()
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [breedingRecords, setBreedingRecords] = useState<BreedingRecord[]>([])
  const [formData, setFormData] = useState({
    male_tag: "",
    female_tag: "",
    breeding_date: new Date().toISOString().split("T")[0],
    expected_due_date: "",
    breeding_method: "",
    status: "planned",
    notes: "",
  })

  // Calculate expected due date based on breeding date and animal type
  const calculateDueDate = (breedingDate: string, animalType = "cattle") => {
    const date = new Date(breedingDate)
    const gestationPeriods = {
      cattle: 283, // 9 months
      goat: 150, // 5 months
      sheep: 147, // 5 months
      pig: 114, // 3.5 months
    }
    const days = gestationPeriods[animalType as keyof typeof gestationPeriods] || 283
    date.setDate(date.getDate() + days)
    return date.toISOString().split("T")[0]
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const records = await breedingAPI.getAll()
        setBreedingRecords(records)
        console.log("Loaded breeding records:", records)
      } catch (error) {
        console.error("Error loading breeding records:", error)
      }
    }

    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.male_tag.trim() || !formData.female_tag.trim()) {
      toast({
        title: t("غلطی"),
        description: t("نر اور مادہ کا ٹیگ درکار ہے"),
        variant: "destructive",
      })
      return
    }

    if (!formData.breeding_method) {
      toast({
        title: t("غلطی"),
        description: t("نسل بندی کا طریقہ درکار ہے"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const newRecord = await breedingAPI.create({
        male_tag: formData.male_tag.trim(),
        female_tag: formData.female_tag.trim(),
        breeding_date: formData.breeding_date,
        expected_due_date: formData.expected_due_date || calculateDueDate(formData.breeding_date),
        breeding_method: formData.breeding_method,
        status: formData.status,
        notes: formData.notes.trim(),
      })

      setBreedingRecords((prev) => [newRecord, ...prev])
      setIsDialogOpen(false)

      // Reset form
      setFormData({
        male_tag: "",
        female_tag: "",
        breeding_date: new Date().toISOString().split("T")[0],
        expected_due_date: "",
        breeding_method: "",
        status: "planned",
        notes: "",
      })

      toast({
        title: t("کامیابی"),
        description: t("نسل بندی کا ریکارڈ کامیابی سے شامل ہو گیا"),
      })
    } catch (error) {
      console.error("Error creating breeding record:", error)
      toast({
        title: t("غلطی"),
        description: t("نسل بندی کا ریکارڈ شامل کرنے میں ناکامی"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await breedingAPI.delete(id)
      setBreedingRecords((prev) => prev.filter((record) => record.id !== id))
      toast({
        title: t("کامیابی"),
        description: t("نسل بندی کا ریکارڈ کامیابی سے حذف ہو گیا"),
      })
    } catch (error) {
      toast({
        title: t("غلطی"),
        description: t("نسل بندی کا ریکارڈ حذف کرنے میں ناکامی"),
        variant: "destructive",
      })
    }
  }

  const filteredRecords = breedingRecords.filter(
    (record) =>
      record.male_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.female_tag.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Status display translations
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      planned: t("منصوبہ بند"),
      completed: t("مکمل"),
      confirmed_pregnant: t("حمل کی تصدیق ہو گئی"),
      failed: t("ناکام"),
    }
    return statusMap[status] || status
  }

  // Breeding method translations
  const getMethodDisplay = (method: string) => {
    const methodMap: Record<string, string> = {
      natural: t("قدرتی"),
      artificial: t("مصنوعی"),
      embryo_transfer: t("جنین کی منتقلی"),
    }
    return methodMap[method] || method
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("نسل بندی کے ریکارڈز تلاش کریں...")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {hasPermission("breeding:create") && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  console.log("Breeding button clicked!")
                  setIsDialogOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("نیا ریکارڈ شامل کریں")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("نسل بندی کا نیا ریکارڈ")}</DialogTitle>
                <DialogDescription>{t("نئی نسل بندی کی معلومات درج کریں")}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="male_tag">{t("نر کا ٹیگ")} *</Label>
                    <Input
                      id="male_tag"
                      value={formData.male_tag}
                      onChange={(e) => setFormData((prev) => ({ ...prev, male_tag: e.target.value }))}
                      placeholder={t("نر جانور کا ٹیگ درج کریں")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="female_tag">{t("مادہ کا ٹیگ")} *</Label>
                    <Input
                      id="female_tag"
                      value={formData.female_tag}
                      onChange={(e) => setFormData((prev) => ({ ...prev, female_tag: e.target.value }))}
                      placeholder={t("مادہ جانور کا ٹیگ درج کریں")}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="breeding_date">{t("نسل بندی کی تاریخ")} *</Label>
                    <Input
                      id="breeding_date"
                      type="date"
                      value={formData.breeding_date}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          breeding_date: e.target.value,
                          expected_due_date: calculateDueDate(e.target.value),
                        }))
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expected_due_date">{t("متوقع پیدائش کی تاریخ")}</Label>
                    <Input
                      id="expected_due_date"
                      type="date"
                      value={formData.expected_due_date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, expected_due_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breeding_method">{t("طریقہ")} *</Label>
                  <Select
                    value={formData.breeding_method}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, breeding_method: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("طریقہ منتخب کریں")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural">{t("قدرتی")}</SelectItem>
                      <SelectItem value="artificial">{t("مصنوعی")}</SelectItem>
                      <SelectItem value="embryo_transfer">{t("جنین کی منتقلی")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">{t("حالت")}</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">{t("منصوبہ بند")}</SelectItem>
                      <SelectItem value="completed">{t("مکمل")}</SelectItem>
                      <SelectItem value="confirmed_pregnant">{t("حمل کی تصدیق ہو گئی")}</SelectItem>
                      <SelectItem value="failed">{t("ناکام")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">{t("نوٹس")}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder={t("اضافی نوٹس درج کریں")}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t("منسوخ کریں")}
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? t("شامل کیا جا رہا ہے...") : t("شامل کریں")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">{t("ریکارڈز")}</TabsTrigger>
          <TabsTrigger value="calendar">{t("کیلنڈر")}</TabsTrigger>
          <TabsTrigger value="genealogy">{t("نسب نامہ")}</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("نسل بندی کے ریکارڈز")}</CardTitle>
              <CardDescription>{t("تمام نسل بندی کے ریکارڈز کی فہرست")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t("کوئی ریکارڈز موجود نہیں ہیں")}</p>
                ) : (
                  <div className="space-y-2">
                    {filteredRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {record.male_tag} × {record.female_tag}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                record.status === "confirmed_pregnant"
                                  ? "bg-green-100 text-green-800"
                                  : record.status === "completed"
                                    ? "bg-blue-100 text-blue-800"
                                    : record.status === "failed"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {getStatusDisplay(record.status).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("نسل بندی")}: {record.breeding_date} • {t("متوقع پیدائش")}:{" "}
                            {record.expected_due_date} • {t("طریقہ")}:{" "}
                            {getMethodDisplay(record.breeding_method)}
                          </div>
                          {record.notes && <div className="text-sm text-muted-foreground">{record.notes}</div>}
                        </div>
                        <div className="flex space-x-2">
                          {hasPermission("breeding:update") && (
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {hasPermission("breeding:delete") && (
                            <Button variant="outline" size="sm" onClick={() => handleDelete(record.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("نسل بندی کیلنڈر")}</CardTitle>
              <CardDescription>{t("نسل بندی اور پیدائش کے واقعات کا کیلنڈر")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t("جلد ہی دستیاب ہوگا")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="genealogy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("نسب نامہ")}</CardTitle>
              <CardDescription>{t("جانوروں کا نسب نامہ اور خاندانی شجرہ")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">{t("جلد ہی دستیاب ہوگا")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}