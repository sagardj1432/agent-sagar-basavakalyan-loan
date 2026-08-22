import React, { useState, useMemo } from 'react';
import { LoanCategoryInfo } from '../types';
import { LOAN_CATEGORIES } from '../data/loansData';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  User, 
  Star, 
  ArrowLeft, 
  RotateCcw, 
  Building2, 
  PhoneCall, 
  Award,
  Calculator,
  Clock,
  Banknote,
  HelpCircle,
  Layers,
  MessageCircle,
  FileCheck2,
  Landmark
} from 'lucide-react';
import { apiService } from '../services/api';
import { PageBacklinksNetwork } from './PageBacklinksNetwork';

interface SeoLoanPageProps {
  slug: string;
  onOpenApplyModal: (loanType: string) => void;
  onNavigateHome: () => void;
  onNavigateToSeoPage?: (slug: string) => void;
}

export const SeoLoanPage: React.FC<SeoLoanPageProps> = ({
  slug,
  onOpenApplyModal,
  onNavigateHome,
  onNavigateToSeoPage
}) => {
  const category = LOAN_CATEGORIES.find(c => c.slug === slug) || LOAN_CATEGORIES[0];
  const otherCategories = LOAN_CATEGORIES.filter(c => c.slug !== category.slug);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Loan Calculator State tailored for this category
  const defaultAmountNumber = useMemo(() => {
    if (category.id === 'home-loan') return 2500000;
    if (category.id === 'mortgage-loan') return 3000000;
    if (category.id === 'business-loan') return 1000000;
    if (category.id === 'agriculture-loan') return 500000;
    if (category.id === 'vehicle-loan') return 600000;
    if (category.id === 'gold-loan') return 200000;
    return 300000;
  }, [category.id]);

  const defaultRateNumber = useMemo(() => {
    const parsed = parseFloat(category.minRate.replace(/[^\d.]/g, ''));
    return isNaN(parsed) || parsed <= 0 ? 10.5 : parsed;
  }, [category.minRate]);

  const defaultTenureNumber = useMemo(() => {
    if (category.id === 'home-loan') return 20;
    if (category.id === 'mortgage-loan') return 15;
    if (category.id === 'vehicle-loan') return 5;
    if (category.id === 'agriculture-loan') return 5;
    if (category.id === 'gold-loan') return 2;
    return 3;
  }, [category.id]);

  const [calcAmount, setCalcAmount] = useState<number>(defaultAmountNumber);
  const [calcRate, setCalcRate] = useState<number>(defaultRateNumber);
  const [calcTenureYears, setCalcTenureYears] = useState<number>(defaultTenureNumber);

  // EMI Formula Calculation
  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const P = calcAmount;
    const monthlyRate = calcRate / 12 / 100;
    const N = calcTenureYears * 12;

    if (P <= 0 || calcRate <= 0 || N <= 0) {
      return { emi: 0, totalInterest: 0, totalPayment: 0 };
    }

    const calculatedEmi = Math.round(
      (P * monthlyRate * Math.pow(1 + monthlyRate, N)) / (Math.pow(1 + monthlyRate, N) - 1)
    );
    const calculatedTotalPayment = calculatedEmi * N;
    const calculatedTotalInterest = calculatedTotalPayment - P;

    return {
      emi: calculatedEmi,
      totalInterest: Math.max(0, calculatedTotalInterest),
      totalPayment: Math.max(P, calculatedTotalPayment)
    };
  }, [calcAmount, calcRate, calcTenureYears]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name.trim()) return setErrorMsg('Please enter your full name');
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) return setErrorMsg('Please enter a valid 10-digit mobile number');

    setSubmitting(true);
    try {
      await apiService.submitLead({
        name: name.trim(),
        mobile: cleanMobile,
        loanType: category.title as any,
        amount: amount ? `₹${amount}` : `₹${calcAmount.toLocaleString('en-IN')}`,
        city: 'Basavakalyan',
        notes: `Submitted via Landing Page: ${category.title} in Basavakalyan`
      });
      setSubmitted(true);
      setName('');
      setMobile('');
      setAmount('');
    } catch (e: any) {
      setErrorMsg(e?.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  // Category specific rich FAQs
  const faqs = useMemo(() => {
    switch (category.id) {
      case 'personal-loan':
        return [
          {
            q: 'How fast can I get a Personal Loan approved in Basavakalyan?',
            a: 'Initial eligibility check is done within 30 minutes. Once documents are verified, the loan sanction and bank disbursal take between 24 and 48 working hours.'
          },
          {
            q: 'Do I need to submit property or collateral for a Personal Loan?',
            a: 'No. Personal Loans in Basavakalyan are 100% unsecured. You do not need to pledge land, house, or gold.'
          },
          {
            q: 'Can self-employed shopkeepers and traders apply in Basavakalyan?',
            a: 'Yes. Both salaried professionals and self-employed individuals with active bank transactions in Basavakalyan are eligible.'
          },
          {
            q: 'What is the minimum monthly income requirement?',
            a: 'Applicants generally need a minimum regular monthly income of ₹15,000 with salary slips or bank account statements.'
          },
          {
            q: 'Does Agent Sagar assist with doorstep document pickup in Basavakalyan?',
            a: 'Yes. Our local team collects your KYC documents, photographs, and bank statements directly from your residence or shop in Basavakalyan.'
          }
        ];
      case 'home-loan':
        return [
          {
            q: 'What is the maximum Home Loan amount I can get in Basavakalyan?',
            a: 'You can apply for housing finance from ₹5 Lakhs up to ₹1 Crore depending on property value and monthly repayment capacity.'
          },
          {
            q: 'Can I apply for a loan to construct a house on my own plot in Basavakalyan?',
            a: 'Yes. We assist with plot-plus-construction loans as well as construction-only loans for approved residential layouts and village plots in Basavakalyan taluka.'
          },
          {
            q: 'Is PMAY (Pradhan Mantri Awas Yojana) subsidy guidance provided?',
            a: 'Yes, we provide end-to-end guidance to check eligibility for government interest subsidy schemes under PMAY for first-time home buyers.'
          },
          {
            q: 'What property documents are required for home loans in Basavakalyan?',
            a: 'Title deed / sale deed, Katha certificate, latest property tax paid receipt, approved building plan, and encumbrance certificate (EC).'
          },
          {
            q: 'What is the maximum tenure for Home Loans?',
            a: 'You can choose flexible repayment tenures extending up to 30 years to keep your monthly EMIs affordable.'
          }
        ];
      case 'gold-loan':
        return [
          {
            q: 'How fast is the Gold Loan disbursal process in Basavakalyan?',
            a: 'Gold Loans are disbursed on the spot within 15 to 20 minutes with instant valuation and cash or bank account transfer.'
          },
          {
            q: 'Is my gold jewelry safe with the lender?',
            a: 'Yes. All pledged gold jewelry is stored in certified tamper-evident bank vaults with 100% complimentary insurance coverage.'
          },
          {
            q: 'Is CIBIL score or salary proof mandatory for Gold Loans?',
            a: 'No. Gold loans are secured against physical gold ornaments (18k-24k), so regular income proof and high credit scores are not mandatory.'
          },
          {
            q: 'What are the repayment options available for Gold Loans?',
            a: 'You can choose monthly interest payments with principal closure at maturity (bullet repayment), or standard monthly EMI schedules.'
          }
        ];
      case 'business-loan':
        return [
          {
            q: 'Who is eligible for an unsecured Business Loan in Basavakalyan?',
            a: 'Local shopkeepers, retailers, wholesalers, merchants, traders, and small enterprise owners in Basavakalyan with an active operational history.'
          },
          {
            q: 'What is the maximum collateral-free business loan limit?',
            a: 'Unsecured business loans range from ₹1 Lakh up to ₹50 Lakhs based on business turnover and GST/banking transactions.'
          },
          {
            q: 'Can I get a loan if I do not have GST registration?',
            a: 'Yes, small shopkeepers and traders with valid Trade License / Shop Act and 6-12 months active current/savings bank statements can apply.'
          },
          {
            q: 'How quickly are funds disbursed for business expansion?',
            a: 'Sanction and account disbursal are typically completed in 2 to 4 working days after document verification.'
          }
        ];
      case 'agriculture-loan':
        return [
          {
            q: 'What types of Agriculture Loans are available in Basavakalyan taluka?',
            a: 'We assist with Kisan Credit Card (KCC) loans, crop production finance, tractor & harvester loans, borewell funding, and drip irrigation equipment loans.'
          },
          {
            q: 'What documents do farmers need to submit?',
            a: 'Aadhaar Card, agricultural land RTC (Pahani) records, 7/12 extract, active bank passbook, and passport photographs.'
          },
          {
            q: 'Are repayment schedules aligned with harvest cycles?',
            a: 'Yes, agriculture loans feature flexible post-harvest repayment cycles matching local Kharif and Rabi crop seasons.'
          },
          {
            q: 'Can farmers across rural Basavakalyan taluka apply?',
            a: 'Yes, farmers from Sastapur, Rajeshwar, Kohinoor, Hulsoor, Mudbi, Muchalamba, and all connecting villages are served with doorstep guidance.'
          }
        ];
      case 'vehicle-loan':
        return [
          {
            q: 'Can I get financing for commercial vehicles and tractors in Basavakalyan?',
            a: 'Yes, we facilitate financing for cars, two-wheelers, auto-rickshaws, goods carriers, and agricultural tractors with up to 90% on-road funding.'
          },
          {
            q: 'Is vehicle loan available for second-hand / pre-owned vehicles?',
            a: 'Yes, certified pre-owned cars and commercial vehicles can also be financed with flexible EMIs up to 5 years.'
          }
        ];
      case 'mortgage-loan':
        return [
          {
            q: 'What is Loan Against Property (LAP) and how does it work?',
            a: 'LAP allows you to mortgage your residential house, commercial shop, or registered plot to obtain large funds at interest rates much lower than unsecured loans.'
          },
          {
            q: 'Can I continue living in or renting out my property during the loan tenure?',
            a: 'Yes, you retain complete ownership, occupancy, and rental rights of the mortgaged property throughout the loan tenure.'
          }
        ];
      default:
        return [
          {
            q: `How do I apply for ${category.title} in Basavakalyan?`,
            a: `Submit the quick form on this page or contact Agent Sagar on WhatsApp (+91 96326 36718) for instant doorstep consultation.`
          },
          {
            q: `What is the starting interest rate for ${category.title}?`,
            a: `Rates start from ${category.minRate} depending on your profile, credit score, and lender guidelines.`
          }
        ];
    }
  }, [category]);

  return (
    <article className="bg-white text-slate-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Breadcrumb Navigation with Backlinks */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 border-b border-slate-200 pb-4">
          <ol itemScope itemType="https://schema.org/BreadcrumbList" className="flex items-center gap-2 flex-wrap font-medium">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <a
                href="/"
                itemProp="item"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateHome();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-vermillion" />
                <span itemProp="name">Home (Agent Sagar)</span>
              </a>
              <meta itemProp="position" content="1" />
            </li>
            <li className="text-slate-300">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <a
                href="/#loans"
                itemProp="item"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateHome();
                }}
                className="text-slate-600 hover:text-vermillion transition-colors"
              >
                <span itemProp="name">Loan Services</span>
              </a>
              <meta itemProp="position" content="2" />
            </li>
            <li className="text-slate-300">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="text-vermillion font-bold" aria-current="page">
              <span itemProp="name">{category.title}</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>

          <div className="flex items-center gap-3">
            <a 
              href="tel:+919632636718"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-vermillion"
            >
              <PhoneCall className="w-3.5 h-3.5 text-vermillion" />
              <span>+91 96326 36718</span>
            </a>
            <a
              href="https://wa.me/919632636718"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </nav>

        {/* Hero Banner Section for this specific Loan Category */}
        <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="max-w-4xl space-y-4 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-vermillion text-white text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Basavakalyan Verified Service
              </span>
              <span className="bg-slate-700/80 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-slate-600">
                <MapPin className="w-3.5 h-3.5" />
                <span>Basavakalyan (585327) & Bidar District</span>
              </span>
            </div>

            {/* Main H1 Primary Keyword Heading */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {category.title} in Basavakalyan
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {category.shortDesc} Agent Sagar provides end-to-end guidance, doorstep documentation, and multi-lender rate comparison across Basavakalyan town and surrounding taluka villages.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Interest Rate</div>
                <div className="text-lg font-black text-vermillion mt-0.5">{category.minRate}</div>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Max Sanction</div>
                <div className="text-lg font-black text-emerald-400 mt-0.5">{category.maxAmount}</div>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Repayment Tenure</div>
                <div className="text-lg font-black text-white mt-0.5">{category.maxTenure}</div>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Doorstep Support</div>
                <div className="text-lg font-black text-amber-400 mt-0.5">Free in Town</div>
              </div>
            </div>
          </div>
        </header>

        {/* PILLAR PAGE BACKLINK BANNER (Topic Cluster Core Anchor) */}
        <section aria-label="Central Pillar Hub Connection" className="bg-gradient-to-r from-vermillion/5 via-amber-500/5 to-slate-50 border-2 border-vermillion/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-vermillion/10 border border-vermillion/20 flex items-center justify-center text-vermillion flex-shrink-0 mt-0.5">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-black uppercase tracking-wider text-vermillion">Topic Cluster Supporting Page</div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900">
                Part of the Agent Sagar Basavakalyan Master Financial Pillar Hub
              </div>
              <p className="text-xs text-slate-600">
                Explore our main portal to compare all 8 retail, commercial, gold, and farming loan products side by side with official bank partnerships.
              </p>
            </div>
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-vermillion text-white text-xs font-black rounded-xl transition-colors flex-shrink-0 cursor-pointer shadow-xs group"
          >
            <span>Back to Master Pillar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400 group-hover:text-white" />
          </a>
        </section>

        {/* 2-Column Main Landing Page Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTENT COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">

            {/* SECTION: Interactive EMI Calculator Tailored for this Category */}
            <section className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-vermillion">
                    <Calculator className="w-4 h-4" />
                    <span>Monthly Installment Calculator</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Estimate Your Monthly EMI for {category.title}
                  </h2>
                </div>
                <span className="text-xs bg-white text-slate-700 font-bold px-3 py-1 rounded-full border border-slate-200">
                  Live Calculator
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Amount Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Loan Amount:</span>
                    <span className="text-slate-900 font-black">₹{calcAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={category.id === 'home-loan' || category.id === 'mortgage-loan' ? 500000 : 25000}
                    max={category.id === 'home-loan' ? 10000000 : category.id === 'mortgage-loan' ? 20000000 : 5000000}
                    step={25000}
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full accent-vermillion cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Min</span>
                    <span>Max ({category.maxAmount})</span>
                  </div>
                </div>

                {/* Interest Rate Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Interest Rate:</span>
                    <span className="text-vermillion font-black">{calcRate.toFixed(1)}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min={7}
                    max={24}
                    step={0.1}
                    value={calcRate}
                    onChange={(e) => setCalcRate(Number(e.target.value))}
                    className="w-full accent-vermillion cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>7%</span>
                    <span>24%</span>
                  </div>
                </div>

                {/* Tenure Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Tenure:</span>
                    <span className="text-slate-900 font-black">{calcTenureYears} Years ({calcTenureYears * 12} Mo)</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={category.id === 'home-loan' ? 30 : category.id === 'mortgage-loan' ? 15 : 7}
                    step={1}
                    value={calcTenureYears}
                    onChange={(e) => setCalcTenureYears(Number(e.target.value))}
                    className="w-full accent-vermillion cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1 Year</span>
                    <span>{category.maxTenure}</span>
                  </div>
                </div>
              </div>

              {/* Calculator Results Box */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="border-b sm:border-b-0 sm:border-r border-slate-100 pb-3 sm:pb-0">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated Monthly EMI</div>
                  <div className="text-2xl font-black text-vermillion mt-1">₹{emi.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-500">per month</div>
                </div>
                <div className="border-b sm:border-b-0 sm:border-r border-slate-100 pb-3 sm:pb-0">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Interest</div>
                  <div className="text-xl font-black text-slate-800 mt-1">₹{totalInterest.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-500">over {calcTenureYears} years</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Repayment</div>
                  <div className="text-xl font-black text-emerald-700 mt-1">₹{totalPayment.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-500">Principal + Interest</div>
                </div>
              </div>
            </section>

            {/* SECTION: Key Features & Advantages */}
            <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-vermillion">
                  <Sparkles className="w-4 h-4" />
                  <span>Key Benefits & Highlights</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Why Choose {category.title} via Agent Sagar?
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Applying directly at bank counters often leads to delays, repetitive branch visits, and document rejections. Agent Sagar ensures your application is pre-screened for eligibility, paired with the best partner bank or NBFC, and verified with doorstep coordination.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {category.features.map((feat, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-800 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION: Eligibility & Required Documents */}
            <section className="space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900">
                Eligibility & Required Documentation Checklist
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Eligibility Box */}
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-vermillion font-extrabold text-base border-b border-slate-100 pb-3">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Eligibility Criteria</span>
                  </div>
                  <ul className="space-y-3">
                    {category.eligibility.map((item, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-slate-700 font-medium flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-vermillion mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Documents Box */}
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-base border-b border-slate-100 pb-3">
                    <FileText className="w-5 h-5" />
                    <span>Documents Required</span>
                  </div>
                  <ul className="space-y-3">
                    {category.documents.map((item, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-slate-700 font-medium flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION: Step-by-Step Local Process in Basavakalyan */}
            <section className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-vermillion">
                  <Clock className="w-4 h-4" />
                  <span>Transparent 4-Step Process</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  How {category.title} Processing Works in Basavakalyan
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    step: '1',
                    title: 'Submit Enquiry',
                    desc: 'Fill out the quick online form, call +91 96326 36718, or send a WhatsApp message.'
                  },
                  {
                    step: '2',
                    title: 'Free Evaluation',
                    desc: 'We review your profile, calculate eligibility, and select the optimal lending institution.'
                  },
                  {
                    step: '3',
                    title: 'Doorstep Pickup',
                    desc: 'Our local representative collects KYC and income documents from your home or shop.'
                  },
                  {
                    step: '4',
                    title: 'Bank Disbursal',
                    desc: 'Upon official underwriting sanction, funds are credited directly to your bank account.'
                  }
                ].map((item) => (
                  <div key={item.step} className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2 relative">
                    <div className="w-7 h-7 bg-vermillion text-white rounded-full flex items-center justify-center font-black text-xs">
                      {item.step}
                    </div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">{item.title}</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION: Local Area Coverage in Basavakalyan */}
            <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <MapPin className="w-4 h-4" />
                  <span>Local Neighborhood Service</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Serving Borrowers Across All Areas of Basavakalyan (585327)
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Our loan facilitation and doorstep document assistance is actively available in:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-semibold text-slate-800">
                {[
                  'Basavakalyan Main Market',
                  'Reliance Mart / Main Road',
                  'Bus Stand & Auto Stand Area',
                  'Shivaji Nagar & Fort Area',
                  'Model Colony & Tripurant',
                  'Sastapur Bangla (NH-65)',
                  'Rajeshwar & Kohinoor',
                  'Hulsoor & Mudbi',
                  'Muchalamba & Narayanpur'
                ].map((loc, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-vermillion flex-shrink-0" />
                    <span>{loc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION: Category Specific FAQs */}
            <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-vermillion">
                  <HelpCircle className="w-4 h-4" />
                  <span>Questions & Answers</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Frequently Asked Questions ({category.title})
                </h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="border-2 border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex justify-between items-center hover:text-vermillion cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-vermillion flex-shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed border-t border-slate-200 pt-3 bg-white">
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION: Internal Crawlable Links to Other Loan Landing Pages + Master Pillar Link */}
            <section className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-vermillion">
                  <Layers className="w-4 h-4" />
                  <span>Explore Related Categories & Master Hub</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Compare Other Loan Options in Basavakalyan
                </h2>
              </div>

              <p className="text-xs text-slate-600 font-normal">
                Need a different financing solution or want a holistic view of all credit products? Visit our master hub or explore specific loan categories:
              </p>

              {/* Master Pillar Hub Primary Card */}
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateHome();
                }}
                className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl flex items-center justify-between group transition-all cursor-pointer shadow-md hover:ring-2 hover:ring-vermillion"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-vermillion flex items-center justify-center font-bold text-white shadow-xs">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Central Topic Pillar</div>
                    <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                      Agent Sagar Loans Basavakalyan (Master Hub)
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Explore all 8 loan categories, direct eligibility tools & taluka consultation
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:text-white transition-colors">
                  <span>Visit Pillar</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {otherCategories.map((other) => (
                  <a
                    key={other.slug}
                    href={`/${other.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigateToSeoPage) {
                        onNavigateToSeoPage(other.slug);
                      } else {
                        onNavigateHome();
                      }
                    }}
                    className="p-4 bg-white border border-slate-200 hover:border-vermillion rounded-2xl text-left flex items-center justify-between group transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                  >
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-vermillion transition-colors">
                        {other.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Rate from {other.minRate} • Sanction {other.maxAmount}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-vermillion group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT STICKY LEAD APPLICATION COLUMN (4 Cols) */}
          <div className="lg:col-span-4 sticky top-20 space-y-6">
            
            {/* Quick Application Card */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="text-center pb-3 border-b border-slate-100">
                <span className="bg-vermillion text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Instant Enquiry
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  Apply for {category.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Get instant callback from our Basavakalyan desk
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-600 text-white font-extrabold rounded-full flex items-center justify-center mx-auto text-xl shadow-xs">
                    ✓
                  </div>
                  <h4 className="text-sm font-extrabold text-emerald-900">Enquiry Received!</h4>
                  <p className="text-xs text-slate-700 font-medium">
                    Thank you, our loan advisor will contact you within 15 minutes to coordinate your application.
                  </p>
                  
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-vermillion" />
                      <span>Submit Another Enquiry</span>
                    </button>

                    <button
                      onClick={onNavigateHome}
                      className="w-full py-2.5 bg-vermillion hover:bg-vermillion-dark text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Return to Home Page</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {errorMsg && (
                    <div className="bg-red-50 border border-red-300 text-red-700 text-xs p-2.5 rounded-xl font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Patil"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Mobile Number (10 Digits) *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Required Loan Amount</label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`e.g. ₹${calcAmount.toLocaleString('en-IN')}`}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-4 bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{submitting ? 'Submitting...' : `Apply for ${category.title}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-center text-slate-500">
                    🔒 Zero upfront charges. Your data is kept 100% confidential.
                  </p>
                </form>
              )}
            </div>

            {/* Direct Helpline Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm space-y-3">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4" />
                <span>Instant Phone Assistance</span>
              </div>
              <p className="text-xs text-slate-300">
                Need urgent loan consultation or doorstep document collection in Basavakalyan?
              </p>
              <div className="space-y-2 pt-1">
                <a
                  href="tel:+919632636718"
                  className="w-full py-2.5 bg-vermillion hover:bg-vermillion-dark text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call +91 96326 36718</span>
                </a>
                <a
                  href="https://wa.me/919632636718"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Sidebar Pillar Master Hub Backlink */}
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 space-y-2.5">
              <div className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-vermillion" />
                <span>Central Financial Pillar Hub</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-normal">
                Want to review all lending partners, compare multiple loan quotes, or visit the main desk?
              </p>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateHome();
                }}
                className="w-full py-2 px-3 bg-white hover:bg-amber-100 text-slate-900 border border-amber-300 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Return to Master Pillar</span>
                <ArrowRight className="w-3.5 h-3.5 text-vermillion" />
              </a>
            </div>

          </div>

        </div>

        {/* Backlinks & Local Resource Network (Cross-Page Backlinks on Every Page) */}
        <PageBacklinksNetwork
          currentSlug={category.slug}
          currentPageTitle={`${category.title} in Basavakalyan`}
          onNavigateToSeoPage={onNavigateToSeoPage}
          onNavigateHome={onNavigateHome}
        />

      </div>
    </article>
  );
};
