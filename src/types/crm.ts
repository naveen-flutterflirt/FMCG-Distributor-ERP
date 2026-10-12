export type FMCGCompany = 'All' | 'Company A' | 'Company B' | 'Company C' | 'Company D';

export interface CompanyInfo {
  id: string;
  name: string;
  category: string;
  targetAchievement: number;
  mtdSales: number;
  pendingClaims: number;
}

export interface MetricCard {
  label: string;
  value: string;
  subtext: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export interface SalesmanScorecard {
  id: string;
  name: string;
  beat: string;
  visited: string;
  productive: number;
  lpc: number;
  sales: number;
  mustSell: string;
  avatar?: string;
}

export interface VanSettlementItem {
  sku: string;
  loaded: number;
  sold: number;
  freeScheme: number;
  goodReturn: number;
  damageIn: number;
  expectedBack: number;
  countedBack: number;
  variance: number;
  unitPrice: number;
}

export interface VanSettlementSummary {
  vanId: string;
  vanName: string;
  salesman: string;
  route: string;
  date: string;
  loadedTime: string;
  returnedTime: string;
  status: 'In Progress' | 'Settled' | 'Pending Approval';
  items: VanSettlementItem[];
  emptyCrates: {
    loaded: number;
    issued: number;
    collected: number;
    counted: number;
    withOutlets: number;
  };
  cashBreakdown: {
    cashSales: number;
    oldDuesCollected: number;
    upiReceived: number;
    cheques: number;
    chequeCount: number;
    expenses: number;
    cashToDeposit: number;
    cashCounted: number;
    shortVariance: number;
  };
}

export interface OrderItem {
  id: string;
  sku: string;
  qty: string;
  units: number;
  rate: number;
  mrp: number;
  scheme: string;
  amount: number;
  isMustSell?: boolean;
}

export interface PendingOrder {
  id: string;
  outlet: string;
  outletClass?: 'A' | 'B' | 'C' | 'Modern Trade' | 'HoReCa';
  route: string;
  source: 'Salesman · Rakesh' | 'Salesman · Anil' | 'Salesman · Farhan' | 'Salesman · Manoj' | 'Retailer app' | 'Phone' | 'Chain PO · EDI';
  lines: number;
  value: number;
  schemeSaving: number;
  checks: 'OK' | 'Credit hold' | 'Short 3 SKUs' | 'PO match' | 'Under Review';
  deliveryDate: string;
  items: OrderItem[];
  gstin?: string;
  balanceDue?: number;
  creditLimit?: number;
}

export interface ClaimRecord {
  id: string;
  company: 'Company A' | 'Company B' | 'Company C' | 'Company D';
  type: string;
  period: string;
  amount: number;
  age: number;
  status: 'Submitted' | 'Query raised' | 'Audit done' | 'Credit note recd.' | 'Overdue' | 'Approved';
  evidence: {
    freeGoodsList: boolean;
    outletListWithGst: boolean;
    schemeCircularLinked: boolean;
    companyClaimFormatGenerated: boolean;
    queryNote?: string;
  };
}

export interface Outlet {
  id: string;
  name: string;
  ownerName: string;
  category: 'General Trade' | 'Modern Trade' | 'Wholesale' | 'HoReCa' | 'Chemist';
  outletClass: 'A' | 'B' | 'C';
  route: string;
  beatId: string;
  address: string;
  phone: string;
  gstin: string;
  creditLimit: number;
  currentOutstanding: number;
  overdueDays: number;
  loyaltyPoints: number;
  lastOrderDate: string;
  status: 'Active' | 'Credit Blocked' | 'Inactive';
}

export interface FinancialSummary {
  bankBalance: string;
  receivables: string;
  dsoDays: number;
  payableToCompanies: string;
  gstPayableOctEst: string;
  netProfitMtd: string;
  profitPercentage: string;
  pnlSeptember: {
    sales: number;
    cogs: number;
    schemeIncome: number;
    grossMargin: number;
    grossMarginPct: number;
    salariesIncentives: number;
    vehicleFuel: number;
    rentPowerOther: number;
    interestCharges: number;
    netProfit: number;
    netProfitPct: number;
  };
  payablesByCompany: {
    company: string;
    dueDate: string;
    amount: string;
    isAdvance?: boolean;
  }[];
  bankRecon: {
    totalLines: number;
    autoMatched: number;
    needsReview: number;
  };
  gstStatutory: {
    gstr1Status: string;
    gstr3bStatus: string;
    gstr2bMismatches: number;
    tdsTcsStatus: string;
  };
}
