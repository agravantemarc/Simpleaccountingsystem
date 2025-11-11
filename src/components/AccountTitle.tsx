import { useState } from 'react';
import { Account, AccountType, UserRole } from '../types/accounting';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';

interface AccountTitleProps {
  accounts: Account[];
  userRole: UserRole;
  onAddAccount?: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  onToggleActive?: (accountId: string) => void;
}

export function AccountTitle({ accounts, userRole, onAddAccount, onToggleActive }: AccountTitleProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('Asset');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || !name || !type) {
      alert('Please fill in all fields');
      return;
    }

    if (onAddAccount) {
      onAddAccount({
        code,
        name,
        type,
        isActive: true,
      });
    }

    // Reset form
    setCode('');
    setName('');
    setType('Asset');
    setIsDialogOpen(false);
  };

  const groupedAccounts = accounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<AccountType, Account[]>);

  const accountTypes: AccountType[] = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Chart of Accounts</CardTitle>
        {userRole === 'admin' && onAddAccount && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Account Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., 1050"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Account Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Bank Account"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Account Type</Label>
                  <Select value={type} onValueChange={(value) => setType(value as AccountType)}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asset">Asset</SelectItem>
                      <SelectItem value="Liability">Liability</SelectItem>
                      <SelectItem value="Equity">Equity</SelectItem>
                      <SelectItem value="Revenue">Revenue</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Create Account</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {accountTypes.map(accountType => {
          const typeAccounts = groupedAccounts[accountType] || [];
          if (typeAccounts.length === 0) return null;

          return (
            <div key={accountType}>
              <h3 className="mb-3 px-2 py-1 bg-muted rounded">{accountType}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    {userRole === 'admin' && <TableHead className="text-center">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typeAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.code}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={account.isActive ? 'default' : 'secondary'}>
                          {account.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      {userRole === 'admin' && onToggleActive && (
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onToggleActive(account.id)}
                          >
                            {account.isActive ? (
                              <ToggleRight className="w-4 h-4 mr-1" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 mr-1" />
                            )}
                            {account.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
