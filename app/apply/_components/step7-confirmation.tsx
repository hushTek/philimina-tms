'use client';

import { useApplicationStore } from '@/lib/stores/application-store';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';

export function Step7Confirmation() {
  const { resetForm, applicationNumber } = useApplicationStore();
  const { t } = useLanguage();

  const handleFinish = () => {
    resetForm();
    // Navigate to home or dashboard
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center animate-in zoom-in duration-500 py-10">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      
      <h2 className="text-3xl font-bold">{t.apply.step7.title}</h2>
      
      <p className="text-muted-foreground max-w-md">
        {t.apply.step7.thanks}
      </p>

      <div className="p-4 border border-dashed rounded-lg bg-muted/30">
        <p className="text-sm text-muted-foreground mb-1">{t.apply.step7.appNumber}</p>
        <p className="text-xl font-mono font-bold tracking-wider">{applicationNumber || 'TMS-......'}</p>
      </div>

      <div className="pt-8 space-x-4">
        <Link href="/">
            <Button variant="outline" onClick={handleFinish} className="cursor-pointer">{t.apply.step7.backHome}</Button>
        </Link>
        <Link href="/status">
            <Button onClick={handleFinish} className="cursor-pointer">{t.apply.step7.checkStatus}</Button>
        </Link>
      </div>
    </div>
  );
}
