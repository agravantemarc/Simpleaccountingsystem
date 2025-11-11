import { useState } from 'react';
import { Book, FileText, FolderTree, BookOpen, Scale, FileSpreadsheet, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { NewTransaction } from './components/NewTransaction';
import { Transactions } from './components/Transactions';
import { AccountTitle } from './components/AccountTitle';
import { GeneralJournal } from './components/GeneralJournal';
import { GeneralLedger } from './components/GeneralLedger';
import { BalanceSheet } from './components/BalanceSheet';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { mockAccounts, mockJournalEntries } from './utils/mockData';
import { Account, JournalEntry, UserRole } from './types/accounting';

type Panel = 'dashboard' | 'new-transaction' | 'transactions' | 'account-title' | 'general-journal' | 'general-ledger' | 'balance-sheet';

export default function App() {
  const [currentPanel, setCurrentPanel] = useState<Panel>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [currentUser] = useState('marc@accounting.com');

  const handleAddEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'approved'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `${journalEntries.length + 1}`,
      createdAt: new Date().toISOString(),
      approved: userRole === 'admin', // Auto-approve if admin
    };
    setJournalEntries([...journalEntries, newEntry]);
    setCurrentPanel('transactions');
  };

  const handleApproveEntry = (entryId: string) => {
    setJournalEntries(
      journalEntries.map(entry =>
        entry.id === entryId ? { ...entry, approved: true } : entry
      )
    );
  };

  const handleDeleteEntry = (entryId: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setJournalEntries(journalEntries.filter(entry => entry.id !== entryId));
    }
  };

  const handleAddAccount = (account: Omit<Account, 'id' | 'createdAt'>) => {
    const newAccount: Account = {
      ...account,
      id: `${accounts.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setAccounts([...accounts, newAccount]);
  };

  const handleToggleActive = (accountId: string) => {
    setAccounts(
      accounts.map(account =>
        account.id === accountId ? { ...account, isActive: !account.isActive } : account
      )
    );
  };

  const toggleUserRole = () => {
    setUserRole(userRole === 'user' ? 'admin' : 'user');
  };

  const menuItems = [
    { id: 'dashboard' as Panel, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-transaction' as Panel, label: 'New Transaction', icon: FileText },
    { id: 'transactions' as Panel, label: 'Transactions', icon: FileSpreadsheet },
    { id: 'account-title' as Panel, label: 'Account Title', icon: FolderTree },
    { id: 'general-journal' as Panel, label: 'General Journal', icon: Book },
    { id: 'general-ledger' as Panel, label: 'General Ledger', icon: BookOpen },
    { id: 'balance-sheet' as Panel, label: 'Balance Sheet', icon: Scale },
  ];

  const pendingCount = journalEntries.filter(e => !e.approved).length;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-[#1f2937] border-r border-[#374151] flex flex-col text-white">
        <div className="p-6 border-b border-[#374151]">
          <h1 className="flex items-center gap-2 text-white">
            <Book className="w-6 h-6" />
            Accounting System
          </h1>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">{currentUser}</span>
            </div>
          </div>
          <div className="mt-2">
            <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
              {userRole.toUpperCase()}
            </Badge>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPanel === item.id;
            const showBadge = item.id === 'transactions' && pendingCount > 0;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPanel(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#2563eb] text-white'
                    : 'hover:bg-[#374151] text-gray-300 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {showBadge && (
                  <Badge variant="destructive" className="ml-auto">
                    {pendingCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#374151]">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent border-[#374151] text-gray-300 hover:bg-[#374151] hover:text-white"
            onClick={toggleUserRole}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Switch to {userRole === 'user' ? 'Admin' : 'User'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {currentPanel === 'dashboard' && (
            <Dashboard
              entries={journalEntries}
              accounts={accounts}
              userRole={userRole}
            />
          )}
          {currentPanel === 'new-transaction' && (
            <NewTransaction
              accounts={accounts}
              onAddEntry={handleAddEntry}
              userEmail={currentUser}
            />
          )}
          {currentPanel === 'transactions' && (
            <Transactions
              entries={journalEntries}
              accounts={accounts}
              userRole={userRole}
              onApprove={userRole === 'admin' ? handleApproveEntry : undefined}
              onDelete={userRole === 'admin' ? handleDeleteEntry : undefined}
            />
          )}
          {currentPanel === 'account-title' && (
            <AccountTitle
              accounts={accounts}
              userRole={userRole}
              onAddAccount={userRole === 'admin' ? handleAddAccount : undefined}
              onToggleActive={userRole === 'admin' ? handleToggleActive : undefined}
            />
          )}
          {currentPanel === 'general-journal' && (
            <GeneralJournal entries={journalEntries} accounts={accounts} />
          )}
          {currentPanel === 'general-ledger' && (
            <GeneralLedger entries={journalEntries} accounts={accounts} />
          )}
          {currentPanel === 'balance-sheet' && (
            <BalanceSheet entries={journalEntries} accounts={accounts} />
          )}
        </div>
      </div>
    </div>
  );
}