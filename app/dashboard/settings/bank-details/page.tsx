 "use client"
 
 import { useState } from "react"
 import { useQuery, useMutation } from "convex/react"
 import { Button } from "@/components/ui/button"
 import { Input } from "@/components/ui/input"
 import { Separator } from "@/components/ui/separator"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
 
 export default function BankDetailsPage() {
   const bank = useQuery("bank:get" as unknown as never) as { balance: number } | undefined
   const setBalance = useMutation("bank:set" as unknown as never) as unknown as (args: { balance: number }) => Promise<string>
   const unconfirmed = useQuery("transactions:listUnconfirmedBank" as unknown as never) as Array<
     {
       _id: string
       createdAt: number
       amount: number
       type: "disbursement" | "repayment" | "penalty"
       method: "bank"
       clientName?: string
     }
   > | undefined
   const confirmTx = useMutation("transactions:confirm" as unknown as never) as unknown as (args: { id: string }) => Promise<boolean>
 
   const [manualBalance, setManualBalance] = useState<number | "">(bank?.balance ?? "")
   const current = bank?.balance ?? 0
 
   return (
     <div className="p-6 space-y-8">
       <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold">Bank Details</h1>
       </div>
 
       <section className="space-y-4">
         <h2 className="text-lg font-semibold">Float (Capital) Balance</h2>
         <div className="flex items-center gap-6">
           <div className="text-2xl font-bold">{Intl.NumberFormat().format(current)}</div>
           <div className="flex items-center gap-3">
             <Input
               type="number"
               placeholder="Set balance"
               value={manualBalance}
               onChange={(e) => setManualBalance(e.target.value === "" ? "" : Number(e.target.value))}
               className="max-w-xs"
             />
             <Button
               onClick={async () => {
                 if (manualBalance === "") return
                 await setBalance({ balance: Number(manualBalance) })
               }}
             >
               Save
             </Button>
           </div>
         </div>
       </section>
 
       <Separator />
 
       <section className="space-y-4">
         <h2 className="text-lg font-semibold">Unconfirmed Bank Transactions</h2>
         {!unconfirmed || unconfirmed.length === 0 ? (
           <div className="text-sm text-muted-foreground">No unconfirmed transactions.</div>
         ) : (
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Date</TableHead>
                 <TableHead>Client</TableHead>
                 <TableHead>Type</TableHead>
                 <TableHead>Amount</TableHead>
                 <TableHead></TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {unconfirmed.map((t) => (
                 <TableRow key={t._id}>
                   <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                   <TableCell className="font-medium">{t.clientName ?? "-"}</TableCell>
                   <TableCell className="capitalize">{t.type}</TableCell>
                   <TableCell>{t.amount.toLocaleString()}</TableCell>
                   <TableCell className="text-right">
                     <Button
                       variant="outline"
                       onClick={async () => {
                         await confirmTx({ id: t._id })
                       }}
                     >
                       Confirm
                     </Button>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         )}
       </section>
     </div>
   )
 }
