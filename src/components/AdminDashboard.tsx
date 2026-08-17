import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, DashboardStats, LoanType } from '../types';
import { apiService } from '../services/api';
import { 
  Lock, Key, Search, Download, Trash2, Edit3, Plus, RefreshCw, 
  CheckCircle2, Clock, XCircle, AlertCircle, Phone, MessageSquare, 
  Database, ShieldCheck, BarChart3, Filter, Check, X, FileSpreadsheet,
  Settings, KeyRound, User, Mail, UserPlus, LogIn, ShieldAlert, UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  initialMode?: 'login' | 'signup';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialMode = 'login' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Single Slot Admin Account State
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [hasAdmin, setHasAdmin] = useState<boolean>(true);
  const [adminUsername, setAdminUsername] = useState<string>('sagar');
  const [adminEmail, setAdminEmail] = useState<string>('sagardj1432@gmail.com');
  const [checkingAdminStatus, setCheckingAdminStatus] = useState<boolean>(false);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Signup Form State
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupMessage, setSignupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Account Settings Modal State
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [currPass, setCurrPass] = useState('');
  const [newUsernameAcc, setNewUsernameAcc] = useState('');
  const [newEmailAcc, setNewEmailAcc] = useState('');
  const [newPassAcc, setNewPassAcc] = useState('');
  const [accUpdateMsg, setAccUpdateMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Leads & Stats state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loanTypeFilter, setLoanTypeFilter] = useState('All');

  // Modals & Drawers
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPinChangeModal, setShowPinChangeModal] = useState(false);
  const [showSupabasePanel, setShowSupabasePanel] = useState(false);

  // New Lead Form State
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadMobile, setNewLeadMobile] = useState('');
  const [newLeadLoanType, setNewLeadLoanType] = useState<LoanType>('Personal Loan');
  const [newLeadAmount, setNewLeadAmount] = useState('');
  const [newLeadCity, setNewLeadCity] = useState('Basavakalyan');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  // Pin Change State
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState({ type: '', text: '' });

  // Supabase Config State
  const [supabaseUrl, setSupabaseUrl] = useState('https://gvljtwufckjvykinvkul.supabase.co');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('sb_publishable_iKBzHNZZHQekG7p9fGig6g_XAJfIQX5');
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  // Check if admin slot has been claimed
  const checkAdminAccountStatus = async () => {
    setCheckingAdminStatus(true);
    try {
      const status = await apiService.getAdminAccountStatus();
      setHasAdmin(status.hasAdmin);
      if (status.username) setAdminUsername(status.username);
      if (status.email) setAdminEmail(status.email);
    } catch (err) {
      console.error('Error checking admin status:', err);
    } finally {
      setCheckingAdminStatus(false);
    }
  };

  useEffect(() => {
    checkAdminAccountStatus();
  }, []);

  const checkSupabase = async () => {
    try {
      const status = await apiService.checkSupabaseStatus();
      if (status.connected) {
        setSupabaseConnected(true);
        setSupabaseError(null);
      } else {
        setSupabaseConnected(false);
        setSupabaseError(status.error || 'Table "leads" not found in Supabase yet.');
      }
    } catch (err: any) {
      setSupabaseConnected(false);
      setSupabaseError(err?.message || 'Failed to connect to Supabase');
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSubmitting(true);
    try {
      const res = await apiService.adminLogin({
        username: loginIdentifier.trim(),
        password: loginPassword.trim()
      });
      if (res.success) {
        setIsAuthenticated(true);
        if (res.user?.username) setAdminUsername(res.user.username);
        if (res.user?.email) setAdminEmail(res.user.email);
        setLoginIdentifier('');
        setLoginPassword('');
      } else {
        setLoginError(res.error || 'Invalid login credentials. Please verify your admin username/email and password.');
      }
    } catch (e) {
      setLoginError('Authentication failed. Please check your connection.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Handle Signup Submit (Single Slot)
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupMessage(null);

    if (hasAdmin) {
      setSignupMessage({
        type: 'error',
        text: 'Admin account slot is already claimed! Only 1 admin account is allowed.'
      });
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupMessage({
        type: 'error',
        text: 'Passwords do not match. Please enter matching passwords.'
      });
      return;
    }

    setLoginSubmitting(true);
    try {
      const res = await apiService.adminSignup({
        username: signupUsername,
        email: signupEmail,
        password: signupPassword
      });

      if (res.success) {
        setSignupMessage({
          type: 'success',
          text: '🎉 Admin account created successfully! Single admin slot claimed.'
        });
        setHasAdmin(true);
        setAdminUsername(signupUsername);
        setAdminEmail(signupEmail);

        // Auto login after 1 sec
        setTimeout(() => {
          setIsAuthenticated(true);
        }, 1200);
      } else {
        setSignupMessage({
          type: 'error',
          text: res.error || 'Registration failed.'
        });
      }
    } catch (e: any) {
      setSignupMessage({
        type: 'error',
        text: 'Registration failed. ' + (e.message || '')
      });
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Update Account Submit
  const handleUpdateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccUpdateMsg(null);
    try {
      const res = await apiService.updateAdminAccount({
        currentPassword: currPass,
        newUsername: newUsernameAcc || undefined,
        newEmail: newEmailAcc || undefined,
        newPassword: newPassAcc || undefined
      });
      if (res.success) {
        setAccUpdateMsg({ type: 'success', text: 'Admin details updated successfully!' });
        if (newUsernameAcc) setAdminUsername(newUsernameAcc);
        if (newEmailAcc) setAdminEmail(newEmailAcc);
        setCurrPass('');
        setNewPassAcc('');
        setNewUsernameAcc('');
        setNewEmailAcc('');
        checkAdminAccountStatus();
      } else {
        setAccUpdateMsg({ type: 'error', text: res.error || 'Failed to update credentials.' });
      }
    } catch (err: any) {
      setAccUpdateMsg({ type: 'error', text: 'Error updating details.' });
    }
  };

  // Fetch data
  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedLeads = await apiService.fetchLeads(search, statusFilter, loanTypeFilter);
      setLeads(fetchedLeads);
      const fetchedStats = await apiService.fetchStats();
      setStats(fetchedStats);
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      checkSupabase();
    }
  }, [isAuthenticated, search, statusFilter, loanTypeFilter]);

  // Update lead status
  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      await apiService.updateLeadStatus(id, newStatus);
      loadData();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  // Delete lead
  const handleDeleteLead = async (id: string) => {
    try {
      await apiService.deleteLead(id);
      setDeleteConfirmId(null);
      loadData();
    } catch (e) {
      alert('Failed to delete lead');
    }
  };

  // Add manual lead
  const handleAddManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadMobile.trim()) return;

    try {
      await apiService.submitLead({
        name: newLeadName,
        mobile: newLeadMobile,
        loanType: newLeadLoanType,
        amount: newLeadAmount,
        city: newLeadCity,
        notes: newLeadNotes || 'Manually logged by Admin'
      });
      setShowAddModal(false);
      setNewLeadName('');
      setNewLeadMobile('');
      setNewLeadAmount('');
      setNewLeadNotes('');
      loadData();
    } catch (e) {
      alert('Failed to add lead');
    }
  };

  // Change PIN
  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg({ type: '', text: '' });
    const ok = await apiService.changeAdminPin(currentPin, newPin);
    if (ok) {
      setPinChangeMsg({ type: 'success', text: 'PIN updated successfully!' });
      setCurrentPin('');
      setNewPin('');
    } else {
      setPinChangeMsg({ type: 'error', text: 'Current PIN is incorrect.' });
    }
  };

  // Status badge styling helper
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Progress':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // LOGIN & SIGNUP AUTHENTICATION SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-vermillion" />
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-vermillion-light border border-vermillion-light rounded-2xl flex items-center justify-center mx-auto text-vermillion shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Basavakalyan Admin Portal
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Lead Management & Customer Security Console
            </p>

            {/* Single Slot Badge Indicator */}
            <div className="pt-1">
              {hasAdmin ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-full text-xs font-extrabold shadow-2xs">
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin: {adminUsername || 'sagar'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-extrabold shadow-2xs">
                  <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>🎉 1 Admin Account Slot Available</span>
                </span>
              )}
            </div>
          </div>

          {!hasAdmin && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setLoginError(''); }}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4 text-vermillion" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setSignupMessage(null); }}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>Signup (1 Slot)</span>
              </button>
            </div>
          )}

          {/* LOGIN FORM: PURELY ADMIN NAME & PASSWORD */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in duration-200">
              {loginError && (
                <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs p-3.5 rounded-xl font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs space-y-1">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-vermillion" />
                  <span>Authorized Administrator Console</span>
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Enter your admin login name and password to access the customer leads dashboard.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Admin Login Name / Email
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. sagar"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-vermillion font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your admin password"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-vermillion font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-3.5 bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{loginSubmitting ? 'Authenticating...' : 'Unlock Admin Dashboard'}</span>
              </button>
            </form>
          )}

          {/* SIGNUP FORM (ONLY IF SLOT UNCLAIMED) */}
          {authMode === 'signup' && !hasAdmin && (
            <form onSubmit={handleSignupSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-xs text-emerald-900 font-medium space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  <span>Single Slot Admin Registration</span>
                </p>
                <p>
                  You are registering the 1 official admin account. Once created, signups will be locked.
                </p>
              </div>

              {signupMessage && (
                <div className={`text-xs p-3 rounded-xl font-medium border flex items-center gap-2 ${
                  signupMessage.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}>
                  {signupMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                  <span>{signupMessage.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Choose Admin Username *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder="e.g. sagar"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Admin Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. sagardj1432@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 4 chars"
                    className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-emerald-200" />
                <span>{loginSubmitting ? 'Registering...' : 'Create Admin Account & Lock Slot'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD VIEW
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-slate-200 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <ShieldCheck className="w-6 h-6 text-vermillion" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Admin Dashboard
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Logged in: {adminUsername || 'Admin'}</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Basavakalyan Loan Services • Lead Pipeline, Search & Status Control
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add Manual Lead */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2.5 bg-vermillion text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-vermillion-dark transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>

          {/* Export to Excel / CSV */}
          <button
            onClick={() => apiService.exportCsvDownload()}
            className="px-3.5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel/CSV</span>
          </button>

          {/* Account Settings Modal Trigger */}
          <button
            onClick={() => setShowAccountModal(true)}
            className="px-3 py-2.5 bg-slate-100 text-slate-800 hover:text-slate-900 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Account Settings</span>
          </button>

          {/* Supabase Panel Toggle */}
          <button
            onClick={() => setShowSupabasePanel(!showSupabasePanel)}
            className="px-3 py-2.5 bg-slate-100 text-slate-800 hover:text-slate-900 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Supabase DB</span>
          </button>

          {/* Lock / Logout */}
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-2.5 bg-slate-800 text-white hover:bg-slate-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Supabase Integration Drawer / Config */}
      {showSupabasePanel && (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Supabase Backend Integration</h3>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${supabaseConnected ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                {supabaseConnected ? '● Active Backend Sync' : '⚠️ Action Needed: Create leads Table'}
              </span>
            </div>
            <button onClick={() => setShowSupabasePanel(false)} className="text-slate-400 hover:text-slate-900 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <p className="text-slate-900 font-bold text-xs flex items-center justify-between">
                <span>Supabase Credentials:</span>
                <span className="text-emerald-700 font-mono text-[11px]">gvljtwufckjvykinvkul</span>
              </p>
              <div className="space-y-1 font-mono text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                <p><strong className="text-slate-900">Project ID:</strong> gvljtwufckjvykinvkul</p>
                <p><strong className="text-slate-900">URL:</strong> https://gvljtwufckjvykinvkul.supabase.co</p>
                <p><strong className="text-slate-900">API Key:</strong> sb_publishable_iKBzHN...XAJfIQX5</p>
              </div>

              <div className="pt-1">
                <button
                  onClick={checkSupabase}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Test Supabase Connection</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-slate-900 font-bold text-xs">Supabase Table Creation SQL Query:</p>
                <button
                  onClick={() => {
                    const sql = `CREATE TABLE IF NOT EXISTS public.leads (\n  id TEXT PRIMARY KEY,\n  name TEXT NOT NULL,\n  mobile TEXT NOT NULL,\n  loan_type TEXT,\n  amount TEXT,\n  city TEXT,\n  status TEXT DEFAULT 'New',\n  notes TEXT,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Allow public inserts" ON public.leads FOR INSERT WITH CHECK (true);\nCREATE POLICY "Allow public select" ON public.leads FOR SELECT USING (true);\nCREATE POLICY "Allow public update" ON public.leads FOR UPDATE USING (true);\nCREATE POLICY "Allow public delete" ON public.leads FOR DELETE USING (true);`;
                    navigator.clipboard.writeText(sql);
                    setSqlCopied(true);
                    setTimeout(() => setSqlCopied(false), 3000);
                  }}
                  className="px-2.5 py-1 bg-vermillion text-white text-[11px] font-bold rounded-md hover:bg-vermillion-dark transition-colors cursor-pointer flex items-center gap-1"
                >
                  {sqlCopied ? <Check className="w-3 h-3" /> : null}
                  <span>{sqlCopied ? 'Copied SQL!' : 'Copy SQL'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-[10px] font-mono overflow-x-auto leading-relaxed border border-slate-800 max-h-32">
{`CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  loan_type TEXT,
  amount TEXT,
  city TEXT,
  status TEXT DEFAULT 'New',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
              </pre>
              <p className="text-[11px] text-slate-500 font-medium">
                Paste this into your <strong className="text-slate-900">Supabase SQL Editor</strong> to create the <code className="text-vermillion font-bold">leads</code> table.
              </p>
            </div>
          </div>
        </div>
      )}


      {/* Dashboard Statistics Widget Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border-2 border-slate-200 p-5 rounded-2xl">
            <p className="text-xs text-slate-500 font-bold">Total Leads</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalLeads}</p>
          </div>

          <div className="bg-white border-2 border-blue-200 p-5 rounded-2xl">
            <p className="text-xs text-blue-600 font-bold">New Enquiries</p>
            <p className="text-2xl font-black text-blue-700 mt-1">{stats.newToday || stats.totalLeads}</p>
          </div>

          <div className="bg-white border-2 border-purple-200 p-5 rounded-2xl">
            <p className="text-xs text-purple-600 font-bold">In Progress</p>
            <p className="text-2xl font-black text-purple-700 mt-1">{stats.inProgressLeads}</p>
          </div>

          <div className="bg-white border-2 border-emerald-200 p-5 rounded-2xl">
            <p className="text-xs text-emerald-600 font-bold">Approved Loans</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{stats.approvedLeads}</p>
          </div>

          <div className="bg-white border-2 border-vermillion-light p-5 rounded-2xl col-span-2 lg:col-span-1">
            <p className="text-xs text-vermillion font-bold">Approval Rate</p>
            <p className="text-2xl font-black text-vermillion mt-1">
              {stats.totalLeads > 0 ? Math.round((stats.approvedLeads / stats.totalLeads) * 100) : 0}%
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white border-2 border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, mobile or city..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-900 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category & Status Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <Filter className="w-3.5 h-3.5 text-vermillion" />
            <span>Filter:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 px-3 py-2.5 rounded-xl focus:outline-none focus:border-vermillion cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={loanTypeFilter}
            onChange={(e) => setLoanTypeFilter(e.target.value)}
            className="bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 px-3 py-2.5 rounded-xl focus:outline-none focus:border-vermillion cursor-pointer"
          >
            <option value="All">All Loan Types</option>
            <option value="Personal Loan">Personal Loan</option>
            <option value="Home Loan">Home Loan</option>
            <option value="Gold Loan">Gold Loan</option>
            <option value="Business Loan">Business Loan</option>
            <option value="Agriculture Loan">Agriculture Loan</option>
            <option value="Credit Card">Credit Card</option>
          </select>

          <button
            onClick={loadData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 cursor-pointer"
            title="Refresh Leads Table"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

      </div>

      {/* Main Leads Table */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-900 uppercase tracking-wider text-[11px] border-b-2 border-slate-200 font-extrabold">
              <tr>
                <th className="py-4 px-4">Applicant Name</th>
                <th className="py-4 px-4">Mobile Number</th>
                <th className="py-4 px-4">Loan Category</th>
                <th className="py-4 px-4">Amount / Location</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Date Submitted</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 px-4">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                        <Database className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800">
                          {search || statusFilter !== 'All' || loanTypeFilter !== 'All' 
                            ? 'No matching leads found' 
                            : 'No customer leads recorded yet'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {search || statusFilter !== 'All' || loanTypeFilter !== 'All'
                            ? 'Try changing your search keywords or filter dropdowns.'
                            : 'New customer applications submitted via the website forms will appear here in real time.'}
                        </p>
                      </div>
                      {!search && statusFilter === 'All' && loanTypeFilter === 'All' && (
                        <button
                          type="button"
                          onClick={() => setShowAddModal(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-vermillion hover:bg-vermillion-dark text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Manual Offline Lead</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Name */}
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-slate-900 text-sm">{lead.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{lead.id}</div>
                    </td>

                    {/* Mobile & Direct Actions */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 font-mono">{lead.mobile}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={`tel:${lead.mobile}`}
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-vermillion" /> Call
                        </a>
                        <a
                          href={`https://wa.me/91${lead.mobile}?text=Hello%20${encodeURIComponent(lead.name)},%20this%20is%20Basavakalyan%20Loan%20Services%20regarding%20your%20${encodeURIComponent(lead.loanType)}%20enquiry.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-600" /> WhatsApp
                        </a>
                      </div>
                    </td>

                    {/* Loan Category */}
                    <td className="py-4 px-4 font-extrabold text-vermillion">
                      {lead.loanType}
                    </td>

                    {/* Amount & City */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{lead.amount || 'Flexible'}</div>
                      <div className="text-[11px] text-slate-500">{lead.city || 'Basavakalyan'}</div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl border-2 focus:outline-none cursor-pointer ${getStatusBadge(lead.status)}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4 px-4 text-slate-500 font-medium text-[11px]">
                      {new Date(lead.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 cursor-pointer"
                        title="View / Edit Notes"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(lead.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl border border-red-200 cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View / Edit Notes Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900">
                Lead Notes & Follow-up Log
              </h3>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
              <p><strong className="text-slate-900">Name:</strong> {selectedLead.name}</p>
              <p><strong className="text-slate-900">Mobile:</strong> {selectedLead.mobile}</p>
              <p><strong className="text-vermillion">Loan:</strong> {selectedLead.loanType} ({selectedLead.amount})</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Admin Notes / Follow-up remarks
              </label>
              <textarea
                rows={4}
                value={selectedLead.notes || ''}
                onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
                placeholder="e.g. Called customer at 2 PM. Requested RTC pahani document for agriculture loan."
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200 cursor-pointer border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await apiService.updateLeadStatus(selectedLead.id, selectedLead.status, selectedLead.notes);
                  setSelectedLead(null);
                  loadData();
                }}
                className="px-4 py-2.5 bg-vermillion hover:bg-vermillion-dark text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lead Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 w-full max-w-md text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Delete Lead Entry?</h3>
            <p className="text-xs text-slate-600 font-medium">
              Are you sure you want to delete this lead record? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200 cursor-pointer border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLead(deleteConfirmId)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Manual Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900">Add Manual Lead Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualLead} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g. Rajkumar Patil"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={newLeadMobile}
                  onChange={(e) => setNewLeadMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="10 digit mobile"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Loan Category</label>
                <select
                  value={newLeadLoanType}
                  onChange={(e) => setNewLeadLoanType(e.target.value as LoanType)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                >
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Gold Loan">Gold Loan</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Agriculture Loan">Agriculture Loan</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Amount / Location</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newLeadAmount}
                    onChange={(e) => setNewLeadAmount(e.target.value)}
                    placeholder="e.g. ₹5,00,000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                  />
                  <input
                    type="text"
                    value={newLeadCity}
                    onChange={(e) => setNewLeadCity(e.target.value)}
                    placeholder="Basavakalyan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Initial Remark</label>
                <textarea
                  rows={2}
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  placeholder="Walk-in inquiry or phone call notes..."
                  className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200 cursor-pointer border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Admin PIN Modal */}
      {showPinChangeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900">Change Admin Security PIN</h3>
              <button onClick={() => setShowPinChangeModal(false)} className="text-slate-400 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePinSubmit} className="space-y-3">
              {pinChangeMsg.text && (
                <div className={`text-xs p-2.5 rounded-xl border ${
                  pinChangeMsg.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-700'
                }`}>
                  {pinChangeMsg.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Current PIN</label>
                <input
                  type="password"
                  required
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  placeholder="Enter current PIN (e.g. 1234)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">New Secret PIN</label>
                <input
                  type="password"
                  required
                  minLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Minimum 4 digits"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinChangeModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200 cursor-pointer border border-slate-200"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Update PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Account Credentials Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-vermillion" />
                <h3 className="text-base font-black text-slate-900">Admin Account Credentials</h3>
              </div>
              <button onClick={() => setShowAccountModal(false)} className="text-slate-400 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAccountSubmit} className="space-y-3">
              {accUpdateMsg && (
                <div className={`text-xs p-3 rounded-xl border flex items-center gap-2 ${
                  accUpdateMsg.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-700'
                }`}>
                  {accUpdateMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                  <span>{accUpdateMsg.text}</span>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1 text-slate-700">
                <p><strong>Registered Username:</strong> <span className="font-mono text-vermillion font-bold">{adminUsername || 'admin'}</span></p>
                <p><strong>Admin Email:</strong> <span className="font-mono text-slate-900">{adminEmail || 'Not set'}</span></p>
                <p className="text-[11px] text-slate-500">Only 1 slot is allocated. Update your details below:</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={currPass}
                  onChange={(e) => setCurrPass(e.target.value)}
                  placeholder="Enter current password to confirm changes"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">New Username (Optional)</label>
                <input
                  type="text"
                  value={newUsernameAcc}
                  onChange={(e) => setNewUsernameAcc(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">New Email Address (Optional)</label>
                <input
                  type="email"
                  value={newEmailAcc}
                  onChange={(e) => setNewEmailAcc(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">New Password (Optional)</label>
                <input
                  type="password"
                  value={newPassAcc}
                  onChange={(e) => setNewPassAcc(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200 cursor-pointer border border-slate-200"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
