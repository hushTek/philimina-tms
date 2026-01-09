

"use client"

import { use, useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Loader2, Download, FileText, CheckCircle, XCircle, AlertCircle, Edit, Save } from "lucide-react"

export default function Page({ params }: { params: Promise<{ ApplicationID: string }> }) {
  const { ApplicationID } = use(params)
  const applicationId = ApplicationID as Id<"loanApplications">
  
  const data = useQuery(api.applications.getById, { id: applicationId })
  const loanTypes = useQuery(api.applications.listLoanTypes)
  
  const updateStatus = useMutation(api.applications.updateStatus)
  const updateDetails = useMutation(api.applications.updateDetails)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editAmount, setEditAmount] = useState("")
  const [editLoanType, setEditLoanType] = useState("")
  const [reviewNotes, setReviewNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isRejecting, setIsRejecting] = useState(false)

  if (!data || !loanTypes) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  const { application, contact, loanType, referees, documents } = data

  const handleEdit = () => {
    setEditAmount((application.requestedAmount ?? 0).toString())
    setEditLoanType(application.loanTypeId ?? "")
    setIsEditing(true) 
  }

  const handleSaveDetails = async () => {
    try {
      setIsSubmitting(true)
      await updateDetails({
        id: applicationId,
        amount: parseFloat(editAmount),
        loanTypeId: editLoanType as Id<"loanTypes">
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update details", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusUpdate = async (newStatus: "approved" | "rejected" | "under_review", notes?: string) => {
    try {
      setIsSubmitting(true)
      await updateStatus({
        id: applicationId,
        status: newStatus,
        reviewNotes: notes
      })
      setReviewNotes("")
      setIsRejecting(false)
    } catch (error) {
      console.error("Failed to update status", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500 hover:bg-green-600"
      case "rejected": return "bg-red-500 hover:bg-red-600"
      case "under_review": return "bg-blue-500 hover:bg-blue-600"
      case "submitted": return "bg-yellow-500 hover:bg-yellow-600"
      default: return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const isImage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Application {application.applicationNumber}</h1>
            <Badge className={getStatusColor(application.status)}>{application.status.replace("_", " ")}</Badge>
          </div>
          <p className="text-muted-foreground mt-1">Submitted on {format(new Date(application.createdAt), "PPP p")}</p>
        </div>
        
        <div className="flex gap-2">
          {application.status !== "approved" && application.status !== "rejected" && (
            <>
              {isRejecting ? (
                <div className="flex items-center gap-2 bg-muted p-2 rounded-md animate-in slide-in-from-right">
                  <Input 
                    placeholder="Reason for rejection..." 
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-64"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setIsRejecting(false)
                      setReviewNotes("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleStatusUpdate("rejected", reviewNotes)}
                    disabled={isSubmitting || !reviewNotes}
                  >
                    Confirm
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="destructive" 
                  className="gap-2"
                  onClick={() => setIsRejecting(true)}
                >
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
              )}

              <Button 
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusUpdate("approved")}
                disabled={isSubmitting || isRejecting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4" />}
                Approve Application
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Details */}
          <div className="border rounded-lg bg-background">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Contact Information</h3>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Full Name</Label>
                <p className="font-medium">{contact?.name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Date of Birth</Label>
                <p className="font-medium">{contact?.dateOfBirth}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Phone Number</Label>
                <p className="font-medium">{contact?.phone}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{contact?.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">NIDA Number</Label>
                <p className="font-medium">{contact?.identity?.serial || "-"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Marital Status</Label>
                <p className="font-medium capitalize">{contact?.marital?.status} {contact?.marital?.name ? `(${contact.marital.name})` : ""}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-muted-foreground">Address</Label>
                <p className="font-medium">
                  {[
                    contact?.address?.street,
                    contact?.address?.houseNumber,
                    contact?.address?.ward,
                    contact?.address?.district,
                    contact?.address?.region
                  ].filter(Boolean).join(", ")}
                </p>
                <p className="text-sm text-muted-foreground capitalize">{contact?.address?.ownership} ({contact?.address?.residenceOwnership})</p>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="border rounded-lg bg-background">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Employment Information</h3>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Employment Status</Label>
                <p className="font-medium capitalize">{contact?.work?.status}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Company Name</Label>
                <p className="font-medium">{contact?.work?.company || "-"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Position</Label>
                <p className="font-medium">{contact?.work?.designation || "-"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Work Address</Label>
                <p className="font-medium">{contact?.work?.address || "-"}</p>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="border rounded-lg bg-background">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Attachments</h3>
              <p className="text-sm text-muted-foreground">Documents and photos uploaded by the applicant.</p>
            </div>
            <div className="p-6">
              {documents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No attachments found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <div key={doc._id} className="border rounded-lg overflow-hidden flex flex-col">
                      <div className="bg-muted aspect-video flex items-center justify-center relative group">
                        {isImage(doc.fileName) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={doc.fileUrl} 
                            alt={doc.fileName} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="h-16 w-16 text-muted-foreground" />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a 
                            href={doc.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white flex items-center gap-2 hover:underline"
                            download={!isImage(doc.fileName)}
                          >
                            <Download className="h-5 w-5" />
                            {isImage(doc.fileName) ? "View Full" : "Download"}
                          </a>
                        </div>
                      </div>
                      <div className="p-3 bg-card border-t">
                        <p className="font-medium truncate" title={doc.fileName}>{doc.fileName}</p>
                        <Badge variant="outline" className="mt-1 capitalize">{doc.type.replace("_", " ")}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Loan Details Card */}
          <div className="border rounded-lg bg-background">
            <div className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-lg font-semibold">Loan Details</h3>
              {!isEditing ? (
                <Button variant="ghost" size="icon" onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleSaveDetails} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                  </Button>
                </div>
              )}
            </div>
            <div className="p-6 space-y-4 pt-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Amount Requested</Label>
                {isEditing ? (
                  <Input 
                    type="number" 
                    value={editAmount} 
                    onChange={(e) => setEditAmount(e.target.value)}
                  />
                ) : (
                  <p className="text-2xl font-bold">
                    {Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(application.requestedAmount ?? 0)}
                  </p>
                )}
              </div>
              
              <div className="space-y-1">
                <Label className="text-muted-foreground">Loan Product</Label>
                {isEditing ? (
                  <Select value={editLoanType} onValueChange={setEditLoanType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanTypes.map((t) => (
                        <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-medium">{loanType?.name || "Unknown Product"}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">Purpose</Label>
                <p className="font-medium">{application.loanPurpose}</p>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">Other Loans?</Label>
                <Badge variant={application.hasOtherLoans ? "destructive" : "secondary"}>
                  {application.hasOtherLoans ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Guarantors Card */}
          <div className="border rounded-lg bg-background">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Guarantors</h3>
            </div>
            <div className="p-6 space-y-4">
              {referees.length === 0 ? (
                <p className="text-sm text-muted-foreground">No guarantors listed.</p>
              ) : (
                referees.map((ref, idx) => (
                  <div key={ref._id} className="relative pl-4 border-l-2 border-muted pb-4 last:pb-0">
                    <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-primary" />
                    <p className="font-medium">{ref.fullName}</p>
                    <p className="text-sm text-muted-foreground">{ref.relationship}</p>
                    <p className="text-sm">{ref.phone}</p>
                    {ref.email && <p className="text-sm text-muted-foreground">{ref.email}</p>}
                    <div className="mt-2">
                      {ref.acknowledged ? (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                          <CheckCircle className="h-3 w-3 mr-1" /> Confirmed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                          <AlertCircle className="h-3 w-3 mr-1" /> Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}