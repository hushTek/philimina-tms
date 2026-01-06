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
    api.applications.listPaginated,
    { search, status: (status as "draft" | "submitted" | "awaiting_referee" | "under_review" | "approved" | "rejected" | undefined) || undefined },
    { initialNumItems: 10 }
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Applications</h1>
      </div>
      <div className="space-y-4">
        <div className="flex gap-3">
          <Input
            placeholder="Search by client or purpose..."
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
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="awaiting_referee">Awaiting Referee</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results?.map((a) => (
              <TableRow key={a._id}>
                <TableCell className="font-medium">{(a as { clientName?: string }).clientName ?? "-"}</TableCell>
                <TableCell>{a.loanPurpose}</TableCell>
                <TableCell>{Intl.NumberFormat().format(a.requestedAmount)}</TableCell>
                <TableCell className="capitalize">{a.status.replace("_", " ")}</TableCell>
              </TableRow>
            ))}
            {results && results.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                  No applications found
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
