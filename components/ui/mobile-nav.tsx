"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { X } from "lucide-react"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const { t, direction } = useLanguage()

  // Close the mobile nav when the route changes
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  const navItems = [
    { href: "/dashboard", label: "dashboard" },
    { href: "/dashboard/livestock", label: "livestockManagement" },
    { href: "/dashboard/health", label: "healthRecords" },
    { href: "/dashboard/breeding", label: "breedingManagement" },
    { href: "/dashboard/feeding", label: "feedingManagement" },
    { href: "/dashboard/finances", label: "financialManagement" },
    { href: "/dashboard/staff", label: "veterinaryStaff" },
    { href: "/dashboard/reports", label: "reportsAnalytics" },
    { href: "/dashboard/settings", label: "settings" },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={direction === "rtl" ? "right" : "left"} className="w-[300px] sm:w-[400px]">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{t("appName")}</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">{t("close")}</span>
            </Button>
          </div>
        </SheetHeader>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)]">
          <div className="flex flex-col space-y-2 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                {t(item.label)}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
