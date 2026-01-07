"use client"

import { useState } from "react"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function Page() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("")

  const { results, isLoading, loadMore, status: pagStatus } = usePaginatedQuery(
    api.applications.listPaginated,
    { search, status: (status as "draft" | "submitted" | "awaiting_referee" | "under_review" | "approved" | "rejected" | undefined) || undefined },
    { initialNumItems: 10 }
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500 hover:bg-green-600"
      case "rejected": return "bg-red-500 hover:bg-red-600"
      case "under_review": return "bg-blue-500 hover:bg-blue-600"
      case "submitted": return "bg-yellow-500 hover:bg-yellow-600"
      default: return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground mt-2">Manage and track loan applications.</p>
        </div>
      </div>

      <div className="border rounded-md bg-background">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
            <div className="flex gap-3 w-full md:w-auto">
              <Input
                placeholder="Search by client or purpose..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-40 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
          </div>
        </div>
        <div className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App No.</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results?.map((a) => (
                  <TableRow 
                    key={a._id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/dashboard/applications/${a._id}`)}
                  >
                    <TableCell className="font-mono text-sm">{a.applicationNumber}</TableCell>
                    <TableCell className="font-medium">{(a as { client?: any }).client?.name ?? "-"}</TableCell>
                    <TableCell>{format(new Date(a.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>{a.loanPurpose}</TableCell>
                    <TableCell className="font-medium">
                      {Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(a.requestedAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(a.status)}>
                        {a.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {results && results.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                      No applications found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              disabled={isLoading || pagStatus === "Exhausted"}
              onClick={() => loadMore(10)}
              className="w-full max-w-xs"
            >
              {pagStatus === "Exhausted" ? "No more applications" : isLoading ? "Loading..." : "Load more"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
