import { Account, JournalEntry, UserRole } from '../types/accounting';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet } from 'lucide-react';
import { Badge } from './ui/badge';

interface DashboardProps {
  entries: JournalEntry[];
  accounts: Account[];
  userRole: UserRole;
}

export function Dashboard({ entries, accounts, userRole }: DashboardProps) {
  // Calculate cash flow data by month
  const getCashFlowData = () => {
    const monthlyData: { [key: string]: { month: string; inflow: number; outflow: number } } = {};
    
    entries.forEach(entry => {
      const account = accounts.find(a => a.id === entry.debitAccountId);
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthName, inflow: 0, outflow: 0 };
      }
      
      if (account?.type === 'Asset' && account.code === '1010') {
        monthlyData[monthKey].inflow += entry.amount;
      } else if (account?.type === 'Expense') {
        monthlyData[monthKey].outflow += entry.amount;
      }
    });
    
    return Object.values(monthlyData);
  };

  // Calculate expenses by category
  const getExpensesData = () => {
    const expensesByCategory: { [key: string]: number } = {};
    
    entries.forEach(entry => {
      const debitAccount = accounts.find(a => a.id === entry.debitAccountId);
      if (debitAccount?.type === 'Expense') {
        expensesByCategory[debitAccount.name] = (expensesByCategory[debitAccount.name] || 0) + entry.amount;
      }
    });
    
    return Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));
  };

  // Calculate sales over time
  const getSalesData = () => {
    const salesByDate: { [key: string]: number } = {};
    
    entries.forEach(entry => {
      const creditAccount = accounts.find(a => a.id === entry.creditAccountId);
      if (creditAccount?.type === 'Revenue') {
        const date = new Date(entry.date);
        const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        salesByDate[dateKey] = (salesByDate[dateKey] || 0) + entry.amount;
      }
    });
    
    return Object.entries(salesByDate).map(([date, sales]) => ({ date, sales }));
  };

  // Calculate profit and loss
  const getProfitAndLoss = () => {
    let revenue = 0;
    let expenses = 0;
    
    entries.forEach(entry => {
      const creditAccount = accounts.find(a => a.id === entry.creditAccountId);
      const debitAccount = accounts.find(a => a.id === entry.debitAccountId);
      
      if (creditAccount?.type === 'Revenue') {
        revenue += entry.amount;
      }
      if (debitAccount?.type === 'Expense') {
        expenses += entry.amount;
      }
    });
    
    const netIncome = revenue - expenses;
    
    return [
      { name: 'Revenue', value: revenue, color: '#10b981' },
      { name: 'Expenses', value: expenses, color: '#ef4444' },
    ];
  };

  // Calculate key metrics
  const getMetrics = () => {
    let totalCash = 0;
    let totalRevenue = 0;
    let totalExpenses = 0;
    
    entries.forEach(entry => {
      const debitAccount = accounts.find(a => a.id === entry.debitAccountId);
      const creditAccount = accounts.find(a => a.id === entry.creditAccountId);
      
      if (debitAccount?.code === '1010') {
        totalCash += entry.amount;
      }
      if (creditAccount?.code === '1010') {
        totalCash -= entry.amount;
      }
      if (creditAccount?.type === 'Revenue') {
        totalRevenue += entry.amount;
      }
      if (debitAccount?.type === 'Expense') {
        totalExpenses += entry.amount;
      }
    });
    
    const netIncome = totalRevenue - totalExpenses;
    
    return { totalCash, totalRevenue, totalExpenses, netIncome };
  };

  const cashFlowData = getCashFlowData();
  const expensesData = getExpensesData();
  const salesData = getSalesData();
  const profitLossData = getProfitAndLoss();
  const metrics = getMetrics();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a'];
  const EXPENSE_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Financial insights and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Cash Flow</CardTitle>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatCurrency(metrics.totalCash)}</div>
            <p className="text-xs text-muted-foreground mt-1">Current balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatCurrency(metrics.totalRevenue)}</div>
            <p className="text-xs text-green-600 mt-1">+{((metrics.totalRevenue / 10000) * 100).toFixed(1)}% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Expenses</CardTitle>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatCurrency(metrics.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">Operating costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Net Income</CardTitle>
            <DollarSign className={`w-4 h-4 ${metrics.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${metrics.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(metrics.netIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Profit this period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <p className="text-sm text-muted-foreground">Monthly inflow and outflow</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Legend />
                <Bar dataKey="inflow" fill="#10b981" name="Inflow" radius={[8, 8, 0, 0]} />
                <Bar dataKey="outflow" fill="#ef4444" name="Outflow" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expenses Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">By category</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expensesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expensesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Revenue over time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit & Loss */}
        <Card>
          <CardHeader>
            <CardTitle>Profit and Loss</CardTitle>
            <p className="text-sm text-muted-foreground">Revenue vs Expenses</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={profitLossData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {profitLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.slice(-5).reverse().map((entry) => {
              const debitAccount = accounts.find(a => a.id === entry.debitAccountId);
              const creditAccount = accounts.find(a => a.id === entry.creditAccountId);
              return (
                <div key={entry.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="text-sm">{entry.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {debitAccount?.name} → {creditAccount?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatCurrency(entry.amount)}</p>
                    <Badge variant={entry.approved ? 'default' : 'secondary'} className="mt-1">
                      {entry.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}