import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(distDir)) {
  console.log('dist directory not found, skipping static page generation.');
  process.exit(0);
}

const baseHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(baseHtmlPath)) {
  console.log('dist/index.html not found, skipping static page generation.');
  process.exit(0);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

const pages = [
  {
    slug: 'personal-loan-basavakalyan',
    title: 'Personal Loan in Basavakalyan | Instant Approval & Low Interest',
    description: 'Apply for collateral-free personal loans in Basavakalyan up to ₹15 Lakhs. Fast approval, minimal documentation, doorstep service by Agent Sagar.',
    h1: 'Personal Loan in Basavakalyan – Fast Approval & Minimal Documents',
    category: 'Personal Loan',
    highlights: ['Collateral-Free loans up to ₹15 Lakhs', 'Flexible tenure from 12 to 60 months', 'Interest rates starting from 10.5% p.a.', 'Doorstep document collection across Basavakalyan']
  },
  {
    slug: 'home-loan-basavakalyan',
    title: 'Home Loan in Basavakalyan | Housing & Construction Finance',
    description: 'Get low interest home loans and house construction finance in Basavakalyan up to ₹1 Crore. Doorstep guidance and PMAY subsidy assistance by Agent Sagar.',
    h1: 'Home Loan in Basavakalyan – Affordable Housing & Construction Finance',
    category: 'Home Loan',
    highlights: ['Loans up to ₹1 Crore for construction, purchase & renovation', 'Repayment tenures up to 30 years', 'Attractive interest rates from 8.4% p.a.', 'Assistance with title verification and PMAY subsidy']
  },
  {
    slug: 'business-loan-basavakalyan',
    title: 'Business Loan in Basavakalyan | Working Capital for Shops & Traders',
    description: 'Collateral-free business loans up to ₹50 Lakhs for merchants, shopkeepers, and traders in Basavakalyan. Quick processing by Agent Sagar.',
    h1: 'Business Loan in Basavakalyan – Working Capital & Shop Expansion',
    category: 'Business Loan',
    highlights: ['Collateral-free working capital up to ₹50 Lakhs', 'Funding based on GST/ITR or daily banking turnover', 'Fast sanction within 48 to 72 hours', 'Special schemes for local retail and wholesale traders']
  },
  {
    slug: 'vehicle-loan-basavakalyan',
    title: 'Vehicle Loan in Basavakalyan | Car, Bike & Commercial Vehicle Finance',
    description: 'Get fast vehicle loans for cars, bikes, tractors, and commercial vehicles in Basavakalyan. Up to 100% on-road funding assistance by Agent Sagar.',
    h1: 'Vehicle Loan in Basavakalyan – Car, Bike & Commercial Vehicle Finance',
    category: 'Vehicle Loan',
    highlights: ['Financing for new and used cars, two-wheelers & commercial autos', 'Tractor and farm equipment loans', 'Flexible EMI repayment options', 'Doorstep quotation and documentation handling']
  },
  {
    slug: 'gold-loan-basavakalyan',
    title: 'Gold Loan in Basavakalyan | Instant Cash Against Gold Ornaments',
    description: 'Instant cash gold loans in Basavakalyan with highest per-gram valuation and safe vault storage. Minimal KYC required by Agent Sagar.',
    h1: 'Gold Loan in Basavakalyan – Instant Spot Cash Against Gold',
    category: 'Gold Loan',
    highlights: ['Spot cash disbursement in 15 to 30 minutes', 'Maximum per-gram market valuation', 'Safe bank vault storage with complete insurance', 'Flexible interest repayment: monthly or bullet repayment']
  },
  {
    slug: 'mortgage-loan-basavakalyan',
    title: 'Mortgage Loan in Basavakalyan | Loan Against Property (LAP)',
    description: 'Secure high-value Loan Against Property (LAP) in Basavakalyan at low interest rates. Mortgage residential or commercial property with Agent Sagar.',
    h1: 'Mortgage Loan (LAP) in Basavakalyan – High Value Against Property',
    category: 'Mortgage Loan',
    highlights: ['High funding limits up to ₹2 Crores against residential/commercial property', 'Lower interest rates than unsecured loans', 'Long repayment tenures up to 15 years', 'Complete assistance with property title scrutiny']
  },
  {
    slug: 'agriculture-loan-basavakalyan',
    title: 'Agriculture Loan in Basavakalyan | Kisan Credit & Farm Finance',
    description: 'Kisan Credit Card (KCC), crop loans, and agricultural machinery finance for farmers in Basavakalyan taluka. Dedicated support by Agent Sagar.',
    h1: 'Agriculture Loan in Basavakalyan – Kisan Credit & Farm Finance',
    category: 'Agriculture Loan',
    highlights: ['Kisan Credit Card (KCC) scheme assistance', 'Crop production and borewell finance', 'Tractor and drip irrigation funding on RTC (Pahani)', 'Subsidized interest rates with government schemes']
  },
  {
    slug: 'credit-card-basavakalyan',
    title: 'Credit Card in Basavakalyan | Instant Approval & Lifetime Free Cards',
    description: 'Apply for lifetime-free, cashback, and rewards credit cards in Basavakalyan with high limits and 50-day interest-free grace periods.',
    h1: 'Credit Card Assistance in Basavakalyan – Instant Approval',
    category: 'Credit Card',
    highlights: ['Lifetime-free and rewards card options', 'Up to 50 days interest-free credit period', 'Welcome vouchers, cashback, and airport lounge access', 'Fast approval for salaried and business applicants']
  }
];

pages.forEach((page) => {
  let customHtml = baseHtml;
  
  // Replace title
  customHtml = customHtml.replace(
    /<title id="page-title">.*?<\/title>/,
    `<title id="page-title">${page.title}</title>`
  );

  // Replace meta description
  customHtml = customHtml.replace(
    /<meta name="description" id="meta-description" content=".*?" \/>/,
    `<meta name="description" id="meta-description" content="${page.description}" />`
  );

  // Replace canonical
  customHtml = customHtml.replace(
    /<link rel="canonical" id="canonical-url" href=".*?" \/>/,
    `<link rel="canonical" id="canonical-url" href="https://agent-sagar-basavakalyan-loan.vercel.app/${page.slug}" />`
  );

  // Replace og:title
  customHtml = customHtml.replace(
    /<meta property="og:title" id="og-title" content=".*?" \/>/,
    `<meta property="og:title" id="og-title" content="${page.title}" />`
  );

  // Replace og:url
  customHtml = customHtml.replace(
    /<meta property="og:url" id="og-url" content=".*?" \/>/,
    `<meta property="og:url" id="og-url" content="https://agent-sagar-basavakalyan-loan.vercel.app/${page.slug}" />`
  );

  // Replace og:description
  customHtml = customHtml.replace(
    /<meta property="og:description" id="og-description" content=".*?" \/>/,
    `<meta property="og:description" id="og-description" content="${page.description}" />`
  );

  // Replace Twitter
  customHtml = customHtml.replace(
    /<meta name="twitter:title" id="twitter-title" content=".*?" \/>/,
    `<meta name="twitter:title" id="twitter-title" content="${page.title}" />`
  );
  customHtml = customHtml.replace(
    /<meta name="twitter:description" id="twitter-description" content=".*?" \/>/,
    `<meta name="twitter:description" id="twitter-description" content="${page.description}" />`
  );

  // Create directory and write index.html inside dist/[slug]/
  const pageDir = path.join(distDir, page.slug);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  fs.writeFileSync(path.join(pageDir, 'index.html'), customHtml, 'utf8');

  // Also write dist/[slug].html for servers configured without trailing slash
  fs.writeFileSync(path.join(distDir, `${page.slug}.html`), customHtml, 'utf8');
  console.log(`Generated static crawlable HTML for /${page.slug}`);
});

console.log('All static SEO pages generated successfully!');
