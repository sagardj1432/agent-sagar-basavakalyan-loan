import React from 'react';
import { LOAN_CATEGORIES } from '../data/loansData';
import { CheckCircle2, ArrowRight, Award } from 'lucide-react';

interface LoanCategoriesProps {
  onOpenApplyModal: (loanType: string) => void;
  onNavigateToSeoPage: (slug: string) => void;
}

export const LoanCategories: React.FC<LoanCategoriesProps> = ({
  onOpenApplyModal,
  onNavigateToSeoPage
}) => {
  return (
    <section className="py-16 bg-slate-50 text-slate-900 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vermillion-light border border-vermillion-light text-vermillion text-xs font-bold">
            <Award className="w-4 h-4 text-vermillion" />
            <span>Comprehensive Loan Solutions in Basavakalyan</span>
          </div>
          <h2 id="loan-services-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loan Services
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal">
            Compare interest rates, eligibility criteria, and documentation guidance for all major loan categories available across Basavakalyan, Bidar district, Karnataka.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOAN_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border-2 border-slate-200 rounded-3xl p-6 hover:border-vermillion transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-vermillion bg-vermillion-light border border-vermillion-light px-3 py-1 rounded-full">
                    Rate: {cat.minRate}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">
                    Max: {cat.maxAmount}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-slate-900 hover:text-vermillion transition-colors mb-2">
                  {cat.title}
                </h3>

                <p className="text-xs text-slate-600 font-normal leading-relaxed mb-4">
                  {cat.shortDesc}
                </p>

                {/* Feature checklist */}
                <ul className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                  {cat.features.slice(0, 4).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onOpenApplyModal(cat.title)}
                  className="flex-1 py-3 px-4 rounded-xl bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-xs shadow-sm transition-all text-center cursor-pointer"
                >
                  Apply Now
                </button>

                <button
                  onClick={() => onNavigateToSeoPage(cat.slug)}
                  className="py-3 px-4 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 font-bold text-xs border border-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  title="View full details and SEO guide"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-vermillion" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
