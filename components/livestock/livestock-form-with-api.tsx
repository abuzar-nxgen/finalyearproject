"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { livestockAPI } from "@/services/api"
import { useApiSubmit } from "@/hooks/use-api-data"

interface LivestockFormProps {
  onCancel: () => void
  onSuccess?: () => void
}

export function LivestockFormWithApi({ onCancel, onSuccess }: LivestockFormProps) {
  const { t, direction } = useLanguage()
  const { toast } = useToast()
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    type: "",
    breed: "",
    gender: "",
    weight: "",
    status: "",
    notes: "",
  })

  const { submit, isSubmitting } = useApiSubmit(livestockAPI.create)

  // Organized translations
  const translations = {
    form: {
      type: t("قسم"),
      selectType: t("قسم منتخب کریں"),
      breed: t("نسل"),
      enterBreed: t("نسل درج کریں"),
      gender: t("جنس"),
      selectGender: t("جنس منتخب کریں"),
      birthDate: t("تاریخ پیدائش"),
      selectDate: t("تاریخ منتخب کریں"),
      weight: t("وزن"),
      enterWeight: t("وزن درج کریں"),
      kg: t("کلوگرام"),
      status: t("حالت"),
      selectStatus: t("حالت منتخب کریں"),
      notes: t("نوٹس"),
      enterNotes: t("نوٹس درج کریں"),
      cancel: t("منسوخ کریں"),
      saving: t("محفوظ ہو رہا ہے..."),
      saveLivestock: t("مویشی محفوظ کریں")
    },
    options: {
      cattle: t("گائے"),
      sheep: t("بھیڑ"),
      goats: t("بکری"),
      horses: t("گھوڑا"),
      camels: t("اونٹ"),
      male: t("نر"),
      female: t("مادہ"),
      healthy: t("صحت مند"),
      sick: t("بیمار"),
      pregnant: t("حاملہ"),
      lactating: t("دودھ دینے والی")
    },
    messages: {
      validationError: t("تصدیق کی خرابی"),
      allFieldsRequired: t("تمام ضروری فیلڈز بھریں"),
      success: t("کامیابی"),
      livestockAddedSuccessfully: t("مویشی کامیابی سے شامل ہو گیا"),
      error: t("خرابی"),
      failedToAddLivestock: t("مویشی شامل کرنے میں ناکامی")
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.type || !formData.breed || !formData.gender || !date || !formData.weight || !formData.status) {
      toast({
        title: translations.messages.validationError,
        description: translations.messages.allFieldsRequired,
        variant: "destructive",
      })
      return
    }

    try {
      await submit({
        ...formData,
        birthDate: date?.toISOString().split("T")[0],
        weight: Number.parseFloat(formData.weight),
      })

      toast({
        title: translations.messages.success,
        description: translations.messages.livestockAddedSuccessfully,
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: translations.messages.error,
        description: translations.messages.failedToAddLivestock,
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">{translations.form.type}</Label>
          <Select onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder={translations.form.selectType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cattle">{translations.options.cattle}</SelectItem>
              <SelectItem value="sheep">{translations.options.sheep}</SelectItem>
              <SelectItem value="goats">{translations.options.goats}</SelectItem>
              <SelectItem value="horses">{translations.options.horses}</SelectItem>
              <SelectItem value="camels">{translations.options.camels}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="breed">{translations.form.breed}</Label>
          <Input
            id="breed"
            placeholder={translations.form.enterBreed}
            className={direction === "rtl" ? "text-right" : "text-left"}
            value={formData.breed}
            onChange={(e) => handleChange("breed", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">{translations.form.gender}</Label>
          <Select onValueChange={(value) => handleChange("gender", value)}>
            <SelectTrigger id="gender">
              <SelectValue placeholder={translations.form.selectGender} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{translations.options.male}</SelectItem>
              <SelectItem value="female">{translations.options.female}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">{translations.form.birthDate}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : translations.form.selectDate}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">{translations.form.weight}</Label>
          <div className="flex">
            <Input
              id="weight"
              type="number"
              placeholder={translations.form.enterWeight}
              className={cn("rounded-r-none", direction === "rtl" ? "text-right" : "text-left")}
              value={formData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
            />
            <div className="flex items-center justify-center rounded-r-md border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
              {translations.form.kg}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">{translations.form.status}</Label>
          <Select onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder={translations.form.selectStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="healthy">{translations.options.healthy}</SelectItem>
              <SelectItem value="sick">{translations.options.sick}</SelectItem>
              <SelectItem value="pregnant">{translations.options.pregnant}</SelectItem>
              <SelectItem value="lactating">{translations.options.lactating}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">{translations.form.notes}</Label>
        <Input
          id="notes"
          placeholder={translations.form.enterNotes}
          className={direction === "rtl" ? "text-right" : "text-left"}
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} type="button">
          {translations.form.cancel}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? translations.form.saving : translations.form.saveLivestock}
        </Button>
      </div>
    </form>
  )
}