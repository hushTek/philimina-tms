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
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function Page() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("")

  const { results, isLoading, loadMore, status: pagStatus } = usePaginatedQuery(
    api.loans.listPaginated,
    { search, status: (status as "new" | "active" | "completed" | "defaulted" | undefined) || undefined },
    { initialNumItems: 10 }
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(amount);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loans</h1>
      </div>
      <div className="space-y-4">
        <div className="flex gap-3">
          <Input
            placeholder="Search by contact..."
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
            <option value="new">New</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="defaulted">Defaulted</option>
          </select>
        </div>
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {results?.map((l) => (
                <TableRow key={l._id}>
                    <TableCell className="font-medium">{(l as any).clientName ?? "-"}</TableCell>
                    <TableCell>{l.loanTypeSnapshot.name}</TableCell>
                    <TableCell>{formatCurrency(l.principalAmount)}</TableCell>
                    <TableCell>{formatCurrency(l.outstandingBalance)}</TableCell>
                    <TableCell className="capitalize">
                        <Badge variant={
                            l.status === 'active' ? 'default' :
                            l.status === 'completed' ? 'secondary' :
                            l.status === 'defaulted' ? 'destructive' :
                            'outline'
                        }>
                            {l.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/loans/${l._id}`}>View</Link>
                        </Button>
                    </TableCell>
                </TableRow>
                ))}
                {results && results.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    No loans found
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
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
