import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  CurrencyCode,
  AccountItem,
  Beneficiary,
  TransactionItem,
  BankCard,
  SecurityRule,
  AlertItem,
  DeviceType,
  MobileTab,
  DesktopTab,
} from '../types/bank';

interface BankContextType {
  // Theme & Device
  isDark: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (val: boolean) => void;
  activeDevice: DeviceType;
  setActiveDevice: (device: DeviceType) => void;
  mobileScale: number;
  setMobileScale: (scale: number) => void;
  activeMobileTab: MobileTab;
  setActiveMobileTab: (tab: MobileTab) => void;
  activeDesktopTab: DesktopTab;
  setActiveDesktopTab: (tab: DesktopTab) => void;

  // Currency & Privacy
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatCurrency: (amount: number, overrideCurrency?: CurrencyCode) => string;
  isBalanceConcealed: boolean;
  toggleBalanceConceal: () => void;

  // Accounts
  accounts: AccountItem[];
  totalBalance: number;
  availableLiquidity: number;
  emergencyFreeze: boolean;
  toggleEmergencyFreeze: () => void;

  // Beneficiaries
  beneficiaries: Beneficiary[];
  selectedBeneficiary: Beneficiary | null;
  setSelectedBeneficiary: (b: Beneficiary | null) => void;

  // Transactions
  transactions: TransactionItem[];
  executeTransfer: (params: {
    fromAccountId: string;
    toAccountName: string;
    toAccountMask: string;
    amount: number;
    fee: number;
    memo: string;
    rail: string;
  }) => TransactionItem;

  // Cards
  cards: BankCard[];
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  isCardDetailsRevealed: boolean;
  toggleCardReveal: () => void;
  toggleCardFreeze: (cardId: string) => void;
  generateBurnerCard: () => void;
  securityRules: SecurityRule[];
  toggleSecurityRule: (key: string) => void;

  // Alerts & Biometrics
  alerts: AlertItem[];
  dismissAlert: (id: string) => void;
  markAllAlertsRead: () => void;
  isBiometricModalOpen: boolean;
  openBiometricModal: (pendingTx?: { beneficiary: string; amount: number; routing: string }) => void;
  closeBiometricModal: () => void;
  biometricSuccess: boolean;
  authorizeBiometricWire: () => void;
  resetBiometricSuccess: () => void;

  // Real-time Sync Engine
  isSyncing: boolean;
  syncIntervalSec: number;
  setSyncIntervalSec: (sec: number) => void;
  lastSynced: Date;
  latencyMs: number;
  currentBlock: number;
  nodeName: string;
  manualSync: () => void;
  simulateLiveEvent: (type: 'deposit' | 'wire' | 'anomaly') => void;

