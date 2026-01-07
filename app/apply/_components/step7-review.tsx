'use client';

import { useApplicationStore } from '@/lib/stores/application-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/language-provider';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { sendApplicationNumberEmail } from '../../actions/send-app-number';
import { sendGuarantorInviteEmail } from '../../actions/send-guarantor-invite';

export function Step7Review() {
  const { personalInfo, loanDetails, collateral, declaration, attachments, resetForm, nextStep, setApplicationNumber } = useApplicationStore();
  const { t, language } = useLanguage();
  const submitApp = useMutation(api.applications.submit);
  const [submitting, setSubmitting] = useState(false);
  const review = (t as unknown as { apply: { review: { title: string; submit: string; cancel: string }}}).apply.review;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await submitApp({
        client: {
          name: personalInfo.fullName,
          dateOfBirth: personalInfo.dateOfBirth,
          phoneNumber: personalInfo.phoneNumber,
          email: personalInfo.email,
          maritalStatus: personalInfo.maritalStatus,
          spouseName: personalInfo.spouseName,
          residence: {
            street: personalInfo.residence.street,
            houseNumber: personalInfo.residence.houseNumber,
            ward: personalInfo.residence.ward,
            district: personalInfo.residence.district,
            region: personalInfo.residence.region,
            ownership: personalInfo.residence.ownership,
          },
          employment: {
            status: personalInfo.employment.status,
            companyName: personalInfo.employment.companyName,
            address: personalInfo.employment.address,
            position: personalInfo.employment.position,
          },
          nidaNumber: personalInfo.nidaNumber,
        },
        loanDetails: {
          loanTypeId: loanDetails.loanTypeId as Id<"loanTypes">,
          amount: loanDetails.amount,
          existingLoan: loanDetails.existingLoan,
          purpose: loanDetails.purpose,
        },
        guarantors: collateral.guarantors.map(g => ({
          fullName: g.fullName,
          phoneNumber: g.phoneNumber,
          email: g.email,
          relationship: g.relationship,
          residence: g.residence,
          nidaNumber: g.nidaNumber,
        })),
        attachments: [
          ...(attachments.nidaId && attachments.nidaId.storageId ? [{ type: "nida" as const, storageId: attachments.nidaId.storageId, fileName: attachments.nidaId.name }] : []),
          ...(attachments.introLetter && attachments.introLetter.storageId ? [{ type: "local_letter" as const, storageId: attachments.introLetter.storageId, fileName: attachments.introLetter.name }] : []),
          ...(attachments.collateralDoc && attachments.collateralDoc.storageId ? [{ type: "collateral" as const, storageId: attachments.collateralDoc.storageId, fileName: attachments.collateralDoc.name }] : []),
        ],
        declarationAccepted: declaration.confirmed,
      });
      const result = res as { applicationId: Id<"loanApplications">; applicationNumber: string; invitations?: { email?: string; url: string }[] };
      setApplicationNumber(result.applicationNumber);
      if (personalInfo.email) {
        await sendApplicationNumberEmail(personalInfo.email, result.applicationNumber, language);
      }
      if (Array.isArray(result.invitations)) {
        for (const inv of result.invitations) {
          if (inv.email) {
            await sendGuarantorInviteEmail(inv.email, inv.url, language);
          }
        }
      }
      nextStep();
    } catch {
      alert('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">{review.title}</h2>

      <div className="border rounded-lg bg-background p-6 space-y-4">
        <div>
          <h3 className="font-semibold">Personal Information</h3>
          <p className="text-sm text-muted-foreground">{personalInfo.fullName}</p>
          <p className="text-sm text-muted-foreground">{personalInfo.phoneNumber} • {personalInfo.email}</p>
          <p className="text-sm text-muted-foreground">{personalInfo.residence.street}, {personalInfo.residence.ward}, {personalInfo.residence.district}, {personalInfo.residence.region}</p>
        </div>

        <div>
          <h3 className="font-semibold">Loan Details</h3>
          <p className="text-sm text-muted-foreground">Amount: {loanDetails.amount} TZS</p>
          <p className="text-sm text-muted-foreground">Purpose: {loanDetails.purpose}</p>
        </div>

        <div>
          <h3 className="font-semibold">Attachments</h3>
          <div className="space-y-1 mt-1">
            {attachments.nidaId && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-medium">NIDA ID:</span> {attachments.nidaId.name}
              </p>
            )}
            {attachments.introLetter && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-medium">Intro Letter:</span> {attachments.introLetter.name}
              </p>
            )}
            {attachments.collateralDoc && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-medium">Collateral:</span> {attachments.collateralDoc.name}
              </p>
            )}
            {!attachments.nidaId && !attachments.introLetter && !attachments.collateralDoc && (
              <p className="text-sm text-muted-foreground italic">No attachments uploaded</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button variant="destructive" onClick={resetForm} className="cursor-pointer">{review.cancel}</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="cursor-pointer">
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {review.submit}
        </Button>
      </div>
    </div>
  );
}
