import React, { useState, useEffect, useMemo } from 'react';
import { useBank } from '../../context/BankContext';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Sliders,
  Play,
  Pause,
  RefreshCw,
  Search,
  ExternalLink,
  Flame,
  Globe,
  FileText,
  UserCheck,
  Eye,
  XCircle,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  Cpu,
  Fingerprint
} from 'lucide-react';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ComplianceRule {
  id: string;
  code: string;
  name: string;
  category: 'AML' | 'Velocity' | 'Sanctions' | 'Fraud' | 'Structuring';
  severity: SeverityLevel;
  threshold: string;
  description: string;
  enabled: boolean;
  triggersToday: number;
}

export interface SuspiciousActivityEvent {
  id: string;
  timestamp: string;
  timeAgo: string;
  ruleCode: string;
  ruleName: string;
  severity: SeverityLevel;
  entityName: string;
  accountMask: string;
  amount: number;
  currency: string;
  ipOrigin: string;
  country: string;
  riskScore: number; // 0-100
  details: string;
  status: 'PENDING_REVIEW' | 'FROZEN' | 'SAR_FILED' | 'CLEARED';
  txRef: string;
  clearingRail: string;
}

const INITIAL_RULES: ComplianceRule[] = [
  {
    id: 'rule-1',
    code: 'AML-CTR-10K',
    name: 'Currency Transaction Report (CTR) Single Outflow',
    category: 'AML',
    severity: 'CRITICAL',
    threshold: '> $10,000.00 USD',
    description: 'Mandatory FinCEN automated reporting threshold for single or aggregated daily withdrawals/wires.',
    enabled: true,
    triggersToday: 14,
  },
  {
    id: 'rule-2',
    code: 'SANCT-OFAC-SDN',
    name: 'OFAC SDN & Specially Designated Nationals Screening',
    category: 'Sanctions',
    severity: 'CRITICAL',
    threshold: 'Fuzzy Match Score >= 85%',
    description: 'Real-time lexical and phonetic matching against US Treasury OFAC sanctions list.',
    enabled: true,
    triggersToday: 2,
  },
  {
    id: 'rule-3',
    code: 'STRUCT-SMURF-99',
    name: 'Structuring / Smurfing Pattern Detection',
    category: 'Structuring',
    severity: 'HIGH',
    threshold: '2+ tx between $9,000 - $9,999 in 24h',
    description: 'Intentional avoidance of $10k reporting thresholds across linked institutional accounts.',
    enabled: true,
    triggersToday: 5,
  },
  {
    id: 'rule-4',
    code: 'VEL-SPIKE-300',
    name: 'Abnormal Velocity Surge (Anomaly Detection)',
    category: 'Velocity',
    severity: 'HIGH',
    threshold: '> 300% of 90-day hourly average',
    description: 'Sudden high-frequency batch settlement departure from institutional corporate baseline.',
    enabled: true,
    triggersToday: 8,
  },
  {
    id: 'rule-5',
    code: 'GEO-FATF-RISK',
    name: 'High-Risk Geopolitical Jurisdiction Route',
    category: 'Fraud',
    severity: 'MEDIUM',
    threshold: 'FATF Blacklist / High-Risk Corridor',
    description: 'Cross-border wire routing through jurisdictions with deficiencies in AML/CFT controls.',
    enabled: true,
    triggersToday: 3,
  },
  {
    id: 'rule-6',
    code: 'DORM-ACT-25K',
    name: 'Dormant Repository Activation Spike',
    category: 'Fraud',
    severity: 'MEDIUM',
    threshold: '> $25,000 on account dormant > 120d',
    description: 'Substantial sudden outflow from an account with zero previous 120-day activity.',
    enabled: true,
    triggersToday: 1,
  },
];