  // Toast System
  toast: { message: string; type?: 'info' | 'success' | 'warn' | 'error' } | null;
  showToast: (message: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
}

const INITIAL_ACCOUNTS: AccountItem[] = [
  {
    id: 'acc-savings',
    name: 'High-Yield Savings',
    type: 'savings',
    accountNumber: '•••• 4821',
    balance: 15250.00,
    availableBalance: 15250.00,
    apy: 4.65,
    accruedInterest: 58.20,
    status: 'active',
    badgeText: '4.65% APY',
  },
  {
    id: 'acc-checking',
    name: 'Premier Checking',
    type: 'checking',
    accountNumber: '•••• 7319',
    balance: 9600.00,
    availableBalance: 9210.00,
    dailyLimit: 5000.00,
    dailyUsed: 1200.00,
    cardsLinked: 4,
    status: 'active',
    badgeText: 'Primary Operating',
  },
  {
    id: 'acc-vault',
    name: 'Institutional Treasury Vault',
    type: 'vault',
    accountNumber: '•••• 1094',
    balance: 32180.00,
    availableBalance: 32180.00,
    apy: 5.10,
    termEndDate: 'Dec 15, 2024',
    status: 'locked',
    badgeText: 'Fixed Term (5.10% APY)',
  },
];

const INITIAL_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'ben-marcus',
    name: 'Marcus Vance',
    accountMask: '•••• 8812',
    accountType: 'Checking',
    bankName: 'J.P. Morgan Chase',
    routing: '021000021',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6yq7Y0w6XXsLIgEjE90u4TdHF126Gq8dbR4Q10a7vN0eKR5_3G9Dw-uhuGh3z5ObZZpdLItqV9AZYgwQ42NdA27d7ficp3pJ3kddlgyLGgtCmAxdUcrXEvL2AzkUL5l03rnqFq3pp14FfLDdU2j0OrKt799miQ1C1rgcFMeoAz_dBaPltZTt9nqFGtCEPhHfa21msACveNvzZBlBEoBsQfPPSDHiFp1dKeRkfaqKjkQrzEWSYkmQQ1w',
    badge: 'Verified Wire',
    lastSent: '3 days ago',
  },
  {
    id: 'ben-sophia',
    name: 'Sophia Chen',
    accountMask: '•••• 4120',
    accountType: 'High-Yield Reserve',
    bankName: 'Silicon Valley Bank',
    routing: '121140399',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhLsWb6JCBJ51iER6jtEcDdEf_Nfv00LEMFNPfh4hIhVKl8zqcBa4VQ6uM1j5XmsFL7TANzN0Wdq_nbzcn6xi7mm5dyPNgK8k2GrBDnf7eGSmxB_BuiDINeCBjvxDJW0JXzxSAeZThkS2u7Y_ud4CwoTky0BMczh8O9mNlpseCt4nMNL28B02dbcoluxNrhopAcANuxlNTIJLpT4P9gJxmsl7V8iZ1bO6i5wkpeBCjDhMa3kuIIASY2A',
    badge: 'ACH Linked',
    lastSent: 'Oct 28',
  },
  {
    id: 'ben-apex',
    name: 'Apex Cloud LLC',
    accountMask: '•••• 9033',
    accountType: 'Corporate Treasury',
    bankName: 'Wells Fargo Treasury',
    routing: '121000358',
    badge: 'Corporate Vendor',
    lastSent: 'Monthly Recurring',
    initials: 'AC',
  },
  {
    id: 'ben-vault',
    name: 'Vault Escrow 04',
    accountMask: '•••• 6632',
    accountType: 'Corporate Ledger',
    bankName: 'FinCore Internal FedLine',
    routing: '021000998',
    badge: 'Internal Route',
    lastSent: 'Oct 15',
    initials: 'V4',
  },
];

