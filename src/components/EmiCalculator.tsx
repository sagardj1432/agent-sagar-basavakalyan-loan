import React, { useState, useId } from 'react';
import { Calculator, IndianRupee, Clock, Percent, ArrowRight, MessageCircle, Copy, Check, ChevronDown, ChevronUp, Table } from 'lucide-react';
import { LoanType } from '../types';

interface EmiCalculatorProps {
  onOpenApplyModal?: (loanType?: string, amount?: string) => void;
}

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({ onOpenApplyModal }) => {
  const [loanType, setLoanType] = useState<LoanType>('Home Loan');
  const [loanAmount, setLoanAmount] = useState<number>(1500000);
  const [interestRate, setInterestRate] = useState<number>(8.4);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [showSchedule, setShowSchedule] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);

  const amountInputId = useId();
  const rateInputId = useId();
  const tenureInputId = useId();

  // Quick Presets
  const handleCategoryPreset = (type: LoanType) => {
    setLoanType(type);
    if (type === 'Home Loan') {
      setLoanAmount(2500000);
      setInterestRate(8.4);
      setTenureYears(20);
    } else if (type === 'Personal Loan') {
      setLoanAmount(300000);
      setInterestRate(10.5);
      setTenureYears(4);
    } else if (type === 'Gold Loan') {
      setLoanAmount(250000);
      setInterestRate(9.0);
      setTenureYears(2);
    } else if (type === 'Business Loan') {
      setLoanAmount(1000000);
      setInterestRate(12.0);
      setTenureYears(5);
    } else if (type === 'Vehicle Loan') {
      setLoanAmount(600000);
      setInterestRate(8.75);
      setTenureYears(5);
    } else if (type === 'Agriculture Loan') {
      setLoanAmount(500000);
      setInterestRate(7.0);
      setTenureYears(5);
    }
  };

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

  // Generate Yearly Amortization Schedule
  const generateAmortization = () => {
    let balance = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const schedule = [];

    for (let yr = 1; yr <= tenureYears; yr++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const interestForMonth = balance * monthlyRate;
        const principalForMonth = Math.min(balance, monthlyEmi - interestForMonth);
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        balance -= principalForMonth;
      }

      schedule.push({
        year: yr,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        totalPayment: Math.round(yearlyPrincipal + yearlyInterest),
        closingBalance: Math.max(0, Math.round(balance))
      });
    }
    return schedule;
  };

  const copyQuoteText = () => {
    const text = `🏦 *Basavakalyan Loan EMI Quote*\nLoan Type: ${loanType}\nAmount: ${formatCurrency(loanAmount)}\nInterest Rate: ${interestRate}% p.a.\nTenure: ${tenureYears} Years\n👉 Monthly EMI: ${formatCurrency(monthlyEmi)}\nTotal Interest: ${formatCurrency(totalInterest)}\nTotal Payable: ${formatCurrency(totalPayment)}\n\nContact Agent Sagar: +91 96326 36718`;
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  return (
    <section aria-labelledby="emi-calculator-heading" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vermillion-light border border-vermillion-light text-vermillion text-xs font-bold">
            <Calculator className="w-4 h-4 text-vermillion" />
            <span>Interactive Financial Planner</span>
          </div>
          <h2 id="emi-calculator-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dynamic Loan EMI & Amortization Calculator
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal">
            Choose a loan category below or fine-tune the sliders to compute accurate monthly installments and yearly payment schedules.
          </p>
        </div>

        {/* Dynamic Category Quick-Select */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(['Home Loan', 'Personal Loan', 'Gold Loan', 'Business Loan', 'Vehicle Loan', 'Agriculture Loan'] as LoanType[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryPreset(cat)}
              className={`text-xs px-3.5 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                loanType === cat
                  ? 'bg-vermillion text-white border-vermillion shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Calculator Grid */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
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
                min={6.5}
                max={24.0}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-vermillion"
                aria-label="Interest Rate Slider"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                <span>7.0% (Agri)</span>
                <span>8.4% (Home)</span>
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
                <span>10 Years</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Toggle Amortization Schedule */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSchedule(!showSchedule)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-vermillion transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200"
              >
                <Table className="w-3.5 h-3.5 text-vermillion" />
                <span>{showSchedule ? 'Hide Yearly Repayment Breakdown' : 'View Yearly Amortization Schedule'}</span>
                {showSchedule ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>

          {/* Results Summary Box (5 Cols) */}
          <div className="lg:col-span-5 bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-slate-900 text-white rounded-xl p-5 text-center space-y-1">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Estimated Monthly EMI</span>
                <div className="text-3xl sm:text-4xl font-black text-amber-300">{formatCurrency(monthlyEmi)}</div>
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

            <div className="space-y-2">
              <button
                onClick={() => onOpenApplyModal?.(loanType, loanAmount.toString())}
                className="w-full py-3.5 px-6 rounded-xl bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply for {formatCurrency(loanAmount)} Loan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                <a
                  href={`https://wa.me/919632636718?text=Hello%20Agent%20Sagar,%20I%20calculated%20my%20loan%20quote:%0A- Loan Type: ${encodeURIComponent(loanType)}%0A- Amount: ${encodeURIComponent(formatCurrency(loanAmount))}%0A- Rate: ${interestRate}%%20p.a.%0A- Tenure: ${tenureYears}%20Years%0A- Monthly EMI: ${encodeURIComponent(formatCurrency(monthlyEmi))}%0APlease%20assist%20me.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                  <span>Send Quote on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={copyQuoteText}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="Copy Calculation Breakdown"
                >
                  {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedQuote ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Amortization Schedule Table */}
        {showSchedule && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Table className="w-5 h-5 text-vermillion" />
              <span>Year-by-Year Amortization Schedule ({tenureYears} Years)</span>
            </h3>
            
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="sticky top-0 bg-slate-100 border-b border-slate-300">
                  <tr className="font-bold text-slate-700 uppercase text-[11px]">
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4">Principal Paid</th>
                    <th className="py-3 px-4">Interest Paid</th>
                    <th className="py-3 px-4">Total Payment</th>
                    <th className="py-3 px-4">Closing Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {generateAmortization().map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">Year {row.year}</td>
                      <td className="py-2.5 px-4 text-emerald-700 font-semibold">{formatCurrency(row.principal)}</td>
                      <td className="py-2.5 px-4 text-vermillion font-semibold">{formatCurrency(row.interest)}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">{formatCurrency(row.totalPayment)}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-600">{formatCurrency(row.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

