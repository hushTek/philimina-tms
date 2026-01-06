'use client';

import { useApplicationStore } from '@/lib/stores/application-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/components/language-provider';

export function Step5Declaration() {
  const { declaration, setDeclaration, nextStep, prevStep } = useApplicationStore();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeclaration({ [name]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">{t.apply.step5.title}</h2>

      <div className="p-4 bg-muted rounded-lg text-sm leading-relaxed space-y-4">
        <p>
            Mimi <span className="font-bold underline decoration-dotted">{declaration.name || ".............."}</span> nathibitisha kwamba taarifa zote nilizotoa hapo juu ni kweli na sahihi, 
            pia ninafahamu kwamba kutoa taarifa yeyote ya udanganyifu ilikujipatia mkopo nikosa la jinai.
        </p>
        <p>
            Natambua ya kuwa ninatakiwa kufanya marejesho ya mkopo huu kwa wakati kwani kuchelewesha marejesho hayo nitatakiwa kulipia asilimia tano 5% ya mkopo kwa mwezi pamoja na rejesho husika kama adhabu ya kuchelewesha.
        </p>
        <p>
            Pia Mkopeshaji anayo haki ya kukamata /kuchukua na kuuza mali nilizowekwa dhamana wakati wowote endapo nitashindwa kurejesha mkopo hata kwa awamu moja.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="name">{t.apply.step5.nameLabel}</Label>
            <Input 
                id="name"
                name="name"
                value={declaration.name}
                onChange={handleChange}
                placeholder="Andika jina lako kamili"
            />
        </div>

        <div className="flex items-center space-x-2">
            <Checkbox 
                id="confirmed" 
                checked={declaration.confirmed}
                onCheckedChange={(checked) => setDeclaration({ confirmed: checked as boolean })}
            />
            <Label htmlFor="confirmed">{t.apply.step5.agreeLabel}</Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="date">{t.apply.step5.date}</Label>
                <Input 
                    id="date"
                    name="date"
                    type="date"
                    value={declaration.date}
                    onChange={handleChange}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="signatureOtp">{t.apply.step5.signatureOtp}</Label>
                <div className="flex gap-2">
                    <Input 
                        id="signatureOtp"
                        name="signatureOtp"
                        value={declaration.signatureOtp}
                        onChange={handleChange}
                        placeholder="Ingiza OTP iliyotumwa"
                    />
                    <Button variant="secondary" type="button" className="cursor-pointer">{t.apply.step5.sendOtp}</Button>
                </div>
            </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="cursor-pointer">{t.apply.previous}</Button>
        <Button onClick={nextStep} disabled={!declaration.confirmed || !declaration.name} className="cursor-pointer">{t.apply.next}</Button>
      </div>
    </div>
  );
}
