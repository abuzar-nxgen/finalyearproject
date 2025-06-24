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
import { feedingAPI } from "@/services/api"

interface FeedingFormData {
  livestock_tag: string
  feed_type: string
  feed_brand: string
  quantity: string
  unit: string
  cost_per_unit: string
  total_cost: string
  feeding_date: Date | undefined
  feeding_time: string
  location: string
  weather_conditions: string
  animal_condition: string
  notes: string
  next_feeding_date: Date | undefined
}

interface AddFeedingRecordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddFeedingRecordForm({ onSuccess, onCancel }: AddFeedingRecordFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FeedingFormData>({
    livestock_tag: "",
    feed_type: "",
    feed_brand: "",
    quantity: "",
    unit: "kg",
    cost_per_unit: "",
    total_cost: "",
    feeding_date: new Date(),
    feeding_time: "",
    location: "",
    weather_conditions: "",
    animal_condition: "good",
    notes: "",
    next_feeding_date: undefined,
  })

  // Calculate total cost when quantity or cost per unit changes
  const calculateTotalCost = (quantity: string, costPerUnit: string) => {
    const qty = Number.parseFloat(quantity) || 0
    const cost = Number.parseFloat(costPerUnit) || 0
    return (qty * cost).toFixed(2)
  }

  const handleQuantityChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      quantity: value,
      total_cost: calculateTotalCost(value, prev.cost_per_unit),
    }))
  }

  const handleCostPerUnitChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      cost_per_unit: value,
      total_cost: calculateTotalCost(prev.quantity, value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.livestock_tag.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the livestock tag number",
        variant: "destructive",
      })
      return
    }

    if (!formData.feed_type) {
      toast({
        title: "Validation Error",
        description: "Please select the feed type",
        variant: "destructive",
      })
      return
    }

    if (!formData.quantity || Number.parseFloat(formData.quantity) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      })
      return
    }

    if (!formData.feeding_date) {
      toast({
        title: "Validation Error",
        description: "Please select the feeding date",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const newRecord = await feedingAPI.create({
        livestock_tag: formData.livestock_tag.trim(),
        feed_type: formData.feed_type,
        feed_brand: formData.feed_brand,
        quantity: Number.parseFloat(formData.quantity),
        unit: formData.unit,
        cost_per_unit: formData.cost_per_unit ? Number.parseFloat(formData.cost_per_unit) : 0,
        total_cost: formData.total_cost ? Number.parseFloat(formData.total_cost) : 0,
        feeding_date: format(formData.feeding_date, "yyyy-MM-dd"),
        feeding_time: formData.feeding_time,
        location: formData.location,
        weather_conditions: formData.weather_conditions,
        animal_condition: formData.animal_condition,
        notes: formData.notes.trim(),
        next_feeding_date: formData.next_feeding_date ? format(formData.next_feeding_date, "yyyy-MM-dd") : "",
      })

      toast({
        title: "Success",
        description: "Feeding record added successfully",
      })

      // Reset form
      setFormData({
        livestock_tag: "",
        feed_type: "",
        feed_brand: "",
        quantity: "",
        unit: "kg",
        cost_per_unit: "",
        total_cost: "",
        feeding_date: new Date(),
        feeding_time: "",
        location: "",
        weather_conditions: "",
        animal_condition: "good",
        notes: "",
        next_feeding_date: undefined,
      })

      onSuccess?.()
    } catch (error) {
      console.error("Error creating feeding record:", error)
      toast({
        title: "Error",
        description: "Failed to add feeding record. Please try again.",
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
          Add Feeding Record
        </CardTitle>
        <CardDescription>Record feeding information for your livestock</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Animal and Feed Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="livestock_tag">Livestock Tag *</Label>
              <Input
                id="livestock_tag"
                value={formData.livestock_tag}
                onChange={(e) => setFormData((prev) => ({ ...prev, livestock_tag: e.target.value }))}
                placeholder="Enter livestock tag number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feed_type">Feed Type *</Label>
              <Select
                value={formData.feed_type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, feed_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feed type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hay">Hay</SelectItem>
                  <SelectItem value="grain">Grain</SelectItem>
                  <SelectItem value="pellets">Pellets</SelectItem>
                  <SelectItem value="silage">Silage</SelectItem>
                  <SelectItem value="supplements">Supplements</SelectItem>
                  <SelectItem value="minerals">Minerals</SelectItem>
                  <SelectItem value="vitamins">Vitamins</SelectItem>
                  <SelectItem value="concentrate">Concentrate</SelectItem>
                  <SelectItem value="pasture">Pasture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Feed Brand and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feed_brand">Feed Brand</Label>
              <Input
                id="feed_brand"
                value={formData.feed_brand}
                onChange={(e) => setFormData((prev) => ({ ...prev, feed_brand: e.target.value }))}
                placeholder="Enter feed brand name"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  placeholder="0.0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kg</SelectItem>
                    <SelectItem value="lbs">Lbs</SelectItem>
                    <SelectItem value="tons">Tons</SelectItem>
                    <SelectItem value="bales">Bales</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Cost Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost_per_unit">Cost per Unit ($)</Label>
              <Input
                id="cost_per_unit"
                type="number"
                step="0.01"
                value={formData.cost_per_unit}
                onChange={(e) => handleCostPerUnitChange(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_cost">Total Cost ($)</Label>
              <Input
                id="total_cost"
                type="number"
                step="0.01"
                value={formData.total_cost}
                onChange={(e) => setFormData((prev) => ({ ...prev, total_cost: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Feeding Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.feeding_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.feeding_date ? format(formData.feeding_date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.feeding_date}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, feeding_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeding_time">Feeding Time</Label>
              <Input
                id="feeding_time"
                type="time"
                value={formData.feeding_time}
                onChange={(e) => setFormData((prev) => ({ ...prev, feeding_time: e.target.value }))}
              />
            </div>
          </div>

          {/* Location and Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Feeding Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Enter feeding location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weather_conditions">Weather Conditions</Label>
              <Select
                value={formData.weather_conditions}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, weather_conditions: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select weather" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">Sunny</SelectItem>
                  <SelectItem value="cloudy">Cloudy</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                  <SelectItem value="windy">Windy</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Animal Condition and Next Feeding */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="animal_condition">Animal Condition</Label>
              <Select
                value={formData.animal_condition}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, animal_condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="sick">Sick</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Next Feeding Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.next_feeding_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.next_feeding_date ? format(formData.next_feeding_date, "PPP") : <span>Optional</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.next_feeding_date}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, next_feeding_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter any additional notes about the feeding..."
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
                  Add Feeding Record
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
