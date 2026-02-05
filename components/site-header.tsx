"use client"

import { usePathname } from "next/navigation"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { LayoutDashboard } from "lucide-react"

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
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost">{t.header?.signIn || "Sign In"}</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>{t.header?.signUp || "Sign Up"}</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              {t.header?.dashboard || "Dashboard"}
            </Button>
          </Link>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  )
}
