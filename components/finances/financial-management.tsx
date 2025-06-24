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
import { Plus, Search, Edit, Trash2, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { financialAPI } from "@/services/api"

interface FinancialRecord {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
  livestock_tag?: string
  payment_method: string
  created_at: string
}

export function FinancialManagement() {
  const { t } = useLanguage()
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([])
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    livestock_tag: "",
    payment_method: "",
  })

  // Category translations
  const getCategoryDisplay = (category: string) => {
    const categoryMap: Record<string, string> = {
      "Feed": t("خوراک"),
      "Veterinary": t("جانوروں کا علاج"),
      "Equipment": t("سامان"),
      "Labor": t("مزدوری"),
      "Utilities": t("یوٹیلیٹیز"),
      "Insurance": t("انشورنس"),
      "Transportation": t("ٹرانسپورٹ"),
      "Maintenance": t("دیکھ بھال"),
      "Other": t("دیگر"),
      "Livestock Sale": t("مویشیوں کی فروخت"),
      "Milk Sale": t("دودھ کی فروخت"),
      "Breeding Fee": t("نسل بندی فیس"),
      "Product Sale": t("مصنوعات کی فروخت"),
      "Service": t("خدمت"),
    }
    return categoryMap[category] || category
  }

  // Payment method translations
  const getPaymentMethodDisplay = (method: string) => {
    const methodMap: Record<string, string> = {
      "cash": t("نقد"),
      "check": t("چیک"),
      "bank_transfer": t("بینک ٹرانسفر"),
      "credit_card": t("کریڈٹ کارڈ"),
      "other": t("دیگر")
    }
    return methodMap[method] || method
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const records = await financialAPI.getAll()
        setFinancialRecords(
          records.map((record: any) => ({
            ...record,
            type: record.type === "income" ? "income" : "expense",
          }))
        )
        console.log("Loaded financial records:", records)
      } catch (error) {
        console.error("Error loading financial records:", error)
        toast({
          title: t("خرابی"),
          description: t("مالی ریکارڈز لوڈ کرنے میں ناکامی"),
          variant: "destructive",
        })
      }
    }

    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.category) {
      toast({
        title: t("تصدیق کی خرابی"),
        description: t("براہ کرم ایک زمرہ منتخب کریں"),
        variant: "destructive",
      })
      return
    }

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      toast({
        title: t("تصدیق کی خرابی"),
        description: t("براہ کرم درست رقم درج کریں"),
        variant: "destructive",
      })
      return
    }

    if (!formData.description.trim()) {
      toast({
        title: t("تصدیق کی خرابی"),
        description: t("براہ کرم تفصیل درج کریں"),
        variant: "destructive",
      })
      return
    }

    if (!formData.payment_method) {
      toast({
        title: t("تصدیق کی خرابی"),
        description: t("براہ کرم ادائیگی کا طریقہ منتخب کریں"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const newRecord = await financialAPI.create({
        type: formData.type,
        category: formData.category,
        amount: Number.parseFloat(formData.amount),
        description: formData.description.trim(),
        date: formData.date,
        livestock_tag: formData.livestock_tag.trim() || undefined,
        payment_method: formData.payment_method,
      })

      setFinancialRecords((prev) => [newRecord, ...prev])
      setIsDialogOpen(false)

      // Reset form
      setFormData({
        type: "expense",
        category: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        livestock_tag: "",
        payment_method: "",
      })

      toast({
        title: t("کامیابی"),
        description: t("مالی ریکارڈ کامیابی سے شامل ہو گیا"),
      })
    } catch (error) {
      console.error("Error creating financial record:", error)
      toast({
        title: t("خرابی"),
        description: t("مالی ریکارڈ شامل کرنے میں ناکامی"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await financialAPI.delete(id)
      setFinancialRecords((prev) => prev.filter((record) => record.id !== id))
      toast({
        title: t("کامیابی"),
        description: t("مالی ریکارڈ کامیابی سے حذف ہو گیا"),
      })
    } catch (error) {
      toast({
        title: t("خرابی"),
        description: t("مالی ریکارڈ حذف کرنے میں ناکامی"),
        variant: "destructive",
      })
    }
  }

  const filteredRecords = financialRecords.filter(
    (record) =>
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.livestock_tag?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalIncome = financialRecords
    .filter((record) => record.type === "income")
    .reduce((sum, record) => sum + record.amount, 0)

  const totalExpenses = financialRecords
    .filter((record) => record.type === "expense")
    .reduce((sum, record) => sum + record.amount, 0)

  const netProfit = totalIncome - totalExpenses

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("کل آمدنی")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("کل اخراجات")}</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("خالص منافعہ")}</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${netProfit.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("مالی ریکارڈز تلاش کریں...")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {hasPermission("financial:create") && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("نیا ریکارڈ شامل کریں")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("مالی ریکارڈ شامل کریں")}</DialogTitle>
                <DialogDescription>{t("آمدنی یا اخراجات کا نیا لین دین درج کریں")}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">{t("لین دین کی قسم")} *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "income" | "expense") =>
                      setFormData((prev) => ({ ...prev, type: value, category: "" }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">{t("آمدنی")}</SelectItem>
                      <SelectItem value="expense">{t("اخراجات")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">{t("زمرہ")} *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("زمرہ منتخب کریں")} />
                    </SelectTrigger>
                    <SelectContent>
                      {(formData.type === "income" ? [
                        "Livestock Sale",
                        "Milk Sale",
                        "Breeding Fee",
                        "Product Sale",
                        "Service",
                        "Other"
                      ] : [
                        "Feed",
                        "Veterinary",
                        "Equipment",
                        "Labor",
                        "Utilities",
                        "Insurance",
                        "Transportation",
                        "Maintenance",
                        "Other"
                      ]).map((category) => (
                        <SelectItem key={category} value={category}>
                          {getCategoryDisplay(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">{t("رقم ($)")} *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">{t("تاریخ")} *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t("تفصیل")} *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder={t("لین دین کی مختصر تفصیل")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="livestock_tag">{t("متعلقہ مویشی (اختیاری)")}</Label>
                  <Input
                    id="livestock_tag"
                    value={formData.livestock_tag}
                    onChange={(e) => setFormData((prev) => ({ ...prev, livestock_tag: e.target.value }))}
                    placeholder={t("اگر لاگو ہو تو مویشی کا ٹیگ درج کریں")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_method">{t("ادائیگی کا طریقہ")} *</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, payment_method: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("ادائیگی کا طریقہ منتخب کریں")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">{t("نقد")}</SelectItem>
                      <SelectItem value="check">{t("چیک")}</SelectItem>
                      <SelectItem value="bank_transfer">{t("بینک ٹرانسفر")}</SelectItem>
                      <SelectItem value="credit_card">{t("کریڈٹ کارڈ")}</SelectItem>
                      <SelectItem value="other">{t("دیگر")}</SelectItem>
                    </SelectContent>
                  </Select>
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

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t("تمام لین دین")}</TabsTrigger>
          <TabsTrigger value="income">{t("آمدنی کے ریکارڈز")}</TabsTrigger>
          <TabsTrigger value="expenses">{t("اخراجات کے ریکارڈز")}</TabsTrigger>
          <TabsTrigger value="reports">{t("مالی رپورٹس")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("تمام لین دین")}</CardTitle>
              <CardDescription>{t("آمدنی اور اخراجات کے تمام لین دین کی مکمل فہرست")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t("کوئی مالی ریکارڈ نہیں ملا")}</p>
                ) : (
                  <div className="space-y-2">
                    {filteredRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{record.description}</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                record.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {record.type === "income" ? t("آمدنی") : t("اخراجات")}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {getCategoryDisplay(record.category)} • ${record.amount.toFixed(2)} • {record.date} • {getPaymentMethodDisplay(record.payment_method)}
                            {record.livestock_tag && ` • ${t("ٹیگ")}: ${record.livestock_tag}`}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {hasPermission("financial:update") && (
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {hasPermission("financial:delete") && (
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

        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("آمدنی کے ریکارڈز")}</CardTitle>
              <CardDescription>{t("آمدنی کے تمام لین دین اور ذرائع")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredRecords
                  .filter((record) => record.type === "income")
                  .map((record) => (
                    <div key={record.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{record.description}</span>
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            +${record.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getCategoryDisplay(record.category)} • {record.date} • {getPaymentMethodDisplay(record.payment_method)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("اخراجات کے ریکارڈز")}</CardTitle>
              <CardDescription>{t("اخراجات کے تمام لین دین اور لاگتیں")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredRecords
                  .filter((record) => record.type === "expense")
                  .map((record) => (
                    <div key={record.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{record.description}</span>
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            -${record.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getCategoryDisplay(record.category)} • {record.date} • {getPaymentMethodDisplay(record.payment_method)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("مالی رپورٹس")}</CardTitle>
              <CardDescription>{t("تفصیلی مالی رپورٹس اور تجزیات تیار کریں")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">{t("مالی رپورٹس اور تجزیات جلد دستیاب ہوں گے")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}