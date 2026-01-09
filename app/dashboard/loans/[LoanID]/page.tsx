"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, AlertCircle, Info, Send, ArrowUpRight, ArrowDownLeft } from "lucide-react"

export default function LoanDetailsPage() {
    const params = useParams()
    const loanId = params.LoanID as Id<"loans">
    
    const data = useQuery(api.loans.get, { id: loanId })
    const activities = useQuery(api.loans.getActivities, { loanId })
    const transactions = useQuery(api.loans.getTransactions, { loanId })
    const sendReminder = useMutation(api.loans.sendReminder)
    const createTransaction = useMutation(api.transactions.create)
    
    const [reminderType, setReminderType] = useState<"sms" | "email">("sms")
    const [reminderMessage, setReminderMessage] = useState("")
    const [sending, setSending] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")

    // Transaction Form State
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)
    const [transactionType, setTransactionType] = useState<"disbursement" | "repayment">("repayment")
    const [amount, setAmount] = useState("")
    const [method, setMethod] = useState<"cash" | "mobile_money" | "bank">("cash")
    const [reference, setReference] = useState("")
    const [submittingTx, setSubmittingTx] = useState(false)

    if (!data) return <div className="p-6">Loading...</div>
    if (!data.loan) return <div className="p-6">Loan not found</div>

    const { loan, contact } = data

    const handleSendReminder = async () => {
        setSending(true)
        try {
            await sendReminder({
                loanId,
                type: reminderType,
                message: reminderMessage || undefined
            })
            setReminderMessage("")
            alert("Reminder sent successfully")
        } catch (e) {
            alert("Failed to send reminder")
        } finally {
            setSending(false)
        }
    }

    const handleCreateTransaction = async () => {
        if (!amount || isNaN(Number(amount))) {
            alert("Please enter a valid amount")
            return
        }
        setSubmittingTx(true)
        try {
            await createTransaction({
                loanId,
                amount: Number(amount),
                type: transactionType,
                method,
                reference: reference || undefined,
            })
            setIsTransactionDialogOpen(false)
            setAmount("")
            setReference("")
            alert("Transaction recorded successfully")
        } catch (e) {
            console.error(e)
            alert("Failed to record transaction")
        } finally {
            setSubmittingTx(false)
        }
    }

    const openTransactionDialog = (type: "disbursement" | "repayment") => {
        setTransactionType(type)
        setAmount(type === "disbursement" ? loan.principalAmount.toString() : "")
        setIsTransactionDialogOpen(true)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(amount);
    }

    const formatDate = (ts: number) => {
        return new Date(ts).toLocaleDateString()
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">Loan #{loan._id.slice(-6)}</h1>
                        <Badge variant={
                            loan.status === 'active' ? 'default' :
                            loan.status === 'completed' ? 'secondary' :
                            loan.status === 'defaulted' ? 'destructive' :
                            'outline'
                        }>{loan.status}</Badge>
                    </div>
                    <p className="text-muted-foreground">
                        {contact?.name} • {loan.loanTypeSnapshot.name}
                    </p>
                </div>
                <div className="flex gap-2">
                    {loan.status === 'new' && (
                        <Button onClick={() => openTransactionDialog("disbursement")}>
                            <ArrowUpRight className="mr-2 h-4 w-4" />
                            Disburse Loan
                        </Button>
                    )}
                    {(loan.status === 'active' || loan.status === 'defaulted') && (
                        <Button onClick={() => openTransactionDialog("repayment")}>
                            <ArrowDownLeft className="mr-2 h-4 w-4" />
                            Add Repayment
                        </Button>
                    )}
                    
                    <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {transactionType === 'disbursement' ? 'Disburse Loan' : 'Add Repayment'}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Amount</Label>
                                    <Input 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Method</Label>
                                    <Select value={method} onValueChange={(v: any) => setMethod(v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="bank">Bank</SelectItem>
                                            <SelectItem value="mobile_money">Mobile Money</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Reference</Label>
                                    <Input 
                                        value={reference} 
                                        onChange={(e) => setReference(e.target.value)}
                                        placeholder="Receipt No, Transaction ID, etc."
                                    />
                                </div>
                                <Button className="w-full" onClick={handleCreateTransaction} disabled={submittingTx}>
                                    {submittingTx ? "Processing..." : "Confirm Transaction"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats - Flat UI */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium text-muted-foreground">Principal</div>
                    <div className="text-2xl font-bold mt-1">{formatCurrency(loan.principalAmount)}</div>
                </div>
                <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium text-muted-foreground">Outstanding</div>
                    <div className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(loan.outstandingBalance)}</div>
                </div>
                <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Payable</div>
                    <div className="text-2xl font-bold mt-1">{formatCurrency(loan.totalPayable)}</div>
                </div>
                <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium text-muted-foreground">Next Due</div>
                    <div className="text-2xl font-bold mt-1">
                        {formatDate(loan.startDate + 30 * 24 * 60 * 60 * 1000)}
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b">
                <button
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'repayments' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                    onClick={() => setActiveTab('repayments')}
                >
                    Repayments
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'activities' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                    onClick={() => setActiveTab('activities')}
                >
                    Activities & Reminders
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-6">
                        <h3 className="font-semibold mb-4">Customer Details</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">Name:</span>
                                <span className="font-medium">{contact?.name}</span>
                                <span className="text-muted-foreground">Phone:</span>
                                <span className="font-medium">{contact?.phone}</span>
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium">{contact?.email}</span>
                                <span className="text-muted-foreground">Address:</span>
                                <span className="font-medium">
                                    {contact?.address?.street}, {contact?.address?.ward}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-lg p-6">
                        <h3 className="font-semibold mb-4">Loan Terms</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-muted-foreground">Interest Rate:</span>
                                <span className="font-medium">{loan.loanTypeSnapshot.interestRate}%</span>
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-medium">{loan.loanTypeSnapshot.durationMonths} Months</span>
                                <span className="text-muted-foreground">Start Date:</span>
                                <span className="font-medium">{formatDate(loan.startDate)}</span>
                                <span className="text-muted-foreground">End Date:</span>
                                <span className="font-medium">{formatDate(loan.expectedEndDate)}</span>
                                <span className="text-muted-foreground">Installment:</span>
                                <span className="font-medium">{formatCurrency(loan.installmentAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'repayments' && (
                <div className="border rounded-lg p-6">
                    <h3 className="font-semibold mb-4">Transaction History</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions?.map((tx) => (
                                <TableRow key={tx._id}>
                                    <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="capitalize">
                                        <Badge variant={
                                            tx.type === 'disbursement' ? 'outline' : 
                                            tx.type === 'penalty' ? 'destructive' : 'default'
                                        }>
                                            {tx.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize">{tx.method.replace('_', ' ')}</TableCell>
                                    <TableCell>{tx.reference || '-'}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatCurrency(tx.amount)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {transactions?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {activeTab === 'activities' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        <div className="border rounded-lg p-6">
                            <h3 className="font-semibold mb-4">Activity Log</h3>
                            <div className="space-y-6 relative border-l pl-6 ml-2">
                                {activities?.map((activity) => (
                                    <div key={activity._id} className="relative">
                                        <div className={`absolute -left-[31px] top-0 p-1 rounded-full ${
                                            activity.type === 'success' ? 'bg-green-100 text-green-600' :
                                            activity.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                                            activity.type === 'error' ? 'bg-red-100 text-red-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                            {activity.type === 'success' ? <CheckCircle2 size={16} /> :
                                                activity.type === 'warning' ? <AlertCircle size={16} /> :
                                                <Info size={16} />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{activity.title}</span>
                                            <span className="text-sm text-muted-foreground">{activity.description}</span>
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {new Date(activity.createdAt).toLocaleString()} • {activity.performedBy}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {activities?.length === 0 && (
                                    <div className="text-muted-foreground text-sm">No activities recorded.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="border rounded-lg p-6">
                            <h3 className="font-semibold mb-4">Send Reminder</h3>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Button 
                                        variant={reminderType === 'sms' ? 'default' : 'outline'} 
                                        onClick={() => setReminderType('sms')}
                                        className="flex-1"
                                    >
                                        SMS
                                    </Button>
                                    <Button 
                                        variant={reminderType === 'email' ? 'default' : 'outline'} 
                                        onClick={() => setReminderType('email')}
                                        className="flex-1"
                                    >
                                        Email
                                    </Button>
                                </div>
                                <Textarea
                                    placeholder="Enter message..."
                                    value={reminderMessage}
                                    onChange={(e) => setReminderMessage(e.target.value)}
                                    rows={4}
                                />
                                <Button 
                                    className="w-full" 
                                    onClick={handleSendReminder}
                                    disabled={sending}
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    {sending ? "Sending..." : "Send Reminder"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
