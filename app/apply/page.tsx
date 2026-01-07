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

export default function ApplyPage() {
  const { currentStep } = useApplicationStore();
  const { t } = useLanguage();

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
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleSaveDraft} disabled={isSavingDraft}>
            {isSavingDraft ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Draft
        </Button>
      </div>

      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-center">{t.apply.pageTitle}</h1>

        {currentStep === 1 && (
            <div className="max-w-md mx-auto p-4 border rounded-lg bg-muted/50 mb-8">
                <h3 className="font-semibold mb-2">Resume Application</h3>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Enter Application Number" 
                        value={resumeId}
                        onChange={(e) => setResumeId(e.target.value)}
                    />
                    <Button onClick={handleResume} disabled={isLoadingResume}>
                        {isLoadingResume ? <Loader2 className="h-4 w-4 animate-spin" /> : "Resume"}
                    </Button>
                </div>
            </div>
        )}
        
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
    </div>
  );
}
