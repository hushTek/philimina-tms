'use client';

import { useApplicationStore, Guarantor } from '@/lib/stores/application-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/language-provider';

export function Step3Collateral() {
  const { collateral, setCollateral, addGuarantor, removeGuarantor, nextStep, prevStep } = useApplicationStore();
  const { t } = useLanguage();
  
  const [newGuarantor, setNewGuarantor] = useState<Guarantor>({
    fullName: '',
    phoneNumber: '',
    relationship: '',
    residence: '',
    nidaNumber: '',
  });

  const handleAddGuarantor = () => {
    if (newGuarantor.fullName && newGuarantor.phoneNumber) {
      addGuarantor(newGuarantor);
      setNewGuarantor({
        fullName: '',
        phoneNumber: '',
        relationship: '',
        residence: '',
        nidaNumber: '',
      });
    }
  };

  const updateNewGuarantor = (field: keyof Guarantor, value: string) => {
    setNewGuarantor(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">{t.apply.step3.title}</h2>

      <div className="flex items-start space-x-3 p-4 border rounded-md bg-muted/20">
        <Checkbox 
          id="acknowledge" 
          checked={collateral.acknowledged}
          onCheckedChange={(checked) => setCollateral({ acknowledged: checked as boolean })}
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor="acknowledge" className="text-sm font-medium leading-relaxed">
            {t.apply.step3.acknowledgedText}
          </Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{t.apply.step3.guarantorsTitle}</h3>
        
        {/* List of added guarantors */}
        {collateral.guarantors.map((g, index) => (
          <Card key={index} className="relative">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>{t.apply.step3.name}:</strong> {g.fullName}</p>
                <p><strong>{t.apply.step3.phone}:</strong> {g.phoneNumber}</p>
                <p><strong>{t.apply.step3.relationship}:</strong> {g.relationship}</p>
                <p><strong>{t.apply.step3.residence}:</strong> {g.residence}</p>
                <p><strong>{t.apply.step3.nida}:</strong> {g.nidaNumber}</p>
              </div>
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8 cursor-pointer"
                onClick={() => removeGuarantor(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add new guarantor form */}
        <div className="border p-4 rounded-md space-y-4 bg-muted/10">
            <h4 className="font-medium text-sm text-muted-foreground">{t.apply.step3.addGuarantor}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                    placeholder="Jina Kamili" 
                    value={newGuarantor.fullName} 
                    onChange={e => updateNewGuarantor('fullName', e.target.value)} 
                />
                <Input 
                    placeholder="Nambari ya Simu" 
                    value={newGuarantor.phoneNumber} 
                    onChange={e => updateNewGuarantor('phoneNumber', e.target.value)} 
                />
                <Input 
                    placeholder="Uhusiano" 
                    value={newGuarantor.relationship} 
                    onChange={e => updateNewGuarantor('relationship', e.target.value)} 
                />
                <Input 
                    placeholder="Mahali anapoishi" 
                    value={newGuarantor.residence} 
                    onChange={e => updateNewGuarantor('residence', e.target.value)} 
                />
                <Input 
                    placeholder="Nambari ya NIDA" 
                    value={newGuarantor.nidaNumber} 
                    onChange={e => updateNewGuarantor('nidaNumber', e.target.value)} 
                />
            </div>
            <Button onClick={handleAddGuarantor} type="button" variant="secondary" className="w-full cursor-pointer">
                <Plus className="mr-2 h-4 w-4" /> {t.apply.step3.addGuarantor}
            </Button>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="cursor-pointer">{t.apply.previous}</Button>
        <Button onClick={nextStep} disabled={!collateral.acknowledged} className="cursor-pointer">{t.apply.next}</Button>
      </div>
    </div>
  );
}
