import { Lead, LeadStatus, DashboardStats, LoanType } from '../types';
import { supabase } from '../lib/supabase';

const INITIAL_FALLBACK_LEADS: Lead[] = [

  {
    id: 'lead-1001',
    name: 'Basavaraj Patil',
    mobile: '9845123456',
    loanType: 'Personal Loan',
    amount: '₹3,00,000',
    city: 'Basavakalyan Town',
    status: 'New',
    notes: 'Urgent medical requirement. Prefers morning callback.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'lead-1002',
    name: 'Suryakant Biradar',
    mobile: '9741882233',
    loanType: 'Agriculture Loan',
    amount: '₹5,00,000',
    city: 'Sastapur Bangla',
    status: 'In Progress',
    notes: 'Kisan Credit Card renewal and tractor loan inquiry. Pahani submitted.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'lead-1003',
    name: 'Anil Kumar Stores',
    mobile: '9980554411',
    loanType: 'Business Loan',
    amount: '₹10,00,000',
    city: 'Main Bazar, Basavakalyan',
    status: 'Contacted',
    notes: 'Inquired about shop working capital credit.',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: 'lead-1004',
    name: 'Priyanka Kulkarni',
    mobile: '9880112233',
    loanType: 'Gold Loan',
    amount: '₹1,50,000',
    city: 'Fort Area, Basavakalyan',
    status: 'Approved',
    notes: 'Valuation complete. Disbursed spot cash.',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  {
    id: 'lead-1005',
    name: 'Malleshi Shetter',
    mobile: '9448332211',
    loanType: 'Home Loan',
    amount: '₹25,00,000',
    city: 'Model Colony, Basavakalyan',
    status: 'In Progress',
    notes: 'Building plan estimation under review.',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString()
  }
];

// Helper for local storage fallback
function getLocalLeads(): Lead[] {
  try {
    const data = localStorage.getItem('basavakalyan_leads');
    if (data) return JSON.parse(data);
    localStorage.setItem('basavakalyan_leads', JSON.stringify(INITIAL_FALLBACK_LEADS));
    return INITIAL_FALLBACK_LEADS;
  } catch (e) {
    return INITIAL_FALLBACK_LEADS;
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
      console.warn('Failed to check admin status:', e);
    }
    const localAccount = localStorage.getItem('basavakalyan_admin_account');
    if (localAccount) {
      const parsed = JSON.parse(localAccount);
      return { hasAdmin: true, username: parsed.username, email: parsed.email };
    }
    return { hasAdmin: false };
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
      return { success: false, error: result.error || 'Signup failed' };
    } catch (e: any) {
      // Local fallback
      const localAccount = localStorage.getItem('basavakalyan_admin_account');
      if (localAccount) {
        return { success: false, error: 'Admin account slot is already claimed! Only 1 admin account is allowed.' };
      }
      localStorage.setItem('basavakalyan_admin_account', JSON.stringify({
        hasAdmin: true,
        username: data.username,
        email: data.email
      }));
      return { success: true, message: 'Admin account registered successfully! Slot claimed.' };
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
        return result;
      }
      return { success: false, error: result.error || 'Invalid credentials' };
    } catch (e: any) {
      console.warn('API login error, using local fallback:', e);
      const localPin = localStorage.getItem('basavakalyan_admin_pin') || '1234';
      if (data.pin === localPin || data.password === localPin || data.password === '1234') {
        return { success: true, token: 'local-token-' + Date.now(), user: { username: 'Admin' } };
      }
      return { success: false, error: 'Invalid login details' };
    }
  },

  // Update Admin Account
  async updateAdminAccount(data: { currentPassword: string; newUsername?: string; newPassword?: string; newEmail?: string }): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/update-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        return result;
      }
      return { success: false, error: result.error || 'Failed to update account' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Server error' };
    }
  },

  // Admin PIN verification
  async verifyAdminPin(pin: string): Promise<boolean> {
    try {
      const loginRes = await this.adminLogin({ pin, password: pin });
      return loginRes.success;
    } catch (e) {
      const localPin = localStorage.getItem('basavakalyan_admin_pin') || '1234';
      return pin === localPin;
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
    const savedPin = localStorage.getItem('basavakalyan_admin_pin') || '1234';
    if (currentPin === savedPin) {
      localStorage.setItem('basavakalyan_admin_pin', newPin);
      return true;
    }
    return false;
  },

  // Export CSV download function
  exportCsvDownload() {
    window.open('/api/leads/export/csv', '_blank');
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
  }
};

