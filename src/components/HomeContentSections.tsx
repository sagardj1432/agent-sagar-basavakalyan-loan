import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Building2, 
  UserCheck, 
  Layers, 
  PhoneCall, 
  Clock, 
  Scale, 
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { LoanType } from '../types';

interface HomeContentSectionsProps {
  onOpenApplyModal: (loanType?: string) => void;
  onNavigateToSeoPage: (slug: string) => void;
}

export const HomeContentSections: React.FC<HomeContentSectionsProps> = ({
  onOpenApplyModal,
  onNavigateToSeoPage
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What loan services are available in Basavakalyan through Agent Sagar?',
      a: 'We provide comprehensive loan assistance for Personal Loans, Home Loans (construction & purchase), Business Loans (working capital & shopkeeper credit), Vehicle Loans (commercial, auto, car, bike), Gold Loans (instant cash), Mortgage Loans (Loan Against Property), Agriculture / Kisan Loans, and Credit Cards across Basavakalyan and Bidar district.'
    },
    {
      q: 'How can I submit a loan enquiry?',
      a: 'You can submit an enquiry easily by filling out our quick online form on this website with your Name and Mobile Number, calling us directly at +91 96326 36718, or sending a message on WhatsApp. Our representative will contact you to understand your requirements.'
    },
    {
      q: 'What documents may be required for loan processing?',
      a: 'Documents vary depending on the lender and loan type. Commonly requested documents include Aadhaar Card, PAN Card, address proof, 3 to 6 months of bank account statements, salary slips (for employed applicants) or business/trade proofs (for merchants and shopkeepers), and land RTC/Pahani for agricultural credit.'
    },
    {
      q: 'Can I enquire about a personal loan if I am self-employed or salaried in Basavakalyan?',
      a: 'Yes. Both salaried professionals and self-employed individuals residing in Basavakalyan town or surrounding taluka villages can enquire for personal loans. Eligibility depends on regular monthly income, banking stability, and credit profile.'
    },
    {
      q: 'Can I enquire about a home loan for construction or plot purchase in Basavakalyan?',
      a: 'Yes. We assist with home construction, ready house purchases, plot-plus-construction loans, and renovation finance with tenure options up to 30 years and subsidy scheme guidance where applicable.'
    },
    {
      q: 'Can local business owners, traders, and shopkeepers submit an enquiry for working capital?',
      a: 'Yes. Local merchants, retailers, wholesalers, and service providers operating in Basavakalyan commercial markets can apply for collateral-free business loans, overdraft facilities, and machinery loans.'
    },
    {
      q: 'Can I enquire about a vehicle loan for commercial vehicles, tractors, or cars?',
      a: 'Yes. Vehicle finance is available for two-wheelers, passenger cars, auto-rickshaws, tractors, and commercial goods carriers with flexible down payment options.'
    },
    {
      q: 'How long does the loan processing and sanction take?',
      a: 'Processing timelines depend on the loan category and the partner bank/NBFC. Gold loans are generally processed in 15 to 30 minutes, personal loans within 24 to 48 hours, while secured home, mortgage, and business loans typically require 3 to 7 working days for complete legal and technical verification.'
    },
    {
      q: 'Is loan approval guaranteed for every applicant?',
      a: 'No. Loan approval, sanctioned amount, and final interest rates are strictly determined by the respective lending institutions based on applicant credit score, repayment capacity, documentation verification, and lending policy. Agent Sagar provides honest consultation and application assistance to improve documentation accuracy.'
    },
    {
      q: 'Which areas around Basavakalyan and Bidar district do you serve?',
      a: 'We assist residents across Basavakalyan main town, Sastapur Bangla, Fort Area, Shivaji Nagar, Model Colony, Rajeshwar, Kohinoor, Hulsoor, and neighboring talukas within Bidar district, Karnataka.'
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-900 space-y-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* SECTION 1: Why Choose Agent Sagar */}
        <section aria-labelledby="why-choose-heading" className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vermillion-light border border-vermillion-light text-vermillion text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-vermillion" />
              <span>Transparent & Reliable Support</span>
            </div>
            <h2 id="why-choose-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Choose Agent Sagar for Loan Assistance
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              Navigating multiple bank branches, complex paperwork, and varying eligibility rules can be overwhelming. As your local loan assistance partner in Basavakalyan, we simplify your financing journey with ethical, end-to-end guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-vermillion-light text-vermillion flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Local Physical Presence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Based right here in Basavakalyan, providing personalized doorstep assistance rather than impersonal online call centers.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Multi-Lender Comparisons</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We help you evaluate multiple banks and NBFC options to discover suitable interest rates and repayment terms for your profile.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Documentation Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We assist you in organizing required KYC, income records, and property or vehicle papers before formal bank submission.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Faster Application Follow-up</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Active coordination with local lending officers to reduce unnecessary application delays and keep you updated.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Zero Upfront Hidden Charges</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete transparency in all loan terms, processing fee explanations, and fair consultation practices.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Dedicated Customer Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-on-one assistance from initial enquiry through file processing, sanction letter issuance, and final disbursement.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: Loan Application Process */}
        <section aria-labelledby="process-heading" className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vermillion-light border border-vermillion-light text-vermillion text-xs font-bold">
              <Layers className="w-4 h-4 text-vermillion" />
              <span>Step-by-Step Procedure</span>
            </div>
            <h2 id="process-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our 5-Step Loan Application Process
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              We guide applicants through an orderly, structured process to ensure accurate filing and prompt bank reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Submit Enquiry',
                desc: 'Fill our website form, call us at +91 96326 36718, or send a WhatsApp message with your basic details.'
              },
              {
                step: '02',
                title: 'Discuss Requirements',
                desc: 'Our representative connects to review your loan category, desired amount, and monthly repayment goals.'
              },
              {
                step: '03',
                title: 'Document Review',
                desc: 'We verify your KYC, bank statements, income proof, or property details to ensure eligibility criteria.'
              },
              {
                step: '04',
                title: 'Application Submission',
                desc: 'Your file is forwarded to the appropriate bank/NBFC partner for formal verification and appraisal.'
              },
              {
                step: '05',
                title: 'Follow-up & Disbursal',
                desc: 'We track file status, facilitate any additional bank queries, and assist until loan amount is disbursed.'
              }
            ].map((st, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 relative flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-vermillion bg-vermillion-light px-2.5 py-1 rounded-lg">
                    Step {st.step}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xs">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm pt-2">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Documents Commonly Required */}
        <section aria-labelledby="documents-heading" className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vermillion-light border border-vermillion-light text-vermillion text-xs font-bold">
              <FileText className="w-4 h-4 text-vermillion" />
              <span>Checklist & Preparation</span>
            </div>
            <h2 id="documents-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Documents Commonly Required for Loans
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              <em>Note: Documents may vary depending on the lender, loan category, and applicant profile.</em> Having these records ready helps expedite verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-vermillion" />
                <span>Identity & KYC Proof</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li>Aadhaar Card</li>
                <li>PAN Card</li>
                <li>Voter ID / Driving License</li>
                <li>Recent passport-size photographs</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-vermillion" />
                <span>Income & Banking Proof</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li>Last 3 to 6 months bank statements</li>
                <li>Salary slips & Form 16 (for salaried)</li>
                <li>IT Returns / computation (if available)</li>
                <li>Bank passbook with latest update</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-vermillion" />
                <span>Business & Self-Employed</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li>Trade license or Shop Act registration</li>
                <li>GST registration & filings (if applicable)</li>
                <li>Business address proof / tenancy deed</li>
                <li>6 months current account statements</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-vermillion" />
                <span>Agricultural Loans</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li>Pahani / RTC land record copies</li>
                <li>7/12 & 8A extracts where required</li>
                <li>Kisan Credit Card (KCC) passbook</li>
                <li>No-objection / title confirmation</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-vermillion" />
                <span>Property / Home Loans</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li>Registered Sale Deed & title chain</li>
                <li>Katha extract & latest property tax receipts</li>
                <li>Approved house construction blueprint</li>
                <li>Encumbrance Certificate (EC 13/30 years)</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-vermillion" />
                <span>Vehicle Loans</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li>Valid Driving License & KYC</li>
                <li>Proforma invoice / dealer quotation</li>
                <li>Existing vehicle RC (for used vehicle/transfer)</li>
                <li>Bank statement of primary account</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 4: Local Loan Assistance in Basavakalyan, Bidar, Karnataka */}
        <section aria-labelledby="local-coverage-heading" className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vermillion-light border border-vermillion-light text-vermillion text-xs font-bold">
              <Building2 className="w-4 h-4 text-vermillion" />
              <span>Local Community Reach</span>
            </div>
            <h2 id="local-coverage-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Loan Assistance Across Basavakalyan & Bidar District
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              Basavakalyan is an important historic and commercial center situated on NH-65 in Bidar district, Karnataka. With bustling markets, agricultural trade, transport networks, and growing residential layouts, families and business owners frequently need reliable access to institutional finance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2.5">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-vermillion" />
                <span>Basavakalyan Town Center</span>
              </h3>
              <p className="leading-relaxed">
                Dedicated support for residents and traders around Main Market, Bus Stand Road, Shivaji Nagar, Fort Area, and Model Colony.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2.5">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-vermillion" />
                <span>NH-65 & Commercial Hubs</span>
              </h3>
              <p className="leading-relaxed">
                Assistance for transport operators, merchants, and highway commercial properties near Sastapur Bangla, Rajeshwar, and surrounding junctions.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2.5">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-vermillion" />
                <span>Rural Taluka & Bidar District</span>
              </h3>
              <p className="leading-relaxed">
                Agricultural, Kisan, and tractor loans tailored for farmers across rural villages of Basavakalyan, Hulsoor, Kohinoor, and Bidar region.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: Frequently Asked Questions (FAQ) */}
        <section aria-labelledby="faq-heading" className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vermillion-light border border-vermillion-light text-vermillion text-xs font-bold">
              <HelpCircle className="w-4 h-4 text-vermillion" />
              <span>Questions & Answers</span>
            </div>
            <h2 id="faq-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions About Loan Services in Basavakalyan
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              Find answers to common queries regarding loan eligibility, document requirements, application steps, and timelines in Basavakalyan.
            </p>
          </div>

          <div className="space-y-3 max-w-4xl">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="border-2 border-slate-200 rounded-2xl overflow-hidden transition-all bg-white"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-vermillion transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-extrabold">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-vermillion flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 6: Compliance & Trust Disclaimer */}
        <section aria-labelledby="disclaimer-heading" className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <h3 id="disclaimer-heading">Important Disclaimer & Advisory</h3>
          </div>
          <p className="leading-relaxed">
            Agent Sagar operates solely as an independent loan assistance provider, documentation counselor, and customer facilitator in Basavakalyan, Bidar, Karnataka. Loan approvals, sanctioned amounts, interest rates, processing charges, and disbursement timelines are at the sole discretion of partner banks and RBI-registered NBFCs in accordance with applicant creditworthiness and respective lending policies. We do not charge unauthorized upfront processing fees and we do not guarantee automatic loan sanctions.
          </p>
        </section>

      </div>
    </div>
  );
};
