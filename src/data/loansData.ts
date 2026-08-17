import { LoanCategoryInfo, Landmark } from '../types';

import basavakalyanGateImg from '../assets/images/basavakalyan_gate_1786122813530.jpg';
import basavaStatueImg from '../assets/images/basava_statue_1786122850745.jpg';
import basavakalyanFortImg from '../assets/images/basavakalyan_fort_1786122868478.jpg';

export const LOAN_CATEGORIES: LoanCategoryInfo[] = [
  {
    id: 'personal-loan',
    slug: 'personal-loan-basavakalyan',
    title: 'Personal Loan Basavakalyan',
    shortDesc: 'Instant, hassle-free cash loans for medical emergencies, weddings, education, or travel in Basavakalyan.',
    minRate: '10.5% p.a.',
    maxAmount: '₹15 Lakhs',
    maxTenure: '5 Years',
    features: [
      'No collateral or guarantor required',
      'Instant documentation in Basavakalyan town',
      'Flexible repayment tenure from 12 to 60 months',
      'Approval within 24 hours for local residents',
      'Minimal paperwork for salaried and self-employed'
    ],
    eligibility: [
      'Resident of Basavakalyan town or nearby local villages',
      'Age between 21 and 60 years',
      'Minimum monthly income of ₹15,000',
      'Valid Aadhaar card and PAN card'
    ],
    documents: [
      'Aadhaar Card & PAN Card',
      'Last 3 months salary slips or bank statements',
      'Passport size photographs',
      'Current address proof (Electricity bill / Voter ID)'
    ],
    seoTitle: 'Personal Loan Basavakalyan - Low Interest Rate & Instant Sanction',
    seoDescription: 'Apply for instant Personal Loan in Basavakalyan. Quick approval up to ₹15 Lakhs with minimal documents for medical, marriage, or personal needs.',
    keywords: ['Personal Loan Basavakalyan', 'Instant Loan Basavakalyan', 'Cash Loan Basavakalyan', 'Personal Finance Basavakalyan'],
    popularLocation: 'Basavakalyan Town, Bus Stand Road & Main Market'
  },
  {
    id: 'home-loan',
    slug: 'home-loan-basavakalyan',
    title: 'Home Loan Basavakalyan',
    shortDesc: 'Affordable home construction, flat purchase, or renovation loans with long tenures and low EMIs.',
    minRate: '8.4% p.a.',
    maxAmount: '₹1 Crore',
    maxTenure: '30 Years',
    features: [
      'Up to 90% property value financing',
      'PMAY subsidy guidance & assistance for first-time buyers',
      'Hassle-free legal and technical evaluation of land/house',
      'Balance transfer facility with top-up loan options',
      'Special discounted interest rates for women applicants'
    ],
    eligibility: [
      'Salaried, Self-Employed professionals, or Business owners',
      'Age between 21 and 65 years at loan maturity',
      'Clear title of plot or existing property in Basavakalyan',
      'Stable source of regular income'
    ],
    documents: [
      'Aadhaar Card, PAN Card & Photos',
      'Property ownership documents (Katha, Sale Deed, Tax receipts)',
      'Approved building plan & estimation',
      'Last 6 months bank statements & Income Proof'
    ],
    seoTitle: 'Home Loan Basavakalyan - Easy Housing Finance & Plot Construction Loans',
    seoDescription: 'Build your dream home in Basavakalyan. Apply for low-interest Home Loan with subsidy support and easy monthly EMI options.',
    keywords: ['Home Loan Basavakalyan', 'House Construction Loan Basavakalyan', 'Plot Purchase Loan Basavakalyan', 'PMAY Subsidy Basavakalyan'],
    popularLocation: 'Shivaji Nagar, Fort Area, & Model Colony Basavakalyan'
  },
  {
    id: 'gold-loan',
    slug: 'gold-loan-basavakalyan',
    title: 'Gold Loan Basavakalyan',
    shortDesc: 'Instant cash in 15 minutes against your gold ornaments with maximum per-gram rate & complete safety.',
    minRate: '0.75% / month (9% p.a.)',
    maxAmount: '₹25 Lakhs',
    maxTenure: '2 Years',
    features: [
      'Instant spot cash or bank transfer within 15 minutes',
      'Highest value per gram for gold jewelry in Basavakalyan',
      'Vault storage with 100% free insurance security',
      'No income proof or CIBIL score checks needed',
      'Bullet repayment: Pay interest monthly and principal at end'
    ],
    eligibility: [
      'Any individual aged 18 years and above',
      'Ownership of 18k to 24k gold jewelry',
      'Valid ID proof (Aadhaar Card / Voter ID)'
    ],
    documents: [
      'Aadhaar Card or Voter ID',
      'PAN Card (for loans above ₹50,000)',
      'Passport size photo'
    ],
    seoTitle: 'Gold Loan Basavakalyan - Instant Cash Against Gold Ornaments in 15 Mins',
    seoDescription: 'Get maximum cash value for your gold ornaments in Basavakalyan. Low interest rate from 0.75% pm, 100% safe locker storage, instant payout.',
    keywords: ['Gold Loan Basavakalyan', 'Cash against Gold Basavakalyan', 'Gold Finance Basavakalyan', 'Instant Gold Loan Basavakalyan'],
    popularLocation: 'Main Bazar & Market Road Basavakalyan'
  },
  {
    id: 'business-loan',
    slug: 'business-loan-basavakalyan',
    title: 'Business Loan Basavakalyan',
    shortDesc: 'Collateral-free working capital and expansion loans for local merchants, shopkeepers, and traders.',
    minRate: '12.0% p.a.',
    maxAmount: '₹50 Lakhs',
    maxTenure: '5 Years',
    features: [
      'No collateral needed for unsecured business loans',
      'Daily/Weekly/Monthly EMI options tailored to business cashflow',
      'Quick working capital limits & overdraft facility',
      'Machinery and shop renovation finance',
      'Dedicated local relation manager in Basavakalyan'
    ],
    eligibility: [
      'Shopkeepers, traders, manufacturers, or service providers',
      'Business operational for at least 1 year in Basavakalyan',
      'Minimum annual turnover of ₹5 Lakhs',
      'Valid local trade license or GST registration (if applicable)'
    ],
    documents: [
      'Business Registration / Trade License / Shop Act',
      'Aadhaar Card & PAN Card of proprietor/partners',
      'Last 6 months business bank statements',
      'GST returns or ITR (for higher loan limits)'
    ],
    seoTitle: 'Business Loan Basavakalyan - Collateral-Free Shopkeeper & Merchant Loans',
    seoDescription: 'Grow your shop or business in Basavakalyan. Unsecured Business Loans up to ₹50 Lakhs with quick approval and flexible EMI.',
    keywords: ['Business Loan Basavakalyan', 'Shopkeeper Loan Basavakalyan', 'Traders Credit Basavakalyan', 'Working Capital Loan Basavakalyan'],
    popularLocation: 'Basavakalyan Main Market & Commercial Area'
  },
  {
    id: 'agriculture-loan',
    slug: 'agriculture-loan-basavakalyan',
    title: 'Agriculture Loan Basavakalyan',
    shortDesc: 'Kisan credit, crop loans, tractor finance, and drip irrigation loans designed specifically for local farmers.',
    minRate: '7.0% p.a.',
    maxAmount: '₹30 Lakhs',
    maxTenure: '7 Years',
    features: [
      'Subsidized government-friendly interest rates',
      'Kisan Credit Card (KCC) scheme assistance',
      'Crop season-aligned flexible repayment options (Post-harvest)',
      'Tractor, harvester, and modern farm equipment financing',
      'Borewell & solar pump installation credit'
    ],
    eligibility: [
      'Farmers owning or cultivating agricultural land in Basavakalyan',
      'Tenant farmers or sharecroppers with valid agreements',
      'Age between 18 and 70 years'
    ],
    documents: [
      'Aadhaar Card & Voter ID',
      'Agricultural land RTC (Pahani) records & 7/12 extract',
      'Passport photos',
      'Bank passbook copy'
    ],
    seoTitle: 'Agriculture Loan Basavakalyan - Kisan Crop & Tractor Finance for Farmers',
    seoDescription: 'Special Agriculture Loans for farmers in Basavakalyan. Subsidized Kisan Credit Card, tractor finance, and crop loans with post-harvest EMI.',
    keywords: ['Agriculture Loan Basavakalyan', 'Kisan Loan Basavakalyan', 'Tractor Finance Basavakalyan', 'Crop Loan Basavakalyan Farmers'],
    popularLocation: 'Basavakalyan Rural Villages & Agriculture Hub'
  },
  {
    id: 'vehicle-loan',
    slug: 'vehicle-loan-basavakalyan',
    title: 'Vehicle Loan Basavakalyan',
    shortDesc: 'Affordable two-wheeler, commercial vehicle, auto-rickshaw, car, and equipment loans with low down payment options.',
    minRate: '8.75% p.a.',
    maxAmount: '₹25 Lakhs',
    maxTenure: '7 Years',
    features: [
      'Financing for new and used cars, two-wheelers, tractors & commercial goods vehicles',
      'Up to 90% on-road price financing',
      'Flexible repayment options suited to local drivers, transport owners & families',
      'Quick document verification with minimal processing paperwork',
      'Assistance with vehicle insurance and RTO hypothecation documentation'
    ],
    eligibility: [
      'Resident of Basavakalyan town or surrounding taluka villages',
      'Salaried individuals, self-employed, drivers, or transport operators',
      'Age between 21 and 65 years',
      'Valid driving license, Aadhaar card, and PAN card'
    ],
    documents: [
      'Aadhaar Card, PAN Card & Driving License',
      'Passport size photographs',
      'Address proof (Voter ID / Ration Card / Electricity Bill)',
      'Bank statement (last 3-6 months) or income proof',
      'Vehicle proforma invoice / quotation from authorized dealer'
    ],
    seoTitle: 'Vehicle Loan Basavakalyan - Low Interest Car, Bike & Commercial Vehicle Loans',
    seoDescription: 'Apply for Vehicle Loan in Basavakalyan for new & used cars, bikes, tractors, and commercial vehicles. Fast processing, low EMIs, and flexible tenures.',
    keywords: ['Vehicle Loan Basavakalyan', 'Car Loan Basavakalyan', 'Bike Loan Basavakalyan', 'Auto Finance Basavakalyan', 'Commercial Vehicle Loan'],
    popularLocation: 'NH-65 Highway Junction, Bus Stand Road & Auto Stand Basavakalyan'
  },
  {
    id: 'mortgage-loan',
    slug: 'mortgage-loan-basavakalyan',
    title: 'Mortgage / Property Loan Basavakalyan',
    shortDesc: 'Loan Against Property (LAP) for commercial, residential, or plot owners needing large funds for business expansion or personal goals.',
    minRate: '9.25% p.a.',
    maxAmount: '₹2 Crores',
    maxTenure: '15 Years',
    features: [
      'High loan value against residential houses, commercial buildings, or approved plots',
      'Lower interest rates compared to unsecured personal or business loans',
      'Long repayment tenure of up to 15 years for comfortable monthly EMIs',
      'Continued full ownership and occupancy of your property',
      'Balance transfer facility with additional top-up loan options'
    ],
    eligibility: [
      'Property owners in Basavakalyan town or registered municipal limits',
      'Salaried professionals, business proprietors, traders, or self-employed',
      'Age between 21 and 65 years',
      'Clear, encumbrance-free property ownership documents'
    ],
    documents: [
      'Aadhaar Card, PAN Card & Photos',
      'Complete property chain documents (Sale Deed, Katha, Tax Paid Receipts, Encumbrance Certificate)',
      'Approved building blueprint/layout plan where applicable',
      'Bank statements (last 6 months) and proof of business/salary income'
    ],
    seoTitle: 'Mortgage Loan Basavakalyan - Loan Against Property (LAP) with Low EMIs',
    seoDescription: 'Get low-interest Mortgage Loan Against Property in Basavakalyan. Unlock funds against residential or commercial properties with long repayment tenures.',
    keywords: ['Mortgage Loan Basavakalyan', 'Loan Against Property Basavakalyan', 'LAP Basavakalyan', 'Property Finance Basavakalyan'],
    popularLocation: 'Commercial Hub, Main Road & Residential Layouts in Basavakalyan'
  },
  {
    id: 'credit-card',
    slug: 'credit-card-basavakalyan',
    title: 'Credit Card Basavakalyan',
    shortDesc: 'Instant lifetime-free & rewards credit cards with high limits and zero joining fees for local residents.',
    minRate: '0% Interest (up to 50 days)',
    maxAmount: '₹5 Lakhs Limit',
    maxTenure: '50 Days Grace Period',
    features: [
      'Instant digital approval & fast KYC in Basavakalyan',
      'Up to 50 days interest-free credit period on all purchases',
      'Lifetime free cards with zero joining and annual fees',
      'Cashback on fuel, grocery, utility bill payments & online shopping',
      'Easy EMI conversion facility for large transactions'
    ],
    eligibility: [
      'Salaried employee, shopkeeper, or self-employed in Basavakalyan',
      'Age between 21 and 65 years',
      'Minimum monthly income of ₹15,000 or good banking history',
      'Valid Aadhaar Card and PAN Card'
    ],
    documents: [
      'Aadhaar Card & PAN Card',
      'Last 3 months bank statement or salary slip',
      'Passport size photograph'
    ],
    seoTitle: 'Credit Card Basavakalyan - Apply Instant Lifetime Free Credit Cards',
    seoDescription: 'Apply for instant Credit Cards in Basavakalyan. Enjoy up to 50 days interest-free credit, limit up to ₹5 Lakhs, cashbacks, and fast verification.',
    keywords: ['Credit Card Basavakalyan', 'Lifetime Free Credit Card Basavakalyan', 'Apply Credit Card Basavakalyan', 'Instant Credit Card'],
    popularLocation: 'Basavakalyan Main Market & Commercial Hub'
  }
];

