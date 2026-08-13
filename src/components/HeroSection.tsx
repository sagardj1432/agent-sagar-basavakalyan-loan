import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, PhoneCall, Sparkles, Send, Clock, Banknote, UserCheck, ArrowLeft, RotateCcw, Building2 } from 'lucide-react';
import basavakalyanGateImg from '../assets/images/basavakalyan_gate_1786122813530.jpg';
import agentSagarLogo from '../assets/images/agent_sagar_logo_1786613776078.jpg';
import { LoanType } from '../types';
import { apiService } from '../services/api';

interface HeroSectionProps {
  onLeadSubmitted: () => void;
  onSelectCategory: (loanType: LoanType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLeadSubmitted, onSelectCategory }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [loanType, setLoanType] = useState<LoanType>('Personal Loan');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setSubmitting(true);
    try {
      await apiService.submitLead({
        name,
        mobile: cleanMobile,
        loanType,
        amount: amount ? `₹${amount}` : 'Flexible',
        city: 'Basavakalyan',
        notes: 'Submitted via Hero Banner Lead Form'
      });
      setSubmittedSuccess(true);
      setName('');
      setMobile('');
      setAmount('');
      onLeadSubmitted();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative bg-white text-slate-900 overflow-hidden py-10 lg:py-16 border-b border-slate-200">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Logo Badge & Location Tag */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vermillion-light border border-vermillion-light text-vermillion text-xs font-bold">
                <Sparkles className="w-4 h-4 text-vermillion" />
                <span>#1 Trusted Loan Agent in Basavakalyan</span>
              </div>
            </div>

            {/* Agent Sagar Brand Banner Logo */}
            <div className="inline-block bg-white p-2 rounded-2xl border-2 border-slate-200 shadow-sm max-w-md mx-auto lg:mx-0">
              <img 
                src={agentSagarLogo} 
                alt="Agent Sagar - Your Loan Our Support Your Growth" 
                className="w-full h-auto max-h-20 sm:max-h-24 object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Agent Sagar <br className="hidden sm:inline" />
              <span className="text-vermillion">
                Basavakalyan Loan Services
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-700 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Your most trusted local loan agent in Basavakalyan. Get fast, hassle-free approvals on <strong className="text-slate-900 font-bold">Personal Loans</strong>, <strong className="text-slate-900 font-bold">Home Loans</strong>, <strong className="text-slate-900 font-bold">Gold Loans</strong>, <strong className="text-slate-900 font-bold">Business Loans</strong>, <strong className="text-slate-900 font-bold">Agriculture Loans</strong>, and <strong className="text-slate-900 font-bold">Credit Cards</strong> with dedicated local support across Basavakalyan.
            </p>

            {/* Key Value Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
                <Clock className="w-6 h-6 text-vermillion flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Spot Sanction</p>
                  <p className="text-[11px] text-slate-500 font-medium">Within 24 hours</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
                <Banknote className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Lowest Rates</p>
                  <p className="text-[11px] text-slate-500 font-medium">From 0.75% pm</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs col-span-2 sm:col-span-1">
                <UserCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Agent Assistance</p>
                  <p className="text-[11px] text-slate-500 font-medium">Free consultation</p>
                </div>
              </div>
            </div>

            {/* Quick Loan Quick-Select Chips */}
            <div className="pt-2">
              <p className="text-xs text-slate-500 mb-2.5 font-bold uppercase tracking-wider">Select Loan Category:</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {[
                  'Personal Loan',
                  'Home Loan',
                  'Gold Loan',
                  'Business Loan',
                  'Agriculture Loan',
                  'Credit Card'
                ].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setLoanType(type as LoanType);
                      onSelectCategory(type as LoanType);
                    }}
                    className={`text-xs px-3.5 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                      loanType === type
                        ? 'bg-vermillion text-white border-vermillion shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-vermillion hover:text-vermillion'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Hero Right Lead Form */}
          <div className="lg:col-span-5">
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              
              {/* Clean Corporate Vermillion Header Bar */}
              <div className="bg-vermillion text-white p-4 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Instant Consultation</span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-0.5">
                    Apply for Loan Today
                  </h2>
                </div>
                <Building2 className="w-8 h-8 text-white/30" />
              </div>

              {submittedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto font-extrabold text-2xl shadow-sm">
                    ✓
                  </div>
                  <h3 className="text-lg font-extrabold text-emerald-900">Application Submitted!</h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Thank you, <strong className="text-slate-900">{name || 'valued customer'}</strong>! Our local representative from Basavakalyan will call your mobile number within <strong className="text-vermillion font-bold">15 minutes</strong>.
                  </p>
                  
                  {/* Return and Edit Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => setSubmittedSuccess(false)}
                      className="w-full sm:w-auto px-4 py-2.5 bg-white text-slate-800 border border-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-vermillion" />
                      <span>Back & Modify Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setName('');
                        setMobile('');
                        setAmount('');
                        setSubmittedSuccess(false);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-vermillion text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-vermillion-dark transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>New Application</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="bg-red-50 border border-red-300 text-red-700 text-xs p-3 rounded-xl font-medium">
                      {errorMsg}
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Full Name <span className="text-vermillion">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Basavaraj Patil"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:border-vermillion focus:bg-white transition-colors placeholder:text-slate-400"
                    />
                  </div>

                  {/* Mobile Number Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Mobile Number <span className="text-vermillion">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-xs font-extrabold text-slate-500">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="10 digit mobile number"
                        className="w-full pl-14 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:border-vermillion focus:bg-white transition-colors placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Loan Category Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Select Loan Category
                    </label>
                    <select
                      value={loanType}
                      onChange={(e) => setLoanType(e.target.value as LoanType)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:border-vermillion focus:bg-white transition-colors"
                    >
                      <option value="Personal Loan">Personal Loan Basavakalyan</option>
                      <option value="Home Loan">Home Loan Basavakalyan</option>
                      <option value="Gold Loan">Gold Loan Basavakalyan</option>
                      <option value="Business Loan">Business Loan Basavakalyan</option>
                      <option value="Agriculture Loan">Agriculture Loan Basavakalyan</option>
                      <option value="Credit Card">Credit Card Basavakalyan</option>
                      <option value="Vehicle Loan">Vehicle / Equipment Loan</option>
                    </select>
                  </div>

                  {/* Expected Loan Amount */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Loan Amount Needed (Optional)
                    </label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 2,00,000"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:border-vermillion focus:bg-white transition-colors placeholder:text-slate-400"
                    />
                  </div>

                  {/* Apply Now Button - Large Simple Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-xl bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-base shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <ArrowRight className="w-5 h-5 text-white" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-500 font-medium">
                    🔒 100% Confidential. Zero spam. Fast agent support in Basavakalyan.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
