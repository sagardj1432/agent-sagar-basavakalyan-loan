import { Lead, LeadStatus, DashboardStats, LoanType, LocalMarketAd } from '../types';
import { supabase } from '../lib/supabase';

const INITIAL_FALLBACK_LEADS: Lead[] = [];

// Helper for local storage fallback
function getLocalLeads(): Lead[] {
  try {
    const data = localStorage.getItem('basavakalyan_leads');
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Clean out legacy dummy leads
        const dummyIds = new Set(['lead-1001', 'lead-1002', 'lead-1003', 'lead-1004', 'lead-1005']);
        const cleaned = parsed.filter((l: any) => !dummyIds.has(l.id));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('basavakalyan_leads', JSON.stringify(cleaned));
        }
        return cleaned;
      }
    }
    return [];
  } catch (e) {
    return [];
  }
}

function saveLocalLeads(leads: Lead[]) {
  try {
    localStorage.setItem('basavakalyan_leads', JSON.stringify(leads));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
}

export const apiService = {
  // Submit a new lead
  async submitLead(leadData: { name: string; mobile: string; loanType: LoanType; amount?: string; city?: string; notes?: string }): Promise<Lead> {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      if (response.ok) {
        const resData = await response.json();
        return resData.lead;
      }
    } catch (err) {
      console.warn('API unavailable, using local storage fallback:', err);
    }

    // Local & Supabase Direct fallback
    const leads = getLocalLeads();
    const newLead: Lead = {
      id: `lead-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      name: leadData.name.trim(),
      mobile: leadData.mobile.replace(/\D/g, ''),
      loanType: leadData.loanType || 'Personal Loan',
      amount: leadData.amount || 'Flexible',
      city: leadData.city || 'Basavakalyan',
      status: 'New',
      notes: leadData.notes || '',
      createdAt: new Date().toISOString()
    };
    leads.unshift(newLead);
    saveLocalLeads(leads);

    // Direct Supabase insert attempt
    try {
      await supabase.from('leads').insert([{
        id: newLead.id,
        name: newLead.name,
        mobile: newLead.mobile,
        loan_type: newLead.loanType,
        amount: newLead.amount,
        city: newLead.city,
        status: newLead.status,
        notes: newLead.notes,
        created_at: newLead.createdAt
      }]);
    } catch (sbErr) {
      console.warn('Direct Supabase submission failed:', sbErr);
    }

    return newLead;
  },

  // Get all leads with optional search and filters
  async fetchLeads(search = '', status = 'All', loanType = 'All'): Promise<Lead[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status && status !== 'All') params.append('status', status);
      if (loanType && loanType !== 'All') params.append('loanType', loanType);

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API fetch failed, falling back to local storage:', e);
    }

    let leads = getLocalLeads();
    const cleanSearch = search.toLowerCase().trim();
    if (cleanSearch) {
      leads = leads.filter(l => 
        l.name.toLowerCase().includes(cleanSearch) || 
        l.mobile.includes(cleanSearch) ||
        (l.city && l.city.toLowerCase().includes(cleanSearch))
      );
    }
    if (status !== 'All') {
      leads = leads.filter(l => l.status === status);
    }
    if (loanType !== 'All') {
      leads = leads.filter(l => l.loanType === loanType);
    }
    return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Update lead status or notes
  async updateLeadStatus(id: string, status: LeadStatus, notes?: string): Promise<Lead> {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) {
        const data = await res.json();
        return data.lead;
      }
    } catch (e) {
      console.warn('API update failed, updating locally:', e);
    }

    const leads = getLocalLeads();
    const index = leads.findIndex(l => l.id === id);
    if (index !== -1) {
      leads[index].status = status;
      if (notes !== undefined) leads[index].notes = notes;
      leads[index].updatedAt = new Date().toISOString();
      saveLocalLeads(leads);
      return leads[index];
    }
    throw new Error('Lead not found');
  },

  // Delete lead
  async deleteLead(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API delete failed, deleting locally:', e);
    }

    let leads = getLocalLeads();
    const len = leads.length;
    leads = leads.filter(l => l.id !== id);
    saveLocalLeads(leads);
    return leads.length < len;
  },

  // Fetch dashboard stats
  async fetchStats(): Promise<DashboardStats> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API stats failed, generating locally:', e);
    }

    const leads = getLocalLeads();
    const todayStr = new Date().toISOString().slice(0, 10);
    return {
      totalLeads: leads.length,
      newToday: leads.filter(l => l.createdAt.startsWith(todayStr)).length,
      approvedLeads: leads.filter(l => l.status === 'Approved').length,
      inProgressLeads: leads.filter(l => l.status === 'In Progress').length,
      rejectedLeads: leads.filter(l => l.status === 'Rejected').length,
      leadsByLoanType: {
        'Personal Loan': leads.filter(l => l.loanType === 'Personal Loan').length,
        'Home Loan': leads.filter(l => l.loanType === 'Home Loan').length,
        'Gold Loan': leads.filter(l => l.loanType === 'Gold Loan').length,
        'Business Loan': leads.filter(l => l.loanType === 'Business Loan').length,
        'Agriculture Loan': leads.filter(l => l.loanType === 'Agriculture Loan').length,
        'Vehicle Loan': leads.filter(l => l.loanType === 'Vehicle Loan').length,
      }
    };
  },

  // Admin Account Status Check
  async getAdminAccountStatus(): Promise<{ hasAdmin: boolean; username?: string; email?: string }> {
    try {
      const res = await fetch('/api/admin/account-status');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to check admin status from API:', e);
    }
    const localAccount = localStorage.getItem('basavakalyan_admin_account');
    if (localAccount) {
      try {
        const parsed = JSON.parse(localAccount);
        return { hasAdmin: true, username: parsed.username || 'sagar', email: parsed.email || 'sagardj1432@gmail.com' };
      } catch (err) {}
    }
    return { hasAdmin: true, username: 'sagar', email: 'sagardj1432@gmail.com' };
  },

  // Admin Single Slot Signup
  async adminSignup(data: { username: string; password: string; email?: string }): Promise<{ success: boolean; message?: string; error?: string; user?: any }> {
    try {
      const res = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        localStorage.setItem('basavakalyan_admin_account', JSON.stringify({
          hasAdmin: true,
          username: data.username,
          email: data.email
        }));
        return result;
      }
      return { success: false, error: result.error || 'Signup closed. The single admin slot is already claimed.' };
    } catch (e: any) {
      return { success: false, error: 'The single admin account slot is already claimed by sagar. Signups are locked.' };
    }
  },

  // Admin Login
  async adminLogin(data: { username?: string; password?: string; pin?: string }): Promise<{ success: boolean; token?: string; error?: string; user?: any }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        if (result.user) {
          localStorage.setItem('basavakalyan_admin_user', JSON.stringify(result.user));
        }
        return result;
      }
      return { success: false, error: result.error || 'Invalid admin username or password.' };
    } catch (e: any) {
      console.warn('API login error, using local fallback:', e);
      const inputUsername = (data.username || '').trim();
      const inputPass = (data.password || '').trim();
      const inputPin = (data.pin || '').trim();

      const isIdValid = inputUsername === 'sagardj';
      const isPassValid = inputPass === '1432' || inputPin === '1432';

      if (isIdValid && isPassValid) {
        const userObj = { username: 'sagardj', email: 'sagardj1432@gmail.com' };
        localStorage.setItem('basavakalyan_admin_user', JSON.stringify(userObj));
        return { success: true, token: 'local-token-' + Date.now(), user: userObj };
      }
      return { success: false, error: 'Invalid admin login name or password. Login name is case-sensitive.' };
    }
  },

  // Update Admin Account
  async updateAdminAccount(data: { currentPassword: string; newUsername?: string; newPassword?: string; newEmail?: string }): Promise<{ success: boolean; message?: string; error?: string; user?: any }> {
    try {
      const res = await fetch('/api/admin/update-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        if (result.user) {
          localStorage.setItem('basavakalyan_admin_user', JSON.stringify(result.user));
          localStorage.setItem('basavakalyan_admin_account', JSON.stringify({
            hasAdmin: true,
            username: result.user.username,
            email: result.user.email
          }));
        }
        return result;
      }
      return { success: false, error: result.error || 'Failed to update account' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Server error while updating account' };
    }
  },

  // Admin PIN verification
  async verifyAdminPin(pin: string): Promise<boolean> {
    try {
      const loginRes = await this.adminLogin({ pin, password: pin });
      return loginRes.success;
    } catch (e) {
      return pin === '1432';
    }
  },

  // Change admin PIN
  async changeAdminPin(currentPin: string, newPin: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPin, newPin })
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API change pin failed:', e);
    }
    const savedPin = localStorage.getItem('basavakalyan_admin_pin') || '1432';
    if (currentPin === savedPin || currentPin === '1432') {
      localStorage.setItem('basavakalyan_admin_pin', newPin);
      return true;
    }
    return false;
  },

  // Request Password Reset OTP via SMS
  async requestAdminResetOtp(phone: string): Promise<{ success: boolean; message?: string; error?: string; maskedPhone?: string; otp?: string }> {
    try {
      const res = await fetch('/api/admin/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data;
      }
      return { success: false, error: data.error || 'Failed to send OTP' };
    } catch (e: any) {
      // Local fallback
      const clean = phone.replace(/\D/g, '').slice(-10);
      if (clean === '9632636718') {
        const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('basavakalyan_recovery_otp', mockOtp);
        return {
          success: true,
          message: 'OTP dispatched to registered mobile +91 9632636718.',
          maskedPhone: '+91 96326***18',
          otp: mockOtp
        };
      }
      return { success: false, error: 'Unauthorized mobile number! OTP can only be sent to +91 9632636718.' };
    }
  },

  // Verify OTP and Reset Credentials
  async verifyAdminResetOtp(data: { phone: string; otp: string; newUsername?: string; newPassword: string }): Promise<{ success: boolean; message?: string; error?: string; token?: string; user?: any }> {
    try {
      const res = await fetch('/api/admin/forgot-password/verify-otp-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        if (result.user) {
          localStorage.setItem('basavakalyan_admin_user', JSON.stringify(result.user));
          localStorage.setItem('basavakalyan_admin_account', JSON.stringify({
            hasAdmin: true,
            username: result.user.username,
            email: result.user.email
          }));
        }
        return result;
      }
      return { success: false, error: result.error || 'Failed to verify OTP' };
    } catch (e: any) {
      // Local fallback
      const savedOtp = localStorage.getItem('basavakalyan_recovery_otp');
      if (savedOtp && savedOtp === data.otp.trim()) {
        const userObj = { username: data.newUsername?.trim() || 'sagar', email: 'sagardj1432@gmail.com' };
        localStorage.setItem('basavakalyan_admin_user', JSON.stringify(userObj));
        localStorage.setItem('basavakalyan_admin_account', JSON.stringify({
          hasAdmin: true,
          username: userObj.username,
          email: userObj.email
        }));
        localStorage.setItem('basavakalyan_admin_pin', data.newPassword);
        localStorage.removeItem('basavakalyan_recovery_otp');
        return {
          success: true,
          message: 'Password reset successfully!',
          token: 'local-token-' + Date.now(),
          user: userObj
        };
      }
      return { success: false, error: 'Incorrect OTP code.' };
    }
  },

  // Export CSV download function
  exportCsvDownload() {
    window.open('/api/leads/export/csv', '_blank');
  },

  // Dynamic Configuration & Live Rates
  async fetchDynamicConfig() {
    try {
      const res = await fetch('/api/dynamic-config');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API dynamic config fetch failed, using fallback:', e);
    }
    const saved = localStorage.getItem('basavakalyan_dynamic_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      goldRatePerGram22k: 6850,
      goldRatePerGram24k: 7480,
      announcementText: '⚡ Special 2026 Loan Festival in Basavakalyan: Housing Loans from 8.4% p.a. | Gold Loan Instant Cash in 15 Mins | Call Agent Sagar +91 96326 36718',
      announcementActive: true,
      categoryRates: {
        'Personal Loan': { minRate: '10.5% p.a.', maxAmount: '₹15 Lakhs', maxTenure: '5 Years', instantSanctionTime: '24 Hours' },
        'Home Loan': { minRate: '8.4% p.a.', maxAmount: '₹1 Crore', maxTenure: '30 Years', instantSanctionTime: '3-5 Days' },
        'Gold Loan': { minRate: '0.75% / month', maxAmount: '₹25 Lakhs', maxTenure: '2 Years', instantSanctionTime: '15 Minutes' },
        'Business Loan': { minRate: '12.0% p.a.', maxAmount: '₹50 Lakhs', maxTenure: '5 Years', instantSanctionTime: '48 Hours' },
        'Vehicle Loan': { minRate: '8.75% p.a.', maxAmount: '₹25 Lakhs', maxTenure: '7 Years', instantSanctionTime: '24-48 Hours' },
        'Mortgage Loan': { minRate: '9.25% p.a.', maxAmount: '₹75 Lakhs', maxTenure: '15 Years', instantSanctionTime: '3-7 Days' },
        'Agriculture Loan': { minRate: '7.0% p.a.', maxAmount: '₹30 Lakhs', maxTenure: '5 Years', instantSanctionTime: '48 Hours' },
        'Credit Card': { minRate: 'Lifetime Free / Low APR', maxAmount: '₹5 Lakhs Limit', maxTenure: 'Revolving', instantSanctionTime: 'Instant / 3 Days' }
      },
      partnerBanks: [
        { bankName: 'State Bank of India (SBI)', category: 'Home Loan', minRate: 8.40, maxTenureYears: 30, processingFee: '0.25%', branchInBasavakalyan: 'Main Road & Shivaji Chowk', specialFeature: 'PMAY Subsidy direct credit' },
        { bankName: 'Canara Bank', category: 'Agriculture Loan', minRate: 7.00, maxTenureYears: 5, processingFee: 'Nil for KCC', branchInBasavakalyan: 'Basavakalyan Market Branch', specialFeature: 'Kisan Credit Card instant limit' },
        { bankName: 'HDFC Bank', category: 'Personal Loan', minRate: 10.50, maxTenureYears: 5, processingFee: '1.5%', branchInBasavakalyan: 'Bus Stand Road', specialFeature: 'Paperless 10-second sanction' },
        { bankName: 'ICICI Bank', category: 'Business Loan', minRate: 11.50, maxTenureYears: 5, processingFee: '1.0%', branchInBasavakalyan: 'Station Road', specialFeature: 'Unsecured working capital line' },
        { bankName: 'Karnataka Gramin Bank (PKGB)', category: 'Gold Loan', minRate: 9.00, maxTenureYears: 2, processingFee: '₹250 Flat', branchInBasavakalyan: 'Fort Area & Sasur Galli', specialFeature: 'Highest valuation per gram' },
        { bankName: 'Union Bank of India', category: 'Vehicle Loan', minRate: 8.75, maxTenureYears: 7, processingFee: '0.50%', branchInBasavakalyan: 'Near Gandhi Chowk', specialFeature: 'Up to 90% on-road financing' }
      ],
      lastUpdated: new Date().toISOString()
    };
  },

  async updateDynamicConfig(configData: any) {
    try {
      const res = await fetch('/api/dynamic-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData)
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('basavakalyan_dynamic_config', JSON.stringify(data.config));
        return data;
      }
    } catch (e) {
      console.warn('API dynamic config update failed, saving locally:', e);
    }
    localStorage.setItem('basavakalyan_dynamic_config', JSON.stringify(configData));
    return { success: true, config: configData };
  },

  // Track loan application status
  async trackApplication(query: string) {
    try {
      const res = await fetch(`/api/leads/track?query=${encodeURIComponent(query)}`);
      return await res.json();
    } catch (e) {
      // Local fallback
      const leads = getLocalLeads();
      const clean = query.replace(/\D/g, '');
      const match = leads.filter(l => l.id.toLowerCase() === query.toLowerCase() || (clean.length >= 10 && l.mobile.includes(clean)));
      if (match.length > 0) {
        return {
          found: true,
          count: match.length,
          applications: match.map(m => ({
            id: m.id,
            applicantName: m.name,
            maskedMobile: `+91 ${m.mobile.slice(0, 3)}****${m.mobile.slice(-3)}`,
            loanType: m.loanType,
            amount: m.amount || 'Flexible',
            status: m.status,
            stage: m.status === 'Approved' ? 4 : m.status === 'In Progress' ? 3 : m.status === 'Contacted' ? 2 : 1,
            stageTitle: m.status === 'Approved' ? 'Loan Sanctioned' : m.status === 'In Progress' ? 'Under Bank Review' : 'Application Received',
            stageDesc: 'Processed by local advisor Agent Sagar in Basavakalyan.',
            appliedDate: m.createdAt,
            assignedOfficer: 'Agent Sagar (+91 96326 36718)',
            officeLocation: 'Near Reliance Mart, Basavakalyan'
          }))
        };
      }
      return { found: false, message: 'No loan application found for this number or ID.' };
    }
  },

  // Fetch reviews
  async fetchReviews(loanType?: string) {
    try {
      const url = loanType && loanType !== 'All' ? `/api/reviews?loanType=${encodeURIComponent(loanType)}` : '/api/reviews';
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API fetch reviews failed:', e);
    }
    const saved = localStorage.getItem('basavakalyan_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  },

  // Submit review
  async submitReview(reviewData: any) {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API submit review failed:', e);
    }
    const reviews = JSON.parse(localStorage.getItem('basavakalyan_reviews') || '[]');
    const newRev = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      isApproved: true
    };
    reviews.unshift(newRev);
    localStorage.setItem('basavakalyan_reviews', JSON.stringify(reviews));
    return { success: true, review: newRev };
  },

  // Calculate Eligibility dynamically
  async calculateEligibility(input: any) {
    try {
      const res = await fetch('/api/loan-eligibility-calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Eligibility calculation fallback:', e);
    }
    const income = Number(input.monthlyIncome) || 25000;
    const maxAmount = income * 20;
    return {
      maxEligibleAmount: maxAmount,
      recommendedInterestRate: 9.5,
      estimatedEmi: Math.round((maxAmount * 0.095) / 12),
      recommendedTenureYears: 5,
      approvalProbability: 92,
      eligibleBanks: [
        { bankName: 'SBI Basavakalyan', rate: 8.4, emi: Math.round((maxAmount * 0.084) / 12), specialOffer: 'Lowest rate' },
        { bankName: 'Canara Bank Basavakalyan', rate: 8.65, emi: Math.round((maxAmount * 0.0865) / 12), specialOffer: 'Fast approval' }
      ],
      tips: ['Aadhaar linked with mobile guarantees fast e-KYC in Basavakalyan.']
    };
  },

  // Check Supabase connection status
  async checkSupabaseStatus() {
    try {
      const res = await fetch('/api/supabase/status');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend Supabase status check failed:', e);
    }

    try {
      const { data, error } = await supabase.from('leads').select('*').limit(1);
      if (error) {
        return {
          connected: false,
          projectId: 'gvljtwufckjvykinvkul',
          url: 'https://gvljtwufckjvykinvkul.supabase.co',
          error: error.message
        };
      }
      return {
        connected: true,
        projectId: 'gvljtwufckjvykinvkul',
        url: 'https://gvljtwufckjvykinvkul.supabase.co',
        sampleCount: data?.length || 0
      };
    } catch (err: any) {
      return {
        connected: false,
        projectId: 'gvljtwufckjvykinvkul',
        url: 'https://gvljtwufckjvykinvkul.supabase.co',
        error: err.message
      };
    }
  },

  // LOCAL MARKET ADS & CLASSIFIEDS (Admin Sagar Managed)
  async fetchLocalAds(all = false, category = 'All', search = ''): Promise<LocalMarketAd[]> {
    try {
      const params = new URLSearchParams();
      if (all) params.append('all', 'true');
      if (category && category !== 'All') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`/api/local-ads?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API fetch local ads failed, falling back:', e);
    }
    const saved = localStorage.getItem('basavakalyan_local_ads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return all ? parsed : parsed.filter((a: any) => a.isActive !== false);
      } catch (e) {}
    }
    return [];
  },

  async createLocalAd(adData: Partial<LocalMarketAd>, adminToken?: string): Promise<{ success: boolean; ad?: LocalMarketAd; error?: string }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
        headers['x-admin-token'] = adminToken;
      }
      const res = await fetch('/api/local-ads', {
        method: 'POST',
        headers,
        body: JSON.stringify(adData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to post local ad.' };
      }
      return { success: true, ad: data.ad };
    } catch (e: any) {
      console.warn('API create local ad failed:', e);
      return { success: false, error: e.message || 'Network error while publishing ad.' };
    }
  },

  async updateLocalAd(id: string, adData: Partial<LocalMarketAd>, adminToken?: string): Promise<{ success: boolean; ad?: LocalMarketAd; error?: string }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
        headers['x-admin-token'] = adminToken;
      }
      const res = await fetch(`/api/local-ads/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(adData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update local ad.' };
      }
      return { success: true, ad: data.ad };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error while updating ad.' };
    }
  },

  async toggleLocalAd(id: string, adminToken?: string): Promise<{ success: boolean; isActive?: boolean; error?: string }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
        headers['x-admin-token'] = adminToken;
      }
      const res = await fetch(`/api/local-ads/${id}/toggle`, {
        method: 'PATCH',
        headers
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to toggle ad status.' };
      }
      return { success: true, isActive: data.isActive };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error toggling ad status.' };
    }
  },

  async deleteLocalAd(id: string, adminToken?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
        headers['x-admin-token'] = adminToken;
      }
      const res = await fetch(`/api/local-ads/${id}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to delete local ad.' };
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error deleting ad.' };
    }
  }
};

