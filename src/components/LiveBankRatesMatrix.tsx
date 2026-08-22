import React, { useState } from 'react';
import { Building2, Percent, Clock, MapPin, CheckCircle2, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { BankRateInfo, DynamicRatesConfig, LoanType } from '../types';

interface LiveBankRatesMatrixProps {
  config?: DynamicRatesConfig | null;
  onOpenApplyModal?: (loanType?: string) => void;
}

export const LiveBankRatesMatrix: React.FC<LiveBankRatesMatrixProps> = ({ config, onOpenApplyModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const partnerBanks: BankRateInfo[] = config?.partnerBanks || [
    { bankName: 'State Bank of India (SBI)', category: 'Home Loan', minRate: 8.40, maxTenureYears: 30, processingFee: '0.25%', branchInBasavakalyan: 'Main Road & Shivaji Chowk', specialFeature: 'PMAY Subsidy direct credit' },
    { bankName: 'Canara Bank', category: 'Agriculture Loan', minRate: 7.00, maxTenureYears: 5, processingFee: 'Nil for KCC', branchInBasavakalyan: 'Basavakalyan Market Branch', specialFeature: 'Kisan Credit Card instant limit' },
    { bankName: 'HDFC Bank', category: 'Personal Loan', minRate: 10.50, maxTenureYears: 5, processingFee: '1.5%', branchInBasavakalyan: 'Bus Stand Road', specialFeature: 'Paperless 10-second sanction' },
    { bankName: 'ICICI Bank', category: 'Business Loan', minRate: 11.50, maxTenureYears: 5, processingFee: '1.0%', branchInBasavakalyan: 'Station Road', specialFeature: 'Unsecured working capital line' },
    { bankName: 'Karnataka Gramin Bank (PKGB)', category: 'Gold Loan', minRate: 9.00, maxTenureYears: 2, processingFee: '₹250 Flat', branchInBasavakalyan: 'Fort Area & Sasur Galli', specialFeature: 'Highest valuation per gram' },
    { bankName: 'Union Bank of India', category: 'Vehicle Loan', minRate: 8.75, maxTenureYears: 7, processingFee: '0.50%', branchInBasavakalyan: 'Near Gandhi Chowk', specialFeature: 'Up to 90% on-road financing' },
    { bankName: 'Bank of Baroda', category: 'Mortgage Loan', minRate: 9.25, maxTenureYears: 15, processingFee: '0.50%', branchInBasavakalyan: 'Basavakalyan Town', specialFeature: 'Plot & Commercial property' }
  ];

  const categories = ['All', 'Personal Loan', 'Home Loan', 'Gold Loan', 'Business Loan', 'Agriculture Loan', 'Vehicle Loan', 'Mortgage Loan'];

  const filteredBanks = selectedCategory === 'All'
    ? partnerBanks
    : partnerBanks.filter(b => b.category === selectedCategory);

  return (
    <section id="bank-rates-matrix" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vermillion-light text-vermillion font-bold text-xs mb-2">
              <Percent className="w-3.5 h-3.5" />
              <span>Multi-Bank Comparison • Basavakalyan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Live Bank Interest Rates Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Compare updated loan rates across Nationalized, Private, and Gramin Banks operating in Basavakalyan.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-slate-400 font-bold mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table / Cards Grid */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Bank / Institution</th>
                <th className="py-3.5 px-4">Loan Type</th>
                <th className="py-3.5 px-4">Interest Rate</th>
                <th className="py-3.5 px-4">Max Tenure</th>
                <th className="py-3.5 px-4">Processing Fee</th>
                <th className="py-3.5 px-4">Basavakalyan Branch</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBanks.map((bank, index) => (
                <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Bank Name */}
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-vermillion-light text-vermillion flex items-center justify-center flex-shrink-0 font-extrabold text-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span>{bank.bankName}</span>
                        <p className="text-[10px] text-slate-500 font-normal">{bank.specialFeature}</p>
                      </div>
                    </div>
                  </td>

                  {/* Loan Type */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-lg text-xs font-semibold">
                      {bank.category}
                    </span>
                  </td>

                  {/* Min Rate */}
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-vermillion text-sm sm:text-base">
                      {bank.minRate}% <span className="text-[10px] text-slate-500 font-normal">p.a.</span>
                    </div>
                  </td>

                  {/* Max Tenure */}
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {bank.maxTenureYears} Years
                  </td>

                  {/* Processing Fee */}
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {bank.processingFee}
                  </td>

                  {/* Branch In Basavakalyan */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1 text-xs">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span>{bank.branchInBasavakalyan}</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onOpenApplyModal?.(bank.category)}
                      className="bg-vermillion hover:bg-vermillion-dark text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Local Guidance Guarantee Note */}
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Agent Sagar coordinates directly with bank branch managers in Basavakalyan to secure maximum rate concessions.</span>
          </div>
          <a
            href="tel:+919632636718"
            className="text-vermillion font-bold hover:underline whitespace-nowrap"
          >
            Ask for Special Concession: +91 96326 36718
          </a>
        </div>

      </div>
    </section>
  );
};
