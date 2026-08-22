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
const DYNAMIC_CONFIG_FILE = path.join(DATA_DIR, 'rates_config.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const LOCAL_ADS_FILE = path.join(DATA_DIR, 'local_ads.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default Dynamic Rates & Config
const DEFAULT_DYNAMIC_CONFIG = {
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
    { bankName: 'State Bank of India (SBI)', category: 'Home Loan', minRate: 8.40, maxTenureYears: 30, processingFee: '0.25% (Concessional)', branchInBasavakalyan: 'Main Road & Shivaji Chowk', specialFeature: 'PMAY Subsidy direct credit' },
    { bankName: 'Canara Bank', category: 'Agriculture Loan', minRate: 7.00, maxTenureYears: 5, processingFee: 'Nil for KCC', branchInBasavakalyan: 'Basavakalyan Market Branch', specialFeature: 'Kisan Credit Card instant limit' },
    { bankName: 'HDFC Bank', category: 'Personal Loan', minRate: 10.50, maxTenureYears: 5, processingFee: '1.5%', branchInBasavakalyan: 'Bus Stand Road', specialFeature: 'Paperless 10-second sanction for pre-approved' },
    { bankName: 'ICICI Bank', category: 'Business Loan', minRate: 11.50, maxTenureYears: 5, processingFee: '1.0%', branchInBasavakalyan: 'Station Road', specialFeature: 'Unsecured working capital line' },
    { bankName: 'Karnataka Gramin Bank (PKGB)', category: 'Gold Loan', minRate: 9.00, maxTenureYears: 2, processingFee: '₹250 Flat', branchInBasavakalyan: 'Fort Area & Sasur Galli', specialFeature: 'Highest valuation per gram' },
    { bankName: 'Union Bank of India', category: 'Vehicle Loan', minRate: 8.75, maxTenureYears: 7, processingFee: '0.50%', branchInBasavakalyan: 'Near Gandhi Chowk', specialFeature: 'Up to 90% on-road financing' },
    { bankName: 'Bank of Baroda', category: 'Mortgage Loan', minRate: 9.25, maxTenureYears: 15, processingFee: '0.50%', branchInBasavakalyan: 'Basavakalyan Town', specialFeature: 'Plot & Commercial property accepted' }
  ],
  lastUpdated: new Date().toISOString()
};

function getDynamicConfig() {
  try {
    if (fs.existsSync(DYNAMIC_CONFIG_FILE)) {
      const content = fs.readFileSync(DYNAMIC_CONFIG_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_DYNAMIC_CONFIG, ...parsed };
      }
    }
  } catch (e) {
    console.error('Error reading dynamic config:', e);
  }
  saveDynamicConfig(DEFAULT_DYNAMIC_CONFIG);
  return DEFAULT_DYNAMIC_CONFIG;
}

function saveDynamicConfig(config: any) {
  try {
    fs.writeFileSync(DYNAMIC_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving dynamic config:', e);
  }
}

// Initial Verified Reviews for Basavakalyan
const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Basavaraj Patil',
    location: 'Shivaji Nagar, Basavakalyan',
    loanType: 'Home Loan',
    rating: 5,
    comment: 'Agent Sagar helped me get my SBI Home Loan sanction of ₹28 Lakhs within 6 days. Very transparent, zero hidden charges and local assistance right at my doorstep!',
    amount: '₹28,00,000',
    date: '2026-08-10',
    verified: true,
    isApproved: true
  },
  {
    id: 'rev-2',
    name: 'Santosh Biradar',
    location: 'Main Market, Basavakalyan',
    loanType: 'Business Loan',
    rating: 5,
    comment: 'Got ₹12 Lakhs unsecured business loan for my wholesale shop without any running around. Sagar took care of all the paperwork and bank coordination.',
    amount: '₹12,00,000',
    date: '2026-08-04',
    verified: true,
    isApproved: true
  },
  {
    id: 'rev-3',
    name: 'Anand Kumar Swamy',
    location: 'Fort Road, Basavakalyan',
    loanType: 'Gold Loan',
    rating: 5,
    comment: 'Needed urgent cash for medical emergency. Sagar arranged spot gold loan disbursement at highest per-gram valuation in 20 minutes.',
    amount: '₹4,50,000',
    date: '2026-07-28',
    verified: true,
    isApproved: true
  },
  {
    id: 'rev-4',
    name: 'Mahadevappa Kulkarni',
    location: 'Humnabad Road, Basavakalyan',
    loanType: 'Agriculture Loan',
    rating: 5,
    comment: 'Tractor and crop enhancement loan processed smoothly. Best loan guidance in Basavakalyan taluka.',
    amount: '₹7,50,000',
    date: '2026-07-15',
    verified: true,
    isApproved: true
  }
];

