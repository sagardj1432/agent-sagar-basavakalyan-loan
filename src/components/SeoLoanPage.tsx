import React, { useState } from 'react';
import { LoanCategoryInfo } from '../types';
import { LOAN_CATEGORIES } from '../data/loansData';
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles, FileText, ChevronDown, ChevronUp, MapPin, User, Star, ArrowLeft, RotateCcw, Building2, PhoneCall, Award } from 'lucide-react';
import { apiService } from '../services/api';

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

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name.trim()) return setErrorMsg('Please enter your full name');
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) return setErrorMsg('Please enter a 10-digit mobile number');

    setSubmitting(true);
    try {
      await apiService.submitLead({
        name,
        mobile: cleanMobile,
        loanType: category.title as any,
        amount: amount ? `₹${amount}` : 'Flexible',
        city: 'Basavakalyan',
        notes: `Submitted via SEO Page: ${category.title}`
      });
      setSubmitted(true);
      setName('');
      setMobile('');
      setAmount('');
    } catch (e: any) {
      setErrorMsg(e?.message || 'Error submitting');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: `How quickly can I get a ${category.title} approved in Basavakalyan?`,
      a: `In most cases, initial approval for ${category.title} in Basavakalyan is provided within 12 to 24 hours. Gold Loans are disbursed in spot cash within 15 minutes at our local office.`
    },
    {
      q: `What is the starting interest rate for ${category.title}?`,
      a: `Our rates start as low as ${category.minRate}. Exact interest rate depends on your income profile, repayment history, or collateral.`
    },
    {
      q: `How does local document verification work in Basavakalyan?`,
      a: `Our local loan advisors guide you step-by-step through document preparation and verification at our local office or via fast digital support across Basavakalyan town, Rajeshwar, Kohinoor, and nearby local areas.`
    },
    {
      q: `What documents are required for ${category.title}?`,
      a: `Primary documents required are Aadhaar Card, PAN Card, passport photographs, address proof, and basic income records (bank statements / Pahani for farmers).`
    }
  ];

  return (
    <article className="bg-white text-slate-900 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb & Navigation */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 border-b border-slate-200 pb-4">
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-vermillion" />
                <span>Return to Home</span>
              </button>
            </li>
            <li className="text-slate-300">/</li>
            <li className="text-slate-600 font-medium">Loan Services</li>
            <li className="text-slate-300">/</li>
            <li className="text-vermillion font-bold" aria-current="page">{category.title}</li>
          </ol>

          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-600 hover:text-slate-900 underline font-semibold"
          >
            ← Back to All Loan Services
          </button>
        </nav>

        {/* SEO Meta Header Banner */}
        <header className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4 relative overflow-hidden">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-vermillion-light text-vermillion text-xs font-bold px-3 py-1 rounded-full border border-vermillion-light">
              Official Loan Assistance
            </span>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Localized for Basavakalyan (585327) & Surrounding Taluka</span>
            </span>
          </div>

          {/* Primary H1 Heading */}
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {category.seoTitle}
          </h1>

          <p className="text-slate-700 text-sm sm:text-base max-w-3xl leading-relaxed font-normal">
            {category.seoDescription}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            {category.keywords.map((kw, i) => (
              <span key={i} className="bg-white text-slate-800 font-medium px-3 py-1 rounded-lg border border-slate-200">
                #{kw}
              </span>
            ))}
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Details, Rates, Checklist */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 bg-slate-50 border-2 border-slate-200 p-5 rounded-2xl">
              <div>
                <p className="text-xs text-slate-500 font-bold">Interest Rate</p>
                <p className="text-lg font-black text-vermillion mt-0.5">{category.minRate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold">Max Sanction</p>
                <p className="text-lg font-black text-emerald-700 mt-0.5">{category.maxAmount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold">Tenure</p>
                <p className="text-lg font-black text-slate-900 mt-0.5">{category.maxTenure}</p>
              </div>
            </div>

            {/* Key Benefits & Features */}
            <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-vermillion" />
                <span>Why Choose {category.title} in Basavakalyan?</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Whether you live near Reliance Mart, Main Bazar, Fort Area, Sastapur Bangla, or surrounding villages in Basavakalyan, our localized approval process ensures maximum speed and zero hassle.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {category.features.map((feat, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-800 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Eligibility & Document Checklist */}
            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900">
                Eligibility & Required Documents for {category.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Eligibility */}
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-3">
                  <h3 className="text-base font-extrabold text-vermillion flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Eligibility Criteria</span>
                  </h3>
                  <ul className="space-y-2">
                    {category.eligibility.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-700 font-medium flex items-start gap-2">
                        <span className="text-vermillion font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Documents */}
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-3">
                  <h3 className="text-base font-extrabold text-emerald-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Required Documents</span>
                  </h3>
                  <ul className="space-y-2">
                    {category.documents.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-700 font-medium flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Local Testimonial */}
            <section className="bg-vermillion-light border border-vermillion-light rounded-3xl p-6 relative">
              <div className="flex items-center gap-1 text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-900 font-medium italic leading-relaxed">
                "Applied for {category.title} from Basavakalyan town. The local agent visited my place for document collection and loan was sanctioned quickly. Highly recommend!"
              </p>
              <div className="mt-3 text-xs font-bold text-vermillion flex items-center gap-2">
                <User className="w-4 h-4 text-vermillion" />
                <span>Verified Local Applicant, Basavakalyan</span>
              </div>
            </section>

            {/* FAQ Accordion */}
            <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4">
              <h2 className="text-lg font-black text-slate-900">
                Frequently Asked Questions ({category.title})
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-2 border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex justify-between items-center hover:text-vermillion cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {openFaqIndex === idx ? <ChevronUp className="w-4 h-4 text-vermillion" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-700 font-normal leading-relaxed border-t border-slate-200 pt-2 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Internal Links: Explore Other Loan Services in Basavakalyan */}
            <section className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-vermillion" />
                  <span>Explore Other Loan Services in Basavakalyan</span>
                </h2>
                <span className="text-xs font-bold text-slate-500">Internal Service Directory</span>
              </div>

              <p className="text-xs text-slate-600 font-normal">
                Looking for alternative financing? Compare interest rates and features across all loan categories available in Basavakalyan:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {otherCategories.map((other) => (
                  <button
                    key={other.id}
                    onClick={() => onNavigateToSeoPage ? onNavigateToSeoPage(other.slug) : onNavigateHome()}
                    className="p-3.5 bg-white border border-slate-200 hover:border-vermillion rounded-2xl text-left flex items-center justify-between group transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-vermillion transition-colors">
                        {other.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Rate from {other.minRate} • Up to {other.maxAmount}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-vermillion group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Embedded Lead Form */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-lg space-y-4">
              <div className="text-center pb-3 border-b border-slate-200">
                <span className="bg-vermillion text-white text-[11px] font-extrabold px-3 py-1 rounded-full">
                  Priority Application
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  Apply for {category.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Get instant callback from our Basavakalyan agent desk
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-2xl text-center space-y-3">
                  <div className="w-10 h-10 bg-emerald-600 text-white font-extrabold rounded-full flex items-center justify-center mx-auto text-xl shadow-xs">
                    ✓
                  </div>
                  <h4 className="text-sm font-extrabold text-emerald-900">Submission Received!</h4>
                  <p className="text-xs text-slate-700 font-medium">
                    Our local advisor in Basavakalyan will reach out shortly.
                  </p>
                  
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-vermillion" />
                      <span>Back & Modify Details</span>
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
                <form onSubmit={handleSubmit} className="space-y-3">
                  {errorMsg && (
                    <div className="bg-red-50 border border-red-300 text-red-700 text-xs p-2 rounded-xl font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="10 digit mobile"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Required Amount</label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. ₹2,00,000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Apply Now'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </article>
  );
};

