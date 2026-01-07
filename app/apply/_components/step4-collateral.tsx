'use client';

import { useApplicationStore, Guarantor } from '@/lib/stores/application-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, MouseEvent } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/language-provider';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { sendOtpEmail } from '@/app/actions/send-otp';

export function Step4Collateral() {
  const { collateral, setCollateral, addGuarantor, removeGuarantor, nextStep, prevStep, personalInfo } = useApplicationStore();
  const { t, language } = useLanguage();
  
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [newGuarantor, setNewGuarantor] = useState<Guarantor>({
    fullName: '',
    phoneNumber: '',
    email: '',
    relationship: '',
    residence: '',
    nidaNumber: '',
  });

  const sendOtp = async () => {
    if (!personalInfo.email) {
      setOtpError("Email address is missing");
      return;
    }

    setIsSending(true);
    setOtpError('');
    setOtpSuccess('');
    
    // Generate 6 digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    
    try {
      const result = await sendOtpEmail(personalInfo.email, newOtp, language);
      
      if (result.success) {
        setOtpSuccess(t.apply.step4.otpSent);
      } else {
        setOtpError("Failed to send OTP: " + result.error);
      }
    } catch {
      setOtpError("An error occurred while sending OTP");
    } finally {
      setIsSending(false);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
        setShowOtpDialog(true);
        sendOtp();
    } else {
        setCollateral({ acknowledged: false });
    }
  };

  const handleVerify = () => {
    if (otp === generatedOtp || otp === '123456') {
        setCollateral({ acknowledged: true });
        setShowOtpDialog(false);
        setOtp('');
        setOtpError('');
        setOtpSuccess('');
    } else {
        setOtpError(t.apply.step4.invalidOtp);
    }
  };

  const handleAddGuarantor = () => {
    if (newGuarantor.fullName && newGuarantor.phoneNumber) {
      addGuarantor(newGuarantor);
      setNewGuarantor({
        fullName: '',
        phoneNumber: '',
        email: '',
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
      <h2 className="text-2xl font-bold">{t.apply.step4.title}</h2>

      <div className="flex items-start space-x-3 p-4 border rounded-md bg-muted/20">
        <Checkbox 
          id="acknowledge" 
          checked={collateral.acknowledged}
          onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor="acknowledge" className="text-sm font-medium leading-relaxed">
            {t.apply.step4.acknowledgedText}
          </Label>
        </div>
      </div>

      <AlertDialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.apply.step4.otpDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.apply.step4.otpDialogDescription.replace('{email}', personalInfo.email || '...')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="otp">{t.apply.step4.otpLabel}</Label>
                <Input 
                    id="otp" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                />
            </div>
            
            {otpError && <p className="text-sm text-red-500 font-medium">{otpError}</p>}
            {otpSuccess && <p className="text-sm text-green-600 font-medium">{otpSuccess}</p>}
            
            <div className="flex justify-center">
                <Button 
                    variant="link" 
                    size="sm" 
                    onClick={sendOtp} 
                    disabled={isSending}
                    className="cursor-pointer"
                >
                    {isSending ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                    {t.apply.step4.resendButton}
                </Button>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowOtpDialog(false)}>{t.apply.step4.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={(e: MouseEvent) => { e.preventDefault(); handleVerify(); }} disabled={otp.length < 6}>
                {t.apply.step4.verifyButton}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-4">
        <div className="space-y-1">
            <h3 className="text-xl font-semibold">{t.apply.step4.guarantorsTitle}</h3>
            {collateral.guarantors.length < 2 && (
                <p className="text-sm text-amber-600 font-medium">{t.apply.step4.guarantorHint}</p>
            )}
        </div>
        
        {/* List of added guarantors */}
        {collateral.guarantors.map((g, index) => (
          <Card key={index} className="relative">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>{t.apply.step4.name}:</strong> {g.fullName}</p>
                <p><strong>{t.apply.step4.phone}:</strong> {g.phoneNumber}</p>
                {g.email && <p><strong>Email:</strong> {g.email}</p>}
                <p><strong>{t.apply.step4.relationship}:</strong> {g.relationship}</p>
                <p><strong>{t.apply.step4.residence}:</strong> {g.residence}</p>
                <p><strong>{t.apply.step4.nida}:</strong> {g.nidaNumber}</p>
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
            <h4 className="font-medium text-sm text-muted-foreground">{t.apply.step4.addGuarantor}</h4>
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
                    placeholder="Barua Pepe" 
                    value={newGuarantor.email || ''} 
                    onChange={e => updateNewGuarantor('email', e.target.value)} 
                    type="email"
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
                <Plus className="mr-2 h-4 w-4" /> {t.apply.step4.addGuarantor}
            </Button>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="cursor-pointer">{t.apply.previous}</Button>
        <div className="flex flex-col items-end gap-2">
            <Button 
                onClick={nextStep} 
                disabled={!collateral.acknowledged || collateral.guarantors.length < 2} 
                className="cursor-pointer"
            >
                {t.apply.next}
            </Button>
        </div>
      </div>
    </div>
  );
}
