"use client"

import { useAuth, type UserRole } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { LogOut, Settings, User, ShieldCheck } from "lucide-react"
import Link from "next/link"

export function UserNav() {
  const { user, logout, hasPermission } = useAuth()
  const { t } = useLanguage()

  if (!user) return null

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  // Helper function to get badge for user role
  const getRoleBadge = (role: UserRole) => {
    const badges = {
      admin: "bg-red-100 text-red-800",
      manager: "bg-blue-100 text-blue-800",
      staff: "bg-green-100 text-green-800",
      viewer: "bg-gray-100 text-gray-800",
    }

    return badges[role] || badges.viewer
  }

  return (
    <div className="flex items-center gap-4">
      <LanguageSwitcher />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <div className="flex items-center gap-1">
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${getRoleBadge(user.role)}`}>
                  {t(user.role)}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings/profile" className="flex w-full cursor-pointer items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{t("profile")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="flex w-full cursor-pointer items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t("settings")}</span>
            </Link>
          </DropdownMenuItem>
          {hasPermission("admin") && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard/admin" className="flex w-full cursor-pointer items-center">
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>{t("adminPanel")}</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
