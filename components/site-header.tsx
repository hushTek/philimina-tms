"use client"

import { usePathname } from "next/navigation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
import Link from "next/link"

export function SiteHeader() {
  const pathname = usePathname()
  const { t } = useLanguage()

  // Do not show this header on dashboard pages
  if (pathname?.startsWith("/dashboard")) {
    return null
  }

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center gap-2">
         <Link href="/" className="font-bold text-xl flex items-center gap-2">
           <img src="/icon_only.png" alt="TFM Logo" className="w-8 h-8 rounded-full object-contain" />
           <span>TFM</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
      </div>
    </header>
  )
}
