"use client"

import { useState } from "react"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useLanguage } from "@/components/language-provider"

export default function Page() {
  const { t } = useLanguage()
  const [search, setSearch] = useState("")

  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.contacts.listPaginated,
    { search },
    { initialNumItems: 10 }
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.dashboard?.contacts?.title || "Contacts"}</h1>
      </div>
      <div className="space-y-4">
        <div className="flex gap-3">
          <Input
            placeholder={t.dashboard?.contacts?.searchPlaceholder || "Search name, email or phone..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.dashboard?.contacts?.table?.name || "Name"}</TableHead>
              <TableHead>{t.dashboard?.contacts?.table?.email || "Email"}</TableHead>
              <TableHead>{t.dashboard?.contacts?.table?.phone || "Phone"}</TableHead>
              <TableHead>{t.dashboard?.contacts?.table?.region || "Region"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results?.map((c) => (
              <TableRow key={c._id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.address?.region ?? "-"}</TableCell>
              </TableRow>
            ))}
            {results && results.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                  {t.dashboard?.contacts?.empty || "No clients found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-end">
          <Button
            variant="outline"
            disabled={isLoading || status === "Exhausted"}
            onClick={() => loadMore(10)}
          >
            {status === "Exhausted" 
              ? (t.dashboard?.contacts?.noMore || "No more") 
              : isLoading 
                ? (t.dashboard?.common?.loading || "Loading...") 
                : (t.dashboard?.contacts?.loadMore || "Load more")}
          </Button>
        </div>
      </div>
    </div>
  )
}