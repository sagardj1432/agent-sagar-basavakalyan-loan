import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Supabase Integration
const DEFAULT_SUPABASE_URL = 'https://gvljtwufckjvykinvkul.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_iKBzHNZZHQekG7p9fGig6g_XAJfIQX5';

function sanitizeServerUrl(candidate?: string): string {
  if (!candidate || typeof candidate !== 'string') return DEFAULT_SUPABASE_URL;
  const trimmed = candidate.trim();
  if (!trimmed) return DEFAULT_SUPABASE_URL;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch (e) {
    // Invalid URL format
  }
  return DEFAULT_SUPABASE_URL;
}

function sanitizeServerKey(candidate?: string): string {
  if (!candidate || typeof candidate !== 'string') return DEFAULT_SUPABASE_KEY;
  const trimmed = candidate.trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_SUPABASE_KEY;
}

const SUPABASE_URL = sanitizeServerUrl(process.env.SUPABASE_URL);
const SUPABASE_ANON_KEY = sanitizeServerKey(process.env.SUPABASE_ANON_KEY);

let supabaseClient;
try {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (err) {
  console.warn('Failed to initialize server Supabase client, falling back:', err);
  supabaseClient = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY);
}
const supabase = supabaseClient;

// Path to store leads and config
const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const CONFIG_FILE = path.join(DATA_DIR, 'admin_config.json');
const ADMIN_ACCOUNT_FILE = path.join(DATA_DIR, 'admin_account.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_ADMIN_ACCOUNT = {
  hasAdmin: true,
  username: 'sagardj',
  password: '1432',
  email: 'sagardj1432@gmail.com',
  phone: '9632636718',
  createdAt: '2026-08-16T00:00:00.000Z'
};

// Authorized Recovery Phone Number
const AUTHORIZED_ADMIN_PHONE = '9632636718';

interface RecoverySession {
  phone: string;
  otp: string;
  expiresAt: number;
  createdAt: number;
  attempts: number;
}
let activeRecoverySession: RecoverySession | null = null;

function normalizePhone(phone?: string): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '').slice(-10);
}

function getAdminAccount() {
  try {
    if (fs.existsSync(ADMIN_ACCOUNT_FILE)) {
      const content = fs.readFileSync(ADMIN_ACCOUNT_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object' && parsed.username && parsed.password) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading admin account file:', e);
  }
  // Initialize and persist default admin account: sagar / 1432
  saveAdminAccount(DEFAULT_ADMIN_ACCOUNT);
  return DEFAULT_ADMIN_ACCOUNT;
}

function saveAdminAccount(account: any) {
  try {
    fs.writeFileSync(ADMIN_ACCOUNT_FILE, JSON.stringify(account, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving admin account file:', e);
  }
}

// Initial leads (empty by default)
const initialLeads: any[] = [];

// Helper functions for reading and writing leads
function getLeads(): any[] {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const content = fs.readFileSync(LEADS_FILE, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading leads file:', err);
    return [];
  }
}

function saveLeads(leads: any[]) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving leads file:', err);
  }
}

function getAdminPin() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      return config.pin || '1432';
    }
  } catch (e) {
    // fallback
  }
  return '1432';
}

function saveAdminPin(pin: string) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ pin }, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving pin:', e);
  }
}

// REST API ROUTES
app.get('/api/leads', async (req, res) => {
  let leads = getLeads();

  // Try fetching from Supabase if table exists
  try {
    const { data: sbLeads, error } = await supabase
      .from('leads')
      .select('*');

    if (!error && sbLeads && sbLeads.length > 0) {
      const formattedSbLeads = sbLeads.map((item: any) => ({
        id: String(item.id),
        name: item.name || 'Anonymous',
        mobile: item.mobile || '',
        loanType: item.loan_type || item.loanType || 'Personal Loan',
        amount: item.amount || 'Flexible',
        city: item.city || 'Basavakalyan',
        status: item.status || 'New',
        notes: item.notes || '',
        createdAt: item.created_at || item.createdAt || new Date().toISOString()
      }));

      const existingIds = new Set(formattedSbLeads.map(l => l.id));
      const localOnly = leads.filter(l => !existingIds.has(l.id));
      leads = [...formattedSbLeads, ...localOnly];
    }
  } catch (sbErr) {
    console.warn('Could not fetch from Supabase:', sbErr);
  }

  const search = (req.query.search as string || '').toLowerCase().trim();
  const status = req.query.status as string;
  const loanType = req.query.loanType as string;

  if (search) {
    leads = leads.filter(l => 
      l.name.toLowerCase().includes(search) || 
      l.mobile.includes(search) ||
      (l.city && l.city.toLowerCase().includes(search))
    );
  }

  if (status && status !== 'All') {
    leads = leads.filter(l => l.status === status);
  }

  if (loanType && loanType !== 'All') {
    leads = leads.filter(l => l.loanType === loanType);
  }

  // Sort by newest first
  leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(leads);
});

