import { RoleGuard } from "@/components/role-guard"
import { UserManagementPage } from "@/components/admin/user-management-page"

export default function AdminUsersPage() {
  return (
    <RoleGuard requiredRole="admin" requiredSection="user_management">
      <UserManagementPage />
    </RoleGuard>
  )
}
