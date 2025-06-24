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
import { CalendarIcon, Plus, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { breedingAPI } from "@/services/api"

interface BreedingFormData {
  male_tag: string
  female_tag: string
  breeding_date: Date | undefined
  expected_due_date: Date | undefined
  breeding_method: string
  breeding_location: string
  veterinarian: string
  status: string
  notes: string
  breeding_cost: string
  success_probability: string
}

interface AddBreedingRecordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddBreedingRecordForm({ onSuccess, onCancel }: AddBreedingRecordFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<BreedingFormData>({
    male_tag: "",
    female_tag: "",
    breeding_date: new Date(),
    expected_due_date: undefined,
    breeding_method: "",
    breeding_location: "",
    veterinarian: "",
    status: "planned",
    notes: "",
    breeding_cost: "",
    success_probability: "",
  })

  // Calculate expected due date based on breeding date and animal type
  const calculateDueDate = (breedingDate: Date, animalType = "cattle") => {
    const date = new Date(breedingDate)
    const gestationPeriods = {
      cattle: 283, // 9 months
      goat: 150, // 5 months
      sheep: 147, // 5 months
      pig: 114, // 3.5 months
      horse: 340, // 11 months
    }
    const days = gestationPeriods[animalType as keyof typeof gestationPeriods] || 283
    date.setDate(date.getDate() + days)
    return date
  }

  const handleBreedingDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      breeding_date: date,
      expected_due_date: date ? calculateDueDate(date) : undefined,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.male_tag.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the male animal tag number",
        variant: "destructive",
      })
      return
    }

    if (!formData.female_tag.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the female animal tag number",
        variant: "destructive",
      })
      return
    }

    if (!formData.breeding_date) {
      toast({
        title: "Validation Error",
        description: "Please select the breeding date",
        variant: "destructive",
      })
      return
    }

    if (!formData.breeding_method) {
      toast({
        title: "Validation Error",
        description: "Please select the breeding method",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const newRecord = await breedingAPI.create({
        male_tag: formData.male_tag.trim(),
        female_tag: formData.female_tag.trim(),
        breeding_date: format(formData.breeding_date, "yyyy-MM-dd"),
        expected_due_date: formData.expected_due_date ? format(formData.expected_due_date, "yyyy-MM-dd") : "",
        breeding_method: formData.breeding_method,
        breeding_location: formData.breeding_location,
        veterinarian: formData.veterinarian,
        status: formData.status,
        notes: formData.notes.trim(),
        breeding_cost: formData.breeding_cost ? Number.parseFloat(formData.breeding_cost) : 0,
        success_probability: formData.success_probability ? Number.parseInt(formData.success_probability) : 0,
      })

      toast({
        title: "Success",
        description: "Breeding record added successfully",
      })

      // Reset form
      setFormData({
        male_tag: "",
        female_tag: "",
        breeding_date: new Date(),
        expected_due_date: undefined,
        breeding_method: "",
        breeding_location: "",
        veterinarian: "",
        status: "planned",
        notes: "",
        breeding_cost: "",
        success_probability: "",
      })

      onSuccess?.()
    } catch (error) {
      console.error("Error creating breeding record:", error)
      toast({
        title: "Error",
        description: "Failed to add breeding record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Breeding Record
        </CardTitle>
        <CardDescription>Record a new breeding event for your livestock animals</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Animal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="male_tag">Male Animal Tag *</Label>
              <Input
                id="male_tag"
                value={formData.male_tag}
                onChange={(e) => setFormData((prev) => ({ ...prev, male_tag: e.target.value }))}
                placeholder="Enter male animal tag number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="female_tag">Female Animal Tag *</Label>
              <Input
                id="female_tag"
                value={formData.female_tag}
                onChange={(e) => setFormData((prev) => ({ ...prev, female_tag: e.target.value }))}
                placeholder="Enter female animal tag number"
                required
              />
            </div>
          </div>

          {/* Breeding Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Breeding Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.breeding_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.breeding_date ? format(formData.breeding_date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.breeding_date}
                    onSelect={handleBreedingDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Expected Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expected_due_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expected_due_date ? (
                      format(formData.expected_due_date, "PPP")
                    ) : (
                      <span>Auto-calculated</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expected_due_date}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, expected_due_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Breeding Method and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breeding_method">Breeding Method *</Label>
              <Select
                value={formData.breeding_method}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, breeding_method: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select breeding method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Natural Breeding</SelectItem>
                  <SelectItem value="artificial_insemination">Artificial Insemination</SelectItem>
                  <SelectItem value="embryo_transfer">Embryo Transfer</SelectItem>
                  <SelectItem value="in_vitro_fertilization">In Vitro Fertilization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="breeding_location">Breeding Location</Label>
              <Input
                id="breeding_location"
                value={formData.breeding_location}
                onChange={(e) => setFormData((prev) => ({ ...prev, breeding_location: e.target.value }))}
                placeholder="Enter breeding location"
              />
            </div>
          </div>

          {/* Veterinarian and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="veterinarian">Veterinarian</Label>
              <Input
                id="veterinarian"
                value={formData.veterinarian}
                onChange={(e) => setFormData((prev) => ({ ...prev, veterinarian: e.target.value }))}
                placeholder="Enter veterinarian name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="confirmed_pregnant">Confirmed Pregnant</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="aborted">Aborted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cost and Success Probability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breeding_cost">Breeding Cost ($)</Label>
              <Input
                id="breeding_cost"
                type="number"
                step="0.01"
                value={formData.breeding_cost}
                onChange={(e) => setFormData((prev) => ({ ...prev, breeding_cost: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="success_probability">Success Probability (%)</Label>
              <Input
                id="success_probability"
                type="number"
                min="0"
                max="100"
                value={formData.success_probability}
                onChange={(e) => setFormData((prev) => ({ ...prev, success_probability: e.target.value }))}
                placeholder="85"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter any additional notes about the breeding..."
              rows={4}
            />
          </div>

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
                  Adding Record...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Breeding Record
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
