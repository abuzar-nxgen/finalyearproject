"use client"

import { useAuth } from "@/components/auth-provider"
import type { ReactNode } from "react"

interface RoleGuardProps {
  children: ReactNode
  requiredSection?: string
  requiredAction?: string
  fallback?: ReactNode
}

export function RoleGuard({ children, requiredSection, requiredAction, fallback = null }: RoleGuardProps) {
  const { user, canAccessSection, hasPermission } = useAuth()

  if (!user) {
    return <>{fallback}</>
  }

  // Check section access
  if (requiredSection && !canAccessSection(requiredSection)) {
    return <>{fallback}</>
  }

  // Check specific permission
  if (requiredSection && requiredAction && !hasPermission(requiredSection, requiredAction)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
