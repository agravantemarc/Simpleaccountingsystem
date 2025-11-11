import { Account, JournalEntry } from '../types/accounting';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface GeneralJournalProps {
  entries: JournalEntry[];
  accounts: Account[];
}

export function GeneralJournal({ entries, accounts }: GeneralJournalProps) {
  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? `${account.code} - ${account.name}` : 'Unknown';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const sortedEntries = [...entries]
    .filter(entry => entry.approved)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>General Journal</CardTitle>
        <p className="text-sm text-muted-foreground">Chronological record of all approved transactions</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No approved transactions found
                  </TableCell>
                </TableRow>
              ) : (
                sortedEntries.flatMap((entry) => [
                  // Debit entry
                  <TableRow key={`${entry.id}-debit`} className="border-b-0">
                    <TableCell rowSpan={2} className="align-top">
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell rowSpan={2} className="align-top">
                      {entry.reference}
                    </TableCell>
                    <TableCell className="pl-4">{getAccountName(entry.debitAccountId)}</TableCell>
                    <TableCell rowSpan={2} className="align-top">
                      {entry.description}
                    </TableCell>
                    <TableCell className="text-right">{formatAmount(entry.amount)}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                  </TableRow>,
                  // Credit entry
                  <TableRow key={`${entry.id}-credit`} className="border-b-2">
                    <TableCell className="pl-8">{getAccountName(entry.creditAccountId)}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">{formatAmount(entry.amount)}</TableCell>
                  </TableRow>
                ])
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