const INITIAL_EVENTS: SuspiciousActivityEvent[] = [
  {
    id: 'evt-101',
    timestamp: '15:44:12 UTC',
    timeAgo: '18s ago',
    ruleCode: 'SANCT-OFAC-SDN',
    ruleName: 'OFAC SDN Match Screening Alert',
    severity: 'CRITICAL',
    entityName: 'Volkov Maritime Logistics Ltd',
    accountMask: '•••• 8912',
    amount: 145000.0,
    currency: 'USD',
    ipOrigin: '194.135.21.84 (Limassol, CY)',
    country: 'Cyprus',
    riskScore: 94,
    details: 'Phonetic match 88.4% against Specially Designated Nationals Annex 4B. Inbound cross-border wire stopped.',
    status: 'FROZEN',
    txRef: 'TXN-99481-CR',
    clearingRail: 'SWIFT MT103 Priority',
  },
  {
    id: 'evt-102',
    timestamp: '15:42:05 UTC',
    timeAgo: '2m ago',
    ruleCode: 'STRUCT-SMURF-99',
    ruleName: 'Structuring Smurfing Detection Pattern',
    severity: 'HIGH',
    entityName: 'Apex Capital Holdings LLC',
    accountMask: '•••• 7319',
    amount: 9850.0,
    currency: 'USD',
    ipOrigin: '104.28.192.12 (Jersey City, US)',
    country: 'United States',
    riskScore: 82,
    details: '3rd transfer within 4 hours priced just under $10,000 threshold ($9,850, $9,920, $9,750).',
    status: 'PENDING_REVIEW',
    txRef: 'TXN-99440-TR',
    clearingRail: 'FedNow Real-Time',
  },
  {
    id: 'evt-103',
    timestamp: '15:38:22 UTC',
    timeAgo: '6m ago',
    ruleCode: 'AML-CTR-10K',
    ruleName: 'Currency Transaction Report (CTR) Breach',
    severity: 'CRITICAL',
    entityName: 'Elena Vance Corporate Reserve',
    accountMask: '•••• 4821',
    amount: 68500.0,
    currency: 'USD',
    ipOrigin: '198.51.100.42 (New York, US)',
    country: 'United States',
    riskScore: 78,
    details: 'Outbound single-wire exceeds $10k statutory CTR reporting trigger. Automated Form 112 queued for FinCEN.',
    status: 'PENDING_REVIEW',
    txRef: 'TXN-99395-TR',
    clearingRail: 'Fedwire Direct RTGS',
  },
  {
    id: 'evt-104',
    timestamp: '15:29:40 UTC',
    timeAgo: '15m ago',
    ruleCode: 'VEL-SPIKE-300',
    ruleName: 'Velocity Spike Departure Baseline',
    severity: 'HIGH',
    entityName: 'Nexis Cloud Solutions B.V.',
    accountMask: '•••• 1094',
    amount: 42000.0,
    currency: 'USD',
    ipOrigin: '82.165.197.1 (Amsterdam, NL)',
    country: 'Netherlands',
    riskScore: 72,
    details: 'Hourly transaction throughput departed by 342% from 90-day institutional profile.',
    status: 'PENDING_REVIEW',
    txRef: 'TXN-99218-WD',
    clearingRail: 'SEPA Instant Credit',
  },
  {
    id: 'evt-105',
    timestamp: '15:15:18 UTC',
    timeAgo: '29m ago',
    ruleCode: 'GEO-FATF-RISK',
    ruleName: 'High-Risk Geopolitical Routing',
    severity: 'MEDIUM',
    entityName: 'Silk Route Global Transact',
    accountMask: '•••• 3391',
    amount: 18400.0,
    currency: 'USD',
    ipOrigin: '185.220.101.5 (Beirut, LB)',
    country: 'Lebanon',
    riskScore: 64,
    details: 'Counterparty intermediary routing corresponds to FATF grey-list compliance review perimeter.',
    status: 'SAR_FILED',
    txRef: 'TXN-98920-TR',
    clearingRail: 'ISO 20022 pacs.008',
  },
];

