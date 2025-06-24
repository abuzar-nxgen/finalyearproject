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
import { CalendarIcon, Plus, Loader2, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { financialAPI } from "@/services/api"

interface FinancialFormData {
  type: "income" | "expense"
  category: string
  subcategory: string
  amount: string
  description: string
  transaction_date: Date | undefined
  payment_method: string
  reference_number: string
  livestock_tag: string
  vendor_supplier: string
  tax_amount: string
  recurring: boolean
  recurring_frequency: string
  notes: string
}

interface AddFinancialRecordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddFinancialRecordForm({ onSuccess, onCancel }: AddFinancialRecordFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FinancialFormData>({
    type: "expense",
    category: "",
    subcategory: "",
    amount: "",
    description: "",
    transaction_date: new Date(),
    payment_method: "",
    reference_number: "",
    livestock_tag: "",
    vendor_supplier: "",
    tax_amount: "",
    recurring: false,
    recurring_frequency: "",
    notes: "",
  })

  const expenseCategories = {
    "Feed & Nutrition": ["Hay", "Grain", "Pellets", "Supplements", "Minerals", "Vitamins"],
    Veterinary: ["Vaccinations", "Treatments", "Check-ups", "Medications", "Surgery", "Emergency Care"],
    Equipment: ["Tools", "Machinery", "Vehicles", "Buildings", "Fencing", "Water Systems"],
    Labor: ["Wages", "Benefits", "Contractors", "Consultants"],
    Utilities: ["Electricity", "Water", "Gas", "Internet", "Phone"],
    Insurance: ["Livestock", "Property", "Liability", "Health"],
    Transportation: ["Fuel", "Vehicle Maintenance", "Shipping", "Delivery"],
    Maintenance: ["Repairs", "Cleaning", "Upgrades", "Replacements"],
    Other: ["Licenses", "Permits", "Training", "Miscellaneous"],
  }

  const incomeCategories = {
    "Livestock Sales": ["Cattle", "Goats", "Sheep", "Pigs", "Chickens", "Other Animals"],
    "Product Sales": ["Milk", "Eggs", "Meat", "Wool", "Leather", "Manure"],
    "Breeding Services": ["Stud Fees", "Artificial Insemination", "Embryo Transfer"],
    Services: ["Consulting", "Training", "Equipment Rental", "Labor"],
    Government: ["Subsidies", "Grants", "Tax Credits", "Insurance Claims"],
    Other: ["Investments", "Rent", "Miscellaneous"],
  }

  const getCurrentCategories = () => {
    return formData.type === "income" ? incomeCategories : expenseCategories
  }

  const getCurrentSubcategories = () => {
    const categories = getCurrentCategories()
    return categories[formData.category as keyof typeof categories] || []
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      })
      return
    }

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a description",
        variant: "destructive",
      })
      return
    }

    if (!formData.transaction_date) {
      toast({
        title: "Validation Error",
        description: "Please select a transaction date",
        variant: "destructive",
      })
      return
    }

    if (!formData.payment_method) {
      toast({
        title: "Validation Error",
        description: "Please select a payment method",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const newRecord = await financialAPI.create({
        type: formData.type,
        category: formData.category,
        subcategory: formData.subcategory,
        amount: Number.parseFloat(formData.amount),
        description: formData.description.trim(),
        transaction_date: format(formData.transaction_date, "yyyy-MM-dd"),
        payment_method: formData.payment_method,
        reference_number: formData.reference_number,
        livestock_tag: formData.livestock_tag,
        vendor_supplier: formData.vendor_supplier,
        tax_amount: formData.tax_amount ? Number.parseFloat(formData.tax_amount) : 0,
        recurring: formData.recurring,
        recurring_frequency: formData.recurring_frequency,
        notes: formData.notes.trim(),
      })

      toast({
        title: "Success",
        description: "Financial record added successfully",
      })

      // Reset form
      setFormData({
        type: "expense",
        category: "",
        subcategory: "",
        amount: "",
        description: "",
        transaction_date: new Date(),
        payment_method: "",
        reference_number: "",
        livestock_tag: "",
        vendor_supplier: "",
        tax_amount: "",
        recurring: false,
        recurring_frequency: "",
        notes: "",
      })

      onSuccess?.()
    } catch (error) {
      console.error("Error creating financial record:", error)
      toast({
        title: "Error",
        description: "Failed to add financial record. Please try again.",
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
          <DollarSign className="h-5 w-5" />
          Add Financial Record
        </CardTitle>
        <CardDescription>Record income or expense transactions for your livestock operation</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "income" | "expense") =>
                setFormData((prev) => ({ ...prev, type: value, category: "", subcategory: "" }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value, subcategory: "" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(getCurrentCategories()).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select
                value={formData.subcategory}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, subcategory: value }))}
                disabled={!formData.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {getCurrentSubcategories().map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount and Tax */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($) *</Label>
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
              <Label htmlFor="tax_amount">Tax Amount ($)</Label>
              <Input
                id="tax_amount"
                type="number"
                step="0.01"
                value={formData.tax_amount}
                onChange={(e) => setFormData((prev) => ({ ...prev, tax_amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the transaction"
              required
            />
          </div>

          {/* Date and Payment Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Transaction Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.transaction_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.transaction_date ? format(formData.transaction_date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.transaction_date}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, transaction_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method *</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, payment_method: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="online_payment">Online Payment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reference Number and Vendor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference_number">Reference Number</Label>
              <Input
                id="reference_number"
                value={formData.reference_number}
                onChange={(e) => setFormData((prev) => ({ ...prev, reference_number: e.target.value }))}
                placeholder="Invoice/Receipt number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor_supplier">Vendor/Supplier</Label>
              <Input
                id="vendor_supplier"
                value={formData.vendor_supplier}
                onChange={(e) => setFormData((prev) => ({ ...prev, vendor_supplier: e.target.value }))}
                placeholder="Company or person name"
              />
            </div>
          </div>

          {/* Livestock Tag */}
          <div className="space-y-2">
            <Label htmlFor="livestock_tag">Related Livestock Tag</Label>
            <Input
              id="livestock_tag"
              value={formData.livestock_tag}
              onChange={(e) => setFormData((prev) => ({ ...prev, livestock_tag: e.target.value }))}
              placeholder="Enter livestock tag if applicable"
            />
          </div>

          {/* Recurring Transaction */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.recurring}
                onChange={(e) => setFormData((prev) => ({ ...prev, recurring: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="recurring">This is a recurring transaction</Label>
            </div>
            {formData.recurring && (
              <div className="space-y-2">
                <Label htmlFor="recurring_frequency">Frequency</Label>
                <Select
                  value={formData.recurring_frequency}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, recurring_frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter any additional notes about the transaction..."
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
                  Add Financial Record
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
