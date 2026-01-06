export default async function Page({
  params,
}: {
  params: Promise<{ LoanID: string }>;
}) {
  const { LoanID } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Loan {LoanID}</h1>
      <p className="text-muted-foreground">
        Track and manage loan repayments here.
      </p>
    </div>
  );
}