const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'txn-1',
    ref: 'TXN-89210-CR',
    date: 'Oct 24, 2024',
    timestamp: '2:15 PM EST',
    title: 'Stripe Merchant Settlement',
    subtitle: 'Daily automated payout',
    accountSource: 'Checking •••• 7319',
    amount: 500.00,
    type: 'Deposit',
    status: 'Completed',
    riskIndicator: 'LOW RISK',
    customerName: 'Stripe Merchant Acct',
    customerEmail: 'settlements@stripe.com',
    speed: 'Instant (Sub-second)',
    category: 'Settlement',
    nonce: '0x81FA...4A91',
  },
  {
    id: 'txn-2',
    ref: 'TXN-89194-TR',
    date: 'Oct 23, 2024',
    timestamp: '09:15 AM EST',
    title: 'Transfer to Marcus Vance',
    subtitle: 'Quarterly family support',
    accountSource: 'Savings •••• 4821',
    amount: -250.00,
    type: 'Transfer',
    status: 'Completed',
    riskIndicator: 'LOW RISK',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@chase.com',
    speed: 'FedNow Real-time',
    category: 'Settlement',
    nonce: '0x9f82...c41e',
  },
  {
    id: 'txn-3',
    ref: 'TXN-89045-WD',
    date: 'Oct 22, 2024',
    timestamp: '11:05 AM EST',
    title: 'ATM Cash Withdrawal - Midtown Fleet',
    subtitle: 'ATM #4928 New York',
    accountSource: 'Checking •••• 7319',
    amount: -100.00,
    type: 'Withdrawal',
    status: 'Completed',
    riskIndicator: 'LOW RISK',
    speed: 'Immediate',
    category: 'Transport',
    nonce: '0x32A1...90EE',
  },
  {
    id: 'txn-4',
    ref: 'TXN-88902-DB',
    date: 'Oct 21, 2024',
    timestamp: '02:45 AM EST',
    title: 'Cloud Hosting - AWS Infrastructure',
    subtitle: 'Monthly dev workload compute',
    accountSource: 'Treasury •••• 1094',
    amount: -1240.50,
    type: 'Fee/Debit',
    status: 'Completed',
    riskIndicator: 'LOW RISK',
    speed: 'Batch ACH',
    category: 'SaaS',
    nonce: '0x7C19...24BB',
  },
  {
    id: 'txn-5',
    ref: 'TXN-88711-CR',
    date: 'Oct 20, 2024',
    timestamp: '03:12 PM EST',
    title: 'Wire Inflow - Acme Corp Invoice #401',
    subtitle: 'Contract retained services',
    accountSource: 'Savings •••• 4821',
    amount: 4800.00,
    type: 'Wire Deposit',
    status: 'Completed',
    riskIndicator: 'LOW RISK',
    speed: 'Fedwire Direct',
    category: 'Settlement',
    nonce: '0x66B0...91A2',
  },
  {
    id: 'txn-6',
    ref: 'TXN-88650-TR',
    date: 'Oct 19, 2024',
    timestamp: '01:12 PM EST',
    title: 'Scheduled Treasury Rebalance',
    subtitle: 'Auto capital reserve rule',
    accountSource: 'Treasury •••• 1094',
    amount: -3000.00,
    type: 'Transfer',
    status: 'Completed',
    riskIndicator: 'LOW RISK',
    speed: 'Internal Ledger',
    category: 'Settlement',
    nonce: '0x55B1...12CD',
  },
  {
    id: 'txn-7',
    ref: 'TXN-88519-WD',
    date: 'Oct 18, 2024',
    timestamp: '08:44 AM EST',
    title: 'Direct Debit Utilities NY Gas',
    subtitle: 'ConEd Recurring Invoice',
    accountSource: 'Checking •••• 7319',
    amount: -84.20,
    type: 'Withdrawal',
    status: 'Completed',
    riskIndicator: 'LOW RISK',
    speed: 'ACH Direct Debit',
    category: 'Utilities',
    nonce: '0x14EE...8811',
  },
  {
    id: 'txn-8',
    ref: 'TXN-88402-CR',
    date: 'Oct 17, 2024',
    timestamp: '07:30 PM EST',
    title: 'SaaS Vendor Subscription Refund',
    subtitle: 'Pro-rated billing adjustment',
    accountSource: 'Checking •••• 7319',
    amount: 49.00,
    type: 'Refund',
    status: 'Completed',
    riskIndicator: 'LOW RISK',
    speed: 'Card Credit',
    category: 'SaaS',
    nonce: '0x99A0...3341',
  },
];

const INITIAL_CARDS: BankCard[] = [
  {
    id: 'card-1',
    tier: 'Sovereign Metal',
    cardholder: 'ELENA VANCE',
    numberMasked: '•••• •••• •••• 8842',
    numberFull: '4920 8821 7390 8842',
    expiry: '08/28',
    cvv: '491',
    monthlyLimit: 10000,
    monthlySpent: 3420,
    isFrozen: false,
    type: 'metal',
    accentGradient: 'from-blue-900 via-indigo-950 to-slate-950',
    subtitle: '$15,000/mo limit',
  },
  {
    id: 'card-2',
    tier: 'Cloud & SaaS Virtual',
    cardholder: 'ELENA VANCE',
    numberMasked: '•••• •••• •••• 3319',
    numberFull: '4920 6214 9011 3319',
    expiry: '11/26',
    cvv: '812',
    monthlyLimit: 5000,
    monthlySpent: 850,
    isFrozen: false,
    type: 'virtual',
    accentGradient: 'from-blue-700 via-blue-900 to-indigo-950',
    subtitle: 'Merchant Lock active',
  },
  {
    id: 'card-3',
    tier: 'Marketing/Travel Virtual',
    cardholder: 'ELENA VANCE',
    numberMasked: '•••• •••• •••• 6204',
    numberFull: '4920 1823 4402 6204',
    expiry: '03/25',
    cvv: '305',
    monthlyLimit: 2500,
    monthlySpent: 920,
    isFrozen: false,
    type: 'virtual',
    accentGradient: 'from-slate-800 via-slate-900 to-blue-950',
    subtitle: 'Auto-burn at $2.5k',
    autoBurn: true,
  },
  {
    id: 'card-4',
    tier: 'Daily Petty Cash',
    cardholder: 'ELENA VANCE',
    numberMasked: '•••• •••• •••• 9102',
    numberFull: '4920 9931 4055 9102',
    expiry: '05/27',
    cvv: '148',
    monthlyLimit: 500,
    monthlySpent: 180,
    isFrozen: false,
    type: 'virtual',
    accentGradient: 'from-sky-900 via-blue-950 to-slate-900',
    subtitle: 'Daily $500 cap',
  },
];