function getReviews(): any[] {
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      const content = fs.readFileSync(REVIEWS_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading reviews file:', e);
  }
  saveReviews(DEFAULT_REVIEWS);
  return DEFAULT_REVIEWS;
}

function saveReviews(reviews: any[]) {
  try {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving reviews file:', e);
  }
}

// Initial Local Area Ads for Basavakalyan (Admin Posted & Verified with Rich Media & Video Tours)
const DEFAULT_LOCAL_ADS = [
  {
    id: 'ad-1',
    title: 'Prime 1,200 sq.ft Residential Plot near Shivaji Chowk - Clear Title',
    category: 'Real Estate & Plots',
    area: 'Shivaji Chowk, Basavakalyan',
    priceOrOffer: '₹18.5 Lakhs (Negotiable)',
    contactPhone: '9632636718',
    whatsappPhone: '9632636718',
    description: 'Corner residential plot with 30ft wide tar road approach, Gram Panchayat / Town Planning approval. Complete legal verification done. 80% SBI / Canara Bank home construction loan available with Agent Sagar.',
    badge: 'HOT DEAL',
    postedBy: 'Agent Sagar (Verified Admin)',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    mediaType: 'both',
    isActive: true,
    createdAt: '2026-08-18T10:00:00.000Z'
  },
  {
    id: 'ad-2',
    title: 'Mahindra 575 DI Tractor with Rotavator (2023 Model) - Urgent Sale',
    category: 'Vehicles & Machinery',
    area: 'Humnabad Road, Basavakalyan',
    priceOrOffer: '₹4.80 Lakhs',
    contactPhone: '9632636718',
    whatsappPhone: '9632636718',
    description: 'Single owner, pristine running condition, 42 HP power with power steering. Agriculture tractor loan refinancing can be arranged on the spot with minimum down payment.',
    badge: 'URGENT SALE',
    postedBy: 'Agent Sagar (Verified Admin)',
    imageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=1200&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    mediaType: 'both',
    isActive: true,
    createdAt: '2026-08-16T14:30:00.000Z'
  },
  {
    id: 'ad-3',
    title: 'Commercial Wholesale & Retail Shop Space for Lease in Main Market',
    category: 'Business & Shop Offers',
    area: 'Main Market Road, Basavakalyan',
    priceOrOffer: '₹14,000 / month',
    contactPhone: '9632636718',
    whatsappPhone: '9632636718',
    description: '350 sq.ft ground floor prime commercial shop facing main bazaar. Ideal for textile, jewellery, grocery or electronics business. Unsecured business loan assistance provided.',
    badge: 'EXCLUSIVE',
    postedBy: 'Agent Sagar (Verified Admin)',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    mediaType: 'both',
    isActive: true,
    createdAt: '2026-08-14T09:15:00.000Z'
  },
  {
    id: 'ad-4',
    title: 'Exclusive Gold Loan Spot Mela: Highest Per-Gram Valuation in Basavakalyan',
    category: 'Loan & Finance Melas',
    area: 'Near Reliance Mart & Fort Road',
    priceOrOffer: '0.75% / Month (Instant Cash)',
    contactPhone: '9632636718',
    whatsappPhone: '9632636718',
    description: 'Get instant cash against gold jewellery in just 15 minutes. Free safe locker appraisal, no hidden charges, and lowest interest rates compared to local financiers in Basavakalyan.',
    badge: 'LIMITED TIME',
    postedBy: 'Agent Sagar (Verified Admin)',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    mediaType: 'both',
    isActive: true,
    createdAt: '2026-08-20T08:00:00.000Z'
  },
  {
    id: 'ad-5',
    title: '2.5 Acres Agricultural Fertile Land with Borewell near Tripurant Lake',
    category: 'Agriculture & Seeds',
    area: 'Tripurant, Basavakalyan Taluka',
    priceOrOffer: '₹16 Lakhs / Acre',
    contactPhone: '9632636718',
    whatsappPhone: '9632636718',
    description: 'Black cotton fertile soil suitable for sugarcane, soyabean and horticulture. Good road connectivity and working borewell. Agriculture land purchase loan support available.',
    badge: 'VERIFIED LOCAL',
    postedBy: 'Agent Sagar (Verified Admin)',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    mediaType: 'both',
    isActive: true,
    createdAt: '2026-08-12T11:20:00.000Z'
  }
];

