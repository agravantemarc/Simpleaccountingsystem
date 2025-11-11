import { Account, JournalEntry } from '../types/accounting';

export const mockAccounts: Account[] = [
  // Assets
  { id: '1', code: '1010', name: 'Cash', type: 'Asset', isActive: true, createdAt: '2025-01-01' },
  { id: '2', code: '1020', name: 'Accounts Receivable', type: 'Asset', isActive: true, createdAt: '2025-01-01' },
  { id: '3', code: '1030', name: 'Inventory', type: 'Asset', isActive: true, createdAt: '2025-01-01' },
  { id: '4', code: '1500', name: 'Equipment', type: 'Asset', isActive: true, createdAt: '2025-01-01' },
  
  // Liabilities
  { id: '5', code: '2010', name: 'Accounts Payable', type: 'Liability', isActive: true, createdAt: '2025-01-01' },
  { id: '6', code: '2020', name: 'Notes Payable', type: 'Liability', isActive: true, createdAt: '2025-01-01' },
  
  // Equity
  { id: '7', code: '3010', name: 'Common Stock', type: 'Equity', isActive: true, createdAt: '2025-01-01' },
  { id: '8', code: '3020', name: 'Retained Earnings', type: 'Equity', isActive: true, createdAt: '2025-01-01' },
  
  // Revenue
  { id: '9', code: '4010', name: 'Sales Revenue', type: 'Revenue', isActive: true, createdAt: '2025-01-01' },
  { id: '10', code: '4020', name: 'Service Revenue', type: 'Revenue', isActive: true, createdAt: '2025-01-01' },
  
  // Expenses
  { id: '11', code: '5010', name: 'Cost of Goods Sold', type: 'Expense', isActive: true, createdAt: '2025-01-01' },
  { id: '12', code: '5020', name: 'Rent Expense', type: 'Expense', isActive: true, createdAt: '2025-01-01' },
  { id: '13', code: '5030', name: 'Salaries Expense', type: 'Expense', isActive: true, createdAt: '2025-01-01' },
  { id: '14', code: '5040', name: 'Utilities Expense', type: 'Expense', isActive: true, createdAt: '2025-01-01' },
];

export const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    date: '2025-10-01',
    description: 'Initial capital investment',
    reference: 'JE-001',
    debitAccountId: '1', // Cash
    creditAccountId: '7', // Common Stock
    amount: 50000,
    createdBy: 'john.smith@headquarters.com',
    createdAt: '2025-10-01T09:00:00Z',
    approved: true,
  },
  {
    id: '2',
    date: '2025-10-05',
    description: 'Purchase of equipment',
    reference: 'JE-002',
    debitAccountId: '4', // Equipment
    creditAccountId: '1', // Cash
    amount: 15000,
    createdBy: 'sarah.jones@westbranch.com',
    createdAt: '2025-10-05T10:30:00Z',
    approved: true,
  },
  {
    id: '3',
    date: '2025-10-10',
    description: 'Sales revenue for October',
    reference: 'JE-003',
    debitAccountId: '1', // Cash
    creditAccountId: '9', // Sales Revenue
    amount: 8500,
    createdBy: 'michael.brown@eastbranch.com',
    createdAt: '2025-10-10T14:20:00Z',
    approved: true,
  },
  {
    id: '4',
    date: '2025-10-15',
    description: 'Purchase inventory on account',
    reference: 'JE-004',
    debitAccountId: '3', // Inventory
    creditAccountId: '5', // Accounts Payable
    amount: 5000,
    createdBy: 'emily.davis@northbranch.com',
    createdAt: '2025-10-15T11:15:00Z',
    approved: true,
  },
  {
    id: '5',
    date: '2025-10-20',
    description: 'Payment of rent',
    reference: 'JE-005',
    debitAccountId: '12', // Rent Expense
    creditAccountId: '1', // Cash
    amount: 2000,
    createdBy: 'david.wilson@southbranch.com',
    createdAt: '2025-10-20T09:45:00Z',
    approved: true,
  },
  {
    id: '6',
    date: '2025-10-25',
    description: 'Salaries payment',
    reference: 'JE-006',
    debitAccountId: '13', // Salaries Expense
    creditAccountId: '1', // Cash
    amount: 6000,
    createdBy: 'lisa.martin@westbranch.com',
    createdAt: '2025-10-25T16:00:00Z',
    approved: true,
  },
  {
    id: '7',
    date: '2025-10-28',
    description: 'Service revenue',
    reference: 'JE-007',
    debitAccountId: '1', // Cash
    creditAccountId: '10', // Service Revenue
    amount: 4200,
    createdBy: 'john.smith@headquarters.com',
    createdAt: '2025-10-28T11:00:00Z',
    approved: true,
  },
  {
    id: '8',
    date: '2025-10-30',
    description: 'Utilities payment',
    reference: 'JE-008',
    debitAccountId: '14', // Utilities Expense
    creditAccountId: '1', // Cash
    amount: 800,
    createdBy: 'sarah.jones@westbranch.com',
    createdAt: '2025-10-30T15:30:00Z',
    approved: true,
  },
  {
    id: '9',
    date: '2025-11-02',
    description: 'Sales revenue',
    reference: 'JE-009',
    debitAccountId: '1', // Cash
    creditAccountId: '9', // Sales Revenue
    amount: 12000,
    createdBy: 'michael.brown@eastbranch.com',
    createdAt: '2025-11-02T10:15:00Z',
    approved: true,
  },
  {
    id: '10',
    date: '2025-11-05',
    description: 'Cost of goods sold',
    reference: 'JE-010',
    debitAccountId: '11', // COGS
    creditAccountId: '3', // Inventory
    amount: 3500,
    createdBy: 'emily.davis@northbranch.com',
    createdAt: '2025-11-05T09:20:00Z',
    approved: true,
  },
  {
    id: '11',
    date: '2025-11-08',
    description: 'Rent payment for November',
    reference: 'JE-011',
    debitAccountId: '12', // Rent Expense
    creditAccountId: '1', // Cash
    amount: 2000,
    createdBy: 'david.wilson@southbranch.com',
    createdAt: '2025-11-08T10:00:00Z',
    approved: false,
  },
  {
    id: '12',
    date: '2025-11-10',
    description: 'Service revenue',
    reference: 'JE-012',
    debitAccountId: '1', // Cash
    creditAccountId: '10', // Service Revenue
    amount: 5500,
    createdBy: 'lisa.martin@westbranch.com',
    createdAt: '2025-11-10T14:45:00Z',
    approved: false,
  },
];