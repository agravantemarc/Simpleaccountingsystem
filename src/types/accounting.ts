export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  isActive: boolean;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  debitAccountId: string;
  creditAccountId: string;
  amount: number;
  createdBy: string;
  createdAt: string;
  approved: boolean;
}

export interface LedgerEntry {
  date: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
}

export type UserRole = 'user' | 'admin';
