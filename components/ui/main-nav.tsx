"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const routes = [
    {
      href: "/dashboard",
      label: t("dashboard"),
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/livestock",
      label: t("livestock"),
      active: pathname === "/dashboard/livestock",
    },
    {
      href: "/dashboard/breeding",
      label: t("breeding"),
      active: pathname === "/dashboard/breeding",
    },
    {
      href: "/dashboard/feeding",
      label: t("feeding"),
      active: pathname === "/dashboard/feeding",
    },
    {
      href: "/dashboard/finances",
      label: t("finances"),
      active: pathname === "/dashboard/finances",
    },
    {
      href: "/dashboard/reports",
      label: t("reports"),
      active: pathname === "/dashboard/reports",
    },
    {
      href: "/dashboard/settings",
      label: t("settings"),
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "transition-colors hover:text-foreground/80",
            route.active ? "text-foreground" : "text-foreground/60",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
