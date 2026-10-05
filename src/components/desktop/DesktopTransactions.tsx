import React, { useState, useRef, useEffect } from 'react';
import { useBank } from '../../context/BankContext';
import { TransactionItem } from '../../types/bank';
import { FinCoreLogo } from '../common/FinCoreLogo';

export const DesktopTransactions: React.FC = () => {
  const { transactions, formatCurrency, showToast } = useBank();

  const [selectedTxn, setSelectedTxn] = useState<TransactionItem>(transactions[0] || transactions[1]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTarget, setSearchTarget] = useState<'all' | 'recipient' | 'amount' | 'date'>('all');
  const [filterType, setFilterType] = useState('All Types');
  const [filterAccount, setFilterAccount] = useState('All Accounts');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [density, setDensity] = useState<'compact' | 'normal'>('normal');

  // Export States
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter transactions dynamically based on date, amount, recipient, ref, or accounts
  const filtered = transactions.filter((t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();

      // Recipient matches
      const matchesRecipient =
        t.title.toLowerCase().includes(q) ||
        (t.customerName && t.customerName.toLowerCase().includes(q)) ||
        (t.subtitle && t.subtitle.toLowerCase().includes(q)) ||
        (t.customerEmail && t.customerEmail.toLowerCase().includes(q)) ||
        (t.signedBy && t.signedBy.toLowerCase().includes(q));

      // Date matches
      const matchesDate =
        t.date.toLowerCase().includes(q) ||
        t.timestamp.toLowerCase().includes(q);

      // Amount matches
      let matchesAmount = false;
      const cleanQ = q.replace(/[$€£,\s]/g, '');
      const numQ = parseFloat(cleanQ);

      // Comparison operator support: e.g. >100, <500, >=200, <=1000
      if (cleanQ.startsWith('>') || cleanQ.startsWith('<')) {
        const op = cleanQ.startsWith('>=') ? '>=' : cleanQ.startsWith('<=') ? '<=' : cleanQ[0];
        const val = parseFloat(cleanQ.replace(/[><=]/g, ''));
        if (!isNaN(val)) {
          const absAmt = Math.abs(t.amount);
          if (op === '>') matchesAmount = absAmt > val;
          else if (op === '>=') matchesAmount = absAmt >= val;
          else if (op === '<') matchesAmount = absAmt < val;
          else if (op === '<=') matchesAmount = absAmt <= val;
        }
      } else if (!isNaN(numQ)) {
        matchesAmount =
          Math.abs(t.amount).toString().includes(cleanQ) ||
          formatCurrency(t.amount).toLowerCase().includes(q) ||
          t.amount.toString().includes(cleanQ);
      } else {
        matchesAmount = formatCurrency(t.amount).toLowerCase().includes(q);
      }

      // Ref and Account matches
      const matchesRef = t.ref.toLowerCase().includes(q);
      const matchesAccount = t.accountSource.toLowerCase().includes(q);

      if (searchTarget === 'recipient') {
        if (!matchesRecipient) return false;
      } else if (searchTarget === 'amount') {
        if (!matchesAmount) return false;
      } else if (searchTarget === 'date') {
        if (!matchesDate) return false;
      } else {
        // 'all' target
        if (!(matchesRecipient || matchesAmount || matchesDate || matchesRef || matchesAccount)) {
          return false;
        }
      }
    }

    // Type filter
    if (filterType !== 'All Types') {
      if (filterType === 'Deposits Only' && t.type !== 'Deposit' && t.type !== 'Wire Deposit') return false;
      if (filterType === 'Transfers Only' && t.type !== 'Transfer') return false;
      if (filterType === 'Withdrawals Only' && t.type !== 'Withdrawal') return false;
    }

    // Account filter
    if (filterAccount !== 'All Accounts') {
      if (filterAccount === 'Premier Checking' && !t.accountSource.toLowerCase().includes('checking')) return false;
      if (filterAccount === 'Vault Escrow' && !t.accountSource.toLowerCase().includes('vault')) return false;
      if (filterAccount === 'Savings' && !t.accountSource.toLowerCase().includes('savings')) return false;
    }

    // Status filter
    if (filterStatus !== 'All Statuses') {
      if (t.status !== filterStatus) return false;
    }

    return true;
  });

  // Export to CSV Function
  const handleExportCSV = (records = filtered, filename = `fincore_ledger_${new Date().toISOString().slice(0, 10)}.csv`) => {
    const headers = [
      'Reference ID',
      'Settlement Date',
      'Execution Time',
      'Transaction Type',
      'Recipient / Merchant',
      'Description / Memo',
      'Origin Account',
      'Amount (USD)',
      'Status',
      'Risk Score',
      'Settlement Rail',
      'Nonce Hash',
    ];

    const rows = records.map((t) => [
      `"${t.ref}"`,
      `"${t.date}"`,
      `"${t.timestamp}"`,
      `"${t.type}"`,
      `"${(t.customerName || t.title).replace(/"/g, '""')}"`,
      `"${(t.subtitle || '').replace(/"/g, '""')}"`,
      `"${t.accountSource}"`,
      `"${t.amount.toFixed(2)}"`,
      `"${t.status}"`,
      `"${t.riskIndicator || 'LOW RISK'}"`,
      `"${t.speed || 'FedNow Real-time'}"`,
      `"${t.nonce || '0x81FA...4A91'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${records.length} transactions to ${filename}`, 'success');
  };

  // Open PDF / Printable Statement
  const handleOpenPDFStatement = () => {
    setIsPdfModalOpen(true);
    setIsExportMenuOpen(false);
  };

  // Print Statement to PDF
  const handlePrintPDF = () => {
    window.print();
    showToast('Sent certified statement to printer / PDF export dialog', 'info');
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full select-none">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dbe1ff] dark:bg-blue-950 text-[#003ea8] dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider">
              Ledger &amp; Audit
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 font-semibold">Live Sync Enabled</span>
          </div>
          <h1 className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight">
            Transactions &amp; Settlement History
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Search, filter, audit, and export all inbound and outbound transactions across all linked FinCore accounts by recipient, date, or amount.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => showToast('Opening Recurring Rule Automation builder...', 'info')}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] text-blue-600">update</span>
            <span>Create Recurring Rule</span>
          </button>

          {/* Primary 'Export to CSV/PDF' Menu Button */}
          <div className="relative" ref={exportDropdownRef}>
            <button
              type="button"
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-[#00236f] dark:bg-blue-600 hover:bg-[#00174b] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Download ledger data as CSV spreadsheet or certified PDF statement"
            >
              <span className="material-symbols-outlined text-[18px] text-amber-300">download</span>
              <span>Export to CSV/PDF</span>
              <span className="material-symbols-outlined text-[16px] text-white/80">
                {isExportMenuOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
            </button>

            {/* Export Dropdown Menu */}
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Institutional Export
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                    {filtered.length} records ready
                  </span>
                </div>

                <div className="p-1 space-y-1">
                  {/* CSV Export Option */}
                  <button
                    type="button"
                    onClick={() => {
                      handleExportCSV(filtered);
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[18px]">table_view</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Export to CSV (.csv)</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200">
                          Direct
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Raw ledger spreadsheet for Excel, Quickbooks, ERP
                      </div>
                    </div>
                  </button>

                  {/* PDF Export Option */}
                  <button
                    type="button"
                    onClick={handleOpenPDFStatement}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Export to PDF (.pdf)</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200">
                          Certified
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Official monthly account audit statement &amp; print
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 px-3 pb-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Total dataset:</span>
                  <button
                    type="button"
                    onClick={() => {
                      handleExportCSV(transactions, `fincore_all_ledger_history_${new Date().toISOString().slice(0, 10)}.csv`);
                      setIsExportMenuOpen(false);
                    }}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Export All ({transactions.length} items)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TOP PRIMARY SEARCH INPUT BAR (Filter by Date, Amount, or Recipient) */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Main Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchTarget === 'recipient'
                  ? 'Filter by recipient or counterparty (e.g. Stripe, Marcus Vance, Apex Logistics)...'
                  : searchTarget === 'amount'
                  ? 'Filter by amount (e.g. $500, 250, >100, <1000)...'
                  : searchTarget === 'date'
                  ? 'Filter by date (e.g. Oct 24, Oct 23, 2024)...'
                  : 'Search transactions by date, amount, recipient, or reference ID...'
              }
              className="w-full h-12 pl-11 pr-24 rounded-xl bg-[#f2f3ff] dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200/70 dark:border-slate-700/80 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-10 flex items-center pr-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/70 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded">
                ⌘F
              </kbd>
            </div>
          </div>

          {/* Search Category Filter Selector Tabs */}
          <div className="flex items-center bg-[#f2f3ff] dark:bg-slate-800 p-1 rounded-xl border border-slate-200/70 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSearchTarget('all');
                showToast('Searching across all fields (Date, Amount, Recipient)', 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                searchTarget === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Criteria
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTarget('recipient');
                showToast('Filter mode: Recipient & Merchant', 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                searchTarget === 'recipient'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">person</span>
              <span>Recipient</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTarget('amount');
                showToast('Filter mode: Amount ($ or comparison >/<)', 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                searchTarget === 'amount'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">attach_money</span>
              <span>Amount</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTarget('date');
                showToast('Filter mode: Settlement Date', 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                searchTarget === 'date'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">calendar_today</span>
              <span>Date</span>
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips and Match Feedback */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 dark:text-slate-500 font-medium text-[11px] uppercase tracking-wider">
              Quick Filters:
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchTarget('recipient');
                setSearchQuery('Marcus Vance');
              }}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">person</span>
              <span>Marcus Vance</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTarget('recipient');
                setSearchQuery('Stripe');
              }}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">domain</span>
              <span>Stripe</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTarget('recipient');
                setSearchQuery('Apex Logistics');
              }}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">local_shipping</span>
              <span>Apex Logistics</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTarget('amount');
                setSearchQuery('>100');
              }}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">payments</span>
              <span>Amount &gt; $100</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTarget('date');
                setSearchQuery('Oct 24');
              }}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">today</span>
              <span>Oct 24, 2024</span>
            </button>
          </div>

          {/* Real-time Match Count & Reset */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {filtered.length}
              </span>
              <span>of {transactions.length} transactions match</span>
            </div>

            {(searchQuery || searchTarget !== 'all' || filterType !== 'All Types' || filterAccount !== 'All Accounts') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchTarget('all');
                  setFilterType('All Types');
                  setFilterAccount('All Accounts');
                  setFilterStatus('All Statuses');
                  showToast('Filters cleared', 'info');
                }}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Reset All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Metrics Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Net Settled (30d)
            </span>
            <span className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              +$8,874.30
            </span>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-bold">
              <span className="material-symbols-outlined text-[15px]">trending_up</span>
              <span>+14.2% vs last cycle</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#eaedff] dark:bg-blue-950 text-[#00236f] dark:text-blue-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Gross Inflows
            </span>
            <span className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-emerald-600">
              +$13,449.00
            </span>
            <span className="text-xs text-slate-400 mt-1 block">42 cleared deposits</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">south_west</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Gross Outflows
            </span>
            <span className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              -$4,574.70
            </span>
            <span className="text-xs text-slate-400 mt-1 block">98 debits &amp; wires</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] dark:bg-slate-800 text-[#0051d5] dark:text-blue-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">north_east</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Compliance Health
            </span>
            <span className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              99.98%
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Zero flagged items</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#eaedff] dark:bg-blue-950 text-[#00236f] dark:text-blue-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">verified_user</span>
          </div>
        </div>
      </div>

      {/* Secondary Filter Row & Density Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Date Range Selector */}
          <div className="md:col-span-3">
            <button
              type="button"
              onClick={() => {
                setSearchTarget('date');
                setSearchQuery('Oct 24');
                showToast('Filtering for today: Oct 24, 2024', 'info');
              }}
              className="w-full h-10 px-3 rounded-xl bg-[#f2f3ff] dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[16px] text-blue-600">calendar_today</span>
                <span>Date: Oct 2024</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
            </button>
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <button
              type="button"
              onClick={() => {
                const options = ['All Types', 'Deposits Only', 'Transfers Only', 'Withdrawals Only'];
                const currentIndex = options.indexOf(filterType);
                const next = options[(currentIndex + 1) % options.length];
                setFilterType(next);
                showToast(`Filter: ${next}`, 'info');
              }}
              className="w-full h-10 px-3 rounded-xl bg-[#f2f3ff] dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[16px] text-blue-600">swap_horiz</span>
                <span className="truncate">{filterType}</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
            </button>
          </div>

          {/* Account Filter */}
          <div className="md:col-span-3">
            <button
              type="button"
              onClick={() => {
                const options = ['All Accounts', 'Premier Checking', 'Vault Escrow', 'Savings'];
                const currentIndex = options.indexOf(filterAccount);
                const next = options[(currentIndex + 1) % options.length];
                setFilterAccount(next);
                showToast(`Account filter: ${next}`, 'info');
              }}
              className="w-full h-10 px-3 rounded-xl bg-[#f2f3ff] dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[16px] text-blue-600">account_balance</span>
                <span className="truncate">{filterAccount}</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <button
              type="button"
              onClick={() => {
                const options = ['All Statuses', 'Completed', 'Pending'];
                const currentIndex = options.indexOf(filterStatus);
                const next = options[(currentIndex + 1) % options.length];
                setFilterStatus(next);
                showToast(`Status filter: ${next}`, 'info');
              }}
              className="w-full h-10 px-3 rounded-xl bg-[#f2f3ff] dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                <span className="truncate">{filterStatus}</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
            </button>
          </div>
        </div>

        {/* Active Filters Row */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-[#eaedff] dark:bg-blue-950 text-[#00236f] dark:text-blue-300 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              {searchQuery ? 'Active Search Query' : 'Ready'}
            </span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 font-medium">
                <span>{searchTarget.toUpperCase()}: &ldquo;{searchQuery}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-rose-500 ml-1"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}
            {filterType !== 'All Types' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                Type: {filterType}
              </span>
            )}
            {filterAccount !== 'All Accounts' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                Acct: {filterAccount}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500">
            <span>Sort by: </span>
            <strong className="text-slate-800 dark:text-slate-200">Most Recent (Date DESC)</strong>
          </div>
        </div>
      </div>

      {/* Main Split: Table (7 cols) + Slide-Over Audit Inspector (5 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Table Column */}
        <div className="xl:col-span-7 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="p-4 bg-[#f2f3ff] dark:bg-slate-800/80 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                Ledger Entries
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#dae2fd] dark:bg-blue-950 text-[#00236f] dark:text-blue-300 text-[10px] font-bold">
                {filtered.length} found
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick Export to CSV/PDF Button right in the table header */}
              <button
                type="button"
                onClick={() => handleExportCSV(filtered)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs border border-slate-200 dark:border-slate-600"
                title="Download current filtered transactions as CSV"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">download</span>
                <span>Export to CSV/PDF</span>
              </button>

              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                <button
                  type="button"
                  onClick={() => setDensity('compact')}
                  className={`p-1.5 rounded-lg ${density === 'compact' ? 'bg-white dark:bg-slate-700 text-blue-600' : 'text-slate-400'}`}
                  title="Compact view"
                >
                  <span className="material-symbols-outlined text-[18px]">density_small</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDensity('normal')}
                  className={`p-1.5 rounded-lg ${density === 'normal' ? 'bg-white dark:bg-slate-700 text-blue-600' : 'text-slate-400'}`}
                  title="Normal view"
                >
                  <span className="material-symbols-outlined text-[18px]">density_medium</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f2f3ff] dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-bold sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4">Date &amp; Ref</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Recipient / Description</th>
                  <th className="py-3 px-3">Account</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[26px]">search_off</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          No transactions found
                        </p>
                        <p className="text-xs text-slate-500 max-w-sm">
                          {searchQuery
                            ? `No records match "${searchQuery}" under ${searchTarget === 'all' ? 'any filter' : `${searchTarget} filter`}. Try searching by recipient name, date, or amount.`
                            : 'No records match the active account or type filters.'}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setSearchTarget('all');
                            setFilterType('All Types');
                            setFilterAccount('All Accounts');
                            setFilterStatus('All Statuses');
                          }}
                          className="mt-2 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                        >
                          Clear All Search &amp; Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => {
                    const isSelected = selectedTxn?.id === row.id;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedTxn(row)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#eaedff] dark:bg-blue-950/70 border-l-4 border-blue-600'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <td className={`${density === 'compact' ? 'py-2' : 'py-3.5'} px-4 whitespace-nowrap`}>
                          <div className={`font-bold ${isSelected ? 'text-[#0051d5] dark:text-blue-300' : 'text-slate-900 dark:text-white'}`}>
                            {row.date}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{row.ref}</div>
                        </td>
                        <td className={`${density === 'compact' ? 'py-2' : 'py-3.5'} px-3 whitespace-nowrap`}>
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                            {row.type}
                          </span>
                        </td>
                        <td className={`${density === 'compact' ? 'py-2' : 'py-3.5'} px-3`}>
                          <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[160px]">
                            {row.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                            {row.customerName || row.subtitle}
                          </div>
                        </td>
                        <td className={`${density === 'compact' ? 'py-2' : 'py-3.5'} px-3 whitespace-nowrap text-slate-600 dark:text-slate-400`}>
                          {row.accountSource}
                        </td>
                        <td
                          className={`${density === 'compact' ? 'py-2' : 'py-3.5'} px-3 text-right font-bold tabular-nums whitespace-nowrap ${
                            row.amount > 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {formatCurrency(row.amount)}
                        </td>
                        <td className={`${density === 'compact' ? 'py-2' : 'py-3.5'} px-3 text-center whitespace-nowrap`}>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {row.status}
                          </span>
                        </td>
                        <td className={`${density === 'compact' ? 'py-2' : 'py-3.5'} px-4 text-right whitespace-nowrap`}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTxn(row);
                              showToast(`Auditing transaction ${row.ref}`, 'info');
                            }}
                            className="p-1 rounded text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-800"
                            title="Inspect in Audit Panel"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-[#f2f3ff] dark:bg-slate-800/80 border-t border-slate-200/60 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>Showing {filtered.length} matching transactions</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 opacity-50 cursor-not-allowed"
              >
                Previous
              </button>
              <button type="button" className="w-7 h-7 rounded bg-[#00236f] dark:bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </button>
              <button
                type="button"
                onClick={() => showToast('Next page loaded', 'info')}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Slide-Over Audit Inspector Panel */}
        <div className="xl:col-span-5 bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-800 p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Audit Inspector
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  {selectedTxn.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                Transaction Details: {selectedTxn.ref}
              </h3>
            </div>
            <span className="material-symbols-outlined text-slate-400">policy</span>
          </div>

          {/* Key Amount Box */}
          <div className="bg-[#f2f3ff] dark:bg-slate-800/80 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Settlement Amount
              </span>
              <div className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                ${Math.abs(selectedTxn.amount).toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Principal: <strong>${Math.abs(selectedTxn.amount).toFixed(2)}</strong> • Rail: <strong>{selectedTxn.speed || 'FedNow'}</strong>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#dbe1ff] dark:bg-blue-950 text-[#003ea8] dark:text-blue-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
          </div>

          {/* Metadata List */}
          <div className="space-y-2 text-xs border-y border-slate-100 dark:border-slate-800 py-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Transaction Nonce Hash</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                {selectedTxn.nonce || '0x9f82...c41e'}
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Reference Number</span>
              <span className="font-bold text-slate-900 dark:text-white">{selectedTxn.ref}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Recipient / Merchant</span>
              <span className="font-bold text-slate-900 dark:text-white">{selectedTxn.customerName || selectedTxn.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Date &amp; Time</span>
              <span className="text-slate-800 dark:text-slate-200">{selectedTxn.date} • {selectedTxn.timestamp}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Account Origin</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTxn.accountSource}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Compliance Risk Score</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                {selectedTxn.riskIndicator || 'LOW RISK (Score: 0.02)'}
              </span>
            </div>
          </div>

          {/* ISO 20022 Raw Message Inspector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-blue-600">code</span>
                <span>ISO 20022 Raw Payload (pacs.008)</span>
              </div>
              <button
                type="button"
                onClick={() => showToast('Copied ISO 20022 JSON payload to clipboard', 'success')}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">content_copy</span>
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`{
  "MsgId": "${selectedTxn.ref}",
  "CreDtTm": "2024-10-24T14:15:00Z",
  "NbOfTxs": "1",
  "GrpHdr": {
    "InstgAgt": { "FinInstnId": { "BICFI": "FINCUS33" } },
    "InstdAgt": { "FinInstnId": { "BICFI": "CHASUS33" } }
  },
  "CdtTrfTxInf": {
    "PmtId": { "EndToEndId": "${selectedTxn.ref}" },
    "IntrBkSttlmAmt": { "Ccy": "USD", "Value": "${Math.abs(selectedTxn.amount).toFixed(2)}" },
    "Cdtr": { "Nm": "${selectedTxn.customerName || selectedTxn.title}" },
    "Dbtr": { "Nm": "Elena Vance" }
  }
}`}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExportCSV([selectedTxn], `fincore_single_audit_${selectedTxn.ref}.csv`)}
              className="flex-1 h-10 rounded-xl bg-[#00236f] dark:bg-blue-600 hover:bg-[#00174b] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span>Export Audit Record (CSV)</span>
            </button>
            <button
              type="button"
              onClick={() => showToast(`Transaction ${selectedTxn.ref} flagged for secondary review`, 'warn')}
              className="px-3 h-10 rounded-xl bg-[#eaedff] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-500">flag</span>
              <span>Flag</span>
            </button>
          </div>
        </div>
      </div>

      {/* INSTITUTIONAL PDF CERTIFIED STATEMENT MODAL */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 select-text">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Top Action Toolbar (Hidden during print) */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-rose-600">picture_as_pdf</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Institutional Account Statement (PDF Certified View)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  FDIC Verified
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintPDF}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  title="Print or Save as PDF"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExportCSV(filtered)}
                  className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Download CSV"
                >
                  <span className="material-symbols-outlined text-[16px]">table_view</span>
                  <span>Download CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                  title="Close modal"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Printable Statement Document Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-slate-800 dark:text-slate-200 font-sans print:p-0">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <FinCoreLogo size="lg" />
                  <p className="text-xs text-slate-500 font-medium pt-1">
                    Institutional Treasury Services • FedLine Direct Member #021000998
                  </p>
                  <p className="text-[11px] text-slate-400">
                    28 Liberty Street, Financial District, New York, NY 10005
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <div className="text-lg font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight uppercase">
                    Official Settlement Statement
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    DOC REF: FIN-STMT-{new Date().getFullYear()}-00918
                  </div>
                  <div className="text-xs text-slate-500">
                    Period: <strong>Oct 01, 2024 – Oct 24, 2024</strong>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Tier 3 Verified • FDIC Insured to $2,500,000.00
                  </div>
                </div>
              </div>

              {/* Account Holder & Bank Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Account Beneficiary
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Elena Vance</p>
                  <p className="text-slate-600 dark:text-slate-400">Commercial Checking Account •••• 7319</p>
                  <p className="text-slate-500">Apex Global Treasury Operations LLC</p>
                </div>

                <div className="space-y-1 md:text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Financial Summary (USD)
                  </span>
                  <div className="flex justify-between md:justify-end gap-6 text-xs">
                    <span className="text-slate-500">Opening Balance:</span>
                    <span className="font-mono font-bold">$48,155.70</span>
                  </div>
                  <div className="flex justify-between md:justify-end gap-6 text-xs">
                    <span className="text-slate-500">Total Credits (+):</span>
                    <span className="font-mono font-bold text-emerald-600">+$13,449.00</span>
                  </div>
                  <div className="flex justify-between md:justify-end gap-6 text-xs">
                    <span className="text-slate-500">Total Debits (-):</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">-$4,574.70</span>
                  </div>
                  <div className="flex justify-between md:justify-end gap-6 text-xs border-t border-slate-200 dark:border-slate-700 pt-1">
                    <span className="font-bold text-slate-900 dark:text-white">Ending Available Balance:</span>
                    <span className="font-mono font-extrabold text-[#00236f] dark:text-blue-300 text-sm">
                      $57,030.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans',sans-serif]">
                    Itemized Settlement Records ({filtered.length} entries)
                  </h4>
                  <span className="text-slate-500 font-mono text-[11px]">ISO 20022 Schema Standard</span>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Reference</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Counterparty / Description</th>
                        <th className="py-2.5 px-3">Account</th>
                        <th className="py-2.5 px-3 text-right">Amount (USD)</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                      {filtered.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 whitespace-nowrap">{tx.date}</td>
                          <td className="py-2 px-3 font-mono text-[10px] text-slate-500">{tx.ref}</td>
                          <td className="py-2 px-3">{tx.type}</td>
                          <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white max-w-[160px] truncate">
                            {tx.customerName || tx.title}
                          </td>
                          <td className="py-2 px-3 text-slate-500">{tx.accountSource}</td>
                          <td className={`py-2 px-3 text-right font-mono font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                            {formatCurrency(tx.amount)}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cryptographic Seal & Certification Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#eaedff] dark:bg-blue-950 flex items-center justify-center text-[#00236f] dark:text-blue-300 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Cryptographically Certified &amp; Tamper Evident
                    </p>
                    <p className="font-mono text-[10px] text-slate-400">
                      SHA256: 4a9f82c41eb93a81fa0021c38e917d23f
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-700 dark:text-slate-300">FinCore National Bank, N.A.</p>
                  <p className="text-slate-400">Authorized Treasury Officer Signature on File</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
