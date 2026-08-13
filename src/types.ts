export type LoanType = 
  | 'Personal Loan'
  | 'Home Loan'
  | 'Gold Loan'
  | 'Business Loan'
  | 'Agriculture Loan'
  | 'Vehicle Loan'
  | 'Credit Card';

export type LeadStatus = 'New' | 'Contacted' | 'In Progress' | 'Approved' | 'Rejected';

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  loanType: LoanType;
  amount?: string;
  city?: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoanCategoryInfo {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  minRate: string;
  maxAmount: string;
  maxTenure: string;
  features: string[];
  eligibility: string[];
  documents: string[];
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  popularLocation: string;
}

export interface Landmark {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  significance: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  loanType: LoanType;
  rating: number; // 1 to 5
  date: string;
  quote: string;
  amountSanctioned?: string;
  verified: boolean;
  avatarBg: string;
}

export interface DashboardStats {
  totalLeads: number;
  newToday: number;
  approvedLeads: number;
  inProgressLeads: number;
  rejectedLeads: number;
  leadsByLoanType: Record<string, number>;
}
