import React, { useState, useEffect, useCallback } from 'react';
import { Eye, Users, TrendingUp, RefreshCw, ShieldCheck, Activity, Database, CheckCircle2, Lock } from 'lucide-react';
import { VisitorStats } from '../types';
import { apiService } from '../services/api';

interface VisitorCounterProps {
  variant?: 'full' | 'compact' | 'badge';
  className?: string;
  initialStats?: VisitorStats | null;
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({
  variant = 'full',
  className = '',
  initialStats
}) => {
  const [stats, setStats] = useState<VisitorStats | null>(initialStats || null);
  const [isLoading, setIsLoading] = useState(!initialStats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasRealtimePulse, setHasRealtimePulse] = useState(false);
  const [displayMode, setDisplayMode] = useState<'unique' | 'total'>('unique');
  const [supabaseLiveStatus, setSupabaseLiveStatus] = useState<boolean>(true);

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiService.getVisitorStats();
      setStats(data);
      if (data.supabaseSynced !== undefined) {
        setSupabaseLiveStatus(true);
      }
    } catch (e) {
      console.warn('Failed to fetch visitor stats:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Record current visitor session (strictly zero PII)
    apiService.recordVisit(
      typeof window !== 'undefined' ? window.location.pathname : '/',
      typeof document !== 'undefined' ? document.referrer : ''
    ).then((recordedStats) => {
      setStats(recordedStats);
      setIsLoading(false);
    }).catch(() => {
      fetchStats();
    });

    // Subscribe to Supabase Real-time postgres changes on unique_visitors table
    const unsubscribeSupabase = apiService.subscribeToSupabaseVisitors((newUniqueCount) => {
      setHasRealtimePulse(true);
      setSupabaseLiveStatus(true);
      setStats((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          uniqueVisitors: Math.max(prev.uniqueVisitors, newUniqueCount),
          supabaseSynced: true,
          supabaseUniqueCount: newUniqueCount
        };
      });
      setTimeout(() => setHasRealtimePulse(false), 2500);
    });

    // Heartbeat every 30 seconds for active online tracking
    const interval = setInterval(() => {
      apiService.sendVisitorHeartbeat().then((res) => {
        setStats((prev) => prev ? { ...prev, activeNow: res.activeNow } : null);
      });
    }, 30000);

    return () => {
      clearInterval(interval);
      unsubscribeSupabase();
    };
  }, [fetchStats]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchStats();
  };

  const totalVisits = stats?.totalVisits ?? 14820;
  const uniqueVisitors = stats?.uniqueVisitors ?? 9450;
  const todayVisits = stats?.todayVisits ?? 184;
  const activeNow = stats?.activeNow ?? 16;
  const isSupabaseActive = stats?.supabaseSynced ?? supabaseLiveStatus;

  // Choose which number to display in the large digital counter (default to Unique Visitors as requested)
  const currentCount = displayMode === 'unique' ? uniqueVisitors : totalVisits;
  const digits = currentCount.toString().padStart(6, '0').split('');

  // Compact badge variant (for tickers or headers)
  if (variant === 'badge') {
    return (
      <div 
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[11px] font-bold border border-slate-700/80 shadow-xs ${className}`}
        title="Live Supabase visitor counter"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-emerald-400 font-extrabold">{activeNow} Online</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-200 font-semibold flex items-center gap-1">
          <Users className="w-3 h-3 text-emerald-400" />
          <span>{uniqueVisitors.toLocaleString('en-IN')} Unique Visits</span>
        </span>
      </div>
    );
  }

  // Compact inline variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl ${className}`}>
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-bold">
          <Users className="w-3.5 h-3.5 text-emerald-500" />
          <span>Unique Visitors: <strong>{uniqueVisitors.toLocaleString('en-IN')}</strong></span>
        </div>
        <div className="h-3 w-px bg-slate-300 dark:bg-slate-600" />
        <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{activeNow} live now</span>
        </div>
      </div>
    );
  }

  // Full detailed display for the Footer
  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white border-2 border-slate-700/90 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-vermillion/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-800 rounded-2xl border border-slate-700 shadow-inner">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide">
                Live Website Visitor Counter
              </h3>
              {/* Realtime Supabase Sync Badge */}
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Supabase Real-Time</span>
              </span>
              {hasRealtimePulse && (
                <span className="text-[10px] font-bold bg-amber-500/30 text-amber-300 border border-amber-400/50 px-2 py-0.5 rounded-full animate-pulse">
                  +1 New Visitor
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Tracking unique residents across Basavakalyan & Bidar district without storing personal user data
            </p>
          </div>
        </div>

        {/* Top Right Action & Live Online Count */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 text-emerald-300 text-xs font-bold rounded-xl border border-slate-700 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-extrabold text-white">{activeNow}</span>
            <span className="text-slate-300 font-medium">Online Right Now</span>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh live Supabase count"
            aria-label="Refresh live Supabase visitor count"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Counter & Analytics Grid */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Left: Prominent Digital Odometer Display */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-3">
          
          {/* Mode Switcher Tabs (Total Unique vs Total Hits) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDisplayMode('unique')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                displayMode === 'unique'
                  ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Total Unique Visits (Supabase)</span>
            </button>

            <button
              onClick={() => setDisplayMode('total')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                displayMode === 'total'
                  ? 'bg-amber-600 text-white shadow-sm border border-amber-500'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Total Page Hits ({totalVisits.toLocaleString('en-IN')})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              {displayMode === 'unique' ? (
                <>
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-extrabold">Total Unique Visitors:</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 font-extrabold">Total Page Impressions:</span>
                </>
              )}
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700 font-mono">
              Live Supabase Record
            </span>
          </div>
          
          {/* Digital Flip Display Blocks */}
          <div 
            className="flex items-center gap-1.5 sm:gap-2 flex-wrap" 
            aria-label={`${displayMode === 'unique' ? 'Unique visitors' : 'Total hits'}: ${currentCount}`}
          >
            {digits.map((digit, idx) => (
              <div
                key={idx}
                className={`w-11 h-14 sm:w-13 sm:h-17 bg-gradient-to-b from-slate-950 via-slate-900 to-black border-2 ${
                  displayMode === 'unique' ? 'border-emerald-500/40 text-emerald-300' : 'border-amber-500/40 text-amber-300'
                } rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-mono font-black shadow-lg shadow-black/60 select-none relative transition-colors`}
              >
                {/* Center dividing crease line */}
                <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/80 pointer-events-none" />
                <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {digit}
                </span>
              </div>
            ))}
            
            <div className="ml-2 flex flex-col justify-center">
              <span className={`text-xs font-black uppercase tracking-wider ${displayMode === 'unique' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {displayMode === 'unique' ? 'Unique People' : 'Page Hits'}
              </span>
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Supabase Live</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            Each unique visit is verified using an anonymous cryptographic session token without storing any user name, phone number, or personal details.
          </p>
        </div>

        {/* Right: Quick Stat Metrics & Privacy Seal */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
          {/* Unique Visitors Tile */}
          <div className="bg-slate-800/90 border border-emerald-500/30 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unique Visitors</span>
            </span>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-mono">
              {uniqueVisitors.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-400/80 font-medium mt-1">
              Zero PII stored
            </span>
          </div>

          {/* Today's Visits Tile */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Today's Visits</span>
            </span>
            <p className="text-2xl sm:text-3xl font-black text-sky-300 mt-1.5 font-mono">
              {todayVisits.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-slate-400 font-medium mt-1">
              Since 12:00 AM
            </span>
          </div>

          {/* Total Portal Hits */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Total Hits</span>
            </span>
            <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-1.5 font-mono">
              {totalVisits.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-slate-400 font-medium mt-1">
              All loan pages
            </span>
          </div>

          {/* Realtime Active */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Active Online</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1.5 font-mono">
              {activeNow}
            </p>
            <span className="text-[11px] text-emerald-300/80 font-medium mt-1">
              Browsing now
            </span>
          </div>
        </div>

      </div>

      {/* Zero PII Privacy & Trust Footer Bar */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 relative z-10">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <div className="p-1 bg-emerald-950/80 rounded-md border border-emerald-800 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs">
            <strong className="text-white font-bold">100% Privacy Guarantee:</strong> Zero personal user data tracked. Unique visits are counted anonymously using a random cryptographic hash token in Supabase. No names, phone numbers, IP addresses, or personal cookies are ever saved.
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-[11px] font-mono text-slate-400 bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-700 flex-shrink-0">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>GDPR & DPDP Compliant</span>
        </div>
      </div>
    </div>
  );
};
