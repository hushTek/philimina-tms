'use client';

import { useApplicationStore } from '@/lib/stores/application-store';
import { Step1PersonalInfo } from './_components/step1-personal-info';
import { Step2Employment } from './_components/step2-employment';
import { Step3LoanDetails } from './_components/step3-loan-details';
import { Step4Collateral } from './_components/step4-collateral';
import { Step5Attachments } from './_components/step5-attachments';
import { Step6Declaration } from './_components/step6-declaration';
import { Step7Confirmation } from './_components/step7-confirmation';
import { Step7Review } from './_components/step7-review';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save, Copy, Download, Check, FileText } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

export default function ApplyPage() {
  const { 
    currentStep, 
    personalInfo, 
    loanDetails, 
    collateral, 
    attachments, 
    declaration, 
    applicationNumber, 
    setApplicationNumber, 
    hydrate 
  } = useApplicationStore();
  
  const { t } = useLanguage();
  const convex = useConvex();
  const saveDraftMutation = useMutation(api.applications.saveDraft);

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [resumeId, setResumeId] = useState('');
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedAppId, setSavedAppId] = useState('');
  const [copied, setCopied] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const formData = JSON.stringify({
        personalInfo, loanDetails, collateral, attachments, declaration
      });
      
      const result = await saveDraftMutation({
        applicationNumber: applicationNumber || undefined,
        formData,
        currentStep,
        contact: {
           name: personalInfo.fullName,
           email: personalInfo.email,
           phone: personalInfo.phoneNumber
        }
      });
      
      setApplicationNumber(result.applicationNumber);
      setSavedAppId(result.applicationNumber);
      setShowSaveDialog(true);
    } catch (error) {
      console.error(error);
      alert("Failed to save draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleResume = async () => {
    if (!resumeId) return;
    setIsLoadingResume(true);
    try {
      const result = await convex.query(api.applications.getByApplicationNumber, { applicationNumber: resumeId });
      if (result && result.application && result.application.formData) {
         const savedData = JSON.parse(result.application.formData);
         hydrate({
           ...savedData,
           currentStep: result.application.currentStep || 1,
           applicationNumber: result.application.applicationNumber
         });
         setShowResumeDialog(false);
         // alert("Application resumed successfully"); // Removed alert for better UX
      } else {
         alert("Application not found or no draft data saved");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to resume application");
    } finally {
      setIsLoadingResume(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(savedAppId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([`Chap Chap Loan Application\nApplication Number: ${savedAppId}\nDate: ${new Date().toLocaleString()}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Loan-Application-${savedAppId}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  // Calculate progress percentage based on 8 steps
  const progress = (currentStep / 8) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo />;
      case 2:
        return <Step2Employment />;
      case 3:
        return <Step3LoanDetails />;
      case 4:
        return <Step4Collateral />;
      case 5:
        return <Step5Attachments />;
      case 6:
        return <Step6Declaration />;
      case 7:
        return <Step7Review />;
      case 8:
        return <Step7Confirmation />;
      default:
        return <Step1PersonalInfo />;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-end gap-2 mb-4">
         {currentStep === 1 && (
            <Button variant="secondary" onClick={() => setShowResumeDialog(true)}>
                Resume Application
            </Button>
         )}
        <Button variant="outline" onClick={handleSaveDraft} disabled={isSavingDraft}>
            {isSavingDraft ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Draft
        </Button>
      </div>

      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-center">{t.apply.pageTitle}</h1>
        
        {currentStep < 8 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t.apply.stepLabel} {currentStep} {t.apply.ofTotal}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>
        )}
      </div>

      <div className="p-0">
        {renderStep()}
      </div>

      {/* Resume Dialog */}
      <AlertDialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resume Application</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your application number to continue where you left off.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-number" className="text-right">
                App Number
              </Label>
              <Input
                id="app-number"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                className="col-span-3"
                placeholder="e.g. LN-2024-ABC123"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={handleResume} disabled={isLoadingResume || !resumeId}>
               {isLoadingResume ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
               Resume
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Save Draft Success Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Draft Saved Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Your application has been saved. Please keep your Application Number safe to resume later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="flex items-center space-x-2 p-4 bg-muted rounded-md border">
            <div className="grid flex-1 gap-2">
               <Label htmlFor="saved-app-id" className="sr-only">Application Number</Label>
               <Input 
                 id="saved-app-id" 
                 value={savedAppId} 
                 readOnly 
                 className="h-9 font-mono text-center font-bold"
               />
            </div>
            <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy</span>
            </Button>
          </div>

          <AlertDialogFooter className="sm:justify-between">
             <Button variant="secondary" onClick={downloadTxt} className="gap-2">
                <Download className="h-4 w-4" />
                Download Info
             </Button>
            <AlertDialogAction onClick={() => setShowSaveDialog(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
