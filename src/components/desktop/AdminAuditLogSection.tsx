import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';

export type AdminActionCategory = 'all' | 'approval' | 'limit' | 'security' | 'card' | 'compliance';

export interface AdminAuditRecord {
  id: string;
  timestamp: string;
  relativeTime: string;
  actor: string;
  actorRole: string;
  actionCategory: 'approval' | 'limit' | 'security' | 'card' | 'compliance';
  categoryLabel: string;
  targetEntity: string;
  summary: string;
  details: string;
  beforeState: string;
  afterState: string;
  ipAddress: string;
  location: string;
  status: 'Completed & Sealed' | 'Pending Dual-Auth' | 'Flagged';
  signatureHash: string;
  authorizationType: 'Biometric Dual-Auth' | 'Automated Compliance Engine' | 'Hardware Security Module (HSM)' | 'Supervisor Manual Override';
}

export const INITIAL_ADMIN_AUDIT_LOGS: AdminAuditRecord[] = [
  {
    id: 'AUD-90248-AP',
    timestamp: 'Oct 24, 2024 • 14:18:22 UTC',
    relativeTime: '23 mins ago',
    actor: 'Elena Vance',
    actorRole: 'Tier-4 Sovereign Admin (#FC-ADM-0941)',
    actionCategory: 'approval',
    categoryLabel: 'Account Approval',
    targetEntity: 'Commercial Checking •••• 7319',
    summary: 'Approved Tier-3 Enterprise Settlement Vault for Apex Global Holdings',
    details: 'Completed enhanced institutional due diligence and verified FDIC $2.5M multi-entity insurance certificate under FinCEN Rule 31-CFR.',
    beforeState: 'Status: Restricted Underwriting (Deposit-Only)',
    afterState: 'Status: Fully Cleared Tier-3 Operational Vault ($2.5M FDIC)',
    ipAddress: '198.51.100.44',
    location: 'New York Financial District (FedLine Node 04)',
    status: 'Completed & Sealed',
    signatureHash: '0x9a82f41e00c318ab91',
    authorizationType: 'Biometric Dual-Auth',
  },
  {
    id: 'AUD-90245-LC',
    timestamp: 'Oct 24, 2024 • 11:45:00 UTC',
    relativeTime: '3 hours ago',
    actor: 'Elena Vance',
    actorRole: 'Tier-4 Sovereign Admin (#FC-ADM-0941)',
    actionCategory: 'limit',
    categoryLabel: 'Limit Change',
    targetEntity: 'Premier Checking •••• 7319',
    summary: 'Increased Outbound FedNow & Fedwire Daily Liquidity Limit',
    details: 'Elevated daily payment velocity limit to accommodate scheduled commercial real estate escrow settlements.',
    beforeState: 'Daily Limit: $50,000.00 / day',
    afterState: 'Daily Limit: $250,000.00 / day',
    ipAddress: '198.51.100.44',
    location: 'New York Financial District (FedLine Node 04)',
    status: 'Completed & Sealed',
    signatureHash: '0x4f12e88b99c7104a32',
    authorizationType: 'Biometric Dual-Auth',
  },
  {
    id: 'AUD-90241-LC',
    timestamp: 'Oct 23, 2024 • 16:30:15 UTC',
    relativeTime: 'Yesterday',
    actor: 'Marcus Vance',
    actorRole: 'Treasury Risk Officer (#FC-RSK-1082)',
    actionCategory: 'limit',
    categoryLabel: 'Limit Change',
    targetEntity: 'Sovereign Metal Card •••• 4092',
    summary: 'Adjusted Monthly Commercial Card Spending Threshold',
    details: 'Increased corporate card spending cap and enabled international FX transactions for executive flight logistics.',
    beforeState: 'Monthly Cap: $5,000.00 • FX: Blocked',
    afterState: 'Monthly Cap: $10,000.00 • FX: Enabled',
    ipAddress: '198.51.100.12',
    location: 'Jersey City Treasury Center',
    status: 'Completed & Sealed',
    signatureHash: '0x3d91a11ff8721b00e5',
    authorizationType: 'Hardware Security Module (HSM)',
  },
  {
    id: 'AUD-90238-SP',
    timestamp: 'Oct 23, 2024 • 09:12:40 UTC',
    relativeTime: 'Yesterday',
    actor: 'Automated AML Sentinel v4.2',
    actorRole: 'Algorithmic Guardian (Autonomous)',
    actionCategory: 'security',
    categoryLabel: 'Security Policy',
    targetEntity: 'Global Rails Node #89194',
    summary: 'Activated Velocity Killswitch and Mandatory Dual-Auth Mandate',
    details: 'Enforced secondary biometric authorization for all external wire transfers exceeding $20,000.00 following abnormal network liquidity pulses.',
    beforeState: 'Single Signer Threshold: < $50,000.00',
    afterState: 'Mandatory Dual-Signer Threshold: > $20,000.00',
    ipAddress: '10.240.0.12',
    location: 'Internal Secure VPC Cloud',
    status: 'Completed & Sealed',
    signatureHash: '0x7e22bf50aa0198c233',
    authorizationType: 'Automated Compliance Engine',
  },
  {
    id: 'AUD-90232-AP',
    timestamp: 'Oct 22, 2024 • 13:05:10 UTC',
    relativeTime: '2 days ago',
    actor: 'Elena Vance',
    actorRole: 'Tier-4 Sovereign Admin (#FC-ADM-0941)',
    actionCategory: 'approval',
    categoryLabel: 'Account Approval',
    targetEntity: 'Beneficiary: Apex Logistics LLC',
    summary: 'Approved FedLine Direct Clearing Route & Verified Counterparty',
    details: 'Counterparty entity verified via ISO 20022 pacs.008 schema validation. Approved US Treasury Routing #121000358 for real-time gross settlement.',
    beforeState: 'Status: Pending Routing Verification',
    afterState: 'Status: FedLine Direct Approved (US TR #121000358)',
    ipAddress: '198.51.100.44',
    location: 'New York Financial District',
    status: 'Completed & Sealed',
    signatureHash: '0x1c8866aa9021e5f884',
    authorizationType: 'Biometric Dual-Auth',
  },
  {
    id: 'AUD-90226-CA',
    timestamp: 'Oct 21, 2024 • 17:50:33 UTC',
    relativeTime: '3 days ago',
    actor: 'Marcus Vance',
    actorRole: 'Treasury Risk Officer (#FC-RSK-1082)',
    actionCategory: 'card',
    categoryLabel: 'Card Action',
    targetEntity: 'Sovereign Metal Card #001',
    summary: 'Issued Sovereign Metal Titanium Physical Card with NFC Waves',
    details: 'Provisioned titanium metal card with dedicated EMV cryptographic key pairing and auto-freeze velocity triggers.',
    beforeState: 'Card Form: Virtual Only',
    afterState: 'Card Form: Sovereign Metal Physical Active',
    ipAddress: '198.51.100.12',
    location: 'Jersey City Treasury Center',
    status: 'Completed & Sealed',
    signatureHash: '0x5b3377dd8812c00a91',
    authorizationType: 'Hardware Security Module (HSM)',
  },
  {
    id: 'AUD-90219-LC',
    timestamp: 'Oct 20, 2024 • 10:20:00 UTC',
    relativeTime: '4 days ago',
    actor: 'Elena Vance',
    actorRole: 'Tier-4 Sovereign Admin (#FC-ADM-0941)',
    actionCategory: 'limit',
    categoryLabel: 'Limit Change',
    targetEntity: 'High-Yield Savings •••• 4821',
    summary: 'Modified Automated Treasury Sweep & Liquidity Minimum',
    details: 'Adjusted target threshold balance for overnight sweep between checking and high-yield reserve accounts (APY 4.65%).',
    beforeState: 'Auto-Sweep Threshold: $10,000.00',
    afterState: 'Auto-Sweep Threshold: $25,000.00',
    ipAddress: '198.51.100.44',
    location: 'New York Financial District',
    status: 'Completed & Sealed',
    signatureHash: '0x88f199bc11e204a773',
    authorizationType: 'Supervisor Manual Override',
  },
  {
    id: 'AUD-90212-CP',
    timestamp: 'Oct 19, 2024 • 15:10:44 UTC',
    relativeTime: '5 days ago',
    actor: 'Sarah Jenkins',
    actorRole: 'Senior AML & BSA Compliance Auditor',
    actionCategory: 'compliance',
    categoryLabel: 'Compliance & KYC',
    targetEntity: 'SAR Report #FIN-2024-8812',
    summary: 'Completed Automated CTR Audit & Cleared Source of Funds Flag',
    details: 'Audited $150,000 inbound ACH deposit from TechCorp International. Verified corporate tax filings and released compliance hold.',
    beforeState: 'Flag: Under Compliance Hold (Score: 0.78)',
    afterState: 'Flag: Cleared & Finalized (Score: 0.01)',
    ipAddress: '198.51.100.89',
    location: 'Boston Regulatory Affairs Office',
    status: 'Completed & Sealed',
    signatureHash: '0x22eedd3188bb4400a2',
    authorizationType: 'Automated Compliance Engine',
  },
];

