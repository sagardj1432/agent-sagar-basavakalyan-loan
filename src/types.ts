export type LoanType = 
  | 'Personal Loan'
  | 'Home Loan'
  | 'Gold Loan'
  | 'Business Loan'
  | 'Agriculture Loan'
  | 'Vehicle Loan'
  | 'Mortgage Loan'
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

export interface BankRateInfo {
  bankName: string;
  category: LoanType;
  minRate: number; // percentage e.g. 8.4
  maxTenureYears: number;
  processingFee: string;
  branchInBasavakalyan: string;
  specialFeature: string;
}

export interface DynamicRatesConfig {
  goldRatePerGram22k: number; // e.g. 6850
  goldRatePerGram24k: number; // e.g. 7450
  announcementText: string;
  announcementActive: boolean;
  categoryRates: Record<string, {
    minRate: string;
    maxAmount: string;
    maxTenure: string;
    instantSanctionTime: string;
  }>;
  partnerBanks: BankRateInfo[];
  lastUpdated: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  loanType: LoanType;
  rating: number;
  comment: string;
  amount?: string;
  date: string;
  verified: boolean;
  isApproved: boolean;
}

export interface EligibilityInput {
  loanType: LoanType;
  employmentType: 'salaried' | 'business' | 'farmer' | 'self_employed';
  monthlyIncome: number;
  existingEmis: number;
  cibilTier: 'excellent' | 'good' | 'average' | 'new'; // 750+, 700-749, 650-699, No Score
  propertyValue?: number;
  goldGrams?: number;
  landAcres?: number;
}

export interface EligibilityResult {
  maxEligibleAmount: number;
  recommendedInterestRate: number;
  estimatedEmi: number;
  recommendedTenureYears: number;
  approvalProbability: number; // 0 to 100%
  eligibleBanks: Array<{
    bankName: string;
    rate: number;
    emi: number;
    specialOffer: string;
  }>;
  tips: string[];
}

export type LocalAdCategory =
  | 'Real Estate & Plots'
  | 'Vehicles & Machinery'
  | 'Business & Shop Offers'
  | 'Gold & Jewellery'
  | 'Agriculture & Seeds'
  | 'Loan & Finance Melas'
  | 'Jobs & Services';

export interface LocalMarketAd {
  id: string;
  title: string;
  category: LocalAdCategory;
  area: string; // e.g. "Shivaji Chowk, Basavakalyan", "Fort Road", "Main Market", "Humnabad Road"
  priceOrOffer?: string; // e.g. "₹18 Lakhs Negotiable", "Flat 20% Off", "Spot Cash in 15 Min"
  contactPhone: string;
  whatsappPhone?: string;
  description: string;
  badge?: string; // e.g. "HOT DEAL", "VERIFIED LOCAL", "LIMITED TIME", "EXCLUSIVE", "URGENT SALE"
  postedBy: string; // "Agent Sagar (Verified Admin)"
  imageUrl?: string;
  videoUrl?: string; // Direct MP4 video, WebM, or YouTube embed/URL
  mediaType?: 'image' | 'video' | 'both';
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

