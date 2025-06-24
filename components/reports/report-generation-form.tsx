"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Download } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface ReportGenerationFormProps {
  onClose: () => void
}

export function ReportGenerationForm({ onClose }: ReportGenerationFormProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    reportType: "",
    title: "",
    dateFrom: "",
    dateTo: "",
    format: "pdf",
    includeCharts: true,
    includeDetails: true,
    includeSummary: true,
  })

  // Organized translations
  const translations = {
    form: {
      reportType: t("رپورٹ کی قسم"),
      selectReportType: t("رپورٹ کی قسم منتخب کریں"),
      reportTitle: t("رپورٹ کا عنوان"),
      enterReportTitle: t("رپورٹ کا عنوان درج کریں"),
      fromDate: t("شروع کی تاریخ"),
      toDate: t("آخر کی تاریخ"),
      exportFormat: t("ایکسپورٹ فارمیٹ"),
      reportOptions: t("رپورٹ کے اختیارات"),
      includeCharts: t("چارٹس اور گراف شامل کریں"),
      includeDetails: t("تفصیلی ریکارڈز شامل کریں"),
      includeSummary: t("ایگزیکٹو سمری شامل کریں"),
      cancel: t("منسوخ کریں"),
      generating: t("تیار ہو رہا ہے..."),
      generateReport: t("رپورٹ تیار کریں")
    },
    messages: {
      validationError: t("تصدیق کی خرابی"),
      selectReportTypeError: t("براہ کرم رپورٹ کی قسم منتخب کریں"),
      enterReportTitleError: t("براہ کرم رپورٹ کا عنوان درج کریں"),
      selectDateRangeError: t("براہ کرم تاریخ کا دورانیہ منتخب کریں"),
      success: t("کامیابی"),
      reportGenerated: t("رپورٹ کامیابی سے تیار اور ڈاؤن لوڈ ہو گئی"),
      error: t("خرابی"),
      reportGenerationFailed: t("رپورٹ تیار کرنے میں ناکامی")
    }
  }

  const reportTypes = [
    { value: "livestock", label: t("مویشیوں کا جائزہ") },
    { value: "financial", label: t("مالی رپورٹ") },
    { value: "breeding", label: t("نسل بندی کی رپورٹ") },
    { value: "feeding", label: t("خوراک کی رپورٹ") },
    { value: "health", label: t("صحت کے ریکارڈز") },
    { value: "comprehensive", label: t("جامع رپورٹ") },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.reportType) {
      toast({
        title: translations.messages.validationError,
        description: translations.messages.selectReportTypeError,
        variant: "destructive",
      })
      return
    }

    if (!formData.title.trim()) {
      toast({
        title: translations.messages.validationError,
        description: translations.messages.enterReportTitleError,
        variant: "destructive",
      })
      return
    }

    if (!formData.dateFrom || !formData.dateTo) {
      toast({
        title: translations.messages.validationError,
        description: translations.messages.selectDateRangeError,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate file download
      const blob = new Blob(["Sample report content"], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `${formData.title.replace(/\s+/g, "_")}.${formData.format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: translations.messages.success,
        description: translations.messages.reportGenerated,
      })

      onClose()
    } catch (error) {
      toast({
        title: translations.messages.error,
        description: translations.messages.reportGenerationFailed,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reportType">{translations.form.reportType} *</Label>
        <Select
          value={formData.reportType}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, reportType: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder={translations.form.selectReportType} />
          </SelectTrigger>
          <SelectContent>
            {reportTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">{translations.form.reportTitle} *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder={translations.form.enterReportTitle}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateFrom">{translations.form.fromDate} *</Label>
          <Input
            id="dateFrom"
            type="date"
            value={formData.dateFrom}
            onChange={(e) => setFormData((prev) => ({ ...prev, dateFrom: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateTo">{translations.form.toDate} *</Label>
          <Input
            id="dateTo"
            type="date"
            value={formData.dateTo}
            onChange={(e) => setFormData((prev) => ({ ...prev, dateTo: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="format">{translations.form.exportFormat}</Label>
        <Select value={formData.format} onValueChange={(value) => setFormData((prev) => ({ ...prev, format: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="excel">Excel</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>{translations.form.reportOptions}</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeCharts"
              checked={formData.includeCharts}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, includeCharts: checked as boolean }))}
            />
            <Label htmlFor="includeCharts" className="text-sm font-normal">
              {translations.form.includeCharts}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeDetails"
              checked={formData.includeDetails}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, includeDetails: checked as boolean }))}
            />
            <Label htmlFor="includeDetails" className="text-sm font-normal">
              {translations.form.includeDetails}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeSummary"
              checked={formData.includeSummary}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, includeSummary: checked as boolean }))}
            />
            <Label htmlFor="includeSummary" className="text-sm font-normal">
              {translations.form.includeSummary}
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {translations.form.cancel}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Calendar className="mr-2 h-4 w-4 animate-spin" />
              {translations.form.generating}
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              {translations.form.generateReport}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}