function getLocalAds(): any[] {
  try {
    if (fs.existsSync(LOCAL_ADS_FILE)) {
      const content = fs.readFileSync(LOCAL_ADS_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading local ads file:', e);
  }
  saveLocalAds(DEFAULT_LOCAL_ADS);
  return DEFAULT_LOCAL_ADS;
}

function saveLocalAds(ads: any[]) {
  try {
    fs.writeFileSync(LOCAL_ADS_FILE, JSON.stringify(ads, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving local ads file:', e);
  }
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

// DYNAMIC CONFIG & RATES ENDPOINTS
app.get('/api/dynamic-config', (req, res) => {
  const config = getDynamicConfig();
  res.json(config);
});

app.post('/api/dynamic-config', (req, res) => {
  const current = getDynamicConfig();
  const updated = {
    ...current,
    ...req.body,
    lastUpdated: new Date().toISOString()
  };
  saveDynamicConfig(updated);
  res.json({ success: true, config: updated, message: 'Dynamic rates and configuration updated!' });
});

// REAL-TIME APPLICATION STATUS TRACKER ENDPOINT
app.get('/api/leads/track', async (req, res) => {
  const query = ((req.query.query as string) || '').trim();
  if (!query) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number or Lead ID.' });
  }

  const cleanQuery = query.replace(/\D/g, '');
  let leads = getLeads();

  // Also check Supabase
  try {
    const { data: sbLeads, error } = await supabase.from('leads').select('*');
    if (!error && sbLeads && sbLeads.length > 0) {
      const formatted = sbLeads.map((item: any) => ({
        id: String(item.id),
        name: item.name || 'Applicant',
        mobile: item.mobile || '',
        loanType: item.loan_type || item.loanType || 'Personal Loan',
        amount: item.amount || 'Flexible',
        city: item.city || 'Basavakalyan',
        status: item.status || 'New',
        notes: item.notes || '',
        createdAt: item.created_at || item.createdAt || new Date().toISOString()
      }));
      const existingIds = new Set(formatted.map(l => l.id));
      const localOnly = leads.filter(l => !existingIds.has(l.id));
      leads = [...formatted, ...localOnly];
    }
  } catch (err) {}

  // Match by mobile or ID
  const matched = leads.filter(l => 
    l.id.toLowerCase() === query.toLowerCase() ||
    (cleanQuery.length >= 10 && l.mobile.replace(/\D/g, '').endsWith(cleanQuery.slice(-10)))
  );

  if (matched.length === 0) {
    return res.status(404).json({ 
      found: false, 
      message: 'No loan applications found matching this mobile number or ID. Please check or submit a new enquiry.' 
    });
  }

  // Mask mobile and name for privacy
  const sanitized = matched.map(m => {
    const mobileDigits = m.mobile.replace(/\D/g, '');
    const maskedMobile = mobileDigits.length >= 10 
      ? `+91 ${mobileDigits.slice(0, 3)}****${mobileDigits.slice(-3)}`
      : m.mobile;
    
    // Compute stage index (1 to 5)
    let stage = 1;
    let stageTitle = 'Application Received';
    let stageDesc = 'Your loan enquiry has been registered and assigned to local advisor Agent Sagar in Basavakalyan.';
    
    if (m.status === 'Contacted') {
      stage = 2;
      stageTitle = 'Initial KYC & Document Verification';
      stageDesc = 'Advisor Sagar is reviewing Aadhaar, PAN, and income papers for bank eligibility.';
    } else if (m.status === 'In Progress') {
      stage = 3;
      stageTitle = 'Submitted to Partner Bank in Basavakalyan';
      stageDesc = 'Application is actively under review at bank credit desk with field evaluation.';
    } else if (m.status === 'Approved') {
      stage = 4;
      stageTitle = 'Loan Sanctioned / Ready for Disbursement';
      stageDesc = 'Congratulations! Sanction letter issued. Funds disbursement to bank account is in process.';
    } else if (m.status === 'Rejected') {
      stage = 0;
      stageTitle = 'Review Complete (Additional Documents Needed)';
      stageDesc = 'Needs alternative co-applicant or updated ITR. Contact Agent Sagar for re-application options.';
    }

    return {
      id: m.id,
      applicantName: m.name,
      maskedMobile,
      loanType: m.loanType,
      amount: m.amount || 'Flexible',
      status: m.status,
      stage,
      stageTitle,
      stageDesc,
      appliedDate: m.createdAt,
      assignedOfficer: 'Agent Sagar (+91 96326 36718)',
      officeLocation: 'Near Reliance Mart, Basavakalyan'
    };
  });

  res.json({ found: true, count: sanitized.length, applications: sanitized });
});

// DYNAMIC REVIEWS ENDPOINTS
app.get('/api/reviews', (req, res) => {
  const reviews = getReviews();
  const loanType = req.query.loanType as string;
  let filtered = reviews.filter(r => r.isApproved !== false);
  if (loanType && loanType !== 'All') {
    filtered = filtered.filter(r => r.loanType === loanType);
  }
  res.json(filtered);
});

app.post('/api/reviews', (req, res) => {
  const { name, location, loanType, rating, comment, amount } = req.body;
  if (!name || !comment) {
    return res.status(400).json({ error: 'Name and review comment are required.' });
  }

  const reviews = getReviews();
  const newReview = {
    id: `rev-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    location: location?.trim() || 'Basavakalyan',
    loanType: loanType || 'Personal Loan',
    rating: Number(rating) || 5,
    comment: comment.trim(),
    amount: amount ? `₹${amount.replace(/[^0-9,.]/g, '')}` : undefined,
    date: new Date().toISOString().split('T')[0],
    verified: true,
    isApproved: true
  };

  reviews.unshift(newReview);
  saveReviews(reviews);

  res.status(201).json({ success: true, review: newReview, message: 'Thank you! Your verified review has been published.' });
});

app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  let reviews = getReviews();
  reviews = reviews.filter(r => r.id !== id);
  saveReviews(reviews);
  res.json({ success: true, message: 'Review deleted successfully' });
});

// LOCAL MARKET ADS & CLASSIFIEDS ENDPOINTS (Admin Sagar Controlled)
app.get('/api/local-ads', (req, res) => {
  const ads = getLocalAds();
  const showAll = req.query.all === 'true';
  const category = req.query.category as string;
  const search = (req.query.search as string || '').toLowerCase().trim();
  const area = (req.query.area as string || '').toLowerCase().trim();

  let filtered = showAll ? ads : ads.filter(a => a.isActive !== false);

  if (category && category !== 'All') {
    filtered = filtered.filter(a => a.category === category);
  }

  if (search) {
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(search) ||
      a.description.toLowerCase().includes(search) ||
      a.area.toLowerCase().includes(search) ||
      (a.priceOrOffer && a.priceOrOffer.toLowerCase().includes(search))
    );
  }

  if (area) {
    filtered = filtered.filter(a => a.area.toLowerCase().includes(area));
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(filtered);
});

// Helper to verify admin authorization for ad modifications
function verifyAdminAuth(req: express.Request): boolean {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-token'] || req.headers['x-admin-password'];
  const account = getAdminAccount() || DEFAULT_ADMIN_ACCOUNT;
  const adminPass = (account.password || '1432').trim();
  const adminPin = getAdminPin();

  if (!authHeader) {
    // Also check body for password or token
    const bodyToken = req.body?.adminToken || req.body?.adminPassword;
    if (bodyToken && (bodyToken === adminPass || bodyToken === adminPin || String(bodyToken).startsWith('admin-token-'))) {
      return true;
    }
    return false;
  }

  const tokenStr = String(authHeader).replace('Bearer ', '').trim();
  if (tokenStr.startsWith('admin-token-') || tokenStr === adminPass || tokenStr === adminPin) {
    return true;
  }
  return false;
}

app.post('/api/local-ads', (req, res) => {
  // Enforce admin permission: Only Agent Sagar can post local ads
  if (!verifyAdminAuth(req)) {
    return res.status(403).json({
      error: 'Permission Denied: Only authenticated Administrator (Agent Sagar) can post local area advertisements.'
    });
  }

  const { title, category, area, priceOrOffer, contactPhone, whatsappPhone, description, badge, imageUrl, videoUrl, mediaType, isActive } = req.body;

  if (!title || !description || !area) {
    return res.status(400).json({ error: 'Title, local area, and description are required for posting an ad.' });
  }

  const ads = getLocalAds();
  const newAd = {
    id: `ad-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
    title: title.trim(),
    category: category || 'Real Estate & Plots',
    area: area.trim(),
    priceOrOffer: priceOrOffer ? priceOrOffer.trim() : undefined,
    contactPhone: (contactPhone || '9632636718').replace(/\D/g, ''),
    whatsappPhone: (whatsappPhone || contactPhone || '9632636718').replace(/\D/g, ''),
    description: description.trim(),
    badge: badge ? badge.trim() : 'VERIFIED LOCAL',
    postedBy: 'Agent Sagar (Verified Admin)',
    imageUrl: imageUrl?.trim() || undefined,
    videoUrl: videoUrl?.trim() || undefined,
    mediaType: mediaType || (videoUrl ? 'both' : 'image'),
    isActive: isActive !== false,
    createdAt: new Date().toISOString()
  };

  ads.unshift(newAd);
  saveLocalAds(ads);

  res.status(201).json({
    success: true,
    ad: newAd,
    message: 'Local area advertisement published successfully in Live Market!'
  });
});

app.put('/api/local-ads/:id', (req, res) => {
  if (!verifyAdminAuth(req)) {
    return res.status(403).json({ error: 'Permission Denied: Only authenticated Admin can update local ads.' });
  }

  const { id } = req.params;
  const ads = getLocalAds();
  const index = ads.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Local ad not found.' });
  }

  const existing = ads[index];
  const { title, category, area, priceOrOffer, contactPhone, whatsappPhone, description, badge, imageUrl, videoUrl, mediaType, isActive } = req.body;

  ads[index] = {
    ...existing,
    title: title !== undefined ? title.trim() : existing.title,
    category: category !== undefined ? category : existing.category,
    area: area !== undefined ? area.trim() : existing.area,
    priceOrOffer: priceOrOffer !== undefined ? priceOrOffer.trim() : existing.priceOrOffer,
    contactPhone: contactPhone !== undefined ? contactPhone.replace(/\D/g, '') : existing.contactPhone,
    whatsappPhone: whatsappPhone !== undefined ? whatsappPhone.replace(/\D/g, '') : existing.whatsappPhone,
    description: description !== undefined ? description.trim() : existing.description,
    badge: badge !== undefined ? badge.trim() : existing.badge,
    imageUrl: imageUrl !== undefined ? imageUrl.trim() : existing.imageUrl,
    videoUrl: videoUrl !== undefined ? videoUrl.trim() : existing.videoUrl,
    mediaType: mediaType !== undefined ? mediaType : existing.mediaType,
    isActive: isActive !== undefined ? isActive : existing.isActive,
    updatedAt: new Date().toISOString()
  };

  saveLocalAds(ads);

  res.json({
    success: true,
    ad: ads[index],
    message: 'Local ad updated successfully.'
  });
});

app.patch('/api/local-ads/:id/toggle', (req, res) => {
  if (!verifyAdminAuth(req)) {
    return res.status(403).json({ error: 'Permission Denied: Only authenticated Admin can toggle ad status.' });
  }

  const { id } = req.params;
  const ads = getLocalAds();
  const index = ads.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Local ad not found.' });
  }

  ads[index].isActive = !ads[index].isActive;
  ads[index].updatedAt = new Date().toISOString();
  saveLocalAds(ads);

  res.json({
    success: true,
    isActive: ads[index].isActive,
    message: `Ad is now ${ads[index].isActive ? 'Active (Visible in Live Market)' : 'Inactive (Hidden)'}.`
  });
});

app.delete('/api/local-ads/:id', (req, res) => {
  if (!verifyAdminAuth(req)) {
    return res.status(403).json({ error: 'Permission Denied: Only authenticated Admin can delete local ads.' });
  }

  const { id } = req.params;
  let ads = getLocalAds();
  const initialLength = ads.length;
  ads = ads.filter(a => a.id !== id);

  if (ads.length === initialLength) {
    return res.status(404).json({ error: 'Local ad not found.' });
  }

  saveLocalAds(ads);
  res.json({ success: true, message: 'Local ad deleted successfully from Live Market.' });
});

// SMART LOAN ELIGIBILITY & MULTI-BANK MATCHING CALCULATOR
app.post('/api/loan-eligibility-calculate', (req, res) => {
  const { loanType, employmentType, monthlyIncome, existingEmis, cibilTier, propertyValue, goldGrams, landAcres } = req.body;

  const income = Number(monthlyIncome) || 25000;
  const emis = Number(existingEmis) || 0;
  const netIncome = Math.max(income - emis, 5000);

  let maxEligibleAmount = 0;
  let baseRate = 10.5;
  let recommendedTenureYears = 5;

  if (loanType === 'Home Loan') {
    baseRate = cibilTier === 'excellent' ? 8.4 : cibilTier === 'good' ? 8.75 : 9.25;
    recommendedTenureYears = 25;
    // 60x net monthly income or 80% property value
    const incomeEligible = netIncome * 60;
    const propertyCap = propertyValue ? propertyValue * 0.85 : 5000000;
    maxEligibleAmount = Math.min(incomeEligible, propertyCap);
  } else if (loanType === 'Gold Loan') {
    baseRate = 9.0; // 0.75% pm
    recommendedTenureYears = 2;
    const dynamicConfig = getDynamicConfig();
    const goldRate = dynamicConfig.goldRatePerGram22k || 6850;
    const grams = Number(goldGrams) || 50;
    maxEligibleAmount = Math.round(grams * goldRate * 0.75); // 75% LTV per RBI guideline
  } else if (loanType === 'Business Loan') {
    baseRate = cibilTier === 'excellent' ? 11.5 : 13.5;
    recommendedTenureYears = 5;
    maxEligibleAmount = Math.round(income * 18);
  } else if (loanType === 'Agriculture Loan') {
    baseRate = 7.0;
    recommendedTenureYears = 5;
    const acres = Number(landAcres) || 5;
    maxEligibleAmount = Math.round(acres * 150000);
  } else if (loanType === 'Vehicle Loan') {
    baseRate = 8.75;
    recommendedTenureYears = 7;
    maxEligibleAmount = Math.round(income * 12);
  } else {
    // Personal Loan
    baseRate = cibilTier === 'excellent' ? 10.5 : cibilTier === 'good' ? 11.5 : 14.0;
    recommendedTenureYears = 5;
    maxEligibleAmount = Math.round(netIncome * 20);
  }

  // Calculate Monthly EMI
  const monthlyRate = baseRate / 12 / 100;
  const totalMonths = recommendedTenureYears * 12;
  const estimatedEmi = Math.round(
    (maxEligibleAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  let approvalProbability = 92;
  if (cibilTier === 'excellent') approvalProbability = 98;
  else if (cibilTier === 'good') approvalProbability = 90;
  else if (cibilTier === 'average') approvalProbability = 78;
  else approvalProbability = 84;

  const eligibleBanks = [
    {
      bankName: 'State Bank of India (SBI) Basavakalyan',
      rate: Number(baseRate.toFixed(2)),
      emi: estimatedEmi,
      specialOffer: 'Zero prepayment penalty & lowest interest rate in taluka'
    },
    {
      bankName: 'Canara Bank Basavakalyan Branch',
      rate: Number((baseRate + 0.25).toFixed(2)),
      emi: Math.round(estimatedEmi * 1.02),
      specialOffer: 'Quick local sanction with minimum paperwork'
    },
    {
      bankName: 'HDFC Bank Bus Stand Road',
      rate: Number((baseRate + 0.5).toFixed(2)),
      emi: Math.round(estimatedEmi * 1.04),
      specialOffer: 'Express 24-hr disbursement for pre-approved customers'
    }
  ];

  const tips = [
    'Submitting Aadhaar linked to active mobile ensures instant e-KYC approval in Basavakalyan.',
    'Keep last 6 months bank statement ready with regular salary/UPI transactions.',
    'Agent Sagar provides doorstep verification and direct branch coordination.'
  ];

  res.json({
    maxEligibleAmount,
    recommendedInterestRate: baseRate,
    estimatedEmi,
    recommendedTenureYears,
    approvalProbability,
    eligibleBanks,
    tips
  });
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

// Dynamic SEO Endpoints: robots.txt & sitemap.xml
app.get('/robots.txt', (req, res) => {
  const host = req.get('host') || 'agent-sagar-basavakalyan-loan.vercel.app';
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'https';
  const baseUrl = host.includes('vercel.app') || host.includes('basavakalyan') ? 'https://agent-sagar-basavakalyan-loan.vercel.app' : `${protocol}://${host}`;

  const robots = `# Robots.txt for Agent Sagar – Basavakalyan Loan Assistance
User-agent: *
Allow: /
Allow: /personal-loan-basavakalyan
Allow: /home-loan-basavakalyan
Allow: /business-loan-basavakalyan
Allow: /vehicle-loan-basavakalyan
Allow: /gold-loan-basavakalyan
Allow: /mortgage-loan-basavakalyan
Allow: /agriculture-loan-basavakalyan
Allow: /credit-card-basavakalyan

Disallow: /api/
Disallow: /admin

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

app.get('/sitemap.xml', (req, res) => {
  const host = req.get('host') || 'agent-sagar-basavakalyan-loan.vercel.app';
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'https';
  const baseUrl = host.includes('vercel.app') || host.includes('basavakalyan') ? 'https://agent-sagar-basavakalyan-loan.vercel.app' : `${protocol}://${host}`;
  const currentDate = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/personal-loan-basavakalyan</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/home-loan-basavakalyan</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/business-loan-basavakalyan</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/vehicle-loan-basavakalyan</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/gold-loan-basavakalyan</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/mortgage-loan-basavakalyan</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/agriculture-loan-basavakalyan</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/credit-card-basavakalyan</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
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
    app.use(express.static(distPath, { extensions: ['html'] }));
    
    // Serve exact pre-rendered subpage HTML to crawlers & users if it exists
    app.get('*all', (req, res) => {
      const cleanPath = req.path.replace(/^\/|\/$/g, '');
      const subpageDirHtml = path.join(distPath, cleanPath, 'index.html');
      const subpageFlatHtml = path.join(distPath, `${cleanPath}.html`);

      if (cleanPath && fs.existsSync(subpageDirHtml)) {
        return res.sendFile(subpageDirHtml);
      }
      if (cleanPath && fs.existsSync(subpageFlatHtml)) {
        return res.sendFile(subpageFlatHtml);
      }

      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Basavakalyan Loan Services server listening on http://localhost:${PORT}`);
  });
}

start();
