import { Account, JournalEntry } from '../types/accounting';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface BalanceSheetProps {
  entries: JournalEntry[];
  accounts: Account[];
}

export function BalanceSheet({ entries, accounts }: BalanceSheetProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateAccountBalance = (accountId: string): number => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return 0;

    const approvedEntries = entries.filter(entry => entry.approved);
    const isDebitNormalBalance = ['Asset', 'Expense'].includes(account.type);

    let balance = 0;
    approvedEntries.forEach(entry => {
      if (entry.debitAccountId === accountId) {
        balance += isDebitNormalBalance ? entry.amount : -entry.amount;
      }
      if (entry.creditAccountId === accountId) {
        balance += isDebitNormalBalance ? -entry.amount : entry.amount;
      }
    });

    return balance;
  };

  const getAccountsByType = (type: string) => {
    return accounts
      .filter(acc => acc.type === type && acc.isActive)
      .map(acc => ({
        ...acc,
        balance: calculateAccountBalance(acc.id),
      }))
      .filter(acc => acc.balance !== 0);
  };

  const assets = getAccountsByType('Asset');
  const liabilities = getAccountsByType('Liability');
  const equity = getAccountsByType('Equity');

  // Calculate net income (Revenue - Expenses)
  const revenueAccounts = getAccountsByType('Revenue');
  const expenseAccounts = getAccountsByType('Expense');
  
  const totalRevenue = revenueAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalExpenses = expenseAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const netIncome = totalRevenue - totalExpenses;

  const totalAssets = assets.reduce((sum, acc) => sum + acc.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, acc) => sum + acc.balance, 0);
  const totalEquity = equity.reduce((sum, acc) => sum + acc.balance, 0) + netIncome;

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Balance Sheet</CardTitle>
        <p className="text-sm text-muted-foreground">As of {new Date().toLocaleDateString()}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Assets */}
          <div>
            <h3 className="mb-4 pb-2 border-b-2">ASSETS</h3>
            <div className="space-y-2">
              {assets.map(account => (
                <div key={account.id} className="flex justify-between py-1">
                  <span className="pl-4">{account.name}</span>
                  <span>{formatAmount(account.balance)}</span>
                </div>
              ))}
              {assets.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No asset accounts</div>
              )}
            </div>
            <div className="flex justify-between py-2 mt-4 border-t-2 border-double">
              <span>Total Assets</span>
              <span>{formatAmount(totalAssets)}</span>
            </div>
          </div>

          {/* Liabilities & Equity */}
          <div>
            <h3 className="mb-4 pb-2 border-b-2">LIABILITIES & EQUITY</h3>
            
            {/* Liabilities */}
            <div className="mb-6">
              <h4 className="mb-2">Liabilities</h4>
              <div className="space-y-2">
                {liabilities.map(account => (
                  <div key={account.id} className="flex justify-between py-1">
                    <span className="pl-4">{account.name}</span>
                    <span>{formatAmount(account.balance)}</span>
                  </div>
                ))}
                {liabilities.length === 0 && (
                  <div className="text-center py-2 text-muted-foreground text-sm">No liabilities</div>
                )}
              </div>
              <div className="flex justify-between py-2 mt-2 border-t">
                <span className="pl-4">Total Liabilities</span>
                <span>{formatAmount(totalLiabilities)}</span>
              </div>
            </div>

            {/* Equity */}
            <div>
              <h4 className="mb-2">Equity</h4>
              <div className="space-y-2">
                {equity.map(account => (
                  <div key={account.id} className="flex justify-between py-1">
                    <span className="pl-4">{account.name}</span>
                    <span>{formatAmount(account.balance)}</span>
                  </div>
                ))}
                {netIncome !== 0 && (
                  <div className="flex justify-between py-1">
                    <span className="pl-4">Net Income</span>
                    <span>{formatAmount(netIncome)}</span>
                  </div>
                )}
                {equity.length === 0 && netIncome === 0 && (
                  <div className="text-center py-2 text-muted-foreground text-sm">No equity</div>
                )}
              </div>
              <div className="flex justify-between py-2 mt-2 border-t">
                <span className="pl-4">Total Equity</span>
                <span>{formatAmount(totalEquity)}</span>
              </div>
            </div>

            <div className="flex justify-between py-2 mt-4 border-t-2 border-double">
              <span>Total Liabilities & Equity</span>
              <span>{formatAmount(totalLiabilities + totalEquity)}</span>
            </div>
          </div>
        </div>

        {/* Balance Check */}
        {Math.abs(totalAssets - (totalLiabilities + totalEquity)) > 0.01 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p>⚠️ Warning: Balance sheet does not balance!</p>
            <p className="text-sm">
              Difference: {formatAmount(totalAssets - (totalLiabilities + totalEquity))}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
