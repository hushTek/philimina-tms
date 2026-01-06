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

export default function Page() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("")

  const { results, isLoading, loadMore, status: pagStatus } = usePaginatedQuery(
    api.loans.listPaginated,
    { search, status: (status as "active" | "completed" | "defaulted" | undefined) || undefined },
    { initialNumItems: 10 }
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loans</h1>
      </div>
      <div className="space-y-4">
        <div className="flex gap-3">
          <Input
            placeholder="Search by client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-48 border rounded-md px-3 py-2 bg-transparent"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="defaulted">Defaulted</option>
          </select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Principal</TableHead>
              <TableHead>Outstanding</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results?.map((l) => (
              <TableRow key={l._id}>
                <TableCell className="font-medium">{(l as { clientName?: string }).clientName ?? "-"}</TableCell>
                <TableCell>{Intl.NumberFormat().format(l.principalAmount)}</TableCell>
                <TableCell>{Intl.NumberFormat().format(l.outstandingBalance)}</TableCell>
                <TableCell className="capitalize">{l.status}</TableCell>
              </TableRow>
            ))}
            {results && results.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                  No loans found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-end">
          <Button
            variant="outline"
            disabled={isLoading || pagStatus === "Exhausted"}
            onClick={() => loadMore(10)}
          >
            {pagStatus === "Exhausted" ? "No more" : isLoading ? "Loading..." : "Load more"}
          </Button>
        </div>
      </div>
    </div>
  )
}
