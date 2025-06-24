"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, FileText, Download, BarChart3 } from "lucide-react"
import { ReportGenerationForm } from "@/components/reports/report-generation-form"
import { useLanguage } from "@/components/language-provider"

export default function ReportsPage() {
  const { t } = useLanguage()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Organized translations
  const translations = {
    page: {
      title: t("رپورٹس"),
      description: t("اپنے مویشیوں کے انتظام سے متعلق رپورٹس تیار کریں اور منظم کریں")
    },
    buttons: {
      generateReport: t("نیا رپورٹ تیار کریں")
    },
    dialog: {
      title: t("اپنی مرضی کی رپورٹ تیار کریں"),
      description: t("اپنے مویشیوں کے انتظام کے ڈیٹا کے لیے تفصیلی رپورٹس بنائیں")
    },
    stats: {
      totalReports: t("کل رپورٹس"),
      thisMonth: t("اس مہینے"),
      reportsGenerated: t("رپورٹس تیار ہوئیں"),
      mostPopular: t("سب سے مقبول"),
      reportType: t("رپورٹ کی قسم"),
      downloads: t("ڈاؤن لوڈز"),
      totalDownloads: t("کل ڈاؤن لوڈز")
    },
    recentReports: {
      title: t("حالیہ رپورٹس"),
      description: t("آپ کی حال ہی میں تیار کردہ رپورٹس"),
      status: t("تیار شدہ"),
      download: t("ڈاؤن لوڈ کریں")
    }
  }

  const recentReports = [
    {
      id: 1,
      title: t("ماہانہ مویشی رپورٹ"),
      type: t("مویشیوں کا جائزہ"),
      date: "2025-01-15",
      status: translations.recentReports.status,
    },
    {
      id: 2,
      title: t("چوتھی سہ ماہی مالی خلاصہ"),
      type: t("مالی رپورٹ"),
      date: "2025-01-10",
      status: translations.recentReports.status,
    },
    {
      id: 3,
      title: t("نسل بندی کی کارکردگی کا تجزیہ"),
      type: t("نسل بندی رپورٹ"),
      date: "2025-01-05",
      status: translations.recentReports.status,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{translations.page.title}</h1>
          <p className="text-muted-foreground">{translations.page.description}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {translations.buttons.generateReport}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{translations.dialog.title}</DialogTitle>
              <DialogDescription>{translations.dialog.description}</DialogDescription>
            </DialogHeader>
            <ReportGenerationForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.stats.totalReports}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 {t("پچھلے مہینے سے")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.stats.thisMonth}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">{translations.stats.reportsGenerated}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.stats.mostPopular}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t("مالی")}</div>
            <p className="text-xs text-muted-foreground">{translations.stats.reportType}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.stats.downloads}</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">{translations.stats.totalDownloads}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{translations.recentReports.title}</CardTitle>
          <CardDescription>{translations.recentReports.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{report.title}</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">{report.status}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {report.type} • {t("تیار شدہ")} {report.date}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {translations.recentReports.download}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}