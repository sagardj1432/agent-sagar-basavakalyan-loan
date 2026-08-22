import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingDown, Coins, Clock, Search, ShieldCheck, ArrowRight, Megaphone, MapPin } from 'lucide-react';
import { DynamicRatesConfig, LocalMarketAd } from '../types';
import { apiService } from '../services/api';

interface LiveRatesTickerProps {
  config?: DynamicRatesConfig | null;
  onOpenTrackModal?: () => void;
  onOpenAdvisor?: () => void;
  onNavigateToLocalAds?: () => void;
}

export const LiveRatesTicker: React.FC<LiveRatesTickerProps> = ({
  config: initialConfig,
  onOpenTrackModal,
  onOpenAdvisor,
  onNavigateToLocalAds
}) => {
  const [config, setConfig] = useState<DynamicRatesConfig | null>(initialConfig || null);
  const [localAds, setLocalAds] = useState<LocalMarketAd[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    apiService.fetchLocalAds(false).then((ads) => {
      if (isMounted && ads && ads.length > 0) {
        setLocalAds(ads);
      }
    });

    if (!initialConfig) {
      apiService.fetchDynamicConfig().then((cfg) => {
        if (isMounted && cfg) {
          setConfig(cfg);
        }
      });
    }
    return () => { isMounted = false; };
  }, [initialConfig]);

  // Update if initialConfig changes
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  // Rotate local ads every 5 seconds
  useEffect(() => {
    if (localAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % localAds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [localAds.length]);

  const goldRate22k = config?.goldRatePerGram22k || 6850;
  const homeLoanRate = config?.categoryRates?.['Home Loan']?.minRate || '8.4% p.a.';
  const goldLoanRate = config?.categoryRates?.['Gold Loan']?.minRate || '0.75% / mo';
  const announcement = config?.announcementText || 'Special Housing Loan Camp in Basavakalyan: Reduced 8.4% p.a. & Fast Local Sanctions';
  const activeAd = localAds[currentAdIndex];

  const handleScrollToBulletin = () => {
    if (onNavigateToLocalAds) {
      onNavigateToLocalAds();
    } else {
      const el = document.getElementById('local-market-bulletin');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <aside aria-label="Live Rates Notice" className="bg-slate-900 text-white border-b border-slate-800 text-xs py-2 px-3 sm:px-6 relative z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Dynamic Live Rates Badges */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
          <button
            onClick={handleScrollToBulletin}
            className="inline-flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30 text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
            title="Click to view Local Area Classifieds"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-0.5" />
            Live Market
          </button>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Gold (22K): <strong className="text-amber-300 font-bold">₹{goldRate22k.toLocaleString('en-IN')}/g</strong></span>
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5 text-slate-300">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Home Loan: <strong className="text-emerald-400 font-bold">{homeLoanRate}</strong></span>
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5 text-slate-300 hidden lg:flex">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Gold Loan Cash: <strong className="text-sky-300 font-bold">15 Mins ({goldLoanRate})</strong></span>
          </div>
        </div>

        {/* Center: Live Local Area Ads Ticker or Announcement */}
        {activeAd ? (
          <button
            onClick={handleScrollToBulletin}
            className="hidden xl:flex items-center gap-2 text-slate-200 text-[11px] truncate max-w-lg hover:text-amber-300 transition-colors cursor-pointer bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-700/60"
            title="Click to see local ad details"
          >
            <Megaphone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" />
            <span className="font-extrabold text-amber-300 text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
              LOCAL AD
            </span>
            <span className="truncate font-medium">{activeAd.title}</span>
            <span className="text-slate-400 flex items-center gap-0.5 text-[10px] flex-shrink-0">
              <MapPin className="w-2.5 h-2.5 text-vermillion" />
              {activeAd.area}
            </span>
          </button>
        ) : (
          config?.announcementActive && (
            <div className="hidden xl:flex items-center gap-2 text-slate-300 text-[11px] truncate max-w-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">{announcement}</span>
            </div>
          )
        )}

        {/* Right: Quick Action Buttons (Track + Local Ads + Smart Advisor) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleScrollToBulletin}
            className="inline-flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2 py-1 rounded-lg border border-amber-500/30 transition-colors font-bold text-[11px] cursor-pointer"
          >
            <Megaphone className="w-3 h-3 text-amber-400" />
            <span>Local Ads ({localAds.length})</span>
          </button>

          <button
            onClick={() => onOpenTrackModal?.()}
            className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 transition-colors font-semibold text-[11px] cursor-pointer"
          >
            <Search className="w-3 h-3 text-sky-400" />
            <span>Track</span>
          </button>

          <button
            onClick={() => onOpenAdvisor?.()}
            className="inline-flex items-center gap-1 bg-vermillion hover:bg-vermillion-dark text-white px-2.5 py-1 rounded-lg transition-colors font-bold text-[11px] cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Advisor</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </aside>
  );
};