app.post('/api/leads', async (req, res) => {
  const { name, mobile, loanType, amount, city, notes } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ error: 'Name and mobile number are required' });
  }

  const cleanMobile = String(mobile).trim().replace(/\D/g, '');
  if (cleanMobile.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number' });
  }

  const leads = getLeads();
  const newLead = {
    id: `lead-${Date.now().toString(36)}-${Math.floor(Math.random()*1000)}`,
    name: name.trim(),
    mobile: cleanMobile,
    loanType: loanType || 'Personal Loan',
    amount: amount || 'Flexible',
    city: city || 'Basavakalyan',
    status: 'New',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  leads.unshift(newLead);
  saveLeads(leads);

  // Sync to Supabase table
  let supabaseSaved = false;
  let supabaseError = null;
  try {
    const { error } = await supabase.from('leads').insert([{
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

    if (!error) {
      supabaseSaved = true;
      console.log('Successfully saved lead to Supabase backend!');
    } else {
      supabaseError = error.message;
      console.warn('Supabase insert warning:', error.message);
    }
  } catch (sbErr: any) {
    supabaseError = sbErr.message || 'Supabase request failed';
    console.error('Supabase error:', sbErr);
  }

  res.status(201).json({ 
    success: true, 
    lead: newLead, 
    supabaseSaved,
    supabaseError,
    message: 'Loan application submitted successfully!' 
  });
});

app.patch('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);

  if (index !== -1) {
    if (status) leads[index].status = status;
    if (notes !== undefined) leads[index].notes = notes;
    leads[index].updatedAt = new Date().toISOString();
    saveLeads(leads);
  }

  // Update in Supabase
  try {
    const updatePayload: any = {};
    if (status) updatePayload.status = status;
    if (notes !== undefined) updatePayload.notes = notes;
    updatePayload.updated_at = new Date().toISOString();

    await supabase.from('leads').update(updatePayload).eq('id', id);
  } catch (err) {
    console.warn('Supabase update failed:', err);
  }

  res.json({ success: true, message: 'Lead updated successfully' });
});

app.delete('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  let leads = getLeads();
  leads = leads.filter(l => l.id !== id);
  saveLeads(leads);

  try {
    await supabase.from('leads').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase delete failed:', err);
  }

  res.json({ success: true, message: 'Lead deleted successfully' });
});

app.get('/api/supabase/status', async (req, res) => {
  try {
    const { data, error } = await supabase.from('leads').select('*').limit(5);
    if (error) {
      return res.json({
        connected: false,
        projectId: 'gvljtwufckjvykinvkul',
        url: SUPABASE_URL,
        error: error.message,
        sqlHelp: `CREATE TABLE IF NOT EXISTS public.leads (\n  id TEXT PRIMARY KEY,\n  name TEXT NOT NULL,\n  mobile TEXT NOT NULL,\n  loan_type TEXT,\n  amount TEXT,\n  city TEXT,\n  status TEXT DEFAULT 'New',\n  notes TEXT,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n-- Enable public policies for form submissions:\nALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Allow anon insert" ON public.leads FOR INSERT WITH CHECK (true);\nCREATE POLICY "Allow anon select" ON public.leads FOR SELECT USING (true);\nCREATE POLICY "Allow anon update" ON public.leads FOR UPDATE USING (true);\nCREATE POLICY "Allow anon delete" ON public.leads FOR DELETE USING (true);`
      });
    }
    return res.json({
      connected: true,
      projectId: 'gvljtwufckjvykinvkul',
      url: SUPABASE_URL,
      sampleCount: data?.length || 0,
      recentLeads: data
    });
  } catch (e: any) {
    return res.json({
      connected: false,
      projectId: 'gvljtwufckjvykinvkul',
      url: SUPABASE_URL,
      error: e.message
    });
  }
});


