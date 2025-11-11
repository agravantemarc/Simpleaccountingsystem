import { Account, JournalEntry, UserRole } from '../types/accounting';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';

interface TransactionsProps {
  entries: JournalEntry[];
  accounts: Account[];
  userRole: UserRole;
  onApprove?: (entryId: string) => void;
  onDelete?: (entryId: string) => void;
}

export function Transactions({ entries, accounts, userRole, onApprove, onDelete }: TransactionsProps) {
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

  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatUserBranch = (email: string) => {
    const parts = email.split('@');
    const userName = parts[0].split('.').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    const branch = parts[1]?.split('.')[0] || 'unknown';
    const branchName = branch.charAt(0).toUpperCase() + branch.slice(1);
    return { userName, branchName };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Debit Account</TableHead>
                <TableHead>Credit Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Status</TableHead>
                {userRole === 'admin' && <TableHead className="text-center">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={userRole === 'admin' ? 9 : 8} className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                sortedEntries.map((entry) => {
                  const { userName, branchName } = formatUserBranch(entry.createdBy);
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                      <TableCell>{entry.reference}</TableCell>
                      <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                      <TableCell>{getAccountName(entry.debitAccountId)}</TableCell>
                      <TableCell>{getAccountName(entry.creditAccountId)}</TableCell>
                      <TableCell className="text-right">{formatAmount(entry.amount)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">{userName}</span>
                          <Badge variant="outline" className="w-fit text-xs">
                            {branchName}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {entry.approved ? (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approved
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      {userRole === 'admin' && (
                        <TableCell className="text-center">
                          <div className="flex gap-2 justify-center">
                            {!entry.approved && onApprove && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onApprove(entry.id)}
                              >
                                Approve
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => onDelete(entry.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}