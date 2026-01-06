'use client';

import { useApplicationStore } from '@/lib/stores/application-store';
import { Step1PersonalInfo } from './_components/step1-personal-info';
import { Step2LoanDetails } from './_components/step2-loan-details';
import { Step3Collateral } from './_components/step3-collateral';
import { Step4Attachments } from './_components/step4-attachments';
import { Step5Declaration } from './_components/step5-declaration';
import { Step6Confirmation } from './_components/step6-confirmation';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/components/language-provider';

export default function ApplyPage() {
  const { currentStep } = useApplicationStore();
  const { t } = useLanguage();

  // Calculate progress percentage based on 6 steps
  const progress = (currentStep / 6) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo />;
      case 2:
        return <Step2LoanDetails />;
      case 3:
        return <Step3Collateral />;
      case 4:
        return <Step4Attachments />;
      case 5:
        return <Step5Declaration />;
      case 6:
        return <Step6Confirmation />;
      default:
        return <Step1PersonalInfo />;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-center">{t.apply.pageTitle}</h1>
        
        {currentStep < 6 && (
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