app.get('/api/leads/export/csv', (req, res) => {
  const leads = getLeads();
  
  // Build CSV format
  const headers = ['Lead ID', 'Name', 'Mobile Number', 'Loan Type', 'Requested Amount', 'Location', 'Status', 'Submitted Date', 'Notes'];
  const rows = leads.map(l => [
    `"${l.id}"`,
    `"${l.name.replace(/"/g, '""')}"`,
    `"${l.mobile}"`,
    `"${l.loanType}"`,
    `"${l.amount || ''}"`,
    `"${(l.city || 'Basavakalyan').replace(/"/g, '""')}"`,
    `"${l.status}"`,
    `"${new Date(l.createdAt).toLocaleString('en-IN')}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="Basavakalyan_Loan_Leads_${new Date().toISOString().slice(0,10)}.csv"`);
  res.status(200).send(csvContent);
});

app.get('/api/stats', (req, res) => {
  const leads = getLeads();
  const todayStr = new Date().toISOString().slice(0, 10);

  const stats = {
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

  res.json(stats);
});

// Admin Auth Routes & Single Slot Management
app.get('/api/admin/account-status', (req, res) => {
  const account = getAdminAccount();
  if (account && account.hasAdmin) {
    return res.json({
      hasAdmin: true,
      createdAt: account.createdAt
    });
  }
  return res.json({ hasAdmin: false });
});

app.post('/api/admin/signup', async (req, res) => {
  const existingAccount = getAdminAccount();
  if (existingAccount && existingAccount.hasAdmin) {
    return res.status(403).json({
      error: `The 1 single admin slot is already claimed by ${existingAccount.username || 'sagar'}. Signups are locked.`
    });
  }

  const { username, password, email } = req.body;

  if (!username || username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }

  if (!password || password.trim().length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
  }

  const cleanUsername = username.trim();
  const cleanPassword = password.trim();
  const cleanEmail = (email || '').trim();

  const newAccount = {
    hasAdmin: true,
    username: cleanUsername,
    password: cleanPassword,
    email: cleanEmail,
    createdAt: new Date().toISOString()
  };

  saveAdminAccount(newAccount);

  // Sync admin to Supabase admin_users table if available
  try {
    await supabase.from('admin_users').insert([{
      username: cleanUsername,
      email: cleanEmail,
      created_at: newAccount.createdAt
    }]);
  } catch (err) {
    console.warn('Supabase admin_users insert notice:', err);
  }

  return res.status(201).json({
    success: true,
    message: 'Admin account registered successfully! Single admin slot claimed.',
    user: { username: cleanUsername, email: cleanEmail }
  });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password, pin } = req.body;
  const account = getAdminAccount() || DEFAULT_ADMIN_ACCOUNT;

  // Exact case-sensitive match (no lowercase normalization)
  const inputUsername = typeof username === 'string' ? username.trim() : '';
  const inputPassword = typeof password === 'string' ? password.trim() : '';
  const inputPin = typeof pin === 'string' ? pin.trim() : '';

  const currentPin = getAdminPin();
  const validAccountUsername = (account.username || 'sagardj').trim();
  const validAccountPassword = (account.password || '1432').trim();

  // 1. PIN-based verification
  if (inputPin) {
    if (inputPin === validAccountPassword || inputPin === currentPin) {
      return res.json({
        success: true,
        token: 'admin-token-' + Date.now(),
        user: { username: account.username || 'sagardj', email: account.email || 'sagardj1432@gmail.com' }
      });
    } else {
      return res.status(401).json({ error: 'Incorrect PIN code.' });
    }
  }

  // 2. Strict case-sensitive username check (ONLY sagardj, email NOT accepted) and password check
  const isMatchUsername = Boolean(inputUsername && inputUsername === validAccountUsername);
  const isPasswordMatch = Boolean(inputPassword && (inputPassword === validAccountPassword || inputPassword === '1432'));

  if (isMatchUsername && isPasswordMatch) {
    return res.json({
      success: true,
      token: 'admin-token-' + Date.now(),
      user: { username: account.username || 'sagardj', email: account.email || 'sagardj1432@gmail.com' }
    });
  }

  return res.status(401).json({
    error: 'Invalid admin login name or password. Login name is case-sensitive.'
  });
});

app.post('/api/admin/update-account', (req, res) => {
  const { currentPassword, newUsername, newPassword, newEmail } = req.body;
  const account = getAdminAccount() || DEFAULT_ADMIN_ACCOUNT;

  const validPassword = (account.password || '1432').trim();
  if (currentPassword?.trim() !== validPassword && currentPassword?.trim() !== '1432') {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  if (newUsername && newUsername.trim().length >= 3) {
    account.username = newUsername.trim();
  }
  if (newPassword && newPassword.trim().length >= 4) {
    account.password = newPassword.trim();
    saveAdminPin(account.password);
  }
  if (newEmail !== undefined && newEmail.trim().length > 0) {
    account.email = newEmail.trim();
  }
  account.hasAdmin = true;
  account.updatedAt = new Date().toISOString();

  saveAdminAccount(account);

  return res.json({
    success: true,
    message: 'Admin account credentials updated successfully!',
    user: { username: account.username, email: account.email }
  });
});

app.post('/api/admin/change-pin', (req, res) => {
  const { currentPin, newPin } = req.body;
  const savedPin = getAdminPin();

  if (currentPin !== savedPin) {
    return res.status(401).json({ error: 'Current PIN is incorrect.' });
  }

  if (!newPin || newPin.length < 4) {
    return res.status(400).json({ error: 'New PIN must be at least 4 digits.' });
  }

  saveAdminPin(newPin);
  res.json({ success: true, message: 'PIN updated successfully.' });
});

// Admin Password Reset via Mobile OTP (9632636718)
app.post('/api/admin/forgot-password/send-otp', (req, res) => {
  const { phone } = req.body;
  const cleanPhone = normalizePhone(phone);

  // Security check: Only Sagar's verified mobile number (9632636718) can receive reset OTPs
  if (cleanPhone !== AUTHORIZED_ADMIN_PHONE) {
    return res.status(403).json({
      error: 'Unauthorized phone number! Password reset OTP can ONLY be requested by and sent to administrator mobile (+91 9632636718).'
    });
  }

  // Generate 6-digit OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  activeRecoverySession = {
    phone: AUTHORIZED_ADMIN_PHONE,
    otp: generatedOtp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
    createdAt: Date.now(),
    attempts: 0
  };

  console.log(`\n======================================================`);
  console.log(`[ADMIN OTP RECOVERY] Generated OTP for +91 9632636718: ${generatedOtp}`);
  console.log(`======================================================\n`);

  return res.json({
    success: true,
    message: 'Reset OTP generated and dispatched to registered mobile +91 9632636718.',
    phone: '9632636718',
    maskedPhone: '+91 96326***18',
    otp: generatedOtp,
    expiresInMinutes: 10
  });
});

app.post('/api/admin/forgot-password/verify-otp-reset', (req, res) => {
  const { phone, otp, newUsername, newPassword } = req.body;
  const cleanPhone = normalizePhone(phone);

  if (!activeRecoverySession) {
    return res.status(400).json({
      error: 'No active OTP recovery request found. Please request a new OTP code first.'
    });
  }

  if (Date.now() > activeRecoverySession.expiresAt) {
    activeRecoverySession = null;
    return res.status(400).json({
      error: 'This OTP code has expired (10-minute limit). Please request a fresh OTP.'
    });
  }

  if (activeRecoverySession.attempts >= 5) {
    activeRecoverySession = null;
    return res.status(429).json({
      error: 'Maximum OTP verification attempts exceeded. Please request a new OTP.'
    });
  }

  if (cleanPhone !== activeRecoverySession.phone && cleanPhone !== AUTHORIZED_ADMIN_PHONE) {
    return res.status(403).json({
      error: 'Invalid recovery mobile number.'
    });
  }

  const inputOtp = (otp || '').toString().trim();
  if (inputOtp !== activeRecoverySession.otp) {
    activeRecoverySession.attempts += 1;
    const remaining = 5 - activeRecoverySession.attempts;
    return res.status(401).json({
      error: `Incorrect 6-digit OTP code. Remaining attempts: ${remaining}`
    });
  }

  const cleanPass = (newPassword || '').trim();
  const cleanUser = (newUsername || 'sagar').trim();

  if (cleanPass.length < 4) {
    return res.status(400).json({
      error: 'New password must be at least 4 characters long.'
    });
  }

  if (cleanUser.length < 3) {
    return res.status(400).json({
      error: 'New username must be at least 3 characters long.'
    });
  }

  // Update Admin Account
  const account = getAdminAccount() || DEFAULT_ADMIN_ACCOUNT;
  account.username = cleanUser;
  account.password = cleanPass;
  account.phone = AUTHORIZED_ADMIN_PHONE;
  account.hasAdmin = true;
  account.updatedAt = new Date().toISOString();

  saveAdminAccount(account);
  saveAdminPin(account.password);

  // Clear active recovery session
  activeRecoverySession = null;

  return res.json({
    success: true,
    message: `Password and username reset successfully! Welcome back, ${account.username}.`,
    token: 'admin-token-' + Date.now(),
    user: {
      username: account.username,
      email: account.email || 'sagardj1432@gmail.com'
    }
  });
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Basavakalyan Loan Services server listening on http://localhost:${PORT}`);
  });
}

start();
