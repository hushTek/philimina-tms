'use client';

import { useApplicationStore } from '@/lib/stores/application-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';

export function Step4Attachments() {
  const { attachments, setAttachments, nextStep, prevStep } = useApplicationStore();
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof attachments) => {
    // In a real app, you would upload the file here and get a URL/ID back.
    // For this persist example, we'll just store the fake filename.
    const file = e.target.files?.[0];
    if (file) {
      setAttachments({ [field]: file.name });
    }
  };

  const isComplete = !!(attachments.nidaId && attachments.introLetter && attachments.collateralDoc);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">{t.apply.step4.title}</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nidaId">{t.apply.step4.nidaId}</Label>
          <Input
            id="nidaId"
            type="file"
            onChange={(e) => handleFileChange(e, 'nidaId')}
          />
          {attachments.nidaId && <p className="text-sm text-green-600">Selected: {attachments.nidaId}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="introLetter">{t.apply.step4.introLetter}</Label>
          <Input
            id="introLetter"
            type="file"
             onChange={(e) => handleFileChange(e, 'introLetter')}
          />
          {attachments.introLetter && <p className="text-sm text-green-600">Selected: {attachments.introLetter}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="collateralDoc">{t.apply.step4.collateralDoc}</Label>
          <Input
            id="collateralDoc"
            type="file"
             onChange={(e) => handleFileChange(e, 'collateralDoc')}
          />
          {attachments.collateralDoc && <p className="text-sm text-green-600">Selected: {attachments.collateralDoc}</p>}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="cursor-pointer">{t.apply.previous}</Button>
        <Button onClick={nextStep} disabled={!isComplete} className="cursor-pointer">{t.apply.next}</Button>
      </div>
    </div>
  );
}