export const AdminAuditLogSection: React.FC = () => {
  const { showToast } = useBank();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AdminActionCategory>('all');
  const [displayMode, setDisplayMode] = useState<'timeline' | 'table'>('timeline');
  const [selectedRecord, setSelectedRecord] = useState<AdminAuditRecord | null>(null);

  // Filter records
  const filteredRecords = INITIAL_ADMIN_AUDIT_LOGS.filter((record) => {
    if (selectedCategory !== 'all' && record.actionCategory !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        record.id.toLowerCase().includes(q) ||
        record.actor.toLowerCase().includes(q) ||
        record.targetEntity.toLowerCase().includes(q) ||
        record.summary.toLowerCase().includes(q) ||
        record.details.toLowerCase().includes(q) ||
        record.categoryLabel.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Export to CSV
  const handleExportAuditCSV = () => {
    const headers = [
      'Audit ID',
      'Timestamp',
      'Administrator',
      'Role',
      'Action Category',
      'Target Entity',
      'Summary',
      'Before State',
      'After State',
      'IP Address',
      'Location',
      'Authorization Type',
      'Cryptographic Signature',
      'Status',
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.id}"`,
      `"${r.timestamp}"`,
      `"${r.actor}"`,
      `"${r.actorRole}"`,
      `"${r.categoryLabel}"`,
      `"${r.targetEntity}"`,
      `"${r.summary.replace(/"/g, '""')}"`,
      `"${r.beforeState.replace(/"/g, '""')}"`,
      `"${r.afterState.replace(/"/g, '""')}"`,
      `"${r.ipAddress}"`,
      `"${r.location}"`,
      `"${r.authorizationType}"`,
      `"${r.signatureHash}"`,
      `"${r.status}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fincore_admin_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${filteredRecords.length} administrative audit records`, 'success');
  };

  const getCategoryStyles = (category: AdminActionCategory) => {
    switch (category) {
      case 'approval':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/70',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          icon: 'check_circle',
        };
      case 'limit':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/70',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-200 dark:border-blue-800',
          dot: 'bg-blue-600',
          icon: 'tune',
        };
      case 'security':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/70',
          text: 'text-amber-800 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800',
          dot: 'bg-amber-500',
          icon: 'shield',
        };
      case 'card':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/70',
          text: 'text-purple-700 dark:text-purple-300',
          border: 'border-purple-200 dark:border-purple-800',
          dot: 'bg-purple-600',
          icon: 'credit_card',
        };
      case 'compliance':
        return {
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-800 dark:text-slate-200',
          border: 'border-slate-300 dark:border-slate-700',
          dot: 'bg-slate-600',
          icon: 'verified_user',
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-200 dark:border-slate-700',
          dot: 'bg-slate-400',
          icon: 'history_edu',
        };
    }
  };

  return (
    <div id="admin-audit-log-section" className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 lg:p-8 space-y-6">
      {/* Header & Verification Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] dark:bg-blue-950 text-[#00236f] dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Supervisory Compliance
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              WORM Immutable Storage (SEC Rule 17a-4)
            </span>
          </div>
          <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight">
            Administrative Audit Log
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Chronological audit trail of all supervisor actions: account approvals, daily transfer limit modifications, policy revisions, and dual-auth overrides.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Display Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setDisplayMode('timeline')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                displayMode === 'timeline'
                  ? 'bg-white dark:bg-slate-700 text-[#00236f] dark:text-blue-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">timeline</span>
              <span>Timeline</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('table')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                displayMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-[#00236f] dark:text-blue-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">table_rows</span>
              <span>Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportAuditCSV}
            className="h-9 px-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">download</span>
            <span>Export Log (CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Cryptographic Merkle Root #89194 validated with 100% integrity', 'success')}
            className="h-9 px-3.5 rounded-xl bg-[#00236f] dark:bg-blue-600 hover:bg-[#00174b] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-amber-300">verified</span>
            <span>Verify Ledger Root</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All Actions' },
            { id: 'approval', label: 'Account Approvals' },
            { id: 'limit', label: 'Limit Changes' },
            { id: 'security', label: 'Security Policies' },
            { id: 'card', label: 'Card Actions' },
            { id: 'compliance', label: 'Compliance / KYC' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as AdminActionCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#00236f] dark:bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by admin, account, or action..."
            className="w-full h-10 pl-9 pr-8 text-xs bg-[#f2f3ff] dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Content Display */}
      {displayMode === 'timeline' ? (
        /* Timeline View */
        <div className="relative space-y-6 pt-2">
          {/* Continuous vertical timeline connector line */}
          <div className="absolute left-6 sm:left-8 top-3 bottom-3 w-0.5 bg-slate-200 dark:bg-slate-800 pointer-events-none"></div>

          {filteredRecords.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <span className="material-symbols-outlined text-[32px] text-slate-400">search_off</span>
              <p className="font-bold text-slate-700 dark:text-slate-300 mt-2">No audit records found</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or clearing your search query.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredRecords.map((item) => {
              const styles = getCategoryStyles(item.actionCategory);

              return (
                <div key={item.id} className="relative flex items-start gap-4 sm:gap-6 group">
                  {/* Timeline Node Badge Icon */}
                  <div className={`relative z-10 w-12 sm:w-16 h-12 sm:h-16 rounded-2xl ${styles.bg} ${styles.border} border-2 flex flex-col items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                    <span className={`material-symbols-outlined text-[20px] ${styles.text}`}>
                      {styles.icon}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 font-mono mt-0.5">
                      {item.relativeTime}
                    </span>
                  </div>

                  {/* Audit Card Details */}
                  <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 hover:border-blue-400 dark:hover:border-blue-700 transition-colors">
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full ${styles.bg} ${styles.text} text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1.5`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
                          {item.categoryLabel}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-400">{item.id}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs text-slate-500 font-medium">{item.timestamp}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          <span className="material-symbols-outlined text-[12px]">lock</span>
                          {item.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(item)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </button>
                      </div>
                    </div>

                    {/* Summary & Narrative */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {item.summary}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.details}
                      </p>
                    </div>

                    {/* Target & Value Delta Box (Before vs After) */}
                    <div className="bg-[#f2f3ff] dark:bg-slate-800/60 p-3 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs border border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Target Entity:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 px-2 py-0.5 rounded">
                          {item.targetEntity}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-[11px]">
                        <span className="line-through text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded">
                          {item.beforeState}
                        </span>
                        <span className="material-symbols-outlined text-[14px] text-blue-600">arrow_forward</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                          {item.afterState}
                        </span>
                      </div>
                    </div>

                    {/* Actor & Security Signature Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                          {item.actor.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.actor}
                        </span>
                        <span className="text-slate-400">({item.actorRole})</span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-[10px]">
                        <span>IP: {item.ipAddress}</span>
                        <span>•</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">fingerprint</span>
                          SHA256: {item.signatureHash}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Tabular View */
        <div className="overflow-x-auto w-full rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f2f3ff] dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Audit ID &amp; Time</th>
                <th className="py-3 px-3">Action Type</th>
                <th className="py-3 px-3">Administrator</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">State Transition (Delta)</th>
                <th className="py-3 px-3 text-center">Auth Method</th>
                <th className="py-3 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.map((item) => {
                const styles = getCategoryStyles(item.actionCategory);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{item.id}</div>
                      <div className="text-[10px] text-slate-400">{item.timestamp}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full ${styles.bg} ${styles.text} text-[10px] font-bold`}>
                        {item.categoryLabel}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{item.actor}</div>
                      <div className="text-[10px] text-slate-400">{item.actorRole}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {item.targetEntity}
                    </td>
                    <td className="py-3 px-4 text-[11px]">
                      <div className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{item.summary}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">{item.afterState}</div>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                        {item.authorizationType.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(item)}
                        className="px-2.5 py-1 rounded bg-[#00236f] dark:bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-800"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 select-text">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-blue-600">{selectedRecord.id}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 text-[10px] font-bold">
                    {selectedRecord.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Cryptographic Audit Certificate
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Executive Summary</span>
                <p className="font-bold text-slate-900 dark:text-white">{selectedRecord.summary}</p>
                <p className="text-slate-500">{selectedRecord.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#f2f3ff] dark:bg-slate-800/40 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pre-Action State</span>
                  <p className="font-mono font-medium text-slate-700 dark:text-slate-300 mt-0.5">{selectedRecord.beforeState}</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Post-Action State</span>
                  <p className="font-mono font-bold text-emerald-800 dark:text-emerald-200 mt-0.5">{selectedRecord.afterState}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Authorized Administrator</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedRecord.actor} ({selectedRecord.actorRole})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedRecord.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Physical Origin &amp; Node</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedRecord.location} ({selectedRecord.ipAddress})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Authorization Mechanism</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedRecord.authorizationType}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">SHA-256 Signature Hash</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{selectedRecord.signatureHash}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  showToast(`Verification report downloaded for ${selectedRecord.id}`, 'success');
                  setSelectedRecord(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#00236f] dark:bg-blue-600 text-white font-bold text-xs"
              >
                Download Verification JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
