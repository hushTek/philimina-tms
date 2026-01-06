'use client';

import { useApplicationStore } from '@/lib/stores/application-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/components/language-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMemo } from 'react';

export function Step2LoanDetails() {
  const { loanDetails, setLoanDetails, personalInfo, setPersonalInfo, nextStep, prevStep } = useApplicationStore();
  const { t } = useLanguage();
  const loanTypes = useQuery(api.loantype.list, { includeInactive: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLoanDetails({ ...loanDetails, [name]: value });
  };

  const handleEmploymentChange = (field: "companyName" | "address" | "position", value: string) => {
    setPersonalInfo({
      ...personalInfo,
      employment: {
        ...personalInfo.employment,
        [field]: value,
      },
    });
  };

  const selectedLoanType = useMemo(() => {
    if (!loanTypes || !loanDetails.loanTypeId) return undefined;
    return loanTypes.find((lt) => (lt._id as Id<"loanTypes">) === (loanDetails.loanTypeId as unknown as Id<"loanTypes">));
  }, [loanTypes, loanDetails.loanTypeId]);

  const amountNum = Number(loanDetails.amount || 0);
  const amountValid =
    !!selectedLoanType &&
    amountNum >= (selectedLoanType.minAmount ?? 0) &&
    amountNum <= (selectedLoanType.maxAmount ?? Infinity);

  const periods = useMemo(() => {
    if (!selectedLoanType) return 0;
    const months = selectedLoanType.durationMonths;
    return selectedLoanType.repaymentFrequency === 'monthly' ? months : months * 4;
  }, [selectedLoanType]);

  const repayment = useMemo(() => {
    if (!selectedLoanType || !amountValid || periods <= 0) return undefined;
    const P = amountNum;
    const totalRate = selectedLoanType.interestRate / 100;
    if (selectedLoanType.calculationMethod === 'flat') {
      const totalInterest = P * totalRate;
      const installment = (P + totalInterest) / periods;
      return {
        method: 'flat',
        installment,
        totalInterest,
        totalRepay: installment * periods,
      };
    } else {
      const perMonthRate = totalRate / selectedLoanType.durationMonths;
      const r = selectedLoanType.repaymentFrequency === 'monthly' ? perMonthRate : perMonthRate / 4;
      const n = periods;
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalRepay = emi * n;
      const totalInterest = totalRepay - P;
      return {
        method: 'reducing_balance',
        installment: emi,
        totalInterest,
        totalRepay,
      };
    }
  }, [selectedLoanType, amountValid, amountNum, periods]);

  const penaltyPerMonth = useMemo(() => {
    if (!selectedLoanType || !amountValid) return undefined;
    return amountNum * (selectedLoanType.penaltyRate / 100);
  }, [selectedLoanType, amountValid, amountNum]);

  const processingFee = useMemo(() => {
    if (!selectedLoanType || !amountValid) return undefined;
    const type = selectedLoanType.processingFeeType as "percentage" | "fixed" | undefined;
    const value = selectedLoanType.processingFeeValue ?? 0;
    if (!type) return 0;
    return type === "percentage" ? amountNum * (value / 100) : value;
  }, [selectedLoanType, amountValid, amountNum]);

  const disbursedAmount = useMemo(() => {
    if (processingFee === undefined) return undefined;
    const net = amountNum - (processingFee ?? 0);
    return Math.max(0, net);
  }, [processingFee, amountNum]);

  const monthSchedule = useMemo(() => {
    if (!selectedLoanType || !repayment) return [];
    const duration = Math.min(selectedLoanType.durationMonths, 2);
    const now = new Date();
    const perMonth =
      selectedLoanType.repaymentFrequency === 'monthly'
        ? repayment.installment
        : repayment.installment * 4;
    return Array.from({ length: duration }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const label = d.toLocaleString(undefined, { month: 'long' });
      return { label, amount: perMonth };
    });
  }, [selectedLoanType, repayment]);

  const isComplete =
    !!loanDetails.loanTypeId &&
    !!loanDetails.amount &&
    amountValid &&
    !!loanDetails.purpose &&
    personalInfo.employment.companyName &&
    personalInfo.employment.address &&
    personalInfo.employment.position;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">{t.apply.step2.title}</h2>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{t.apply.step2.employmentTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employment.companyName">{t.apply.step2.companyName}</Label>
            <Input
              id="employment.companyName"
              value={personalInfo.employment.companyName}
              onChange={(e) => handleEmploymentChange("companyName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employment.address">{t.apply.step2.address}</Label>
            <Input
              id="employment.address"
              value={personalInfo.employment.address}
              onChange={(e) => handleEmploymentChange("address", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employment.position">{t.apply.step2.position}</Label>
            <Input
              id="employment.position"
              value={personalInfo.employment.position}
              onChange={(e) => handleEmploymentChange("position", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t.apply.step2.loanType}</Label>
          <Select
            value={loanDetails.loanTypeId}
            onValueChange={(val) => setLoanDetails({ loanTypeId: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chagua aina ya mkopo" />
            </SelectTrigger>
            <SelectContent>
              {(loanTypes ?? []).map((lt) => (
                <SelectItem key={String(lt._id)} value={String(lt._id)}>
                  {lt.name} • {Intl.NumberFormat().format(lt.minAmount)} - {Intl.NumberFormat().format(lt.maxAmount)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">{t.apply.step2.amount}</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={loanDetails.amount}
            onChange={handleChange}
            placeholder="Kiasi cha Tsh"
          />
          {selectedLoanType && !amountValid && (
            <p className="text-xs text-red-500">
              Kiasi kinaruhusiwa: {Intl.NumberFormat().format(selectedLoanType.minAmount)} - {Intl.NumberFormat().format(selectedLoanType.maxAmount)}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="existingLoan">{t.apply.step2.existingLoan}</Label>
          <Input
            id="existingLoan"
            name="existingLoan"
             type="number"
            value={loanDetails.existingLoan}
            onChange={handleChange}
            placeholder="Kiasi (kama hakuna weka 0)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose">{t.apply.step2.purpose}</Label>
          <Textarea
            id="purpose"
            name="purpose"
            value={loanDetails.purpose}
            onChange={handleChange}
            placeholder="Elezea dhumuni la mkopo huu..."
            rows={4}
          />
        </div>
      </div>

      {repayment && (
        <div className="space-y-2 border rounded-md p-4 bg-muted/20">
          <h4 className="text-sm font-semibold">{t.apply.step2.repaymentSummaryTitle}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-md border bg-background">
              <p className="text-xs text-muted-foreground">{t.apply.step2.method}</p>
              <p className="text-sm font-medium">
                {repayment.method === 'flat' ? t.apply.step2.methodFlat : t.apply.step2.methodReducing}
              </p>
            </div>
            <div className="p-3 rounded-md border bg-background">
              <p className="text-xs text-muted-foreground">{t.apply.step2.interestRate}</p>
              <p className="text-sm font-medium">
                {selectedLoanType ? `${selectedLoanType.interestRate}%` : '-'}
              </p>
            </div>
            <div className="p-3 rounded-md border bg-background">
              <p className="text-xs text-muted-foreground">{t.apply.step2.periods}</p>
              <p className="text-sm font-medium">{periods}</p>
            </div>
            <div className="p-3 rounded-md border bg-background">
              <p className="text-xs text-muted-foreground">{t.apply.step2.installmentPerPeriod}</p>
              <p className="text-sm font-medium">
                {Intl.NumberFormat().format(Math.round(repayment.installment))}
              </p>
            </div>
            <div className="p-3 rounded-md border bg-background">
              <p className="text-xs text-muted-foreground">{t.apply.step2.totalInterest}</p>
              <p className="text-sm font-medium">
                {Intl.NumberFormat().format(Math.round(repayment.totalInterest))}
              </p>
            </div>
            <div className="p-3 rounded-md border bg-background">
              <p className="text-xs text-muted-foreground">{t.apply.step2.totalRepay}</p>
              <p className="text-sm font-medium">
                {Intl.NumberFormat().format(Math.round(repayment.totalRepay))}
              </p>
            </div>
            {processingFee !== undefined && (
              <div className="p-3 rounded-md border bg-background">
                <p className="text-xs text-muted-foreground">{t.apply.step2.processingFee}</p>
                <p className="text-sm font-medium">
                  {Intl.NumberFormat().format(Math.round(processingFee))}
                </p>
              </div>
            )}
            {disbursedAmount !== undefined && (
              <div className="p-3 rounded-md border bg-background">
                <p className="text-xs text-muted-foreground">{t.apply.step2.disbursedAmount}</p>
                <p className="text-sm font-medium">
                  {Intl.NumberFormat().format(Math.round(disbursedAmount))}
                </p>
              </div>
            )}
          </div>
          {penaltyPerMonth !== undefined && (
            <div className="pt-2 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-md border bg-background">
                  <p className="text-xs text-muted-foreground">{t.apply.step2.penaltyTitle}</p>
                  <p className="text-sm font-medium">
                    {selectedLoanType?.penaltyRate}% • {t.apply.step2.monthlyPenalty}: ~{Intl.NumberFormat().format(Math.round(penaltyPerMonth))}
                  </p>
                </div>
              </div>
            </div>
          )}
          {selectedLoanType && selectedLoanType.durationMonths < 3 && monthSchedule.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium">{t.apply.step2.monthlySummaryTitle}</p>
              <div className="flex flex-wrap gap-3">
                {monthSchedule.map((m) => (
                  <div key={m.label} className="p-3 rounded-md border bg-background">
                    <p className="text-xs text-muted-foreground capitalize">{t.apply.step2.month}: {m.label}</p>
                    <p className="text-sm font-medium">{t.apply.step2.payment}: {Intl.NumberFormat().format(Math.round(m.amount))}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="cursor-pointer">{t.apply.previous}</Button>
        <Button onClick={nextStep} disabled={!isComplete} className="cursor-pointer">{t.apply.next}</Button>
      </div>
    </div>
  );
}
