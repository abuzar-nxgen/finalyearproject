"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleGuard } from "@/components/role-guard"
import { LivestockOverview } from "@/components/livestock/livestock-overview"
import { HealthRecords } from "@/components/health/health-records"
import { UserManagement } from "@/components/admin/user-management"
import { SystemSettings } from "@/components/admin/system-settings"
import { AdvancedReports } from "@/components/admin/advanced-reports"
import { FinancialManagement } from "@/components/finances/financial-management"
import { BreedingManagement } from "@/components/breeding/breeding-management"

export function DynamicDashboard() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
      <p className="text-muted-foreground">
        You are logged in as: <span className="font-medium capitalize">{user.role}</span>
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Livestock Overview - Available to all users */}
        <RoleGuard requiredSection="livestock_overview">
          <Card>
            <CardHeader>
              <CardTitle>Livestock Overview</CardTitle>
              <CardDescription>View your livestock inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <LivestockOverview />
            </CardContent>
          </Card>
        </RoleGuard>

        {/* Health Records - Available to all users */}
        <RoleGuard requiredSection="health_records">
          <Card>
            <CardHeader>
              <CardTitle>Health Records</CardTitle>
              <CardDescription>Track animal health and treatments</CardDescription>
            </CardHeader>
            <CardContent>
              <HealthRecords />
            </CardContent>
          </Card>
        </RoleGuard>

        {/* User Management - Admin only */}
        <RoleGuard requiredSection="user_management">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </RoleGuard>

        {/* System Settings - Admin only */}
        <RoleGuard requiredSection="system_settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <SystemSettings />
            </CardContent>
          </Card>
        </RoleGuard>

        {/* Advanced Reports - Admin only */}
        <RoleGuard requiredSection="advanced_reports">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Reports</CardTitle>
              <CardDescription>Generate detailed system reports</CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedReports />
            </CardContent>
          </Card>
        </RoleGuard>

        {/* Financial Management - Admin only */}
        <RoleGuard requiredSection="financial_management">
          <Card>
            <CardHeader>
              <CardTitle>Financial Management</CardTitle>
              <CardDescription>Track expenses and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialManagement />
            </CardContent>
          </Card>
        </RoleGuard>

        {/* Breeding Management - Admin only */}
        <RoleGuard requiredSection="breeding_management">
          <Card>
            <CardHeader>
              <CardTitle>Breeding Management</CardTitle>
              <CardDescription>Track breeding programs and genealogy</CardDescription>
            </CardHeader>
            <CardContent>
              <BreedingManagement />
            </CardContent>
          </Card>
        </RoleGuard>
      </div>
    </div>
  )
}
