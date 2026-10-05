export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

export interface AccountItem {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'vault';
  accountNumber: string;
  balance: number;
  availableBalance: number;
  apy?: number;
  accruedInterest?: number;
  dailyLimit?: number;
  dailyUsed?: number;
  cardsLinked?: number;
  status: 'active' | 'locked' | 'restricted';
  termEndDate?: string;
  badgeText?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountMask: string;
  accountType: string;
  bankName: string;
  routing: string;
  avatarUrl?: string;
  badge: string;
  lastSent?: string;
  initials?: string;
}

export type TransactionStatus = 'Completed' | 'Pending' | 'Compliance Hold' | 'Under Review' | 'Flagged';
export type TransactionType = 'Deposit' | 'Transfer' | 'Withdrawal' | 'Fee/Debit' | 'Wire Deposit' | 'Refund' | 'Card Spend';

export interface TransactionItem {
  id: string;
  ref: string;
  date: string;
  timestamp: string;
  title: string;
  subtitle: string;
  accountSource: string;
  amount: number; // positive for inflow, negative for outflow
  type: TransactionType;
  status: TransactionStatus;
  riskIndicator?: 'LOW RISK' | 'MED RISK' | 'HIGH RISK';
  riskNote?: string;
  customerName?: string;
  customerEmail?: string;
  nonce?: string;
  speed?: string;
  signedBy?: string;
  isoProtocol?: string;
  category?: 'SaaS' | 'Travel' | 'Transport' | 'Dining' | 'Settlement' | 'Utilities' | 'Payroll';
}

export interface BankCard {
  id: string;
  tier: string;
  cardholder: string;
  numberMasked: string;
  numberFull: string;
  expiry: string;
  cvv: string;
  monthlyLimit: number;
  monthlySpent: number;
  isFrozen: boolean;
  type: 'metal' | 'virtual' | 'burner';
  accentGradient: string;
  subtitle: string;
  autoBurn?: boolean;
}

export interface SecurityRule {
  id: string;
  key: 'onlineEcommerce' | 'crossBorderFx' | 'atmWithdrawals' | 'velocityKillSwitch';
  title: string;
  description: string;
  enabled: boolean;
  badge?: string;
  isWarning?: boolean;
}

export interface AlertItem {
  id: string;
  type: 'critical' | 'transactions' | 'aml' | 'compliance';
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  metadata?: {
    location?: string;
    device?: string;
    ip?: string;
    beneficiary?: string;
    routing?: string;
    amount?: number;
    fee?: number;
    spendingCapPercent?: number;
    currentSpend?: number;
    limit?: number;
    tokenName?: string;
    serial?: string;
  };
}

export type DeviceType = 'iphone15' | 'pixel8' | 's24' | 'desktop';
export type MobileTab = 'home' | 'accounts' | 'transfer' | 'cards' | 'activity' | 'alerts';
export type DesktopTab = 'dashboard' | 'accounts' | 'transactions' | 'transfer' | 'admin';
