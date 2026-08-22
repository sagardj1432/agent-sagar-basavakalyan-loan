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
    rate: '10.5% p.a.',
    maxAmount: '₹15 Lakhs',
    tenure: '12 to 60 Months',
    overview: 'Get instant, hassle-free personal loans in Basavakalyan for medical emergencies, family weddings, higher education, home renovation, or debt consolidation. Agent Sagar provides end-to-end loan assistance with zero advance fees and doorstep document pickup across Basavakalyan town and Bidar district.',
    features: [
      'Collateral-Free loans up to ₹15 Lakhs without any property mortgage',
      'Flexible repayment tenure from 12 to 60 months tailored to monthly budget',
      'Attractive interest rates starting from 10.5% p.a. from leading partner banks',
      'Doorstep document collection across Basavakalyan, Sastapur, and local areas',
      'Fast sanction within 24 to 48 hours with minimal paperwork'
    ],
    eligibility: [
      'Salaried employees working in private companies, government departments, or public sector units',
      'Self-employed professionals, traders, and small business owners residing in Basavakalyan',
      'Age between 21 and 60 years at loan maturity',
      'Minimum regular monthly income of ₹15,000 with active bank account'
    ],
    documents: [
      'Identity & Address Proof: Aadhaar Card, PAN Card, Voter ID, or Driving License',
      'Income Proof (Salaried): Last 3 months salary slips and 6 months bank account statement',
      'Income Proof (Self-Employed): Last 1 year ITR / GST returns and 6 months active bank statement',
      'Passport size photographs and utility bill for residence verification'
    ],
    faqs: [
      {
        q: 'How fast can I get a personal loan in Basavakalyan?',
        a: 'Initial eligibility check is completed in 30 minutes. Once documents are verified, loan sanction and disbursement take between 24 and 48 working hours.'
      },
      {
        q: 'Do I need to submit collateral or security for a personal loan?',
        a: 'No. Personal loans in Basavakalyan are 100% unsecured, meaning no gold, land, or property mortgage is required.'
      },
      {
        q: 'Can self-employed individuals in Basavakalyan apply for personal finance?',
        a: 'Yes, shopkeepers, local traders, and independent professionals in Basavakalyan with active bank transactions can apply.'
      }
    ]
  },
  {
    slug: 'home-loan-basavakalyan',
    title: 'Home Loan in Basavakalyan | Housing & Construction Finance',
    description: 'Get low interest home loans and house construction finance in Basavakalyan up to ₹1 Crore. Doorstep guidance and PMAY subsidy assistance by Agent Sagar.',
    h1: 'Home Loan in Basavakalyan – Affordable Housing & Construction Finance',
    category: 'Home Loan',
    rate: '8.4% p.a.',
    maxAmount: '₹1 Crore',
    tenure: 'Up to 30 Years',
    overview: 'Build your dream home in Basavakalyan with affordable housing finance, plot-plus-construction credit, and home extension loans. Agent Sagar assists with legal title verification, property valuation, bank comparisons, and government subsidy applications across Basavakalyan taluka.',
    features: [
      'Financing up to 90% of property valuation for purchase and construction',
      'Extended repayment tenure up to 30 years for lower monthly EMIs',
      'Attractive floating and fixed interest rates starting from 8.4% p.a.',
      'Guidance for Pradhan Mantri Awas Yojana (PMAY) subsidy benefits',
      'Balance transfer facility to switch existing high-interest loans'
    ],
    eligibility: [
      'Salaried professionals, self-employed business owners, and local agriculturalists with regular income',
      'Age between 21 and 65 years at time of loan maturity',
      'Clear, marketable legal title of plot, flat, or house in Basavakalyan municipal or gram panchayat limits',
      'Stable banking track record and satisfactory credit repayment history'
    ],
    documents: [
      'KYC Proofs: Aadhaar Card, PAN Card, Passport photos of applicant and co-applicant',
      'Property Documents: Registered Sale Deed, Katha certificate, Tax paid receipts, and sanctioned building plan',
      'Financial Proofs: Last 3 years ITR with computation / 6 months salary slips and 6 months bank statement',
      'Title search report and non-encumbrance certificate (EC) for 13 to 30 years'
    ],
    faqs: [
      {
        q: 'Can I get a home loan for construction on an ancestral or vacant plot in Basavakalyan?',
        a: 'Yes. Plot-plus-construction and self-construction home loans are readily available with phased disbursements matching building progress.'
      },
      {
        q: 'What is the maximum repayment tenure for home loans in Basavakalyan?',
        a: 'Borrowers can choose flexible tenures of up to 30 years to minimize their monthly installment burden.'
      }
    ]
  },
  {
    slug: 'business-loan-basavakalyan',
    title: 'Business Loan in Basavakalyan | Working Capital for Shops & Traders',
    description: 'Collateral-free business loans up to ₹50 Lakhs for merchants, shopkeepers, and traders in Basavakalyan. Quick processing by Agent Sagar.',
    h1: 'Business Loan in Basavakalyan – Working Capital & Shop Expansion',
    category: 'Business Loan',
    rate: '12.0% p.a.',
    maxAmount: '₹50 Lakhs',
    tenure: '1 to 5 Years',
    overview: 'Empower your local enterprise, retail showroom, wholesale trading shop, or manufacturing unit in Basavakalyan with collateral-free business loans, overdraft limits, and machinery finance. Fast sanctions based on your banking turnover and trade history.',
    features: [
      'Unsecured business credit up to ₹50 Lakhs without pledging property',
      'Customized daily, weekly, or monthly repayment schedules suited to business cashflow',
      'Competitive interest rates starting from 12.0% p.a.',
      'Fast sanction within 48 to 72 hours with minimal documentation',
      'Dedicated relationship support for retail merchants in Basavakalyan Market'
    ],
    eligibility: [
      'Proprietorship, partnership, or private limited businesses operating in Basavakalyan',
      'Minimum business vintage of 1 year with active commercial transactions',
      'Minimum annual turnover of ₹5 Lakhs supported by banking records',
      'Applicant age between 21 and 65 years'
    ],
    documents: [
      'Business Registration: Shop & Establishment license, GST certificate, Trade license, or Udyam Aadhaar',
      'Financials: Last 12 months current/savings bank statements, last 2 years ITR and balance sheets',
      'Promoter Proofs: PAN Card, Aadhaar Card, utility bill of shop/office premises'
    ],
    faqs: [
      {
        q: 'Do shopkeepers in Basavakalyan need property collateral for a business loan?',
        a: 'No. We provide unsecured business loans up to ₹50 Lakhs based on banking turnover and trade receipts.'
      },
      {
        q: 'How are business loan interest rates determined?',
        a: 'Rates depend on annual turnover, credit bureau score, business stability, and bank transaction health.'
      }
    ]
  },
  {
    slug: 'vehicle-loan-basavakalyan',
    title: 'Vehicle Loan in Basavakalyan | Car, Bike & Commercial Vehicle Finance',
    description: 'Get fast vehicle loans for cars, bikes, tractors, and commercial vehicles in Basavakalyan. Up to 100% on-road funding assistance by Agent Sagar.',
    h1: 'Vehicle Loan in Basavakalyan – Car, Bike & Commercial Vehicle Finance',
    category: 'Vehicle Loan',
    rate: '8.75% p.a.',
    maxAmount: '₹25 Lakhs',
    tenure: 'Up to 7 Years',
    overview: 'Drive home your preferred two-wheeler, family car, commercial auto-rickshaw, cargo carrier, or farm tractor in Basavakalyan. Enjoy low down payment options, dealer quotation assistance, and fast hypothecation approvals.',
    features: [
      'Financing for new and certified pre-owned passenger & commercial vehicles',
      'Up to 90% to 100% on-road price funding options',
      'Repayment tenure up to 7 years with affordable monthly EMIs',
      'Support for auto drivers, transport operators, and agricultural tractor buyers',
      'Fast document pickup and transparent processing fees'
    ],
    eligibility: [
      'Salaried, self-employed, drivers, transport operators, or farmers residing in Basavakalyan',
      'Valid driving license, Aadhaar Card, and PAN Card',
      'Age between 21 and 65 years with stable income source'
    ],
    documents: [
      'KYC: Aadhaar Card, PAN Card, Driving License, Passport size photos',
      'Income Proof: Last 3-6 months bank statement or salary slip / RTC for tractor loans',
      'Vehicle Proforma Invoice / Quotation from authorized automobile dealer in Basavakalyan or Bidar'
    ],
    faqs: [
      {
        q: 'Can I get financing for a second-hand/used car or commercial vehicle in Basavakalyan?',
        a: 'Yes, we assist with loans for both brand-new and certified used vehicles with customized valuation.'
      }
    ]
  },
  {
    slug: 'gold-loan-basavakalyan',
    title: 'Gold Loan in Basavakalyan | Instant Cash Against Gold Ornaments',
    description: 'Instant cash gold loans in Basavakalyan with highest per-gram valuation and safe vault storage. Minimal KYC required by Agent Sagar.',
    h1: 'Gold Loan in Basavakalyan – Instant Spot Cash Against Gold',
    category: 'Gold Loan',
    rate: '0.75% / month (9% p.a.)',
    maxAmount: '₹25 Lakhs',
    tenure: '3 Months to 2 Years',
    overview: 'Unlock immediate cash against your 18k to 24k gold ornaments in Basavakalyan within 15 to 30 minutes. Get maximum market valuation per gram, safe bank locker custody with complete insurance, and zero salary slip requirements.',
    features: [
      'Spot cash or direct IMPS/NEFT bank transfer in 15 minutes',
      'Highest per-gram valuation in Basavakalyan market',
      '100% safe bank vault storage with complimentary comprehensive insurance',
      'No income proof, ITR, or CIBIL credit score checks required',
      'Flexible repayment: pay interest monthly and principal at loan maturity (Bullet repayment)'
    ],
    eligibility: [
      'Any individual aged 18 years and above residing in Basavakalyan or surrounding villages',
      'Owner of authentic gold jewelry, coins, or ornaments (18 to 24 karat purity)'
    ],
    documents: [
      'Aadhaar Card or Voter ID',
      'PAN Card (mandatory for loan amounts exceeding ₹50,000)',
      '1 passport size photograph'
    ],
    faqs: [
      {
        q: 'How safe is my gold during the loan tenure?',
        a: 'Your gold is securely sealed in tamper-proof bank vaults with 24/7 surveillance and 100% insurance cover.'
      }
    ]
  },
  {
    slug: 'mortgage-loan-basavakalyan',
    title: 'Mortgage Loan in Basavakalyan | Loan Against Property (LAP)',
    description: 'Secure high-value Loan Against Property (LAP) in Basavakalyan at low interest rates. Mortgage residential or commercial property with Agent Sagar.',
    h1: 'Mortgage Loan (LAP) in Basavakalyan – High Value Against Property',
    category: 'Mortgage Loan',
    rate: '9.25% p.a.',
    maxAmount: '₹2 Crores',
    tenure: 'Up to 15 Years',
    overview: 'Unlock the hidden equity in your residential house, commercial building, or approved land plot in Basavakalyan with a Loan Against Property (LAP). Enjoy lower interest rates than personal loans and extended repayment tenures up to 15 years.',
    features: [
      'High-value financing up to ₹2 Crores against residential or commercial properties',
      'Lower interest rates compared to unsecured personal or business loans',
      'Tenures up to 15 years for comfortable, low-stress EMI repayment',
      'Continue utilizing and residing in your property without operational disruption',
      'Balance transfer and top-up loan options for existing borrowers'
    ],
    eligibility: [
      'Property owners in Basavakalyan town, Main Road, Shivaji Nagar, or registered taluka areas',
      'Salaried professionals, business owners, doctors, and self-employed individuals',
      'Clear, encumbrance-free title deed and municipal registration'
    ],
    documents: [
      'Identity & Address Proofs of all co-owners (Aadhaar, PAN, Photos)',
      'Original Property Deeds: Sale Deed, Mother Deed, Katha Extract, Encumbrance Certificate (EC)',
      'Income Proof: Last 3 years ITR with financial computations / 6 months bank statement'
    ],
    faqs: [
      {
        q: 'Can commercial shop owners in Basavakalyan mortgage their shop for business expansion?',
        a: 'Yes, commercial shops, office premises, and industrial plots are eligible for Loan Against Property.'
      }
    ]
  },
  {
    slug: 'agriculture-loan-basavakalyan',
    title: 'Agriculture Loan in Basavakalyan | Kisan Credit & Farm Finance',
    description: 'Kisan Credit Card (KCC), crop loans, and agricultural machinery finance for farmers in Basavakalyan taluka. Dedicated support by Agent Sagar.',
    h1: 'Agriculture Loan in Basavakalyan – Kisan Credit & Farm Finance',
    category: 'Agriculture Loan',
    rate: '7.0% p.a.',
    maxAmount: '₹30 Lakhs',
    tenure: 'Up to 7 Years',
    overview: 'Dedicated credit facilities for farmers and agriculturalists in Basavakalyan taluka. Secure Kisan Credit Card (KCC) limits, crop production finance, tractor loans, borewell drilling credit, and solar irrigation funding based on RTC (Pahani) records.',
    features: [
      'Subsidized government-backed interest rates starting at 7.0% p.a.',
      'Kisan Credit Card (KCC) scheme processing and annual renewal support',
      'Flexible post-harvest repayment schedules aligned with seasonal crop cycles',
      'Tractor, rotavator, harvester, and farm equipment financing',
      'Borewell drilling, drip irrigation, and warehouse storage finance'
    ],
    eligibility: [
      'Farmers owning or cultivating agricultural land in Basavakalyan taluka',
      'Tenant farmers and sharecroppers with valid lease agreements',
      'Age between 18 and 70 years'
    ],
    documents: [
      'Aadhaar Card, Voter ID, and passport photographs',
      'Latest Agricultural Land RTC (Pahani) records, 7/12 extract, and mutation copy',
      'Bank passbook copy of active savings / KCC account'
    ],
    faqs: [
      {
        q: 'Can farmers pay loan installments after selling their harvest?',
        a: 'Yes. Agricultural loans feature harvest-aligned bullet repayment cycles matching Rabi and Kharif crop sales.'
      }
    ]
  },
  {
    slug: 'credit-card-basavakalyan',
    title: 'Credit Card in Basavakalyan | Instant Approval & Lifetime Free Cards',
    description: 'Apply for lifetime-free, cashback, and rewards credit cards in Basavakalyan with high limits and 50-day interest-free grace periods.',
    h1: 'Credit Card Assistance in Basavakalyan – Instant Approval',
    category: 'Credit Card',
    rate: '0% Interest (up to 50 days)',
    maxAmount: '₹5 Lakhs Limit',
    tenure: '50 Days Grace Period',
    overview: 'Get pre-approved for lifetime-free credit cards from top Indian partner banks with zero joining and annual fees. Enjoy up to 50 days interest-free credit, fuel surcharge waivers, grocery cashback, and emergency instant cash access in Basavakalyan.',
    features: [
      'Instant digital eligibility check and doorstep KYC verification in Basavakalyan',
      'Up to 50 days interest-free grace period on retail and online purchases',
      'Lifetime-free card options with zero annual maintenance fees',
      'Valuable cashback on fuel, grocery, utility bills, and railway/travel tickets',
      'Easy EMI conversion facility for high-value electronic and festival purchases'
    ],
    eligibility: [
      'Salaried employees, merchants, shopkeepers, or self-employed individuals in Basavakalyan',
      'Age between 21 and 65 years with regular banking transaction history',
      'Valid Aadhaar Card and PAN Card'
    ],
    documents: [
      'Aadhaar Card & PAN Card',
      'Last 3 months bank statements or salary slips',
      '1 passport size photograph'
    ],
    faqs: [
      {
        q: 'Are lifetime-free credit cards available for Basavakalyan residents?',
        a: 'Yes, we assist with lifetime-free cards featuring zero joining fee, zero annual charges, and attractive reward points.'
      }
    ]
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

  // Build dedicated Schema.org JSON-LD for this subpage
  const subpageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://agent-sagar-basavakalyan-loan.vercel.app/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Loan Services",
            "item": "https://agent-sagar-basavakalyan-loan.vercel.app/#loan-services"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": page.category,
            "item": `https://agent-sagar-basavakalyan-loan.vercel.app/${page.slug}`
          }
        ]
      },
      {
        "@type": ["FinancialProduct", "LoanOrCredit"],
        "@id": `https://agent-sagar-basavakalyan-loan.vercel.app/${page.slug}#product`,
        "name": page.h1,
        "description": page.description,
        "url": `https://agent-sagar-basavakalyan-loan.vercel.app/${page.slug}`,
        "annualPercentageRate": page.rate,
        "feesAndCommissionsSpecification": "Zero upfront consultation fees",
        "provider": {
          "@type": ["FinancialService", "LocalBusiness"],
          "name": "Agent Sagar – Basavakalyan Loan Assistance",
          "telephone": "+919632636718",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Near Reliance Mart, Main Road",
            "addressLocality": "Basavakalyan",
            "addressRegion": "Karnataka",
            "postalCode": "585327",
            "addressCountry": "IN"
          }
        },
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": "Basavakalyan, Bidar District, Karnataka"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": page.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  };

  // Replace JSON-LD schema
  customHtml = customHtml.replace(
    /<script type="application\/ld\+json" id="business-schema">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="business-schema">\n${JSON.stringify(subpageSchema, null, 2)}\n    </script>`
  );

  // Build dedicated static HTML content for subpage
  const featuresHtml = page.features.map(f => `<li>${f}</li>`).join('\n              ');
  const eligibilityHtml = page.eligibility.map(e => `<li>${e}</li>`).join('\n              ');
  const docsHtml = page.documents.map(d => `<li>${d}</li>`).join('\n              ');
  const faqsHtml = page.faqs.map(faq => `
            <div style="margin-bottom: 16px;">
              <h3 style="font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 6px;">${faq.q}</h3>
              <p style="margin: 0; color: #475569;">${faq.a}</p>
            </div>`).join('\n');

  const otherLinksHtml = pages
    .filter(p => p.slug !== page.slug)
    .map(p => `<li><a href="/${p.slug}" style="color: #ea580c; text-decoration: underline;">${p.category} in Basavakalyan</a></li>`)
    .join('\n              ');

  const dedicatedBody = `
      <div id="root">
        <!-- Static Prerendered Subpage for Search Engine Crawlers -->
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 1100px; margin: 0 auto; padding: 20px;">
          
          <!-- Breadcrumb Navigation -->
          <nav aria-label="Breadcrumb" style="font-size: 13px; margin-bottom: 20px; color: #64748b;">
            <a href="/" style="color: #ea580c; text-decoration: none; font-weight: bold;">Agent Sagar Master Pillar (Home)</a> &gt; 
            <a href="/#loans" style="color: #ea580c; text-decoration: none;">Loan Services</a> &gt; 
            <span>${page.category}</span>
          </nav>

          <!-- Topic Cluster Master Pillar Backlink Notice -->
          <aside style="margin-bottom: 24px; background: linear-gradient(to right, #fff7ed, #fef3c7, #f8fafc); border: 2px solid #fdba74; border-radius: 10px; padding: 16px 20px;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #ea580c; margin-bottom: 4px;">
              Topic Cluster Supporting Page
            </div>
            <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">
              Part of the <a href="/" style="color: #ea580c; text-decoration: underline;">Agent Sagar Basavakalyan Master Financial Pillar Hub</a>
            </div>
            <p style="font-size: 13px; color: #475569; margin: 0;">
              This page provides dedicated guidance on <strong>${page.category} in Basavakalyan</strong>. For multi-product interest rate comparisons across all 8 loan categories, official lender criteria, and central desk consultation, visit our <a href="/" style="color: #ea580c; font-weight: 700; text-decoration: underline;">Main Basavakalyan Pillar Page &rarr;</a>
            </p>
          </aside>

          <!-- Header & Title -->
          <header style="margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
            <div style="display: inline-block; padding: 4px 12px; background: #ffedd5; color: #ea580c; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-bottom: 10px;">
              Basavakalyan (585327) Local Financial Support
            </div>
            <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; margin-top: 8px; margin-bottom: 12px;">
              ${page.h1}
            </h1>
            <p style="font-size: 16px; color: #475569; margin-bottom: 16px;">
              ${page.overview}
            </p>
            <div style="display: flex; gap: 16px; flex-wrap: wrap; font-size: 14px; font-weight: 600; color: #0f172a; background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <div>⚡ Interest Rate: <strong style="color: #ea580c;">From ${page.rate}</strong></div>
              <div>💰 Max Loan: <strong>${page.maxAmount}</strong></div>
              <div>⏱ Tenure: <strong>${page.tenure}</strong></div>
              <div>📍 Location: <strong>Basavakalyan Town & Taluka</strong></div>
            </div>
          </header>

          <!-- Main Subpage Article -->
          <main>
            
            <!-- Key Features & Benefits -->
            <section style="margin-bottom: 30px; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 14px;">Key Benefits of ${page.category} in Basavakalyan</h2>
              <ul style="padding-left: 20px; space-y: 8px;">
                ${featuresHtml}
              </ul>
            </section>

            <!-- Eligibility Criteria -->
            <section style="margin-bottom: 30px; background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 14px;">Eligibility Criteria for Basavakalyan Applicants</h2>
              <ul style="padding-left: 20px; space-y: 8px;">
                ${eligibilityHtml}
              </ul>
            </section>

            <!-- Documents Required -->
            <section style="margin-bottom: 30px; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 14px;">Documents Commonly Required</h2>
              <ul style="padding-left: 20px; space-y: 8px;">
                ${docsHtml}
              </ul>
            </section>

            <!-- Step by Step Process -->
            <section style="margin-bottom: 30px; background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 14px;">Step-by-Step Application Process</h2>
              <ol style="padding-left: 20px;">
                <li><strong>Submit Online Enquiry:</strong> Call <a href="tel:+919632636718" style="color: #ea580c; font-weight: bold;">+91 96326 36718</a>, message on WhatsApp, or complete the online lead form.</li>
                <li><strong>Free Local Consultation:</strong> Agent Sagar reviews your profile, income, and determines the most suitable partner bank or NBFC with lowest interest rates.</li>
                <li><strong>Doorstep Document Verification:</strong> We collect necessary KYC proofs and verify application forms across Basavakalyan.</li>
                <li><strong>Bank Approval & Disbursal:</strong> Loan is sanctioned and credited directly into your bank account with complete transparency.</li>
              </ol>
            </section>

            <!-- Frequently Asked Questions -->
            <section style="margin-bottom: 30px; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 14px;">Frequently Asked Questions (FAQs)</h2>
              ${faqsHtml}
            </section>

            <!-- Other Loan Services Internal Backlinks Matrix -->
            <section style="margin-bottom: 30px; background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">Direct Internal Backlinks & Related Loan Pages</h2>
              <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Explore dedicated guides and interest rates for all loan products available in Basavakalyan:</p>
              <ul style="padding-left: 20px; column-count: 2; column-gap: 20px; font-size: 14px;">
                ${otherLinksHtml}
                <li><a href="/" style="color: #ea580c; text-decoration: underline; font-weight: bold;">Agent Sagar Loans Home - Basavakalyan</a></li>
              </ul>
            </section>

            <!-- Webmaster Backlink & Citation Code -->
            <section style="margin-bottom: 30px; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Backlink Citation & Embed Snippet</h2>
              <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">To link or cite this page on local business directories, blogs, or community portals:</p>
              <div style="background: #0f172a; color: #34d399; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 12px; overflow-x: auto; margin-bottom: 10px;">
                &lt;a href="https://agent-sagar-basavakalyan-loan.vercel.app/${page.slug}" title="${page.title}"&gt;${page.category} in Basavakalyan - Agent Sagar&lt;/a&gt;
              </div>
              <p style="font-size: 12px; color: #475569; margin: 0;">
                <strong>Local Citation (NAP):</strong> Agent Sagar Loan Assistance | Near Reliance Mart, Basavakalyan, Karnataka - 585327 | Phone: +91 96326 36718
              </p>
            </section>

            <!-- Authoritative Regulatory Reference Links -->
            <section style="margin-bottom: 30px; background-color: #f8fafc; padding: 16px 20px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13px;">
              <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Official Reference Links</h3>
              <ul style="padding-left: 20px; margin: 0; color: #475569;">
                <li><a href="https://www.rbi.org.in" target="_blank" rel="noopener noreferrer" style="color: #0369a1;">Reserve Bank of India (RBI) Fair Lending Practices</a></li>
                <li><a href="https://pmaymis.gov.in" target="_blank" rel="noopener noreferrer" style="color: #0369a1;">Pradhan Mantri Awas Yojana (PMAY Housing Subsidy)</a></li>
                <li><a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" style="color: #0369a1;">PM-KISAN / Kisan Credit Card (KCC) Portal</a></li>
                <li><a href="https://www.digilocker.gov.in" target="_blank" rel="noopener noreferrer" style="color: #0369a1;">DigiLocker Government Verified Digital KYC</a></li>
              </ul>
            </section>

            <!-- Contact & CTA -->
            <section style="background: #0f172a; color: #ffffff; padding: 24px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
              <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 8px; color: #ffffff;">Need ${page.category} in Basavakalyan?</h2>
              <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 18px;">
                Contact Agent Sagar for fast, reliable, and transparent loan assistance today.
              </p>
              <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                <a href="tel:+919632636718" style="background: #ea580c; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">📞 Call +91 96326 36718</a>
                <a href="https://wa.me/919632636718?text=Hello%20Agent%20Sagar,%20I%20want%20to%20apply%20for%20${encodeURIComponent(page.category)}%20in%20Basavakalyan" style="background: #25D366; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">💬 WhatsApp Enquiry</a>
                <a href="/" style="background: #334155; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">🏠 Return to Home</a>
              </div>
            </section>

            <!-- Regulatory Disclaimer -->
            <footer style="font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px;">
              <p>
                <strong>Disclaimer:</strong> Agent Sagar is an independent loan facilitation agent and channel partner assisting residents of Basavakalyan with documentation and bank submissions. Loan sanction, interest rates, processing fees, and disbursements are at the sole discretion of partner banks and RBI-registered NBFCs. We never charge upfront processing fees.
              </p>
            </footer>

          </main>
        </div>
      </div>`;

  // Replace <div id="root">...</div> with dedicated subpage body
  customHtml = customHtml.replace(
    /<div id="root">[\s\S]*?<\/div>\s*<script type="module" src="\/src\/main\.tsx"><\/script>/,
    `${dedicatedBody}\n    <script type="module" src="/src/main.tsx"></script>`
  );

  // Create directory and write index.html inside dist/[slug]/
  const pageDir = path.join(distDir, page.slug);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  fs.writeFileSync(path.join(pageDir, 'index.html'), customHtml, 'utf8');

  // Also write dist/[slug].html for servers configured without trailing slash
  fs.writeFileSync(path.join(distDir, `${page.slug}.html`), customHtml, 'utf8');
  console.log(`Generated dedicated static crawlable HTML for /${page.slug}`);
});

console.log('All static SEO pages generated successfully with rich dedicated content!');
