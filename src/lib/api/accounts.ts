import { apiClient } from './client';

export interface FinancialKpis {
  bankBalance: number;
  bankAccountsCount: number;
  receivables: number;
  dsoDays: number;
  payableToCompanies: number;
  gstPayableEst: number;
  itcMatchRate: number;
  netProfitMtd: number;
  profitPercentage: string;
}

export interface PnLData {
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
}

export interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  accountType: string;
  balance: number;
  reconciledDate: string;
}

export interface CompanyPayable {
  company: string;
  dueDate: string;
  amount: number;
}

export interface OperatingExpense {
  id: string;
  category: string;
  description: string;
  amount: number;
  paymentMode: string;
  expenseDate: string;
  paidTo?: string;
  voucherRef?: string;
}

export interface AccountsSummaryData {
  kpis: FinancialKpis;
  pnl: PnLData;
  bankAccounts: BankAccount[];
  payablesByCompany: CompanyPayable[];
  expenses: OperatingExpense[];
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

export interface CreateExpenseInput {
  category: string;
  description: string;
  amount: number;
  paymentMode: string;
  bankAccountId?: string;
  paidTo?: string;
}

export interface CreateBankAccountInput {
  accountName: string;
  accountNumber: string;
  bankName: string;
  accountType: string;
  balance: number;
}

export const accountsApi = {
  getSummary: async () => {
    return apiClient.get<AccountsSummaryData>('/accounts/summary');
  },

  createExpense: async (data: CreateExpenseInput) => {
    return apiClient.post<{ id: string; voucherRef: string; amount: number }>('/accounts/expenses', data);
  },

  addBankAccount: async (data: CreateBankAccountInput) => {
    return apiClient.post<BankAccount>('/accounts/banks', data);
  },

  exportTallyXmlUrl: () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return `${baseUrl}/accounts/export-tally`;
  }
};
