"use client"

import { useState } from "react"
import { usePaginatedQuery, useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useParams } from "next/navigation"
import { Calendar, Activity, Banknote, CreditCard, Hash, ArrowLeftRight } from "lucide-react"

export default function AccountDetailPage() {
  const params = useParams() as { AccountID: string }
  const accountRes = useQuery(api.accounts.get, { id: params.AccountID as any })
  const adjustBalance = useMutation(api.accounts.adjustBalance)
  const categories = useQuery(api.categories.list, {})
  const createTx = useMutation(api.transactions.createGeneral)
  const [newBalance, setNewBalance] = useState<number | string>("")
  const [adjusting, setAdjusting] = useState(false)
  const [txData, setTxData] = useState<{ amount: string; categoryId: string; note: string; method: string }>({ amount: "", categoryId: "", note: "", method: "cash" })

  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.accounts.listAccountTransactions,
    { accountId: params.AccountID as any },
    { initialNumItems: 10 }
  )

  const handleAdjust = async () => {
    if (!accountRes?.account) return
    const nb = Number(newBalance)
    if (Number.isNaN(nb)) return
    setAdjusting(true)
    try {
      await adjustBalance({ accountId: accountRes.account._id as any, newBalance: nb, note: "Manual adjustment" })
      setNewBalance("")
    } finally {
      setAdjusting(false)
    }
  }

  if (!accountRes) return <div className="p-6">Loading...</div>

  const { account } = accountRes

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{account.name}</h1>
          <p className="text-muted-foreground">Type: {account.type.replace("_", " ").toUpperCase()}</p>
          <p className="text-xs text-muted-foreground">Account No: <span className="font-mono">{(account as any).accountNumber}</span></p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Current Balance</div>
          <div className="text-2xl font-bold">{Intl.NumberFormat().format(account.balance)} TZS</div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Adjust Balance</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Input type="number" placeholder="New balance" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} className="h-9" />
          <Button onClick={handleAdjust} disabled={adjusting} className="h-9">{adjusting ? "Adjusting..." : "Apply"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New Transaction</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select value={txData.categoryId} onChange={(e) => setTxData({ ...txData, categoryId: e.target.value })} className="h-9 rounded-md border px-3">
            <option value="">Select Category</option>
            {categories?.map((c) => (
              <option key={c._id} value={c._id as any}>{c.name} ({c.effect === "increase" ? "+" : "-"})</option>
            ))}
          </select>
          <Input type="number" placeholder="Amount" value={txData.amount} onChange={(e) => setTxData({ ...txData, amount: e.target.value })} className="h-9" />
          <select value={txData.method} onChange={(e) => setTxData({ ...txData, method: e.target.value })} className="h-9 rounded-md border px-3">
            <option value="cash">Cash</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="bank">Bank</option>
          </select>
          <Input placeholder="Note" value={txData.note} onChange={(e) => setTxData({ ...txData, note: e.target.value })} className="h-9" />
          <Button
            onClick={async () => {
              if (!txData.categoryId || !txData.amount) return
              await createTx({
                accountId: account._id as any,
                amount: Number(txData.amount),
                categoryId: txData.categoryId as any,
                type: "expense",
                method: txData.method as any,
                note: txData.note,
              })
              setTxData({ amount: "", categoryId: "", note: "", method: "cash" })
            }}
            className="h-9"
          >
            Add
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Transaction History</h2>
        {!results ? (
          <div className="p-3 text-center text-sm">Loading...</div>
        ) : results.length === 0 ? (
          <div className="p-3 text-center text-muted-foreground text-sm">No transactions</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Date
                    </div>
                </TableHead>
                <TableHead>
                    <div className="flex items-center gap-2">
                        <Activity className="h-3 w-3" />
                        Type
                    </div>
                </TableHead>
                <TableHead>
                    <div className="flex items-center gap-2">
                        <Banknote className="h-3 w-3" />
                        Amount
                    </div>
                </TableHead>
                <TableHead>
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-3 w-3" />
                        Method
                    </div>
                </TableHead>
                <TableHead>
                    <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3" />
                        Reference
                    </div>
                </TableHead>
                <TableHead>
                    <div className="flex items-center gap-2">
                        <ArrowLeftRight className="h-3 w-3" />
                        Balance Before
                    </div>
                </TableHead>
                <TableHead>
                    <div className="flex items-center gap-2">
                        <ArrowLeftRight className="h-3 w-3" />
                        Balance After
                    </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{t.type}</TableCell>
                  <TableCell className="font-mono">{Intl.NumberFormat().format(t.amount)} TZS</TableCell>
                  <TableCell className="capitalize">{t.method.replace("_"," ")}</TableCell>
                  <TableCell className="font-mono text-xs">{t.reference || "-"}</TableCell>
                  <TableCell className="font-mono">{t.balanceBefore?.toLocaleString() ?? "-"}</TableCell>
                  <TableCell className="font-mono">{t.balanceAfter?.toLocaleString() ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="flex justify-end">
          <Button variant="outline" disabled={isLoading || status === "Exhausted"} onClick={() => loadMore(10)} className="h-9">
            {status === "Exhausted" ? "No more" : isLoading ? "Loading..." : "Load more"}
          </Button>
        </div>
      </div>
    </div>
  )
}
