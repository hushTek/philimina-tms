"use client"

import { useState } from "react"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RepaymentsPage() {
  const [search, setSearch] = useState("")
  const [method, setMethod] = useState<string>("")

  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.transactions.listRepaymentsPaginated,
    { search, method: (method as "cash" | "mobile_money" | "bank" | undefined) || undefined },
    { initialNumItems: 10 }
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold">Repayments</h1>
            <p className="text-muted-foreground">
                Track and manage loan repayments from customers.
            </p>
        </div>
      </div>

      <div>
        <div className="flex gap-3 mb-4">
          <Input
            placeholder="Search by contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-44 border rounded-md px-3 py-2 bg-transparent"
          >
            <option value="">All Methods</option>
            <option value="cash">Cash</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="bank">Bank</option>
          </select>
        </div>
        {!results ? (
          <div className="p-4 text-center">Loading repayments...</div>
        ) : results.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No repayments found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{(t as { clientName?: string }).clientName}</TableCell>
                  <TableCell className="font-bold text-green-600">
                    +{t.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize">{t.method.replace("_", " ")}</TableCell>
                  <TableCell className="font-mono text-xs">{t.reference || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Received
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            disabled={isLoading || status === "Exhausted"}
            onClick={() => loadMore(10)}
          >
            {status === "Exhausted" ? "No more" : isLoading ? "Loading..." : "Load more"}
          </Button>
        </div>
      </div>
    </div>
  )
}
