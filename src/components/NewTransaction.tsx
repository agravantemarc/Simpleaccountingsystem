import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Account, JournalEntry } from '../types/accounting';

interface NewTransactionProps {
  accounts: Account[];
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'approved'>) => void;
  userEmail: string;
}

export function NewTransaction({ accounts, onAddEntry, userEmail }: NewTransactionProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [debitAccountId, setDebitAccountId] = useState('');
  const [creditAccountId, setCreditAccountId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !description || !reference || !debitAccountId || !creditAccountId || !amount) {
      alert('Please fill in all fields');
      return;
    }

    if (debitAccountId === creditAccountId) {
      alert('Debit and credit accounts must be different');
      return;
    }

    onAddEntry({
      date,
      description,
      reference,
      debitAccountId,
      creditAccountId,
      amount: parseFloat(amount),
      createdBy: userEmail,
    });

    // Reset form
    setDescription('');
    setReference('');
    setDebitAccountId('');
    setCreditAccountId('');
    setAmount('');
  };

  const activeAccounts = accounts.filter(acc => acc.isActive);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>New Journal Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference No.</Label>
              <Input
                id="reference"
                placeholder="JE-XXX"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="debit">Debit Account</Label>
              <Select value={debitAccountId} onValueChange={setDebitAccountId} required>
                <SelectTrigger id="debit">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {activeAccounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credit">Credit Account</Label>
              <Select value={creditAccountId} onValueChange={setCreditAccountId} required>
                <SelectTrigger id="credit">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {activeAccounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Create Journal Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
