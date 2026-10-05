import React, { useState, useMemo } from 'react';
import { useBank } from '../../context/BankContext';
import { AccountItem, TransactionItem } from '../../types/bank';
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Filter,
  Layers,
  Lock,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Zap,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid
} from 'lucide-react';

interface AccountSummarySectionProps {
  onSelectAccount?: (account: AccountItem) => void;
}

export const AccountSummarySection: React.FC<AccountSummarySectionProps> = ({ onSelectAccount }) => {
  const {
    accounts,
    transactions,
    currency,
    formatCurrency,
    isBalanceConcealed,
    setActiveDesktopTab,
    showToast,
  } = useBank();

  // Filter and display state
  const [accountTypeFilter, setAccountTypeFilter] = useState<'all' | 'checking' | 'savings' | 'vault'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Match transactions to accounts based on account mask or type
  const getAccountTransactions = (account: AccountItem): TransactionItem[] => {
    const mask = account.accountNumber.replace(/[^0-9]/g, '');
    return transactions.filter((t) => {
      const source = t.accountSource.toLowerCase();
      if (mask && source.includes(mask)) return true;
      if (account.type === 'checking' && source.includes('checking')) return true;
      if (account.type === 'savings' && source.includes('savings')) return true;
      if (account.type === 'vault' && (source.includes('vault') || source.includes('treasury'))) return true;
      return false;
    });
  };

  // Filtered accounts list
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesType = accountTypeFilter === 'all' || acc.type === accountTypeFilter;
      const matchesSearch =
        searchQuery === '' ||
        acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (acc.badgeText && acc.badgeText.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [accounts, accountTypeFilter, searchQuery]);

  // Aggregate metrics
  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + curr.balance, 0);
  }, [accounts]);

  const totalAvailable = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + (curr.availableBalance ?? curr.balance), 0);
  }, [accounts]);

  const totalAccruedInterest = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + (curr.accruedInterest ?? 0), 0);
  }, [accounts]);

  // Handle Export to CSV
  const handleExportAccountsCSV = () => {
    const headers = [
      'Account Name',
      'Account Number',
      'Account Type',
      'Status',
      `Current Balance (${currency})`,
      `Available Balance (${currency})`,
      'APY / Rate (%)',
      'Daily Limit',
      'Latest Activity Title',
      'Latest Activity Amount',
      'Latest Activity Date',
    ];

    const rows = accounts.map((acc) => {
      const txs = getAccountTransactions(acc);
      const latestTx = txs[0];
      return [
        `"${acc.name}"`,
        `"${acc.accountNumber}"`,
        `"${acc.type.toUpperCase()}"`,
        `"${acc.status.toUpperCase()}"`,
        acc.balance.toFixed(2),
        (acc.availableBalance ?? acc.balance).toFixed(2),
        acc.apy ? `${acc.apy}%` : 'N/A',
        acc.dailyLimit ? acc.dailyLimit.toFixed(2) : 'N/A',
        latestTx ? `"${latestTx.title}"` : 'None',
        latestTx ? latestTx.amount.toFixed(2) : '0.00',
        latestTx ? `"${latestTx.date}"` : 'N/A',
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FinCore_Institutional_Account_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported institutional account summary report (CSV)', 'success');
  };

  const toggleExpand = (accId: string) => {
    setExpandedAccountId((prev) => (prev === accId ? null : accId));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-200">
      {/* Section Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300">
                <Building2 className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                Institutional Demand &amp; Ring-Fenced Vaults
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                FDIC Insured to $2.5M
              </span>
            </div>
            <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight">
              Account Summary &amp; Activity Ledger
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current real-time balances, available liquidity, yield metrics, and itemized transaction activity for all linked accounts.
            </p>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/60 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-[#00236f] dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Tabular Ledger View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-[#00236f] dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Card Bento View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportAccountsCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            {/* Link Account */}
            <button
              type="button"
              onClick={() => showToast('Opening Institutional Clearing Account Setup Wizard...', 'info')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00236f] dark:bg-blue-600 hover:bg-[#00174b] text-white text-xs font-bold transition-all shadow-sm active:scale-[0.99]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Link Account</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-[#f2f3ff] dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Combined Book Balance
            </span>
            <div className="text-lg sm:text-xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white mt-1 tabular-nums">
              {isBalanceConcealed ? '••••••••' : formatCurrency(totalBalance)}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+4.8% billing cycle</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f2f3ff] dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Available Liquidity
            </span>
            <div className="text-lg sm:text-xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-[#00236f] dark:text-blue-300 mt-1 tabular-nums">
              {isBalanceConcealed ? '••••••••' : formatCurrency(totalAvailable)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {((totalAvailable / totalBalance) * 100).toFixed(1)}% instant settlement
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f2f3ff] dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Accrued Interest (MTD)
            </span>
            <div className="text-lg sm:text-xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              +{formatCurrency(totalAccruedInterest || 58.20)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Next sweep payout Nov 01
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f2f3ff] dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Clearing Rails
            </span>
            <div className="text-base sm:text-lg font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>FedNow &amp; Fedwire</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              3 of 3 accounts in good standing
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Account Type Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'All Accounts', count: accounts.length },
              { id: 'checking', label: 'Operating Checking', count: accounts.filter((a) => a.type === 'checking').length },
              { id: 'savings', label: 'High-Yield Savings', count: accounts.filter((a) => a.type === 'savings').length },
              { id: 'vault', label: 'Treasury Vaults', count: accounts.filter((a) => a.type === 'vault').length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAccountTypeFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  accountTypeFilter === tab.id
                    ? 'bg-[#00236f] text-white dark:bg-blue-600 shadow-2xs'
                    : 'bg-[#f2f3ff] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className="ml-1.5 text-[10px] opacity-75 font-mono">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by account or mask..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#f2f3ff] dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200/60 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* View Mode: Tabular Format (Default) */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f2f3ff] dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <th className="py-3.5 px-6">Account Name &amp; Mask</th>
                <th className="py-3.5 px-4 text-right">Current Balance</th>
                <th className="py-3.5 px-4 text-right">Available Liquidity</th>
                <th className="py-3.5 px-4">Yield / Terms</th>
                <th className="py-3.5 px-6">Recent Activity (Latest Settled)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAccounts.map((account) => {
                const txList = getAccountTransactions(account);
                const latestTx = txList[0];
                const isExpanded = expandedAccountId === account.id;
                const availablePct = account.availableBalance
                  ? Math.min(100, (account.availableBalance / account.balance) * 100)
                  : 100;

                return (
                  <React.Fragment key={account.id}>
                    {/* Primary Account Row */}
                    <tr
                      className={`hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer ${
                        isExpanded ? 'bg-blue-50/60 dark:bg-slate-800/70' : ''
                      }`}
                      onClick={() => toggleExpand(account.id)}
                    >
                      {/* Column 1: Account Identification */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              account.type === 'savings'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                : account.type === 'checking'
                                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {account.type === 'savings'
                                ? 'savings'
                                : account.type === 'checking'
                                ? 'account_balance'
                                : 'lock'}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                {account.name}
                              </span>
                              {account.badgeText && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                                  {account.badgeText}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                              <span>USD</span>
                              <span>•</span>
                              <span>{account.accountNumber}</span>
                              <span>•</span>
                              <span className="capitalize">{account.type}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Current Balance */}
                      <td className="py-4 px-4 text-right">
                        <div className="text-sm font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tabular-nums">
                          {isBalanceConcealed ? '••••••••' : formatCurrency(account.balance)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Ledger Total
                        </div>
                      </td>

                      {/* Column 3: Available Liquidity */}
                      <td className="py-4 px-4 text-right">
                        <div className="text-xs font-bold text-[#00236f] dark:text-blue-300 tabular-nums">
                          {isBalanceConcealed
                            ? '••••••••'
                            : formatCurrency(account.availableBalance ?? account.balance)}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-1">
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${availablePct}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                            {availablePct.toFixed(0)}%
                          </span>
                        </div>
                      </td>

                      {/* Column 4: Yield / Terms */}
                      <td className="py-4 px-4">
                        {account.apy ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/60">
                              <TrendingUp className="w-3 h-3 text-emerald-600" />
                              <span>{account.apy}% APY</span>
                            </span>
                            {account.accruedInterest && (
                              <div className="text-[10px] text-slate-400 mt-1">
                                +${account.accruedInterest.toFixed(2)} accrued
                              </div>
                            )}
                          </div>
                        ) : account.dailyLimit ? (
                          <div>
                            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Limit: ${account.dailyLimit.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {account.cardsLinked ? `${account.cardsLinked} cards bound` : 'Direct clearing'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Standard Tier</span>
                        )}
                      </td>

                      {/* Column 5: Recent Account Activity (Latest) */}
                      <td className="py-4 px-6 max-w-[280px]">
                        {latestTx ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]" title={latestTx.title}>
                                {latestTx.title}
                              </span>
                              <span
                                className={`font-mono font-bold text-xs shrink-0 ${
                                  latestTx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {latestTx.amount > 0 ? '+' : ''}
                                {formatCurrency(latestTx.amount)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span>{latestTx.date} • {latestTx.timestamp}</span>
                              <span className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                                <span>{txList.length} txns</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">No settled transactions</span>
                        )}
                      </td>

                      {/* Column 6: Status */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            account.status === 'active'
                              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              account.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          ></span>
                          <span>{account.status === 'active' ? 'Active' : 'Locked Term'}</span>
                        </span>
                      </td>

                      {/* Column 7: Actions */}
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectAccount) onSelectAccount(account);
                              setActiveDesktopTab('transfer');
                              showToast(`Pre-filling transfer from ${account.name}`, 'info');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-bold text-xs transition-colors"
                          >
                            Transfer
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleExpand(account.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Inspect recent activity"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-blue-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Sub-Table: Detailed Recent Activity for This Account */}
                    {isExpanded && (
                      <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-700/60">
                        <td colSpan={7} className="p-4 sm:p-6">
                          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                  <Layers className="w-3.5 h-3.5" />
                                </span>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Recent Activity Ledger • {account.name} ({account.accountNumber})
                                  </h4>
                                  <p className="text-[11px] text-slate-400">
                                    Chronological settled inflows and outbound debits for this institutional repository
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setActiveDesktopTab('transactions')}
                                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                >
                                  <span>View in Full Transactions Ledger</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Sub-Table of Account Activity */}
                            {txList.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                  <thead>
                                    <tr className="text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                                      <th className="py-2 px-3">Date &amp; Time</th>
                                      <th className="py-2 px-3">Reference Nonce</th>
                                      <th className="py-2 px-3">Transaction Title / Description</th>
                                      <th className="py-2 px-3">Speed / Rail</th>
                                      <th className="py-2 px-3 text-right">Settled Amount</th>
                                      <th className="py-2 px-3 text-center">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {txList.map((tx) => (
                                      <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="py-2.5 px-3 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                          {tx.date} • <span className="text-[10px] text-slate-400">{tx.timestamp}</span>
                                        </td>
                                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                                          {tx.ref}
                                        </td>
                                        <td className="py-2.5 px-3">
                                          <div className="font-bold text-slate-900 dark:text-white">
                                            {tx.title}
                                          </div>
                                          <div className="text-[10px] text-slate-400">
                                            {tx.subtitle}
                                          </div>
                                        </td>
                                        <td className="py-2.5 px-3">
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                            <Zap className="w-2.5 h-2.5 text-blue-600" />
                                            <span>{tx.speed || 'Instant'}</span>
                                          </span>
                                        </td>
                                        <td
                                          className={`py-2.5 px-3 text-right font-mono font-bold tabular-nums ${
                                            tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                                          }`}
                                        >
                                          {tx.amount > 0 ? '+' : ''}
                                          {formatCurrency(tx.amount)}
                                        </td>
                                        <td className="py-2.5 px-3 text-center">
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                            <CheckCircle2 className="w-2.5 h-2.5" />
                                            <span>Completed</span>
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="p-4 text-center text-slate-400 text-xs">
                                No recent activity recorded on this sub-ledger yet.
                              </div>
                            )}

                            {/* Sub-ledger footer */}
                            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                              <span>Showing {txList.length} recent settlements for {account.name}</span>
                              <button
                                type="button"
                                onClick={() => showToast(`Generated audit report for ${account.name}`, 'info')}
                                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                              >
                                Download Sub-Ledger Statement →
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Alternative Card Bento View */
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredAccounts.map((account) => {
            const txList = getAccountTransactions(account);
            const latestTx = txList[0];

            return (
              <div
                key={account.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          account.type === 'savings'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : account.type === 'checking'
                            ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">
                          {account.type === 'savings'
                            ? 'savings'
                            : account.type === 'checking'
                            ? 'account_balance'
                            : 'lock'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {account.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">USD • {account.accountNumber}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        account.status === 'active'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{account.status}</span>
                    </span>
                  </div>

                  <div>
                    <div className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tabular-nums">
                      {isBalanceConcealed ? '••••••••' : formatCurrency(account.balance)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                      <span>Available: <strong>{formatCurrency(account.availableBalance ?? account.balance)}</strong></span>
                      {account.apy && <span className="text-emerald-600 font-bold">{account.apy}% APY</span>}
                    </div>
                  </div>

                  {/* Latest Activity Chip */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Latest Activity
                    </span>
                    {latestTx ? (
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                          {latestTx.title}
                        </span>
                        <span
                          className={`font-bold font-mono ${
                            latestTx.amount > 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {latestTx.amount > 0 ? '+' : ''}
                          {formatCurrency(latestTx.amount)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No recent transactions</span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectAccount) onSelectAccount(account);
                      setActiveDesktopTab('transfer');
                    }}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Transfer Funds
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('table');
                      setExpandedAccountId(account.id);
                    }}
                    className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-0.5"
                  >
                    <span>View Ledger</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Table Footer */}
      <div className="p-4 px-6 bg-[#f2f3ff] dark:bg-slate-800/80 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Multi-Account FedLine Real-Time Ledger Active</span>
          </span>
          <span>•</span>
          <span>{filteredAccounts.length} of {accounts.length} linked accounts displayed</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => showToast('Syncing all account balances with clearinghouse node #89194...', 'info')}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-sync Balances</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setActiveDesktopTab('transactions')}
            className="text-xs font-bold text-[#0051d5] dark:text-blue-400 hover:underline"
          >
            View Full Institutional Transactions →
          </button>
        </div>
      </div>
    </div>
  );
};
