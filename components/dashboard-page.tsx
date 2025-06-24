"use client"

import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  MilkIcon as Cow,
  FileText,
  Home,
  Leaf,
  Plus,
  Settings,
  Tractor,
  TrendingUp,
  Users,
  Wheat,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LivestockTable } from "@/components/livestock-table"
import { HealthRecordsTable } from "@/components/health-records-table"
import { RecentActivities } from "@/components/recent-activities"
import { StatsCards } from "@/components/stats-cards"
import { FarmHeader } from "@/components/ui/farm-header"

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar className="border-r">
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <FarmHeader />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <Home className="h-4 w-4" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <BarChart3 className="h-4 w-4" />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <TrendingUp className="h-4 w-4" />
                      <span>Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Cow className="h-4 w-4" />
                      <span>Livestock</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Wheat className="h-4 w-4" />
                      <span>Feed</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Activity className="h-4 w-4" />
                      <span>Health</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Calendar className="h-4 w-4" />
                      <span>Schedule</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Farm</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Tractor className="h-4 w-4" />
                      <span>Equipment</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Leaf className="h-4 w-4" />
                      <span>Crops</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users className="h-4 w-4" />
                      <span>Staff</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-lg font-semibold">Livestock Management</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Livestock
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="livestock">Livestock</TabsTrigger>
                <TabsTrigger value="health">Health Records</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <StatsCards />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Livestock Distribution</CardTitle>
                      <CardDescription>Current livestock by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                              <span>Cattle</span>
                            </div>
                            <span className="font-medium">65%</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                              <span>Sheep</span>
                            </div>
                            <span className="font-medium">20%</span>
                          </div>
                          <Progress value={20} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
                              <span>Goats</span>
                            </div>
                            <span className="font-medium">10%</span>
                          </div>
                          <Progress value={10} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                              <span>Pigs</span>
                            </div>
                            <span className="font-medium">5%</span>
                          </div>
                          <Progress value={5} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Health Alerts</CardTitle>
                      <CardDescription>Recent health issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 rounded-lg border p-3">
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Vaccination Due</p>
                            <p className="text-xs text-muted-foreground">15 cattle due for vaccination this week</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 rounded-lg border p-3">
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-red-500" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Illness Detected</p>
                            <p className="text-xs text-muted-foreground">
                              3 sheep showing symptoms of respiratory issues
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 rounded-lg border p-3">
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Weight Loss</p>
                            <p className="text-xs text-muted-foreground">5 cattle showing abnormal weight loss</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <RecentActivities />
              </TabsContent>
              <TabsContent value="livestock">
                <Card>
                  <CardHeader>
                    <CardTitle>Livestock Inventory</CardTitle>
                    <CardDescription>Manage your livestock records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LivestockTable />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="health">
                <Card>
                  <CardHeader>
                    <CardTitle>Health Records</CardTitle>
                    <CardDescription>Track health events and treatments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <HealthRecordsTable />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
