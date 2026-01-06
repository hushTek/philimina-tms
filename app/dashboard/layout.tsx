import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden">
            <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
           {/* On desktop, we might want a trigger too, or maybe not if we want to mimic old behavior exactly. 
               But usually shadcn sidebar has a trigger. 
               Let's add it only for mobile for now to strictly mimic "mobile sidebar" behavior, 
               OR add it globally. 
               The user said "dashboard modals appear below the sidebar instead of top".
               With SidebarProvider, z-index is handled better.
           */}
           <div className="hidden md:flex items-center gap-2 mb-4">
              <SidebarTrigger />
           </div>
           {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
