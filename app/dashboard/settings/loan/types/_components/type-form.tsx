"use client"

import { useState } from "react";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

type RepaymentFrequency = "monthly" | "weekly";
type CalculationMethod = "flat" | "reducing_balance";

export type LoanTypeFormValues = {
  name: string;
  description?: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  penaltyRate: number;
  processingFeeType?: "percentage" | "fixed";
  processingFeeValue?: number;
  durationMonths: number;
  repaymentFrequency: RepaymentFrequency;
  calculationMethod: CalculationMethod;
  active: boolean;
};

export function TypeForm({
  initial,
  onSaved,
  id,
}: {
  id?: Id<"loanTypes">;
  initial?: LoanTypeFormValues;
  onSaved?: () => void;
}) {
  const create = useMutation("loantype:create" as unknown as never) as unknown as (
    args: LoanTypeFormValues
  ) => Promise<Id<"loanTypes">>;
  const update = useMutation("loantype:update" as unknown as never) as unknown as (
    args: { id: Id<"loanTypes">; patch: Partial<LoanTypeFormValues> }
  ) => Promise<boolean>;

  const [values, setValues] = useState<LoanTypeFormValues>(
    initial ?? {
      name: "",
      description: "",
      minAmount: 100000,
      maxAmount: 10000000,
      interestRate: 5,
      penaltyRate: 5,
      processingFeeType: "percentage",
      processingFeeValue: 0,
      durationMonths: 6,
      repaymentFrequency: "monthly",
      calculationMethod: "flat",
      active: true,
    }
  );

  // Controlled state seeded from initial once

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (values.minAmount > values.maxAmount) {
      alert("Min amount cannot be greater than max amount");
      return;
    }
    try {
      const patch = {
        name: values.name,
        description: values.description,
        minAmount: values.minAmount,
        maxAmount: values.maxAmount,
        interestRate: values.interestRate,
        penaltyRate: values.penaltyRate,
        processingFeeType: values.processingFeeType,
        processingFeeValue: values.processingFeeValue,
        durationMonths: values.durationMonths,
        repaymentFrequency: values.repaymentFrequency,
        calculationMethod: values.calculationMethod,
        active: values.active,
      };
      if (id) {
        await update({
          id,
          patch,
        });
      } else {
        await create(patch as LoanTypeFormValues);
      }
      onSaved?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      alert(msg);
    }
  };

  const set = <K extends keyof LoanTypeFormValues>(key: K, val: LoanTypeFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: val as LoanTypeFormValues[K] }));

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Input
              value={values.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Min Amount</Label>
            <Input
              type="number"
              value={values.minAmount}
              onChange={(e) => set("minAmount", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Amount</Label>
            <Input
              type="number"
              value={values.maxAmount}
              onChange={(e) => set("maxAmount", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Interest Rate (%)</Label>
            <Input
              type="number"
              value={values.interestRate}
              onChange={(e) => set("interestRate", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Penalty Rate (%)</Label>
            <Input
              type="number"
              value={values.penaltyRate}
              onChange={(e) => set("penaltyRate", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Processing Fee Type</Label>
            <Select
              value={values.processingFeeType}
              onValueChange={(v) => set("processingFeeType", v as "percentage" | "fixed")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select fee type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Processing Fee Value</Label>
            <Input
              type="number"
              value={values.processingFeeValue ?? 0}
              onChange={(e) => set("processingFeeValue", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Duration (months)</Label>
            <Input
              type="number"
              value={values.durationMonths}
              onChange={(e) => set("durationMonths", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Repayment Frequency</Label>
            <Select
              value={values.repaymentFrequency}
              onValueChange={(v) => set("repaymentFrequency", v as RepaymentFrequency)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Calculation Method</Label>
            <Select
              value={values.calculationMethod}
              onValueChange={(v) => set("calculationMethod", v as CalculationMethod)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="reducing_balance">Reducing Balance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={values.active}
              onCheckedChange={(checked) => set("active", !!checked)}
            />
            <Label>Active</Label>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button type="submit">{id ? "Update" : "Create"}</Button>
      </div>
    </form>
  );
}
