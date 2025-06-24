"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, FileText, Plus, BarChart3, PieChart, TrendingUp } from "lucide-react"
import { ReportGenerationForm } from "./report-generation-form"

export function ReportsAnalytics() {
  const { t } = useLanguage()
  const [reportType, setReportType] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Organized translations
  const translations = {
    select: {
      reportType: t("رپورٹ کی قسم منتخب کریں"),
      allReports: t("تمام رپورٹس"),
      livestockReports: t("مویشیوں کی رپورٹس"),
      financialReports: t("مالی رپورٹس"),
      breedingReports: t("نسل بندی کی رپورٹس"),
      feedingReports: t("خوراک کی رپورٹس"),
      healthReports: t("صحت کی رپورٹس")
    },
    actions: {
      generateNewReport: t("نیا رپورٹ تیار کریں"),
      generateCustomReport: t("اپنی مرضی کی رپورٹ تیار کریں"),
      customReportDescription: t("اپنی مخصوص ضروریات کے ساتھ ایک تفصیلی رپورٹ بنائیں"),
      download: t("ڈاؤن لوڈ کریں"),
      useTemplate: t("ٹیمپلیٹ استعمال کریں")
    },
    tabs: {
      generatedReports: t("تیار شدہ رپورٹس"),
      analyticsDashboard: t("تجزیاتی ڈیش بورڈ"),
      reportTemplates: t("رپورٹ کے ٹیمپلیٹس")
    },
    reports: {
      availableReports: t("دستیاب رپورٹس"),
      reportsDescription: t("اپنی تیار کردہ رپورٹس ڈاؤن لوڈ کریں اور منظم کریں"),
      generated: t("تیار ہوا"),
      size: t("سائز"),
      noReportsFound: t("منتخب کردہ قسم کے لیے کوئی رپورٹس نہیں ملیں۔"),
      generateToStart: t("شروع کرنے کے لیے ایک نیا رپورٹ تیار کریں۔")
    },
    analytics: {
      totalReports: t("کل رپورٹس"),
      generatedThisMonth: t("اس مہینے تیار ہوا"),
      mostPopular: t("سب سے مقبول"),
      reportType: t("رپورٹ کی قسم"),
      dataInsights: t("ڈیٹا کی بصیرتیں"),
      reportAccuracy: t("رپورٹ کی درستگی"),
      analyticsDescription: t("آپ کے مویشیوں کے ڈیٹا سے بصری بصیرتیں"),
      chartsWillDisplay: t("تجزیاتی چارٹ یہاں دکھائے جائیں گے"),
      generateForAnalytics: t("بصری تجزیات دیکھنے کے لیے رپورٹس تیار کریں")
    },
    templates: {
      templatesDescription: t("تیزی سے تیاری کے لیے پہلے سے ترتیب شدہ رپورٹ ٹیمپلیٹس"),
      monthlySummary: t("ماہانہ خلاصہ"),
      monthlySummaryDesc: t("فارم کی تمام سرگرمیوں کا مکمل ماہانہ جائزہ"),
      financialAnalysis: t("مالی تجزیہ"),
      financialAnalysisDesc: t("تفصیلی مالی کارکردگی اور لاگت کا تجزیہ"),
      healthReport: t("صحت کی رپورٹ"),
      healthReportDesc: t("مویشیوں کی صحت کی حالت اور ویٹرنری ریکارڈ"),
      productionReport: t("پیداوار کی رپورٹ"),
      productionReportDesc: t("نسل بندی اور کھلانے کی کارکردگی کے پیمانے")
    }
  }

  const mockReports = [
    {
      id: 1,
      title: t("ماہانہ مویشیوں کا خلاصہ"),
      description: t("مویشیوں کی حالت اور صحت کے ریکارڈ کا مکمل جائزہ"),
      type: "livestock",
      generatedAt: "2024-01-15",
      size: "2.3 MB",
    },
    {
      id: 2,
      title: t("پہلی سہ ماہی کی مالی کارکردگی"),
      description: t("پہلی سہ ماہی کے لیے آمدنی، اخراجات اور منافع کا تجزیہ"),
      type: "financial",
      generatedAt: "2024-01-10",
      size: "1.8 MB",
    },
    {
      id: 3,
      title: t("نسل بندی کی کامیابی کی رپورٹ"),
      description: t("نسل بندی کے نتائج اور کامیابی کی شرح کا تجزیہ"),
      type: "breeding",
      generatedAt: "2024-01-08",
      size: "1.2 MB",
    },
    {
      id: 4,
      title: t("خوراک کے اخراجات کا تجزیہ"),
      description: t("خوراک کے اخراجات اور کارکردگی کی تفصیلی تقسیم"),
      type: "feeding",
      generatedAt: "2024-01-05",
      size: "950 KB",
    },
  ]

  const filteredReports =
    reportType === "all" ? mockReports : mockReports.filter((report) => report.type === reportType)

  const handleDownloadReport = (reportId: number, title: string) => {
    // Simulate report download
    const blob = new Blob(["Mock report data"], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "_")}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder={translations.select.reportType} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{translations.select.allReports}</SelectItem>
            <SelectItem value="livestock">{translations.select.livestockReports}</SelectItem>
            <SelectItem value="financial">{translations.select.financialReports}</SelectItem>
            <SelectItem value="breeding">{translations.select.breedingReports}</SelectItem>
            <SelectItem value="feeding">{translations.select.feedingReports}</SelectItem>
            <SelectItem value="health">{translations.select.healthReports}</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {translations.actions.generateNewReport}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{translations.actions.generateCustomReport}</DialogTitle>
              <DialogDescription>{translations.actions.customReportDescription}</DialogDescription>
            </DialogHeader>
            <ReportGenerationForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">{translations.tabs.generatedReports}</TabsTrigger>
          <TabsTrigger value="analytics">{translations.tabs.analyticsDashboard}</TabsTrigger>
          <TabsTrigger value="templates">{translations.tabs.reportTemplates}</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{translations.reports.availableReports}</CardTitle>
              <CardDescription>{translations.reports.reportsDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">{report.title}</h3>
                        <span className="text-xs bg-secondary px-2 py-1 rounded capitalize">{report.type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{translations.reports.generated}: {report.generatedAt}</span>
                        <span>{translations.reports.size}: {report.size}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.id, report.title)}>
                      <Download className="mr-2 h-4 w-4" />
                      {translations.actions.download}
                    </Button>
                  </div>
                ))}

                {filteredReports.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{translations.reports.noReportsFound}</p>
                    <p className="text-sm">{translations.reports.generateToStart}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{translations.analytics.totalReports}</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockReports.length}</div>
                <p className="text-xs text-muted-foreground">{translations.analytics.generatedThisMonth}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{translations.analytics.mostPopular}</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{translations.select.financialReports}</div>
                <p className="text-xs text-muted-foreground">{translations.analytics.reportType}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{translations.analytics.dataInsights}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">{translations.analytics.reportAccuracy}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{translations.tabs.analyticsDashboard}</CardTitle>
              <CardDescription>{translations.analytics.analyticsDescription}</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{translations.analytics.chartsWillDisplay}</p>
                <p className="text-sm text-muted-foreground mt-2">{translations.analytics.generateForAnalytics}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{translations.tabs.reportTemplates}</CardTitle>
              <CardDescription>{translations.templates.templatesDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: translations.templates.monthlySummary,
                    description: translations.templates.monthlySummaryDesc,
                    icon: FileText,
                  },
                  {
                    name: translations.templates.financialAnalysis,
                    description: translations.templates.financialAnalysisDesc,
                    icon: BarChart3,
                  },
                  {
                    name: translations.templates.healthReport,
                    description: translations.templates.healthReportDesc,
                    icon: TrendingUp,
                  },
                  {
                    name: translations.templates.productionReport,
                    description: translations.templates.productionReportDesc,
                    icon: PieChart,
                  },
                ].map((template, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <template.icon className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">{template.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {translations.actions.useTemplate}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}