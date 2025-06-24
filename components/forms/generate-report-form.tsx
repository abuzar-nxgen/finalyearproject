"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, FileText, Loader2, Download } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { reportsAPI } from "@/services/api"

interface ReportFormData {
  report_type: string
  title: string
  description: string
  date_from: Date | undefined
  date_to: Date | undefined
  categories: string[]
  livestock_types: string[]
  include_charts: boolean
  include_details: boolean
  include_summary: boolean
  include_recommendations: boolean
  format: string
  delivery_method: string
  email_recipients: string
  schedule_frequency: string
  custom_fields: string[]
}

interface GenerateReportFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function GenerateReportForm({ onSuccess, onCancel }: GenerateReportFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ReportFormData>({
    report_type: "",
    title: "",
    description: "",
    date_from: undefined,
    date_to: new Date(),
    categories: [],
    livestock_types: [],
    include_charts: true,
    include_details: true,
    include_summary: true,
    include_recommendations: false,
    format: "pdf",
    delivery_method: "download",
    email_recipients: "",
    schedule_frequency: "",
    custom_fields: [],
  })

  const reportTypes = [
    {
      value: "livestock_overview",
      label: "Livestock Overview Report",
      description: "Complete overview of all livestock",
    },
    {
      value: "financial_summary",
      label: "Financial Summary Report",
      description: "Income, expenses, and profit analysis",
    },
    {
      value: "breeding_performance",
      label: "Breeding Performance Report",
      description: "Breeding success rates and outcomes",
    },
    {
      value: "feeding_analysis",
      label: "Feeding Cost Analysis Report",
      description: "Feed consumption and cost breakdown",
    },
    { value: "health_records", label: "Health Records Report", description: "Veterinary treatments and health status" },
    { value: "productivity", label: "Productivity Report", description: "Production metrics and efficiency" },
    { value: "compliance", label: "Compliance Report", description: "Regulatory compliance and certifications" },
    { value: "comprehensive", label: "Comprehensive Farm Report", description: "All-inclusive farm management report" },
  ]

  const categoryOptions = {
    livestock_overview: ["Cattle", "Goats", "Sheep", "Pigs", "Chickens", "Horses"],
    financial_summary: ["Income", "Expenses", "Feed Costs", "Veterinary", "Equipment", "Labor"],
    breeding_performance: ["Natural Breeding", "Artificial Insemination", "Embryo Transfer"],
    feeding_analysis: ["Hay", "Grain", "Pellets", "Silage", "Supplements", "Pasture"],
    health_records: ["Vaccinations", "Treatments", "Check-ups", "Medications", "Surgeries"],
    productivity: ["Milk Production", "Egg Production", "Weight Gain", "Feed Conversion"],
    compliance: ["Organic Certification", "Animal Welfare", "Environmental", "Safety"],
  }

  const customFieldOptions = [
    "Weather Data",
    "Staff Performance",
    "Equipment Usage",
    "Market Prices",
    "Feed Quality",
    "Breeding Genetics",
    "Environmental Impact",
    "Cost per Unit",
    "ROI Analysis",
    "Risk Assessment",
  ]

  const getCurrentCategories = () => {
    return categoryOptions[formData.report_type as keyof typeof categoryOptions] || []
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, category] : prev.categories.filter((c) => c !== category),
    }))
  }

  const handleLivestockTypeChange = (type: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      livestock_types: checked ? [...prev.livestock_types, type] : prev.livestock_types.filter((t) => t !== type),
    }))
  }

  const handleCustomFieldChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      custom_fields: checked ? [...prev.custom_fields, field] : prev.custom_fields.filter((f) => f !== field),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.report_type) {
      toast({
        title: "Validation Error",
        description: "Please select a report type",
        variant: "destructive",
      })
      return
    }

    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a report title",
        variant: "destructive",
      })
      return
    }

    if (!formData.date_to) {
      toast({
        title: "Validation Error",
        description: "Please select an end date",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const reportData = await reportsAPI.generate(formData.report_type, {
        title: formData.title,
        description: formData.description,
        date_from: formData.date_from ? format(formData.date_from, "yyyy-MM-dd") : "",
        date_to: format(formData.date_to, "yyyy-MM-dd"),
        categories: formData.categories,
        livestock_types: formData.livestock_types,
        include_charts: formData.include_charts,
        include_details: formData.include_details,
        include_summary: formData.include_summary,
        include_recommendations: formData.include_recommendations,
        format: formData.format,
        custom_fields: formData.custom_fields,
      })

      toast({
        title: "Success",
        description: `Report "${formData.title}" generated successfully!`,
      })

      // Simulate file download
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${formData.title.replace(/\s+/g, "_")}_${format(new Date(), "yyyy-MM-dd")}.${formData.format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Reset form
      setFormData({
        report_type: "",
        title: "",
        description: "",
        date_from: undefined,
        date_to: new Date(),
        categories: [],
        livestock_types: [],
        include_charts: true,
        include_details: true,
        include_summary: true,
        include_recommendations: false,
        format: "pdf",
        delivery_method: "download",
        email_recipients: "",
        schedule_frequency: "",
        custom_fields: [],
      })

      onSuccess?.()
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Custom Report
        </CardTitle>
        <CardDescription>Create detailed reports for your livestock management data</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type */}
          <div className="space-y-2">
            <Label htmlFor="report_type">Report Type *</Label>
            <Select
              value={formData.report_type}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, report_type: value, categories: [] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title and Description */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter report title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter report description (optional)"
                rows={3}
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date_from && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_from ? format(formData.date_from, "PPP") : <span>Select start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date_from}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, date_from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>To Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date_to && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_to ? format(formData.date_to, "PPP") : <span>Select end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date_to}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, date_to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Categories */}
          {formData.report_type && getCurrentCategories().length > 0 && (
            <div className="space-y-2">
              <Label>Categories to Include</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {getCurrentCategories().map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={formData.categories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Livestock Types */}
          <div className="space-y-2">
            <Label>Livestock Types</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Cattle", "Goats", "Sheep", "Pigs", "Chickens", "Horses"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`livestock-${type}`}
                    checked={formData.livestock_types.includes(type)}
                    onCheckedChange={(checked) => handleLivestockTypeChange(type, checked as boolean)}
                  />
                  <Label htmlFor={`livestock-${type}`} className="text-sm font-normal">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Report Options */}
          <div className="space-y-4">
            <Label>Report Options</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {[
                  { key: "include_summary", label: "Include Executive Summary" },
                  { key: "include_charts", label: "Include Charts and Graphs" },
                  { key: "include_details", label: "Include Detailed Records" },
                  { key: "include_recommendations", label: "Include Recommendations" },
                ].map((option) => (
                  <div key={option.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.key}
                      checked={formData[option.key as keyof ReportFormData] as boolean}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, [option.key]: checked as boolean }))
                      }
                    />
                    <Label htmlFor={option.key} className="text-sm font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Fields */}
          <div className="space-y-2">
            <Label>Additional Data Fields</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {customFieldOptions.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`field-${field}`}
                    checked={formData.custom_fields.includes(field)}
                    onCheckedChange={(checked) => handleCustomFieldChange(field, checked as boolean)}
                  />
                  <Label htmlFor={`field-${field}`} className="text-sm font-normal">
                    {field}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Format and Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select
                value={formData.format}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, format: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV File</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                  <SelectItem value="html">HTML Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery_method">Delivery Method</Label>
              <Select
                value={formData.delivery_method}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, delivery_method: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="download">Download Now</SelectItem>
                  <SelectItem value="email">Send via Email</SelectItem>
                  <SelectItem value="schedule">Schedule Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Email Recipients (if email delivery selected) */}
          {formData.delivery_method === "email" && (
            <div className="space-y-2">
              <Label htmlFor="email_recipients">Email Recipients</Label>
              <Input
                id="email_recipients"
                value={formData.email_recipients}
                onChange={(e) => setFormData((prev) => ({ ...prev, email_recipients: e.target.value }))}
                placeholder="Enter email addresses separated by commas"
              />
            </div>
          )}

          {/* Schedule Frequency (if scheduled delivery selected) */}
          {formData.delivery_method === "schedule" && (
            <div className="space-y-2">
              <Label htmlFor="schedule_frequency">Schedule Frequency</Label>
              <Select
                value={formData.schedule_frequency}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, schedule_frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