export const LOCAL_LANDMARKS: Landmark[] = [
  {
    id: 'sastapur-bangla',
    name: 'Sastapur Bangla',
    location: 'NH-65 Highway Junction, Basavakalyan Outer',
    image: basavakalyanGateImg,
    description: 'Sastapur Bangla is the premier highway gateway and bustling landmark of Basavakalyan, connecting the town to Bidar, Kalaburagi, and Solapur.',
    significance: 'Key commercial hub and transportation landmark where local entrepreneurs, transport businesses, and farmers convene daily.'
  },
  {
    id: 'basava-statue',
    name: 'Basava Statue & Anubhava Mantapa',
    location: 'Basava Giri, Basavakalyan Town',
    image: basavaStatueImg,
    description: 'The world-famous 108-foot statue of Lord Basaveshwara, standing atop the historic Anubhava Mantapa hillock overlooking Basavakalyan.',
    significance: 'Spiritual heart of Basavakalyan celebrating equality, democracy, and social reform established in the 12th century.'
  },
  {
    id: 'basavakalyan-fort',
    name: 'Basavakalyan Fort',
    location: 'Fort Road, Central Basavakalyan',
    image: basavakalyanFortImg,
    description: 'A magnificent 10th-century heritage fortress built during the Western Chalukya Empire featuring strategic moats and royal arcades.',
    significance: 'Historical center of administrative pride and cultural heritage attracting thousands of tourists and visitors to Basavakalyan.'
  }
];
