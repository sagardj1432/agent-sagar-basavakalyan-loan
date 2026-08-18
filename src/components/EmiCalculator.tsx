import React, { useState, useId } from 'react';
import { Calculator, IndianRupee, Clock, Percent, ArrowRight, ShieldCheck } from 'lucide-react';

interface EmiCalculatorProps {
  onOpenApplyModal: (loanType?: string, amount?: string) => void;
}

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({ onOpenApplyModal }) => {
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  const amountInputId = useId();
  const rateInputId = useId();
  const tenureInputId = useId();

  // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const calculateEmi = (p: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;
    if (monthlyRate === 0) return Math.round(p / totalMonths);
    const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(emi);
  };

  const monthlyEmi = calculateEmi(loanAmount, interestRate, tenureYears);
  const totalMonths = tenureYears * 12;
  const totalPayment = monthlyEmi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <section aria-labelledby="emi-calculator-heading" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vermillion-light border border-vermillion-light text-vermillion text-xs font-bold">
            <Calculator className="w-4 h-4 text-vermillion" />
            <span>Instant Financial Planning</span>
          </div>
          <h2 id="emi-calculator-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loan EMI Calculator for Basavakalyan
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal">
            Calculate your estimated monthly EMI, total interest, and total repayment amount before submitting your loan enquiry.
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Loan Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                <label htmlFor={amountInputId} className="flex items-center gap-1.5 cursor-pointer">
                  <IndianRupee className="w-4 h-4 text-vermillion" />
                  <span>Loan Amount</span>
                </label>
                <span className="text-vermillion text-base font-extrabold">{formatCurrency(loanAmount)}</span>
              </div>
              <input
                id={amountInputId}
                type="range"
                min={25000}
                max={10000000}
                step={25000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-vermillion"
                aria-label="Loan Amount Slider"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                <span>₹25,000</span>
                <span>₹50 Lakhs</span>
                <span>₹1 Crore</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                <label htmlFor={rateInputId} className="flex items-center gap-1.5 cursor-pointer">
                  <Percent className="w-4 h-4 text-vermillion" />
                  <span>Interest Rate (% per annum)</span>
                </label>
                <span className="text-vermillion text-base font-extrabold">{interestRate}% p.a.</span>
              </div>
              <input
                id={rateInputId}
                type="range"
                min={7.0}
                max={24.0}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-vermillion"
                aria-label="Interest Rate Slider"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                <span>7.0% (Home / Agri)</span>
                <span>10.5% (Personal)</span>
                <span>24.0%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                <label htmlFor={tenureInputId} className="flex items-center gap-1.5 cursor-pointer">
                  <Clock className="w-4 h-4 text-vermillion" />
                  <span>Loan Tenure</span>
                </label>
                <span className="text-vermillion text-base font-extrabold">{tenureYears} Years ({totalMonths} Months)</span>
              </div>
              <input
                id={tenureInputId}
                type="range"
                min={1}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-vermillion"
                aria-label="Loan Tenure Slider"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                <span>1 Year</span>
                <span>5 Years</span>
                <span>30 Years</span>
              </div>
            </div>

          </div>

          {/* Results Summary Box (5 Cols) */}
          <div className="lg:col-span-5 bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-slate-900 text-white rounded-xl p-5 text-center space-y-1">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Estimated Monthly EMI</span>
                <div className="text-3xl sm:text-4xl font-black text-white">{formatCurrency(monthlyEmi)}</div>
                <span className="text-[11px] text-slate-400">per month for {totalMonths} months</span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs sm:text-sm py-2 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Principal Amount</span>
                  <span className="font-bold text-slate-900">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm py-2 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Total Interest Payable</span>
                  <span className="font-bold text-vermillion">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm py-2">
                  <span className="text-slate-600 font-medium">Total Repayment Amount</span>
                  <span className="font-extrabold text-slate-900">{formatCurrency(totalPayment)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenApplyModal('Personal Loan', loanAmount.toString())}
              className="w-full py-3.5 px-6 rounded-xl bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply for {formatCurrency(loanAmount)} Loan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
