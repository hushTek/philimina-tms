"use client"

import { useState, useMemo } from "react";
import { usePaginatedQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TypeForm, LoanTypeFormValues } from "./_components/type-form";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/components/language-provider";

type LoanType = LoanTypeFormValues & {
  _id: Id<"loanTypes">;
  createdAt: number;
};

export default function Page() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [editing, setEditing] = useState<LoanType | null>(null);
  const [creating, setCreating] = useState(false);

  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.loantype.listPaginated,
    { search, includeInactive },
    { initialNumItems: 10 }
  );
  const remove = useMutation("loantype:remove" as unknown as never) as unknown as (
    args: { id: Id<"loanTypes"> }
  ) => Promise<boolean>;

  const items = useMemo(() => results ?? [], [results]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t.dashboard?.loanTypes?.title || "Loan Types"}</h1>
        <Button onClick={() => setCreating(true)}>{t.dashboard?.loanTypes?.new || "New Loan Type"}</Button>
      </div>
      <section className="space-y-4 pt-6">
        <div className="flex gap-3">
          <Input
            placeholder={t.dashboard?.loanTypes?.searchPlaceholder || "Search name or description..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
            />
            {t.dashboard?.loanTypes?.includeInactive || "Include inactive"}
          </label>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">{t.dashboard?.loanTypes?.table?.name || "Name"}</th>
                <th className="py-2">{t.dashboard?.loanTypes?.table?.range || "Range"}</th>
                <th className="py-2">{t.dashboard?.loanTypes?.table?.interestRate || "Interest %"}</th>
                <th className="py-2">{t.dashboard?.loanTypes?.table?.penaltyRate || "Penalty %"}</th>
                <th className="py-2">{t.dashboard?.loanTypes?.table?.duration || "Duration"}</th>
                <th className="py-2">{t.dashboard?.loanTypes?.table?.frequency || "Frequency"}</th>
                <th className="py-2">{t.dashboard?.loanTypes?.table?.method || "Method"}</th>
                <th className="py-2">{t.dashboard?.loanTypes?.table?.active || "Active"}</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((lt) => (
                <tr key={lt._id} className="border-b">
                  <td className="py-2">{lt.name}</td>
                  <td className="py-2">
                    {Intl.NumberFormat().format(lt.minAmount)} –{" "}
                    {Intl.NumberFormat().format(lt.maxAmount)}
                  </td>
                  <td className="py-2">{lt.interestRate}%</td>
                  <td className="py-2">{lt.penaltyRate}%</td>
                  <td className="py-2">{lt.durationMonths} {t.apply.step3.month || "months"}</td>
                  <td className="py-2">{lt.repaymentFrequency}</td>
                  <td className="py-2">{lt.calculationMethod}</td>
                  <td className="py-2">
                    <span
                      className={
                        lt.active
                          ? "text-green-600 font-medium"
                          : "text-gray-400"
                      }
                    >
                      {lt.active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setEditing(lt)}
                      >
                        {t.dashboard?.common?.edit || "Edit"}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          if (confirm(t.dashboard?.loanTypes?.deleteConfirm || "Delete this loan type? This cannot be undone.")) {
                            try {
                              await remove({ id: lt._id });
                            } catch (err: unknown) {
                              const msg = err instanceof Error ? err.message : (t.dashboard?.loanTypes?.deleteFailed || "Failed to delete");
                              alert(msg);
                            }
                          }
                        }}
                      >
                        {t.dashboard?.common?.delete || "Delete"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="py-6 text-center text-muted-foreground" colSpan={9}>
                    {t.dashboard?.loanTypes?.empty || "No loan types found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <Button
            variant="outline"
            disabled={isLoading || status === "Exhausted"}
            onClick={() => loadMore(10)}
          >
            {status === "Exhausted" ? (t.dashboard?.applications?.noMore || "No more") : isLoading ? (t.dashboard?.common?.loading || "Loading...") : (t.dashboard?.applications?.loadMore || "Load more")}
          </Button>
        </div>
      </section>

      {creating && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t.dashboard?.loanTypes?.create || "Create Loan Type"}</h2>
              <Button variant="ghost" onClick={() => setCreating(false)}>
                {t.dashboard?.loanTypes?.close || "Close"}
              </Button>
            </div>
            <TypeForm
              onSaved={() => {
                setCreating(false);
              }}
              key="create"
            />
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t.dashboard?.loanTypes?.edit || "Edit Loan Type"}</h2>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                {t.dashboard?.loanTypes?.close || "Close"}
              </Button>
            </div>
            <TypeForm
              id={editing._id}
              initial={editing}
              onSaved={() => {
                setEditing(null);
              }}
              key={String(editing._id)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