const INITIAL_RULES: SecurityRule[] = [
  {
    id: 'rule-online',
    key: 'onlineEcommerce',
    title: 'Online E-Commerce Transactions',
    description: 'Allow web checkouts with 3D Secure dynamic challenge',
    enabled: true,
  },
  {
    id: 'rule-fx',
    key: 'crossBorderFx',
    title: 'Cross-Border & FX Payments',
    description: 'Block foreign merchant acquirers automatically',
    enabled: false,
    badge: 'Restricted',
  },
  {
    id: 'rule-atm',
    key: 'atmWithdrawals',
    title: 'ATM Cash Withdrawals',
    description: 'Protected limit capped at $1,000.00 / 24h',
    enabled: true,
  },
  {
    id: 'rule-velocity',
    key: 'velocityKillSwitch',
    title: 'Velocity Anomaly Kill-Switch',
    description: 'Instant micro-freeze if >3 bursts hit in 60 seconds',
    enabled: true,
  },
];

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alert-login',
    type: 'critical',
    title: 'Unrecognized Login Attempt',
    description: 'New session detected from an unfamiliar autonomous network system.',
    timestamp: 'Oct 24, 15:42 UTC',
    unread: true,
    metadata: {
      location: 'Frankfurt, Germany (AS16509)',
      device: 'Windows NT • Chrome 130.0',
      ip: '185.191.171.42',
    },
  },
  {
    id: 'alert-wire-auth',
    type: 'transactions',
    title: 'Wire Transfer Pending Dual-Auth',
    description: 'Wire outbound exceeds singular signature tier ($10k+ policy).',
    timestamp: 'Oct 24, 15:40 UTC',
    unread: true,
    metadata: {
      beneficiary: 'Apex Logistics LLC',
      routing: 'FedLine Direct • US TR #121000358',
      amount: 24500.00,
      fee: 15.00,
    },
  },
  {
    id: 'alert-fednow-inflow',
    type: 'transactions',
    title: 'FedNow Real-time Inflow',
    description: 'Stripe Merchant Settlement credited to Premier Checking (•••• 7319).',
    timestamp: '2:15 PM',
    unread: false,
    metadata: {
      amount: 500.00,
    },
  },
  {
    id: 'alert-velocity',
    type: 'aml',
    title: 'Card Velocity Anomaly',
    description: 'Virtual SaaS Card (•••• 3319) reached 85% of monthly allocation threshold.',
    timestamp: '11:20 AM',
    unread: true,
    metadata: {
      spendingCapPercent: 85,
      currentSpend: 850,
      limit: 1000,
    },
  },
  {
    id: 'alert-token',
    type: 'critical',
    title: 'New Hardware Token Registered',
    description: 'FIDO2 YubiKey 5C NFC added to enterprise authorized signature roster.',
    timestamp: 'Oct 23, 09:15 AM',
    unread: false,
    metadata: {
      serial: 'YK-90214',
    },
  },
  {
    id: 'alert-statement',
    type: 'compliance',
    title: 'September Consolidated Statement',
    description: 'Monthly ledger reconciliations and tax reporting manifests ready.',
    timestamp: 'Oct 21',
    unread: false,
  },
  {
    id: 'alert-ledger-root',
    type: 'compliance',
    title: 'Audit Ledger Root Verified',
    description: 'Cryptographic checkpoint root hash validated with FedLine Gateway Node #89194.',
    timestamp: 'Oct 20, 00:00 UTC',
    unread: false,
  },
];

