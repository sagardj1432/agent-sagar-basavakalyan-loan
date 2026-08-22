import React, { useState } from 'react';
import { 
  Link2, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  MapPin, 
  ArrowRight,
  Landmark,
  MessageCircle
} from 'lucide-react';
import { LOAN_CATEGORIES } from '../data/loansData';

interface PageBacklinksNetworkProps {
  currentSlug?: string;
  currentPageTitle?: string;
  onNavigateToSeoPage?: (slug: string) => void;
  onNavigateHome?: () => void;
}

export const PageBacklinksNetwork: React.FC<PageBacklinksNetworkProps> = ({
  currentSlug = '',
  currentPageTitle = 'Agent Sagar Loans Basavakalyan',
  onNavigateToSeoPage,
  onNavigateHome
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const baseUrl = 'https://agent-sagar-basavakalyan-loan.vercel.app';
  const pageUrl = currentSlug ? `${baseUrl}/${currentSlug}` : baseUrl;
  const pageTitle = currentPageTitle || 'Agent Sagar - Basavakalyan Loan Assistance Services';

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  // Localized Anchor Backlinks directory
  const localLoanAnchors = [
    {
      title: 'Personal Loan in Basavakalyan',
      anchor: 'Apply for Personal Loan in Basavakalyan',
      slug: 'personal-loan-basavakalyan',
      category: 'Unsecured Credit',
      desc: 'Instant emergency cash up to ₹15 Lakhs with zero collateral and doorstep document pickup.'
    },
    {
      title: 'Home Loan in Basavakalyan',
      anchor: 'Low Interest Home Loan Basavakalyan',
      slug: 'home-loan-basavakalyan',
      category: 'Housing Finance',
      desc: 'Affordable house construction, flat purchase, and plot loans with PMAY subsidy support.'
    },
    {
      title: 'Business Loan in Basavakalyan',
      anchor: 'Shopkeeper & Trader Business Loan Basavakalyan',
      slug: 'business-loan-basavakalyan',
      category: 'Commercial Credit',
      desc: 'Collateral-free working capital up to ₹50 Lakhs for merchants and retail stores.'
    },
    {
      title: 'Vehicle Loan in Basavakalyan',
      anchor: 'Car, Bike & Commercial Vehicle Loan Basavakalyan',
      slug: 'vehicle-loan-basavakalyan',
      category: 'Automotive Finance',
      desc: 'Fast vehicle loans with up to 90% on-road funding for private and commercial vehicles.'
    },
    {
      title: 'Gold Loan in Basavakalyan',
      anchor: 'Instant Cash Gold Loan Basavakalyan',
      slug: 'gold-loan-basavakalyan',
      category: 'Secured Liquidity',
      desc: '15-minute spot cash against gold jewelry with high per-gram value and secure bank vault safety.'
    },
    {
      title: 'Mortgage Loan in Basavakalyan',
      anchor: 'Loan Against Property (LAP) Basavakalyan',
      slug: 'mortgage-loan-basavakalyan',
      category: 'Secured High-Value',
      desc: 'High sanction funding up to ₹2 Crores against residential, commercial, or plot property.'
    },
    {
      title: 'Agriculture Loan in Basavakalyan',
      anchor: 'Kisan Credit Card (KCC) & Farm Loan Basavakalyan',
      slug: 'agriculture-loan-basavakalyan',
      category: 'Farmer Credit',
      desc: 'Crop finance, borewell funding, and tractor loans tailored for farmers in Basavakalyan taluka.'
    },
    {
      title: 'Credit Card in Basavakalyan',
      anchor: 'Apply for Lifetime-Free Credit Card Basavakalyan',
      slug: 'credit-card-basavakalyan',
      category: 'Revolving Line',
      desc: 'Instant cashback, shopping rewards, and 50-day interest-free grace periods.'
    }
  ];

  // Authority Regulatory References
  const authorityBacklinks = [
    {
      title: 'Reserve Bank of India (RBI)',
      desc: 'Official guidelines on Fair Practices Code for Lenders & NBFCs',
      url: 'https://www.rbi.org.in'
    },
    {
      title: 'Pradhan Mantri Awas Yojana (PMAY-Urban / Gramin)',
      desc: 'Official Housing for All Interest Subsidy Scheme portal',
      url: 'https://pmaymis.gov.in'
    },
    {
      title: 'PM-KISAN / Agriculture Portal',
      desc: 'Farmer welfare, Kisan Credit Card schemes & digital land records',
      url: 'https://pmkisan.gov.in'
    },
    {
      title: 'National Housing Bank (NHB)',
      desc: 'Regulatory standards for housing finance institutions in India',
      url: 'https://nhb.org.in'
    },
    {
      title: 'DigiLocker Paperless Verification',
      desc: 'Government verified digital KYC document sharing system',
      url: 'https://www.digilocker.gov.in'
    }
  ];

  // Local Area Backlink Anchors
  const localAreaAnchors = [
    'Basavakalyan Main Market',
    'Shivaji Nagar & Fort Area',
    'Model Colony & Tripurant',
    'Near Reliance Mart Road',
    'Sastapur Bangla (NH-65)',
    'Rajeshwar Junction',
    'Kohinoor & Hulsoor',
    'Mudbi & Muchalamba',
    'Narayanpur & Hallikhed',
    'Bidar District Central Region'
  ];

  return (
    <section 
      aria-label="Backlink Directory and Local Resource Network"
      className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-vermillion bg-vermillion-light px-3 py-1 rounded-full">
            <Link2 className="w-3.5 h-3.5" />
            <span>SEO Backlink Network & Directory</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Internal Backlinks & Local Citation Hub
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(pageUrl, 'url')}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy Page Canonical URL"
          >
            {copiedType === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            <span>{copiedType === 'url' ? 'URL Copied!' : 'Copy Page URL'}</span>
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Check out ${pageTitle}: ${pageUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            title="Share on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Share</span>
          </a>
        </div>
      </div>

      {/* 1. Complete Internal Backlinks Grid (Cross-Linking Matrix) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-vermillion" />
            <span>Explore All Loan Pages (Direct Backlinks)</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">8 Verified Local Categories</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {localLoanAnchors.map((item) => {
            const isCurrent = currentSlug === item.slug;
            return (
              <a
                key={item.slug}
                href={`/${item.slug}`}
                onClick={(e) => {
                  if (onNavigateToSeoPage && !isCurrent) {
                    e.preventDefault();
                    onNavigateToSeoPage(item.slug);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between group ${
                  isCurrent 
                    ? 'bg-vermillion/5 border-vermillion shadow-xs ring-1 ring-vermillion/20' 
                    : 'bg-slate-50 border-slate-200 hover:border-vermillion hover:bg-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-vermillion uppercase tracking-wide">
                      {item.category}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] bg-vermillion text-white px-1.5 py-0.5 rounded font-extrabold">
                        Current Page
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-vermillion transition-colors">
                    {item.title}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2.5 flex items-center justify-between text-[10px] font-bold text-slate-500 group-hover:text-vermillion">
                  <span>/{item.slug}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* 2. Local Area Anchor Link Cloud */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-vermillion" />
          <span>Local Basavakalyan Service Locations</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {localAreaAnchors.map((area, idx) => (
            <span 
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-xl border border-slate-200 transition-colors"
            >
              <MapPin className="w-3 h-3 text-vermillion" />
              <span>{area}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 4. Official Regulatory & Authority Outbound Reference Backlinks */}
      <div className="border-t border-slate-200 pt-5 space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Landmark className="w-4 h-4 text-emerald-700" />
          <span>Official Financial & Government Reference Portals</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {authorityBacklinks.map((auth, idx) => (
            <a
              key={idx}
              href={auth.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-start justify-between gap-2 group transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-vermillion flex items-center gap-1">
                  <span>{auth.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-vermillion" />
                </div>
                <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                  {auth.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

    </section>
  );
};
