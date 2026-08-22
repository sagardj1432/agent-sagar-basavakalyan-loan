import React, { useState, useEffect } from 'react';
import { Sparkles, Calculator, CheckCircle2, TrendingUp, Building2, ShieldCheck, ArrowRight, Phone, MessageCircle, HelpCircle } from 'lucide-react';
import { LoanType, EligibilityResult } from '../types';
import { apiService } from '../services/api';

interface SmartLoanAdvisorProps {
  onOpenApplyModal?: (loanType?: string, prefillAmount?: string) => void;
  onApplyWithResult?: (loanType?: string, prefillAmount?: string) => void;
}

export const SmartLoanAdvisor: React.FC<SmartLoanAdvisorProps> = ({ 
  onOpenApplyModal, 
  onApplyWithResult 
}) => {
  const [loanType, setLoanType] = useState<LoanType>('Personal Loan');
  const [employmentType, setEmploymentType] = useState<'salaried' | 'business' | 'farmer' | 'self_employed'>('salaried');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(35000);
  const [existingEmis, setExistingEmis] = useState<number>(5000);
  const [cibilTier, setCibilTier] = useState<'excellent' | 'good' | 'average' | 'new'>('excellent');
  const [goldGrams, setGoldGrams] = useState<number>(40);
  const [landAcres, setLandAcres] = useState<number>(4);

  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const calculate = async () => {
    setCalculating(true);
    try {
      const res = await apiService.calculateEligibility({
        loanType,
        employmentType,
        monthlyIncome,
        existingEmis,
        cibilTier,
        goldGrams: loanType === 'Gold Loan' ? goldGrams : undefined,
        landAcres: loanType === 'Agriculture Loan' ? landAcres : undefined
      });
      setResult(res);
    } catch (e) {
      console.warn('Calculation error:', e);
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [loanType, employmentType, monthlyIncome, existingEmis, cibilTier, goldGrams, landAcres]);

  return (
    <section id="smart-advisor" className="py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vermillion-light text-vermillion font-bold text-xs mb-3 border border-vermillion-light">
            <Sparkles className="w-4 h-4 text-vermillion" />
            <span>Interactive Loan Engine • Basavakalyan 2026</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Smart Loan Eligibility & Bank Matchmaker
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal">
            Adjust your monthly income, employment, and credit profile below to instantly see your maximum borrowing capacity and lowest interest rates across partner banks in Basavakalyan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Form Left */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Loan Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Loan Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Personal Loan', 'Home Loan', 'Gold Loan', 'Business Loan', 'Agriculture Loan', 'Vehicle Loan'] as LoanType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLoanType(type)}
                    className={`text-xs font-bold py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      loanType === type
                        ? 'bg-vermillion text-white border-vermillion shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-vermillion hover:text-vermillion'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Employment / Profession Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'salaried', label: 'Salaried' },
                  { id: 'business', label: 'Business / Shop' },
                  { id: 'farmer', label: 'Farmer / Agri' },
                  { id: 'self_employed', label: 'Self Employed' }
                ].map((emp) => (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => setEmploymentType(emp.id as any)}
                    className={`text-xs font-bold py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      employmentType === emp.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {emp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Income Slider */}
            {loanType !== 'Gold Loan' && loanType !== 'Agriculture Loan' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Monthly Net Income:</span>
                  <span className="font-black text-vermillion text-sm">₹{monthlyIncome.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="300000"
                  step="5000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-vermillion"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>₹15,000</span>
                  <span>₹1.5 Lakh</span>
                  <span>₹3.0 Lakhs</span>
                </div>
              </div>
            )}

            {/* Gold Loan specific grams slider */}
            {loanType === 'Gold Loan' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Gold Ornaments Weight (Grams):</span>
                  <span className="font-black text-amber-600 text-sm">{goldGrams} Grams (22K)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="250"
                  step="5"
                  value={goldGrams}
                  onChange={(e) => setGoldGrams(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>10g</span>
                  <span>100g</span>
                  <span>250g</span>
                </div>
              </div>
            )}

            {/* Agriculture specific acres slider */}
            {loanType === 'Agriculture Loan' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Agricultural Land Holding (Acres):</span>
                  <span className="font-black text-emerald-600 text-sm">{landAcres} Acres</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={landAcres}
                  onChange={(e) => setLandAcres(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>1 Acre</span>
                  <span>10 Acres</span>
                  <span>25 Acres</span>
                </div>
              </div>
            )}

            {/* Existing EMIs */}
            {loanType !== 'Gold Loan' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Existing Monthly EMIs:</span>
                  <span className="font-bold text-slate-800 text-sm">₹{existingEmis.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="2000"
                  value={existingEmis}
                  onChange={(e) => setExistingEmis(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>₹0 (None)</span>
                  <span>₹25,000</span>
                  <span>₹50,000</span>
                </div>
              </div>
            )}

            {/* CIBIL Score Tier */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Credit / CIBIL Score Range
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'excellent', label: '750+ (Excellent)' },
                  { id: 'good', label: '700 - 749 (Good)' },
                  { id: 'average', label: '650 - 699 (Fair)' },
                  { id: 'new', label: 'New to Credit' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCibilTier(c.id as any)}
                    className={`text-[11px] font-bold py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      cibilTier === c.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results Card Right */}
          <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
            
            {/* Background Glow */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-vermillion/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dynamic Eligibility Result</span>
                <h3 className="text-xl font-extrabold text-white">{loanType}</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{result?.approvalProbability || 92}% Odds</span>
              </div>
            </div>

            {/* Max Eligible Amount Hero */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 text-center">
              <p className="text-xs text-slate-400 font-semibold mb-1">Estimated Maximum Sanction Amount</p>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                ₹{(result?.maxEligibleAmount || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                At competitive rate of <strong className="text-emerald-400">{result?.recommendedInterestRate || 8.4}% p.a.</strong> ({result?.recommendedTenureYears || 5} Years Tenure)
              </p>
            </div>

            {/* Key Metric Highlights */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-800/50 border border-slate-700/50 p-3.5 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated EMI</span>
                <p className="text-base font-extrabold text-white mt-0.5">
                  ₹{(result?.estimatedEmi || 0).toLocaleString('en-IN')}<span className="text-xs text-slate-400 font-normal">/mo</span>
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 p-3.5 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Local Processing</span>
                <p className="text-base font-extrabold text-emerald-400 mt-0.5">
                  Fast Track Doorstep
                </p>
              </div>
            </div>

            {/* Matched Bank Offers */}
            <div>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                Top Matched Branches in Basavakalyan:
              </p>
              <div className="space-y-2">
                {(result?.eligibleBanks || []).map((bank, i) => (
                  <div key={i} className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Building2 className="w-3.5 h-3.5 text-vermillion" />
                        <span>{bank.bankName}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{bank.specialOffer}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-extrabold text-emerald-400 text-sm">{bank.rate}%</span>
                      <p className="text-[10px] text-slate-400">₹{bank.emi.toLocaleString('en-IN')}/mo</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  const applyFn = onOpenApplyModal || onApplyWithResult;
                  applyFn?.(loanType, `₹${(result?.maxEligibleAmount || 0).toLocaleString('en-IN')}`);
                }}
                className="flex-1 bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply for this Quote Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/919632636718?text=Hello%20Agent%20Sagar,%20I%20used%20the%20Smart%20Loan%20Advisor%20for%20${encodeURIComponent(loanType)}%20(Amount:%20₹${(result?.maxEligibleAmount || 0).toLocaleString('en-IN')}).%20Please%20guide%20me.`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>WhatsApp Advisor</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
