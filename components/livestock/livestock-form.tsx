"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { livestockAPI } from "@/services/api"

interface LivestockFormProps {
  onCancel: () => void
  onSuccess?: () => void
}

export function LivestockForm({ onCancel, onSuccess }: LivestockFormProps) {
  const { t, direction } = useLanguage()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [formData, setFormData] = useState({
    tag_number: "",
    animal_type: "",
    breed: "",
    gender: "",
    weight: "",
    status: "",
    notes: "",
  })

  // Organized translations
  const translations = {
    form: {
      tagNumber: t("ٹیگ نمبر"),
      enterTagNumber: t("ٹیگ نمبر درج کریں (مثال: COW001)"),
      animalType: t("جانور کی قسم"),
      selectAnimalType: t("جانور کی قسم منتخب کریں"),
      breed: t("نسل"),
      enterBreed: t("نسل درج کریں"),
      gender: t("جنس"),
      selectGender: t("جنس منتخب کریں"),
      birthDate: t("تاریخ پیدائش"),
      weight: t("وزن"),
      enterWeight: t("وزن درج کریں"),
      kg: t("کلوگرام"),
      status: t("حالت"),
      selectStatus: t("حالت منتخب کریں"),
      notes: t("نوٹس"),
      enterNotes: t("اضافی نوٹس درج کریں"),
      cancel: t("منسوخ کریں"),
      adding: t("شامل کیا جا رہا ہے..."),
      addLivestock: t("مویشی شامل کریں")
    },
    options: {
      cattle: t("گائے"),
      sheep: t("بھیڑ"),
      goat: t("بکری"),
      horse: t("گھوڑا"),
      pig: t("سور"),
      chicken: t("مرغی"),
      male: t("نر"),
      female: t("مادہ"),
      healthy: t("صحت مند"),
      sick: t("بیمار"),
      pregnant: t("حاملہ"),
      lactating: t("دودھ دینے والی"),
      sold: t("فروخت شدہ")
    },
    messages: {
      validationError: t("تصدیق کی خرابی"),
      fillAllFields: t("براہ کرم تمام ضروری فیلڈز بھریں"),
      success: t("کامیابی"),
      livestockAdded: t("مویشی کامیابی سے شامل ہو گیا"),
      error: t("خرابی"),
      addFailed: t("مویشی شامل کرنے میں ناکامی")
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.tag_number ||
      !formData.animal_type ||
      !formData.breed ||
      !formData.gender ||
      !date ||
      !formData.weight ||
      !formData.status
    ) {
      toast({
        title: translations.messages.validationError,
        description: translations.messages.fillAllFields,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const livestockData = {
        tag_number: formData.tag_number,
        animal_type: formData.animal_type,
        breed: formData.breed,
        gender: formData.gender,
        birth_date: date ? new Date(date).toISOString().split("T")[0] : undefined,
        weight: Number.parseFloat(formData.weight),
        status: formData.status,
        notes: formData.notes,
      }

      const result = await livestockAPI.create(livestockData)

      toast({
        title: translations.messages.success,
        description: translations.messages.livestockAdded,
      })

      // Reset form
      setFormData({
        tag_number: "",
        animal_type: "",
        breed: "",
        gender: "",
        weight: "",
        status: "",
        notes: "",
      })
      setDate("")

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: translations.messages.error,
        description: translations.messages.addFailed,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tag_number">{translations.form.tagNumber} *</Label>
          <Input
            id="tag_number"
            placeholder={translations.form.enterTagNumber}
            className={direction === "rtl" ? "text-right" : "text-left"}
            value={formData.tag_number}
            onChange={(e) => handleChange("tag_number", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="animal_type">{translations.form.animalType} *</Label>
          <Select onValueChange={(value) => handleChange("animal_type", value)} value={formData.animal_type}>
            <SelectTrigger id="animal_type">
              <SelectValue placeholder={translations.form.selectAnimalType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cattle">{translations.options.cattle}</SelectItem>
              <SelectItem value="Sheep">{translations.options.sheep}</SelectItem>
              <SelectItem value="Goat">{translations.options.goat}</SelectItem>
              <SelectItem value="Horse">{translations.options.horse}</SelectItem>
              <SelectItem value="Pig">{translations.options.pig}</SelectItem>
              <SelectItem value="Chicken">{translations.options.chicken}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="breed">{translations.form.breed} *</Label>
          <Input
            id="breed"
            placeholder={translations.form.enterBreed}
            className={direction === "rtl" ? "text-right" : "text-left"}
            value={formData.breed}
            onChange={(e) => handleChange("breed", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">{translations.form.gender} *</Label>
          <Select onValueChange={(value) => handleChange("gender", value)} value={formData.gender}>
            <SelectTrigger id="gender">
              <SelectValue placeholder={translations.form.selectGender} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">{translations.options.male}</SelectItem>
              <SelectItem value="Female">{translations.options.female}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birth_date">{translations.form.birthDate} *</Label>
          <Input
            id="birth_date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">{translations.form.weight} *</Label>
          <div className="flex">
            <Input
              id="weight"
              type="number"
              placeholder={translations.form.enterWeight}
              className={cn("rounded-r-none", direction === "rtl" ? "text-right" : "text-left")}
              value={formData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              required
            />
            <div className="flex items-center justify-center rounded-r-md border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
              {translations.form.kg}
            </div>
          </div>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="status">{translations.form.status} *</Label>
          <Select onValueChange={(value) => handleChange("status", value)} value={formData.status}>
            <SelectTrigger id="status">
              <SelectValue placeholder={translations.form.selectStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Healthy">{translations.options.healthy}</SelectItem>
              <SelectItem value="Sick">{translations.options.sick}</SelectItem>
              <SelectItem value="Pregnant">{translations.options.pregnant}</SelectItem>
              <SelectItem value="Lactating">{translations.options.lactating}</SelectItem>
              <SelectItem value="Sold">{translations.options.sold}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">{translations.form.notes}</Label>
        <Textarea
          id="notes"
          placeholder={translations.form.enterNotes}
          className={direction === "rtl" ? "text-right" : "text-left"}
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} type="button" disabled={isSubmitting}>
          {translations.form.cancel}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? translations.form.adding : translations.form.addLivestock}
        </Button>
      </div>
    </form>
  )
}