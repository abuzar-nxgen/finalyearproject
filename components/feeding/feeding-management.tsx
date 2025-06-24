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
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { feedingAPI } from "@/services/api"

interface FeedRecord {
  id: string
  livestock_id: string
  livestock_tag: string
  feed_type: string
  quantity: number
  unit: string
  cost: number
  feeding_date: string
  notes?: string
  created_at: string
}

export function FeedingManagement() {
  const { t } = useLanguage()
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [feedRecords, setFeedRecords] = useState<FeedRecord[]>([])
  const [formData, setFormData] = useState({
    livestock_id: "",
    feed_type: "",
    quantity: "",
    unit: "kg",
    cost: "",
    feeding_date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  // Feed type translations
  const getFeedTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      hay: t("گھاس"),
      grain: t("اناج"),
      pellets: t("پیلٹس"),
      silage: t("سائلج"),
      supplements: t("اضافی غذائیں"),
      minerals: t("معدنیات"),
      concentrate: t("سینٹریٹ")
    }
    return typeMap[type] || type
  }

  // Unit translations
  const getUnitDisplay = (unit: string) => {
    const unitMap: Record<string, string> = {
      kg: t("کلوگرام"),
      lbs: t("پاؤنڈ"),
      tons: t("ٹن"),
      bales: t("گٹھے")
    }
    return unitMap[unit] || unit
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const records = await feedingAPI.getAll()
        setFeedRecords(records)
        console.log("Loaded feeding records:", records)
      } catch (error) {
        console.error("Error loading feed records:", error)
        toast({
          title: t("خرابی"),
          description: t("خوراک کے ریکارڈز لوڈ کرنے میں ناکامی"),
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.livestock_id.trim()) {
      toast({
        title: t("تصدیق کی خرابی"),
        description: t("براہ کرم مویشی کا ٹیگ نمبر درج کریں"),
        variant: "destructive",
      })
      return
    }

    if (!formData.feed_type) {
      toast({
        title: t("تصدیق کی خرابی"),
        description: t("براہ کرم خوراک کی قسم منتخب کریں"),
        variant: "destructive",
      })
      return
    }

    if (!formData.quantity || Number.parseFloat(formData.quantity) <= 0) {
      toast({
        title: t("تصدیق کی خرابی"),
        description: t("براہ کرم درست مقدار درج کریں"),
        variant: "destructive",
      })
      return
    }

    if (!formData.cost || Number.parseFloat(formData.cost) < 0) {
      toast({
        title: t("تصدیق کی خرابی"),
        description: t("براہ کرم درست لاگت درج کریں"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const newRecord = await feedingAPI.create({
        livestock_id: formData.livestock_id.trim(),
        feed_type: formData.feed_type,
        quantity: Number.parseFloat(formData.quantity),
        unit: formData.unit,
        cost: Number.parseFloat(formData.cost),
        feeding_date: formData.feeding_date,
        notes: formData.notes.trim(),
      })

      setFeedRecords((prev) => [newRecord, ...prev])
      setIsDialogOpen(false)

      // Reset form
      setFormData({
        livestock_id: "",
        feed_type: "",
        quantity: "",
        unit: "kg",
        cost: "",
        feeding_date: new Date().toISOString().split("T")[0],
        notes: "",
      })

      toast({
        title: t("کامیابی"),
        description: t("خوراک کا ریکارڈ کامیابی سے شامل ہو گیا"),
      })
    } catch (error) {
      console.error("Error creating feed record:", error)
      toast({
        title: t("خرابی"),
        description: t("خوراک کا ریکارڈ شامل کرنے میں ناکامی"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await feedingAPI.delete(id)
      setFeedRecords((prev) => prev.filter((record) => record.id !== id))
      toast({
        title: t("کامیابی"),
        description: t("خوراک کا ریکارڈ کامیابی سے حذف ہو گیا"),
      })
    } catch (error) {
      toast({
        title: t("خرابی"),
        description: t("خوراک کا ریکارڈ حذف کرنے میں ناکامی"),
      })
    }
  }

  const filteredRecords = feedRecords.filter(
    (record) =>
      record.livestock_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.feed_type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("خوراک کے ریکارڈز تلاش کریں...")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {hasPermission("feeding:create") && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("نیا ریکارڈ شامل کریں")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("خوراک کا نیا ریکارڈ")}</DialogTitle>
                <DialogDescription>{t("مویشیوں کے لیے خوراک کی نئی معلومات درج کریں")}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="livestock_id">{t("مویشی کا ٹیگ")} *</Label>
                  <Input
                    id="livestock_id"
                    value={formData.livestock_id}
                    onChange={(e) => setFormData((prev) => ({ ...prev, livestock_id: e.target.value }))}
                    placeholder={t("مویشی کا ٹیگ نمبر درج کریں")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feed_type">{t("خوراک کی قسم")} *</Label>
                  <Select
                    value={formData.feed_type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, feed_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("خوراک کی قسم منتخب کریں")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hay">{t("گھاس")}</SelectItem>
                      <SelectItem value="grain">{t("اناج")}</SelectItem>
                      <SelectItem value="pellets">{t("پیلٹس")}</SelectItem>
                      <SelectItem value="silage">{t("سائلج")}</SelectItem>
                      <SelectItem value="supplements">{t("اضافی غذائیں")}</SelectItem>
                      <SelectItem value="minerals">{t("معدنیات")}</SelectItem>
                      <SelectItem value="concentrate">{t("سینٹریٹ")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">{t("مقدار")} *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                      value={formData.quantity}
                      onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                      placeholder="0.0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">{t("اکائی")}</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">{t("کلوگرام")}</SelectItem>
                        <SelectItem value="lbs">{t("پاؤنڈ")}</SelectItem>
                        <SelectItem value="tons">{t("ٹن")}</SelectItem>
                        <SelectItem value="bales">{t("گٹھے")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">{t("کل لاگت ($)")} *</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cost: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feeding_date">{t("کھلانے کی تاریخ")} *</Label>
                  <Input
                    id="feeding_date"
                    type="date"
                    value={formData.feeding_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, feeding_date: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">{t("نوٹس")}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder={t("اضافی نوٹس درج کریں...")}
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
          <TabsTrigger value="records">{t("خوراک کے ریکارڈز")}</TabsTrigger>
          <TabsTrigger value="inventory">{t("خوراک کا انوینٹری")}</TabsTrigger>
          <TabsTrigger value="planning">{t("خوراک کی منصوبہ بندی")}</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("خوراک کے ریکارڈز")}</CardTitle>
              <CardDescription>{t("تمام خوراک کے ریکارڈز کی فہرست")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t("کوئی خوراک کا ریکارڈ نہیں ملا")}</p>
                ) : (
                  <div className="space-y-2">
                    {filteredRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{record.livestock_tag}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm">{getFeedTypeDisplay(record.feed_type)}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {record.quantity} {getUnitDisplay(record.unit)} • ${record.cost} • {record.feeding_date}
                          </div>
                          {record.notes && <div className="text-sm text-muted-foreground">{record.notes}</div>}
                        </div>
                        <div className="flex space-x-2">
                          {hasPermission("feeding:update") && (
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {hasPermission("feeding:delete") && (
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

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("خوراک کا انوینٹری")}</CardTitle>
              <CardDescription>{t("خوراک کے اسٹاک اور انوینٹری کا نظم")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">{t("خوراک کی انوینٹری کا نظم جلد ہی دستیاب ہوگا")}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("خوراک کی منصوبہ بندی")}</CardTitle>
              <CardDescription>{t("خوراک کے شیڈول اور ضروریات کی منصوبہ بندی")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">{t("خوراک کی منصوبہ بندی کے ٹولز جلد ہی دستیاب ہوں گے")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}