const BankContext = createContext<BankContextType | null>(null);

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme & Layout
  const [isDark, setIsDark] = useState<boolean>(false);
  const [activeDevice, setActiveDevice] = useState<DeviceType>('iphone15');
  const [mobileScale, setMobileScale] = useState<number>(100);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('home');
  const [activeDesktopTab, setActiveDesktopTab] = useState<DesktopTab>('dashboard');

  // Currency & Privacy
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [isBalanceConcealed, setIsBalanceConcealed] = useState<boolean>(false);

  // Accounts & Funds
  const [accounts, setAccounts] = useState<AccountItem[]>(INITIAL_ACCOUNTS);
  const [emergencyFreeze, setEmergencyFreeze] = useState<boolean>(false);

  // Beneficiaries
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(INITIAL_BENEFICIARIES[0]);

  // Transactions
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);

  // Cards
  const [cards, setCards] = useState<BankCard[]>(INITIAL_CARDS);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isCardDetailsRevealed, setIsCardDetailsRevealed] = useState<boolean>(false);
  const [securityRules, setSecurityRules] = useState<SecurityRule[]>(INITIAL_RULES);

  // Alerts
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState<boolean>(false);
  const [biometricSuccess, setBiometricSuccess] = useState<boolean>(false);

  // Real-time Sync State
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncIntervalSec, setSyncIntervalSec] = useState<number>(3);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [latencyMs, setLatencyMs] = useState<number>(18);
  const [currentBlock, setCurrentBlock] = useState<number>(19482014);
  const nodeName = 'prod-drf-us-east-1a';

  // Toast System
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'warn' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  }, []);

  // Theme Synchronizer
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const setDarkMode = useCallback((val: boolean) => {
    setIsDark(val);
  }, []);

  const toggleBalanceConceal = useCallback(() => {
    setIsBalanceConcealed((prev) => !prev);
  }, []);

  // Exchange Rates
  const rates = useMemo(
    () => ({
      USD: 1.0,
      EUR: 0.925,
      GBP: 0.790,
    }),
    []
  );

  const formatCurrency = useCallback(
    (amount: number, overrideCurrency?: CurrencyCode): string => {
      if (isBalanceConcealed) {
        return '••••••••••';
      }
      const targetCurr = overrideCurrency || currency;
      const rate = rates[targetCurr] || 1;
      const converted = amount * rate;

      const symbolMap: Record<CurrencyCode, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
      };

      const formattedNum = Math.abs(converted).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const prefix = amount < 0 ? '-' : '';
      return `${prefix}${symbolMap[targetCurr]}${formattedNum}`;
    },
    [currency, isBalanceConcealed, rates]
  );

  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + curr.balance, 0);
  }, [accounts]);

  const availableLiquidity = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + curr.availableBalance, 0);
  }, [accounts]);

  // Emergency Outbound Freeze
  const toggleEmergencyFreeze = useCallback(() => {
    setEmergencyFreeze((prev) => {
      const next = !prev;
      setCards((oldCards) =>
        oldCards.map((c) => ({
          ...c,
          isFrozen: next ? true : c.isFrozen,
        }))
      );
      showToast(
        next
          ? 'Emergency Freeze ENGAGED: Outbound wires and debit cards locked'
          : 'Emergency Freeze Lifted: Sovereign rails restored to active',
        next ? 'error' : 'success'
      );
      return next;
    });
  }, [showToast]);

  // Card Controls
  const toggleCardReveal = useCallback(() => {
    setIsCardDetailsRevealed((prev) => {
      const next = !prev;
      showToast(next ? 'Credentials decrypted & revealed' : 'Card credentials masked', 'info');
      return next;
    });
  }, [showToast]);

  const toggleCardFreeze = useCallback(
    (cardId: string) => {
      setCards((prev) =>
        prev.map((c) => {
          if (c.id === cardId) {
            const nextFrozen = !c.isFrozen;
            showToast(
              nextFrozen ? `${c.tier} frozen immediately` : `${c.tier} is now active & ready`,
              nextFrozen ? 'warn' : 'success'
            );
            return { ...c, isFrozen: nextFrozen };
          }
          return c;
        })
      );
    },
    [showToast]
  );

  const generateBurnerCard = useCallback(() => {
    const random4 = Math.floor(1000 + Math.random() * 9000);
    const newCard: BankCard = {
      id: `card-burner-${Date.now()}`,
      tier: 'Single-Use Burner',
      cardholder: 'ELENA VANCE',
      numberMasked: `•••• •••• •••• ${random4}`,
      numberFull: `4920 7109 4481 ${random4}`,
      expiry: '10/26',
      cvv: String(Math.floor(100 + Math.random() * 900)),
      monthlyLimit: 750,
      monthlySpent: 0,
      isFrozen: false,
      type: 'burner',
      accentGradient: 'from-amber-600 via-orange-800 to-stone-900',
      subtitle: 'Auto-destroys after 1st transaction',
      autoBurn: true,
    };
    setCards((prev) => [newCard, ...prev]);
    setActiveCardIndex(0);
    showToast(`Created single-use burner card (•••• ${random4})`, 'success');
  }, [showToast]);

  const toggleSecurityRule = useCallback(
    (key: string) => {
      setSecurityRules((prev) =>
        prev.map((rule) => {
          if (rule.key === key) {
            const next = !rule.enabled;
            showToast(
              `${rule.title} ${next ? 'Enforced' : 'Disabled'}`,
              next ? 'success' : 'warn'
            );
            return { ...rule, enabled: next };
          }
          return rule;
        })
      );
    },
    [showToast]
  );

  // Transfers
  const executeTransfer = useCallback(
    ({
      fromAccountId,
      toAccountName,
      toAccountMask,
      amount,
      fee,
      memo,
      rail,
    }: {
      fromAccountId: string;
      toAccountName: string;
      toAccountMask: string;
      amount: number;
      fee: number;
      memo: string;
      rail: string;
    }) => {
      const totalDebit = amount + fee;
      // Debit from source account
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === fromAccountId) {
            return {
              ...acc,
              balance: Math.max(0, acc.balance - totalDebit),
              availableBalance: Math.max(0, acc.availableBalance - totalDebit),
            };
          }
          return acc;
        })
      );

      // Create ledger transaction
      const newRef = `TXN-${Math.floor(80000 + Math.random() * 19999)}-${rail === 'Internal' ? 'TR' : 'WD'}`;
      const newTxn: TransactionItem = {
        id: `txn-${Date.now()}`,
        ref: newRef,
        date: 'Oct 24, 2024',
        timestamp: 'Just now',
        title: `Transfer to ${toAccountName}`,
        subtitle: `${memo || 'Account liquidity'} (${toAccountMask})`,
        accountSource: 'Savings •••• 4821',
        amount: -amount,
        type: 'Transfer',
        status: 'Completed',
        riskIndicator: 'LOW RISK',
        speed: rail === 'wire' ? 'Instant FedNow' : 'Fedwire Direct',
        category: 'Settlement',
        nonce: `0x${Math.random().toString(16).substring(2, 6).toUpperCase()}...B91C`,
      };

      setTransactions((prev) => [newTxn, ...prev]);
      showToast(`Settlement dispatched: $${amount.toFixed(2)} USD via ${rail}`, 'success');
      return newTxn;
    },
    [showToast]
  );

  // Alerts
  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })));
    showToast('All security alerts marked as read', 'info');
  }, [showToast]);

  // Biometrics & Apex Logistics Wire Approval Flow
  const openBiometricModal = useCallback(() => {
    setBiometricSuccess(false);
    setIsBiometricModalOpen(true);
  }, []);

  const closeBiometricModal = useCallback(() => {
    setIsBiometricModalOpen(false);
  }, []);

  const resetBiometricSuccess = useCallback(() => {
    setBiometricSuccess(false);
  }, []);

  const authorizeBiometricWire = useCallback(() => {
    // Commit the $24,500.00 Apex Logistics LLC wire
    setBiometricSuccess(true);

    // Debit the $24,500 + $15 fee from Premier Checking
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === 'acc-checking') {
          return {
            ...acc,
            balance: Math.max(0, acc.balance - 24515.00),
            availableBalance: Math.max(0, acc.availableBalance - 24515.00),
          };
        }
        return acc;
      })
    );

    // Add In-Flight / Released wire to transactions
    const wireTx: TransactionItem = {
      id: `txn-apex-${Date.now()}`,
      ref: 'FED-2024-89104-AZ',
      date: 'Oct 24, 2024',
      timestamp: '15:42 UTC',
      title: 'Apex Logistics LLC',
      subtitle: 'FedLine Wire • Premier Checking (•••• 7319)',
      accountSource: 'Checking •••• 7319',
      amount: -24500.00,
      type: 'Transfer',
      status: 'Completed',
      riskIndicator: 'LOW RISK',
      speed: 'FedLine Direct (TLS 1.3 / ISO 20022)',
      signedBy: 'Elena Vance (Signer 2/2)',
      category: 'Payroll',
      nonce: '0x7F4A...B91C',
    };

    setTransactions((prev) => [wireTx, ...prev]);

    // Mark wire alert as resolved
    setAlerts((prev) => prev.filter((a) => a.id !== 'alert-wire-auth'));

    showToast('Dual-Auth Certified: $24,500.00 released to FedLine Direct', 'success');
  }, [showToast]);

  // Manual Sync
  const manualSync = useCallback(() => {
    setIsSyncing(true);
    setLatencyMs(Math.floor(14 + Math.random() * 8));
    setCurrentBlock((b) => b + 1);
    setLastSynced(new Date());

    setTimeout(() => {
      setIsSyncing(false);
      showToast('Real-time ledger synced with FedLine Gateway Node', 'info');
    }, 600);
  }, [showToast]);

  // Simulate Live Events (Deposit, Wire, Anomaly)
  const simulateLiveEvent = useCallback(
    (type: 'deposit' | 'wire' | 'anomaly') => {
      if (type === 'deposit') {
        const depositAmount = 500.00;
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === 'acc-checking'
              ? { ...acc, balance: acc.balance + depositAmount, availableBalance: acc.availableBalance + depositAmount }
              : acc
          )
        );
        const newTx: TransactionItem = {
          id: `sim-${Date.now()}`,
          ref: `TXN-${Math.floor(90000 + Math.random() * 9999)}-CR`,
          date: 'Oct 24, 2024',
          timestamp: 'Just now',
          title: 'Stripe Merchant Payout',
          subtitle: 'Automated settlement credit',
          accountSource: 'Checking •••• 7319',
          amount: depositAmount,
          type: 'Deposit',
          status: 'Completed',
          riskIndicator: 'LOW RISK',
          speed: 'FedNow Instant',
          category: 'Settlement',
        };
        setTransactions((prev) => [newTx, ...prev]);
        showToast('Live Inflow: +$500.00 USD Stripe settlement credited', 'success');
      } else if (type === 'wire') {
        openBiometricModal();
        showToast('High-Value Inbound/Outbound Dual-Signature verification requested', 'warn');
      } else if (type === 'anomaly') {
        const newAlert: AlertItem = {
          id: `alert-${Date.now()}`,
          type: 'aml',
          title: 'High Velocity Transfer Spike',
          description: '3 outbound attempts detected within 45 seconds exceeding standard profile.',
          timestamp: 'Just now',
          unread: true,
          metadata: {
            amount: 9800.00,
          },
        };
        setAlerts((prev) => [newAlert, ...prev]);
        showToast('AML Security Engine Triggered: Rapid velocity spike detected', 'warn');
      }
    },
    [openBiometricModal, showToast]
  );

  // Background Simulated Real-Time Sync Loop
  useEffect(() => {
    if (syncIntervalSec <= 0) return;

    const interval = setInterval(() => {
      setLastSynced(new Date());
      setLatencyMs(Math.floor(15 + Math.random() * 8));
      setCurrentBlock((prev) => prev + 1);

      // Micro APY accrual on savings account every cycle for vivid real-time feeling
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === 'acc-savings') {
            const microInterest = 0.01;
            return {
              ...acc,
              accruedInterest: +(Number(acc.accruedInterest || 0) + microInterest).toFixed(2),
            };
          }
          return acc;
        })
      );
    }, syncIntervalSec * 1000);

    return () => clearInterval(interval);
  }, [syncIntervalSec]);

  return (
    <BankContext.Provider
      value={{
        isDark,
        toggleDarkMode,
        setDarkMode,
        activeDevice,
        setActiveDevice,
        mobileScale,
        setMobileScale,
        activeMobileTab,
        setActiveMobileTab,
        activeDesktopTab,
        setActiveDesktopTab,

        currency,
        setCurrency,
        formatCurrency,
        isBalanceConcealed,
        toggleBalanceConceal,

        accounts,
        totalBalance,
        availableLiquidity,
        emergencyFreeze,
        toggleEmergencyFreeze,

        beneficiaries,
        selectedBeneficiary,
        setSelectedBeneficiary,

        transactions,
        executeTransfer,

        cards,
        activeCardIndex,
        setActiveCardIndex,
        isCardDetailsRevealed,
        toggleCardReveal,
        toggleCardFreeze,
        generateBurnerCard,
        securityRules,
        toggleSecurityRule,

        alerts,
        dismissAlert,
        markAllAlertsRead,
        isBiometricModalOpen,
        openBiometricModal,
        closeBiometricModal,
        biometricSuccess,
        authorizeBiometricWire,
        resetBiometricSuccess,

        isSyncing,
        syncIntervalSec,
        setSyncIntervalSec,
        lastSynced,
        latencyMs,
        currentBlock,
        nodeName,
        manualSync,
        simulateLiveEvent,

        toast,
        showToast,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