export const ComplianceMonitoringWidget: React.FC = () => {
  const { showToast } = useBank();

  // Widget States
  const [rules, setRules] = useState<ComplianceRule[]>(INITIAL_RULES);
  const [events, setEvents] = useState<SuspiciousActivityEvent[]>(INITIAL_EVENTS);
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(true);
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules' | 'analytics'>('alerts');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | SeverityLevel>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<SuspiciousActivityEvent | null>(null);
  const [isInvestigateModalOpen, setIsInvestigateModalOpen] = useState(false);

  // Auto-evaluation heartbeat simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLiveMonitoring) {
      interval = setInterval(() => {
        // Random micro-tick simulation or updates
        setEvents((prev) =>
          prev.map((e, idx) => {
            if (idx === 0) {
              return { ...e, timeAgo: `${parseInt(e.timeAgo) || 20}s ago` };
            }
            return e;
          })
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isLiveMonitoring]);

  // Toggle rule enforcement
  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          const nextState = !r.enabled;
          showToast(
            `${r.code} (${r.name}) is now ${nextState ? 'ENFORCING' : 'DISABLED'}`,
            nextState ? 'success' : 'warn'
          );
          return { ...r, enabled: nextState };
        }
        return r;
      })
    );
  };

  // Simulate new suspicious activity trigger
  const handleSimulateBreach = () => {
    const simulationPool: Omit<SuspiciousActivityEvent, 'id' | 'timestamp' | 'timeAgo'>[] = [
      {
        ruleCode: 'AML-CTR-10K',
        ruleName: 'Currency Transaction Report (CTR) Single Outflow',
        severity: 'CRITICAL',
        entityName: 'Meridian Global Assets Trust',
        accountMask: '•••• 9942',
        amount: 85000.0,
        currency: 'USD',
        ipOrigin: '193.106.31.29 (Geneva, CH)',
        country: 'Switzerland',
        riskScore: 91,
        details: 'Automated AML trigger: Single wire debited $85,000 to unverified foreign beneficiary.',
        status: 'FROZEN',
        txRef: `TXN-${Math.floor(10000 + Math.random() * 90000)}-CR`,
        clearingRail: 'Fedwire Direct RTGS',
      },
      {
        ruleCode: 'STRUCT-SMURF-99',
        ruleName: 'Structuring Smurfing Detection Pattern',
        severity: 'HIGH',
        entityName: 'Borealis Logistics & Freight',
        accountMask: '•••• 2109',
        amount: 9950.0,
        currency: 'USD',
        ipOrigin: '162.247.74.200 (Toronto, CA)',
        country: 'Canada',
        riskScore: 84,
        details: 'Structuring flag: Transferred $9,950 to avoid FinCEN CTR electronic filing threshold.',
        status: 'PENDING_REVIEW',
        txRef: `TXN-${Math.floor(10000 + Math.random() * 90000)}-TR`,
        clearingRail: 'FedNow Real-time',
      },
      {
        ruleCode: 'SANCT-OFAC-SDN',
        ruleName: 'OFAC SDN Match Screening Alert',
        severity: 'CRITICAL',
        entityName: 'Krasnov Trade & Shipping Ltd',
        accountMask: '•••• 6401',
        amount: 210000.0,
        currency: 'USD',
        ipOrigin: '185.190.140.1 (Dubai, AE)',
        country: 'UAE',
        riskScore: 96,
        details: 'High-confidence phonetic match with OFAC SDN list (Entity ID #OFAC-89021). Wire auto-held.',
        status: 'FROZEN',
        txRef: `TXN-${Math.floor(10000 + Math.random() * 90000)}-CR`,
        clearingRail: 'SWIFT MT103 Priority',
      },
    ];

    const pick = simulationPool[Math.floor(Math.random() * simulationPool.length)];
    const newEvent: SuspiciousActivityEvent = {
      ...pick,
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      timeAgo: 'Just now',
    };

    setEvents((prev) => [newEvent, ...prev]);
    showToast(
      `COMPLIANCE BREACH FLAGGED: [${pick.ruleCode}] ${pick.entityName} ($${pick.amount.toLocaleString()} USD)`,
      'error'
    );
  };

  // Action on an event
  const handleFreezeEntity = (evt: SuspiciousActivityEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === evt.id ? { ...e, status: 'FROZEN' } : e))
    );
    showToast(`IMMUTABLE HOLD APPLIED: Funds frozen for ${evt.entityName} (${evt.txRef})`, 'error');
  };

  const handleClearAlert = (evt: SuspiciousActivityEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === evt.id ? { ...e, status: 'CLEARED' } : e))
    );
    showToast(`False positive cleared for ${evt.entityName} by Compliance Officer`, 'success');
  };

  const handleFileSAR = (evt: SuspiciousActivityEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === evt.id ? { ...e, status: 'SAR_FILED' } : e))
    );
    showToast(`FinCEN Suspicious Activity Report (SAR) successfully filed for ${evt.txRef}`, 'info');
  };

  // Filtered Events List
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchSeverity = severityFilter === 'ALL' || evt.severity === severityFilter;
      const matchQuery =
        searchQuery === '' ||
        evt.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.ruleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.txRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.details.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSeverity && matchQuery;
    });
  }, [events, severityFilter, searchQuery]);

  // Statistics
  const pendingCriticalCount = events.filter((e) => e.severity === 'CRITICAL' && e.status !== 'CLEARED').length;
  const pendingHighCount = events.filter((e) => e.severity === 'HIGH' && e.status !== 'CLEARED').length;
  const totalBreachesToday = events.length + 29;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-200">
      {/* Widget Header & Real-time Telemetry Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-[#00174b] to-slate-950 text-white p-5 sm:p-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-lg bg-rose-500/20 text-rose-300">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Real-Time Surveillance &amp; AML Gateway
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Continuous Stream</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
              Institutional Compliance &amp; Risk Rule Engine
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated surveillance monitoring 6 institutional rules against OFAC, CTR threshold limits, and velocity anomalies.
            </p>
          </div>

          {/* Quick Actions & Live Stream Controls */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {/* Live Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsLiveMonitoring(!isLiveMonitoring);
                showToast(
                  isLiveMonitoring ? 'Real-time surveillance paused' : 'Real-time surveillance active',
                  'info'
                );
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                isLiveMonitoring
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              {isLiveMonitoring ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isLiveMonitoring ? 'Live Engine Active' : 'Engine Paused'}</span>
            </button>

            {/* Simulate Breach Trigger */}
            <button
              type="button"
              onClick={handleSimulateBreach}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Zap className="w-3.5 h-3.5 text-amber-200" />
              <span>Simulate Suspicious Activity</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Critical AML Holds</span>
            <div className="text-xl font-extrabold text-rose-400 mt-0.5 flex items-baseline gap-1.5">
              <span>{pendingCriticalCount} Active</span>
              <span className="text-[10px] text-rose-300 font-semibold">(Immediate Action)</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Threshold Breaches</span>
            <div className="text-xl font-extrabold text-amber-300 mt-0.5 flex items-baseline gap-1.5">
              <span>{pendingHighCount} Queued</span>
              <span className="text-[10px] text-slate-300 font-semibold">(Review Q)</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Rule Throughput</span>
            <div className="text-xl font-extrabold text-blue-300 mt-0.5 flex items-baseline gap-1.5">
              <span>1,840 tx/s</span>
              <span className="text-[10px] text-emerald-400 font-semibold">&lt; 4ms latency</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Enforced Rules</span>
            <div className="text-xl font-extrabold text-white mt-0.5 flex items-baseline gap-1.5">
              <span>{rules.filter((r) => r.enabled).length} of {rules.length} Rules</span>
              <span className="text-[10px] text-emerald-300 font-semibold">100% SLA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Mode Tabs */}
      <div className="px-6 pt-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-bold transition-all ${
              activeTab === 'alerts'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Active Breaches &amp; Suspicious Feeds</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              {events.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-bold transition-all ${
              activeTab === 'rules'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Pre-Defined Institutional Risk Rules</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {rules.length}
            </span>
          </button>
        </div>

        {/* Contextual search in alerts tab */}
        {activeTab === 'alerts' && (
          <div className="flex items-center gap-2 pb-2">
            {/* Severity Pill Filter */}
            <div className="flex items-center bg-[#f2f3ff] dark:bg-slate-800 p-1 rounded-xl text-xs">
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    severityFilter === sev
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {sev === 'ALL' ? 'All Alerts' : sev}
                </button>
              ))}
            </div>

            {/* Quick search */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alert by entity or ref..."
                className="w-full h-8 pl-8 pr-2.5 text-xs bg-[#f2f3ff] dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Tab Views */}
      <div className="p-6">
        {/* TAB 1: Suspicious Activity Alerts Stream */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Displaying <strong>{filteredEvents.length}</strong> flagged events in real time based on active institutional thresholds.
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Clock className="w-3 h-3 text-slate-400" />
                Latest event: {events[0]?.timeAgo || 'Just now'}
              </span>
            </div>

            {/* Flagged Events List */}
            <div className="space-y-3">
              {filteredEvents.map((evt) => {
                const isCritical = evt.severity === 'CRITICAL';
                const isHigh = evt.severity === 'HIGH';

                return (
                  <div
                    key={evt.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      evt.status === 'FROZEN'
                        ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900/70 shadow-xs'
                        : evt.status === 'SAR_FILED'
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60'
                        : isCritical
                        ? 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/60 shadow-2xs hover:shadow-md'
                        : isHigh
                        ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/50 shadow-2xs hover:shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left: Event Details */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide flex items-center gap-1 ${
                              isCritical
                                ? 'bg-rose-600 text-white'
                                : isHigh
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            <span>{evt.severity} BREACH</span>
                          </span>

                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                            {evt.ruleCode}
                          </span>

                          <span className="text-xs font-semibold text-slate-500">
                            {evt.ruleName}
                          </span>

                          <span className="text-[11px] text-slate-400 font-mono">
                            • {evt.timeAgo} ({evt.timestamp})
                          </span>
                        </div>

                        {/* Entity and Transaction Highlight */}
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            {evt.entityName}
                          </h4>
                          <div className="text-xs text-slate-500 font-mono">
                            Account: <strong className="text-slate-800 dark:text-slate-200">{evt.accountMask}</strong> • Ref:{' '}
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">{evt.txRef}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {evt.details}
                        </p>

                        {/* Metadata tags */}
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap pt-1 font-mono">
                          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                            <Globe className="w-3.5 h-3.5 text-blue-500" />
                            <span>{evt.ipOrigin}</span>
                          </span>
                          <span>•</span>
                          <span>Rail: <strong>{evt.clearingRail}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Fingerprint className="w-3.5 h-3.5 text-amber-500" />
                            <span>Risk Score: <strong className="text-rose-600 dark:text-rose-400">{evt.riskScore}/100</strong></span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Amount & Case Actions */}
                      <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                        <div className="text-left sm:text-right">
                          <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                            ${evt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {evt.currency}
                          </div>
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                              evt.status === 'FROZEN'
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-extrabold'
                                : evt.status === 'SAR_FILED'
                                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                                : evt.status === 'CLEARED'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            {evt.status === 'FROZEN' && 'IMMUTABLE HOLD APPLIED'}
                            {evt.status === 'SAR_FILED' && 'FINCEN SAR FILED'}
                            {evt.status === 'CLEARED' && 'INVESTIGATION CLEARED'}
                            {evt.status === 'PENDING_REVIEW' && 'ACTION REQUIRED'}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEvent(evt);
                              setIsInvestigateModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center gap-1 shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>Investigate</span>
                          </button>

                          {evt.status !== 'FROZEN' && (
                            <button
                              type="button"
                              onClick={() => handleFreezeEntity(evt)}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Freeze Account</span>
                            </button>
                          )}

                          {evt.status !== 'SAR_FILED' && (
                            <button
                              type="button"
                              onClick={() => handleFileSAR(evt)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>File SAR</span>
                            </button>
                          )}

                          {evt.status !== 'CLEARED' && (
                            <button
                              type="button"
                              onClick={() => handleClearAlert(evt)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all"
                              title="Clear false positive"
                            >
                              <span>Dismiss</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Pre-Defined Institutional Risk Rules */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <span>
                Active pre-defined rule definitions enforced on every transaction passing through the clearinghouse node.
              </span>
              <button
                type="button"
                onClick={() => showToast('Opening Institutional Risk Policy Rule Authoring Engine...', 'info')}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                + Define Custom Risk Rule
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rules.map((rule) => {
                const isCritical = rule.severity === 'CRITICAL';
                const isHigh = rule.severity === 'HIGH';

                return (
                  <div
                    key={rule.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      rule.enabled
                        ? 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-900">
                            {rule.code}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isCritical
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : isHigh
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {rule.severity}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-1">
                          {rule.name}
                        </h4>
                      </div>

                      {/* Enable/Disable Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleRule(rule.id)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          rule.enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        title={rule.enabled ? 'Rule active' : 'Rule disabled'}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            rule.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                      {rule.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Threshold Metric</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {rule.threshold}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Triggers Today</span>
                        <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                          {rule.triggersToday} breaches
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Case Investigation Modal */}
      {isInvestigateModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                    Compliance Case Dossier • {selectedEvent.txRef}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Evaluation Nonce: 0x89FC...410E • {selectedEvent.ruleCode}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInvestigateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Risk Assessment Score Card */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Aggregated Risk Score</span>
                <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
                  {selectedEvent.riskScore} / 100
                </span>
                <span className="text-[10px] text-rose-500 block font-semibold">High Threat Tier</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Transaction Volume</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                  ${selectedEvent.amount.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">{selectedEvent.clearingRail}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Geographical IP Origin</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
                  {selectedEvent.country}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono truncate">{selectedEvent.ipOrigin}</span>
              </div>
            </div>

            {/* Narrative Findings */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Automated Forensic Evidence &amp; Rule Findings
              </label>
              <div className="p-3.5 rounded-2xl bg-[#f2f3ff] dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                {selectedEvent.details}
              </div>
            </div>

            {/* SAR Narrative Auto-Generator preview */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
              <strong>FinCEN Form 111 / 112 Auto-Draft:</strong> The customer ({selectedEvent.entityName}) engaged in fund movement breaching statutory thresholds. Transaction placed on temporary compliance stay pursuant to Bank Secrecy Act (BSA) § 5318(g).
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsInvestigateModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                Close Dossier
              </button>
              <button
                type="button"
                onClick={() => {
                  handleClearAlert(selectedEvent);
                  setIsInvestigateModalOpen(false);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Approve &amp; Dismiss False Positive
              </button>
              <button
                type="button"
                onClick={() => {
                  handleFileSAR(selectedEvent);
                  setIsInvestigateModalOpen(false);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Submit Electronic SAR to FinCEN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
