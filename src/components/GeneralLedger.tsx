import { useState } from 'react';
import { Account, JournalEntry, LedgerEntry } from '../types/accounting';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

interface GeneralLedgerProps {
  entries: JournalEntry[];
  accounts: Account[];
}

export function GeneralLedger({ entries, accounts }: GeneralLedgerProps) {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getLedgerEntries = (accountId: string): LedgerEntry[] => {
    const approvedEntries = entries.filter(entry => entry.approved);
    const ledgerEntries: LedgerEntry[] = [];
    let balance = 0;

    const selectedAccount = accounts.find(acc => acc.id === accountId);
    if (!selectedAccount) return [];

    const isDebitNormalBalance = ['Asset', 'Expense'].includes(selectedAccount.type);

    const sortedEntries = approvedEntries
      .filter(entry => entry.debitAccountId === accountId || entry.creditAccountId === accountId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedEntries.forEach(entry => {
      const isDebit = entry.debitAccountId === accountId;
      const debit = isDebit ? entry.amount : 0;
      const credit = !isDebit ? entry.amount : 0;

      if (isDebitNormalBalance) {
        balance += debit - credit;
      } else {
        balance += credit - debit;
      }

      ledgerEntries.push({
        date: entry.date,
        description: entry.description,
        reference: entry.reference,
        debit,
        credit,
        balance,
      });
    });

    return ledgerEntries;
  };

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);
  const ledgerEntries = getLedgerEntries(selectedAccountId);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>General Ledger</CardTitle>
        <div className="space-y-2 mt-4">
          <Label>Select Account</Label>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger>
              <SelectValue placeholder="Select an account" />
            </SelectTrigger>
            <SelectContent>
              {accounts
                .filter(acc => acc.isActive)
                .map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {selectedAccount && (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Account Code</p>
                <p>{selectedAccount.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Name</p>
                <p>{selectedAccount.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p>{selectedAccount.type}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledgerEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No transactions for this account
                  </TableCell>
                </TableRow>
              ) : (
                ledgerEntries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell>{entry.reference}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell className="text-right">
                      {entry.debit > 0 ? formatAmount(entry.debit) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.credit > 0 ? formatAmount(entry.credit) : '-'}
                    </TableCell>
                    <TableCell className="text-right">{formatAmount(entry.balance)}</TableCell>
                  </TableRow>
                ))
              )}
              {ledgerEntries.length > 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-right">
                    Ending Balance:
                  </TableCell>
                  <TableCell className="text-right">
                    {formatAmount(ledgerEntries[ledgerEntries.length - 1].balance)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
