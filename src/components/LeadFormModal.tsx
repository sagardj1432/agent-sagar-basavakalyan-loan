import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight, Phone, ArrowLeft, RotateCcw } from 'lucide-react';
import { LoanType } from '../types';
import { apiService } from '../services/api';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLoanType?: string;
  defaultAmount?: string;
  onSubmitted: () => void;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  defaultLoanType = 'Personal Loan',
  defaultAmount = '',
  onSubmitted
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [loanType, setLoanType] = useState<LoanType>(
    (defaultLoanType.includes('Credit') ? 'Credit Card' :
     defaultLoanType.includes('Personal') ? 'Personal Loan' :
     defaultLoanType.includes('Home') ? 'Home Loan' :
     defaultLoanType.includes('Gold') ? 'Gold Loan' :
     defaultLoanType.includes('Business') ? 'Business Loan' :
     defaultLoanType.includes('Vehicle') ? 'Vehicle Loan' :
     defaultLoanType.includes('Mortgage') ? 'Mortgage Loan' :
     defaultLoanType.includes('Agriculture') ? 'Agriculture Loan' : 'Personal Loan') as LoanType
  );
  const [amount, setAmount] = useState(defaultAmount);
  const [city, setCity] = useState('Basavakalyan');
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
        amount: amount || 'Flexible',
        city,
        notes: 'Submitted via Quick Modal Application'
      });
      setSubmittedSuccess(true);
      onSubmitted();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-lg relative shadow-2xl space-y-4 animate-in zoom-in-95">
        
        {/* Header Actions: Back / Close button */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-vermillion" />
            <span>Return to Website</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <ShieldCheck className="w-5 h-5 text-vermillion" />
          <span className="text-xs font-bold text-vermillion uppercase tracking-wider">Fast Track Application</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Apply for {loanType} in Basavakalyan
        </h2>

        <p className="text-xs text-slate-600 font-normal leading-relaxed">
          Complete this quick enquiry form and our local financial agent in Basavakalyan will reach out to you within 15 minutes.
        </p>

        {submittedSuccess ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full font-extrabold flex items-center justify-center mx-auto text-2xl shadow-sm">
              ✓
            </div>
            <h3 className="text-lg font-extrabold text-emerald-900">Application Submitted!</h3>
            <p className="text-xs text-slate-700 font-medium">
              Thank you, <strong className="text-slate-900">{name}</strong>! We have received your application for <strong className="text-vermillion font-bold">{loanType}</strong>.
            </p>

            {/* Back / Modify / Close options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="py-3 px-4 bg-white text-slate-800 border border-slate-300 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-vermillion" />
                <span>Back & Modify Details</span>
              </button>

              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  onClose();
                }}
                className="py-3 px-4 bg-vermillion hover:bg-vermillion-dark text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Done & Return Home</span>
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

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Full Name <span className="text-vermillion">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Suryakant Biradar"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:outline-none focus:border-vermillion focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Mobile Number <span className="text-vermillion">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-xs font-extrabold text-slate-500">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="10 digit mobile"
                  className="w-full pl-14 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Loan Category
                </label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value as LoanType)}
                  className="w-full px-3.5 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:outline-none focus:border-vermillion focus:bg-white"
                >
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Vehicle Loan">Vehicle Loan</option>
                  <option value="Gold Loan">Gold Loan</option>
                  <option value="Mortgage Loan">Mortgage Loan</option>
                  <option value="Agriculture Loan">Agriculture Loan</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Required Amount
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. ₹2,00,000"
                  className="w-full px-3.5 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Area / Village in Basavakalyan
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bus Stand Road, Fort Road, Main Market"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:outline-none focus:border-vermillion focus:bg-white"
              />
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-200 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-vermillion" />
                <span>Cancel / Back</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3.5 bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
