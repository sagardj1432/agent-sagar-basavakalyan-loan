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

function getAdminAccount() {
  try {
    if (fs.existsSync(ADMIN_ACCOUNT_FILE)) {
      const content = fs.readFileSync(ADMIN_ACCOUNT_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading admin account file:', e);
  }
  return null;
}

function saveAdminAccount(account: any) {
  try {
    fs.writeFileSync(ADMIN_ACCOUNT_FILE, JSON.stringify(account, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving admin account file:', e);
  }
}

// Initial seed leads if file doesn't exist
const initialLeads = [
  {
    id: 'lead-1001',
    name: 'Basavaraj Patil',
    mobile: '9845123456',
    loanType: 'Personal Loan',
    amount: '₹3,00,000',
    city: 'Basavakalyan',
    status: 'New',
    notes: 'Urgent medical cash requirement. Called today at 10 AM.',
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
    notes: 'Kisan Credit Card renewal and tractor loan inquiry. RTC pahani submitted.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'lead-1003',
    name: 'Anil Kumar Shopping Mart',
    mobile: '9980554411',
    loanType: 'Business Loan',
    amount: '₹10,00,000',
    city: 'Basavakalyan Main Bazar',
    status: 'Contacted',
    notes: 'Looking for shop inventory expansion ahead of festival season.',
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
    notes: 'Jewelry valuation completed. Disbursed spot cash.',
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
    notes: 'Plot estimation submitted. Waiting for legal clear title certificate.',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString()
  }
];

// Helper functions for reading and writing leads
function getLeads() {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(initialLeads, null, 2), 'utf8');
      return initialLeads;
    }
    const content = fs.readFileSync(LEADS_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading leads file:', err);
    return initialLeads;
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
      return config.pin || '1234';
    }
  } catch (e) {
    // fallback
  }
  return '1234';
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
      username: account.username,
      email: account.email || '',
      createdAt: account.createdAt
    });
  }
  return res.json({ hasAdmin: false });
});

app.post('/api/admin/signup', async (req, res) => {
  const existingAccount = getAdminAccount();
  if (existingAccount && existingAccount.hasAdmin) {
    return res.status(403).json({
      error: 'Admin account slot is already claimed! Only 1 admin account is allowed. Nobody else can sign up.'
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
  const account = getAdminAccount();

  // If an admin account has been created
  if (account && account.hasAdmin) {
    const inputIdentifier = (username || '').trim().toLowerCase();
    const inputPassword = (password || '').trim();

    const isMatchUsername = inputIdentifier === account.username.toLowerCase();
    const isMatchEmail = account.email && inputIdentifier === account.email.toLowerCase();
    const isMatchPassword = inputPassword === account.password;

    if ((isMatchUsername || isMatchEmail) && isMatchPassword) {
      return res.json({
        success: true,
        token: 'admin-token-' + Date.now(),
        user: { username: account.username, email: account.email }
      });
    } else {
      return res.status(401).json({ error: 'Invalid username/email or password.' });
    }
  }

  // Fallback if no admin account created yet: check default PIN or 'admin' / '1234'
  const currentPin = getAdminPin();
  if (
    (pin && pin === currentPin) || 
    (username === 'admin' && (password === currentPin || password === '1234')) ||
    (password === currentPin)
  ) {
    return res.json({
      success: true,
      token: 'admin-secret-token-' + Date.now(),
      user: { username: 'Admin (Slot Unclaimed)', email: '' },
      needsAccountSetup: true
    });
  }

  return res.status(401).json({
    error: 'Invalid credentials. No admin account has been created yet. Please use the Signup tab to create your admin account.'
  });
});

app.post('/api/admin/update-account', (req, res) => {
  const { currentPassword, newUsername, newPassword, newEmail } = req.body;
  const account = getAdminAccount();

  if (!account || !account.hasAdmin) {
    return res.status(400).json({ error: 'No admin account exists yet.' });
  }

  if (account.password !== currentPassword) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  if (newUsername) account.username = newUsername.trim();
  if (newPassword) account.password = newPassword.trim();
  if (newEmail !== undefined) account.email = newEmail.trim();
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
