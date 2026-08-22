import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Tag, 
  Sparkles, 
  Search, 
  Filter, 
  ExternalLink, 
  PlusCircle, 
  Lock, 
  Building2, 
  Tractor, 
  Store, 
  Coins, 
  Wheat, 
  BadgePercent, 
  CheckCircle2, 
  Calendar,
  Share2,
  Check
} from 'lucide-react';
import { LocalMarketAd, LocalAdCategory } from '../types';
import { apiService } from '../services/api';

interface LocalMarketAdsSectionProps {
  onOpenApplyModal?: (loanType?: string, amount?: string) => void;
  onNavigateToAdmin?: () => void;
}

export const LocalMarketAdsSection: React.FC<LocalMarketAdsSectionProps> = ({
  onOpenApplyModal,
  onNavigateToAdmin
}) => {
  const [ads, setAds] = useState<LocalMarketAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAdminNotice, setShowAdminNotice] = useState(false);

  const categories: (string | LocalAdCategory)[] = [
    'All',
    'Real Estate & Plots',
    'Vehicles & Machinery',
    'Business & Shop Offers',
    'Gold & Jewellery',
    'Agriculture & Seeds',
    'Loan & Finance Melas'
  ];

  const loadAds = async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchLocalAds(false);
      setAds(data);
    } catch (e) {
      console.warn('Failed to load local market ads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const filteredAds = ads.filter((ad) => {
    const matchesCategory = selectedCategory === 'All' || ad.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ad.priceOrOffer && ad.priceOrOffer.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Real Estate & Plots':
        return <Building2 className="w-4 h-4 text-emerald-600" />;
      case 'Vehicles & Machinery':
        return <Tractor className="w-4 h-4 text-sky-600" />;
      case 'Business & Shop Offers':
        return <Store className="w-4 h-4 text-purple-600" />;
      case 'Gold & Jewellery':
        return <Coins className="w-4 h-4 text-amber-600" />;
      case 'Agriculture & Seeds':
        return <Wheat className="w-4 h-4 text-lime-600" />;
      case 'Loan & Finance Melas':
        return <BadgePercent className="w-4 h-4 text-vermillion" />;
      default:
        return <Tag className="w-4 h-4 text-slate-600" />;
    }
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge?.toUpperCase()) {
      case 'HOT DEAL':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'URGENT SALE':
        return 'bg-rose-500/10 text-rose-700 border-rose-200';
      case 'EXCLUSIVE':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'LIMITED TIME':
        return 'bg-amber-500/10 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
    }
  };

  const handleShareAd = (ad: LocalMarketAd) => {
    const shareText = `📢 *Basavakalyan Local Ad*: ${ad.title}\n📍 Area: ${ad.area}\n💰 Price/Offer: ${ad.priceOrOffer || 'Best Price'}\nℹ️ ${ad.description}\n\nVerified by Agent Sagar (+91 9632636718)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(ad.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section id="local-market-bulletin" className="py-14 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs">
              <Megaphone className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Live Market • Basavakalyan Local Classifieds & Deals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Basavakalyan Local Area Market Bulletin
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Verified local real estate plots, farming machinery, shop rentals, and exclusive finance offers across Basavakalyan Taluka.
            </p>
          </div>

          {/* Admin Exclusive Posting Trigger */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (onNavigateToAdmin) {
                  onNavigateToAdmin();
                } else {
                  setShowAdminNotice(true);
                }
              }}
              className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
              title="Only Administrator Agent Sagar can publish local ads"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Post Local Ad (Admin Only)</span>
            </button>

            <a
              href="https://wa.me/919632636718?text=Hello%20Agent%20Sagar,%20I%20want%20to%20advertise%20my%20property/vehicle/business%20in%20Basavakalyan%20Live%20Market."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Request to Feature Your Ad</span>
            </a>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search area (e.g. Shivaji Chowk), plot, tractor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-vermillion focus:outline-none"
              />
            </div>

            {/* Quick Area Tags */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 w-full sm:w-auto">
              <span className="font-semibold text-[11px] text-slate-400">Popular Areas:</span>
              {['Shivaji Chowk', 'Main Market', 'Fort Road', 'Humnabad Road', 'Tripurant'].map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setSearchQuery(searchQuery === area ? '' : area)}
                  className={`text-[11px] px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                    searchQuery === area
                      ? 'bg-vermillion text-white border-vermillion font-bold'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>

          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ads Grid */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-vermillion border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold">Loading verified local area advertisements...</p>
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No local ads match your filter</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try clearing your search query or selecting "All" categories to view all active Basavakalyan listings.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-2 text-xs text-vermillion font-bold underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-vermillion/40 relative"
              >
                <div className="space-y-3.5">
                  
                  {/* Top Metadata: Badge & Category */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(ad.badge)}`}>
                      {ad.badge || 'VERIFIED LOCAL'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      {getCategoryIcon(ad.category)}
                      <span className="truncate max-w-[130px]">{ad.category}</span>
                    </span>
                  </div>

                  {/* Ad Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-vermillion transition-colors">
                    {ad.title}
                  </h3>

                  {/* Area Landmark */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-vermillion flex-shrink-0" />
                    <span className="font-semibold">{ad.area}</span>
                  </div>

                  {/* Price / Offer Highlight */}
                  {ad.priceOrOffer && (
                    <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-900">Price / Offer:</span>
                      <span className="text-sm font-extrabold text-amber-800">{ad.priceOrOffer}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ad.description}
                  </p>

                </div>

                {/* Bottom Actions & Trust Footnote */}
                <div className="pt-4 mt-5 border-t border-slate-100 space-y-3">
                  
                  {/* Verification by Agent Sagar */}
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 text-slate-500 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{ad.postedBy || 'Agent Sagar Verified'}</span>
                    </div>
                    <button
                      onClick={() => handleShareAd(ad)}
                      className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                      title="Share Ad"
                    >
                      {copiedId === ad.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Action Buttons: WhatsApp + Call */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/${ad.whatsappPhone || '919632636718'}?text=${encodeURIComponent(
                        `Hello Agent Sagar, I saw your Basavakalyan Local Ad on the Live Market portal:\n"${ad.title}" in ${ad.area} (${ad.priceOrOffer || ''}).\nPlease share more details.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:+91${ad.contactPhone || '9632636718'}`}
                      className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>Call Now</span>
                    </a>
                  </div>

                  {/* Apply for Loan Assist on this Item */}
                  <button
                    type="button"
                    onClick={() => {
                      const loanMap: Record<string, string> = {
                        'Real Estate & Plots': 'Home Loan',
                        'Vehicles & Machinery': 'Vehicle Loan',
                        'Business & Shop Offers': 'Business Loan',
                        'Gold & Jewellery': 'Gold Loan',
                        'Agriculture & Seeds': 'Agriculture Loan'
                      };
                      const mappedType = loanMap[ad.category] || 'Personal Loan';
                      if (onOpenApplyModal) {
                        onOpenApplyModal(mappedType);
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-vermillion-light hover:bg-vermillion-light/80 text-vermillion font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-vermillion" />
                    <span>Get Loan Assistance on this Ad</span>
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}

        {/* Informational Banner: How Local Postings Work */}
        <div className="mt-10 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Verified Community Classifieds</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Have a plot, vehicle, or local business offer in Basavakalyan?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              To prevent spam and protect local buyers, only Agent Sagar is authorized to publish verified listings. Submit your details to get your ad featured directly in this Live Market Bulletin.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="https://wa.me/919632636718?text=Hello%20Agent%20Sagar,%20I%20have%20a%20local%20listing%20in%20Basavakalyan%20I%20would%20like%20to%20post%20on%20the%20Live%20Market%20section."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Contact Agent Sagar (+91 96326 36718)</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
