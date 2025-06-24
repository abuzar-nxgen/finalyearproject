"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddBreedingRecordForm } from "@/components/forms/add-breeding-record-form"
import { AddFeedingRecordForm } from "@/components/forms/add-feeding-record-form"
import { AddFinancialRecordForm } from "@/components/forms/add-financial-record-form"
import { GenerateReportForm } from "@/components/forms/generate-report-form"
import { FileText, DollarSign, Heart, Wheat } from "lucide-react"

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState("breeding")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Livestock Management Forms</h1>
        <p className="text-muted-foreground mt-2">Add new records and generate reports for your livestock operation</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breeding" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Breeding
          </TabsTrigger>
          <TabsTrigger value="feeding" className="flex items-center gap-2">
            <Wheat className="h-4 w-4" />
            Feeding
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breeding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Breeding Record Form</CardTitle>
              <CardDescription>Record breeding events, track pregnancies, and manage breeding programs</CardDescription>
            </CardHeader>
            <CardContent>
              <AddBreedingRecordForm onSuccess={() => console.log("Breeding record added successfully")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feeding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feeding Record Form</CardTitle>
              <CardDescription>Track feed consumption, costs, and feeding schedules for your livestock</CardDescription>
            </CardHeader>
            <CardContent>
              <AddFeedingRecordForm onSuccess={() => console.log("Feeding record added successfully")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Record Form</CardTitle>
              <CardDescription>
                Record income and expenses to track the financial health of your operation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddFinancialRecordForm onSuccess={() => console.log("Financial record added successfully")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Generation Form</CardTitle>
              <CardDescription>Generate comprehensive reports for analysis and decision making</CardDescription>
            </CardHeader>
            <CardContent>
              <GenerateReportForm onSuccess={() => console.log("Report generated successfully")} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
