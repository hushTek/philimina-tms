"use client"
import { useLanguage } from "@/components/language-provider"

export default function Page () { 
    const { t } = useLanguage()

    return (
        <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t.dashboard?.nav?.dashboard || "Dashboard"}</h1>
      <p className="text-muted-foreground">{t.dashboard?.overview?.subtitle || "Track and manage loan applications here."}</p>
    </div>
    )
}