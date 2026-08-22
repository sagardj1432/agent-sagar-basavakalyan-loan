import React, { useState, useEffect, useRef } from 'react';
import { 
  Megaphone, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Tag, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  Tractor, 
  Store, 
  Coins, 
  Wheat, 
  BadgePercent, 
  ShieldCheck, 
  ArrowRight, 
  Video, 
  Image as ImageIcon,
  CheckCircle2,
  Share2,
  X,
  Search
} from 'lucide-react';
import { LocalMarketAd, LocalAdCategory, LoanType } from '../types';
import { apiService } from '../services/api';

interface HeaderLocalAdsBannerProps {
  onOpenApplyModal?: (loanType?: string, amount?: string) => void;
  onNavigateToAdmin?: () => void;
}

export const HeaderLocalAdsBanner: React.FC<HeaderLocalAdsBannerProps> = ({
  onOpenApplyModal,
  onNavigateToAdmin
}) => {
  const [ads, setAds] = useState<LocalMarketAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [videoModalAd, setVideoModalAd] = useState<LocalMarketAd | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Category Icon Resolver
  const getCategoryIcon = (category: LocalAdCategory) => {
    switch (category) {
      case 'Real Estate & Plots': return Building2;
      case 'Vehicles & Machinery': return Tractor;
      case 'Business & Shop Offers': return Store;
      case 'Gold & Jewellery': return Coins;
      case 'Agriculture & Seeds': return Wheat;
      case 'Loan & Finance Melas': return BadgePercent;
      default: return Tag;
    }
  };

  // Fetch verified active local ads
  useEffect(() => {
    let isMounted = true;
    const loadAds = async () => {
      try {
        const data = await apiService.fetchLocalAds(false);
        if (isMounted) {
          setAds(data);
          setLoading(false);
        }
      } catch (e) {
        console.warn('Error loading header ads:', e);
        if (isMounted) setLoading(false);
      }
    };
    loadAds();
    return () => { isMounted = false; };
  }, []);

  // Filter ads based on active category and search
  const filteredAds = ads.filter(ad => {
    const matchesCategory = activeCategory === 'All' || ad.category === activeCategory;
    const matchesSearch = !searchQuery || 
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= filteredAds.length) {
      setCurrentIndex(0);
    }
  }, [filteredAds.length, currentIndex]);

  const activeAd = filteredAds[currentIndex] || null;

  // Auto rotation timer (rotates every 7 seconds if not paused and modal not open)
  useEffect(() => {
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    
    if (isPlaying && !videoModalAd && filteredAds.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % filteredAds.length);
      }, 7000);
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, videoModalAd, filteredAds.length]);

  // Video autoplay & mute sync
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Autoplay policy fallback
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentIndex, isPlaying, isMuted, activeAd]);

  const handleNext = () => {
    if (filteredAds.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % filteredAds.length);
  };

  const handlePrev = () => {
    if (filteredAds.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + filteredAds.length) % filteredAds.length);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleShare = (ad: LocalMarketAd, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `*${ad.title}*\n📍 Area: ${ad.area}\n💰 Offer: ${ad.priceOrOffer || 'Best Price'}\nVerified by Agent Sagar Basavakalyan (+91 96326 36718)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(ad.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const isYouTubeUrl = (url?: string) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
    } else if (url.includes('embed/')) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? '1' : '0'}&loop=1&playlist=${videoId}&controls=1` : url;
  };

  const getLoanCategoryFromAd = (cat: LocalAdCategory): LoanType => {
    switch (cat) {
      case 'Real Estate & Plots': return 'Home Loan';
      case 'Vehicles & Machinery': return 'Vehicle Loan';
      case 'Business & Shop Offers': return 'Business Loan';
      case 'Gold & Jewellery': return 'Gold Loan';
      case 'Agriculture & Seeds': return 'Agriculture Loan';
      case 'Loan & Finance Melas': return 'Personal Loan';
      default: return 'Personal Loan';
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-900 border-b border-slate-800 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-vermillion border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-300">Loading Basavakalyan Local Market Banner...</span>
        </div>
      </div>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  const CategoryIcon = activeAd ? getCategoryIcon(activeAd.category) : Megaphone;

  return (
    <div id="header-local-ads-banner" className="w-full bg-slate-950 text-white border-b-2 border-vermillion/40 relative overflow-hidden shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-vermillion/15 via-slate-950/90 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5">
        
        {/* Top Header Bar with Live Market Badge & Categories Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-3 border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950/70 px-2.5 py-0.5 rounded-md border border-amber-800/60 flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                Live Market Header Banner
              </span>
              <span className="text-xs font-bold text-slate-300 hidden md:inline">
                Basavakalyan Exclusive Local Deals & Video Tours
              </span>
            </div>
          </div>

          {/* Search and Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => { setActiveCategory('All'); setCurrentIndex(0); }}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'All'
                  ? 'bg-vermillion text-white shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All ({ads.length})
            </button>
            {[
              'Real Estate & Plots',
              'Vehicles & Machinery',
              'Business & Shop Offers',
              'Gold & Jewellery',
              'Agriculture & Seeds',
              'Loan & Finance Melas'
            ].map(cat => {
              const count = ads.filter(a => a.category === cat).length;
              if (count === 0) return null;
              const shortName = cat.split('&')[0].trim();
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setCurrentIndex(0); }}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-vermillion text-white shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{shortName}</span>
                  <span className="text-[9px] opacity-75 bg-black/30 px-1 py-0.2 rounded-full">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Banner Player Card Showcase */}
        {activeAd ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 bg-slate-900/90 rounded-2xl sm:rounded-3xl border border-slate-800 p-3 sm:p-5 shadow-2xl backdrop-blur-md relative">
            
            {/* Left Column: Rich Video / Image Player Container (7 cols on lg) */}
            <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden bg-black border border-slate-700/80 shadow-inner flex flex-col justify-center min-h-[260px] sm:min-h-[340px] max-h-[420px]">
              
              {/* Media Content: Video or Image */}
              {activeAd.videoUrl ? (
                isYouTubeUrl(activeAd.videoUrl) ? (
                  <div className="w-full h-full relative aspect-video">
                    <iframe
                      src={getYouTubeEmbedUrl(activeAd.videoUrl)}
                      title={activeAd.title}
                      className="w-full h-full object-cover border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="w-full h-full relative aspect-video flex items-center justify-center bg-black">
                    <video
                      ref={videoRef}
                      src={activeAd.videoUrl}
                      poster={activeAd.imageUrl}
                      autoPlay={isPlaying}
                      muted={isMuted}
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              ) : (
                <div className="w-full h-full relative aspect-video">
                  <img
                    src={activeAd.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80'}
                    alt={activeAd.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Top Floating Badges over Media */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
                  <span className="bg-vermillion text-white text-[10px] sm:text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    {activeAd.badge || 'VERIFIED LOCAL'}
                  </span>

                  {activeAd.videoUrl ? (
                    <span className="bg-emerald-600/90 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1 backdrop-blur-xs">
                      <Video className="w-3 h-3" />
                      <span>HD Video Tour</span>
                    </span>
                  ) : (
                    <span className="bg-slate-800/90 text-slate-200 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1 backdrop-blur-xs">
                      <ImageIcon className="w-3 h-3 text-sky-400" />
                      <span>Verified Photo</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 pointer-events-auto">
                  <button
                    onClick={(e) => handleShare(activeAd, e)}
                    className="p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
                    title="Share this listing"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedId === activeAd.id && (
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full animate-fade-in">
                      Copied!
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Media Controls Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                {/* Play/Pause & Sound Controls */}
                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
                  {activeAd.videoUrl && !isYouTubeUrl(activeAd.videoUrl) && (
                    <>
                      <button
                        onClick={togglePlay}
                        className="text-white hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                        title={isPlaying ? 'Pause video' : 'Play video'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white text-amber-400" />}
                        <span className="text-[10px] hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
                      </button>

                      <div className="w-[1px] h-3 bg-white/20" />

                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-sky-400 transition-colors cursor-pointer flex items-center gap-1"
                        title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
                      </button>
                    </>
                  )}

                  {activeAd.videoUrl && (
                    <button
                      onClick={() => setVideoModalAd(activeAd)}
                      className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 pl-1 cursor-pointer"
                      title="Watch Fullscreen Video"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Fullscreen</span>
                    </button>
                  )}
                </div>

                {/* Next / Previous Slide Controls */}
                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-1 rounded-xl border border-white/15">
                  <button
                    onClick={handlePrev}
                    className="p-1 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                    title="Previous Ad"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-slate-300 px-1">
                    {currentIndex + 1}/{filteredAds.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className="p-1 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                    title="Next Ad"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Ad Details & Instant Action Hub (5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              
              <div className="space-y-3">
                {/* Category & Location Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-vermillion-light bg-vermillion/20 px-2.5 py-1 rounded-lg border border-vermillion/40">
                    <CategoryIcon className="w-3.5 h-3.5 text-vermillion" />
                    <span>{activeAd.category}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span className="truncate max-w-[180px]">{activeAd.area}</span>
                  </div>
                </div>

                {/* Ad Title */}
                <h3 className="text-lg sm:text-xl font-black text-white leading-snug hover:text-amber-300 transition-colors">
                  {activeAd.title}
                </h3>

                {/* Price / Offer Highlight Box */}
                {activeAd.priceOrOffer && (
                  <div className="inline-flex items-baseline gap-2 bg-gradient-to-r from-amber-950/80 to-slate-900 border border-amber-500/40 px-3.5 py-1.5 rounded-xl">
                    <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Demand / Deal:</span>
                    <span className="text-base sm:text-lg font-black text-amber-300">{activeAd.priceOrOffer}</span>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {activeAd.description}
                </p>

                {/* Verification Notice */}
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/50 p-2 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Verified locally by Agent Sagar • Bank financing & loan assistance available</span>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-2 gap-2">
                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/${activeAd.whatsappPhone || '919632636718'}?text=${encodeURIComponent(
                      `Hello Agent Sagar, I am interested in the local listing from the website header banner:\n\n*${activeAd.title}*\n📍 Area: ${activeAd.area}\n💰 Price/Offer: ${activeAd.priceOrOffer || 'N/A'}\n\nPlease share further details and loan options.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Direct Call Button */}
                  <a
                    href={`tel:${activeAd.contactPhone || '9632636718'}`}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-sky-400" />
                    <span>Call Seller</span>
                  </a>
                </div>

                {/* Loan Assistance Trigger */}
                <button
                  onClick={() => {
                    const loanType = getLoanCategoryFromAd(activeAd.category);
                    onOpenApplyModal?.(loanType, activeAd.priceOrOffer);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-vermillion to-vermillion-dark hover:brightness-110 text-white font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Apply for 80% Loan on this {activeAd.category.split('&')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl p-6 text-center text-slate-400 border border-slate-800">
            No local ads match the selected filter.
          </div>
        )}

        {/* Thumbnail Selector Strip */}
        {filteredAds.length > 1 && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filteredAds.map((ad, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={ad.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-left transition-all flex-shrink-0 cursor-pointer border ${
                    isActive
                      ? 'bg-vermillion/20 border-vermillion text-white shadow-xs'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {ad.videoUrl ? (
                    <Play className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300 fill-amber-300' : 'text-slate-400'}`} />
                  ) : (
                    <ImageIcon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  )}
                  <span className="text-xs font-bold max-w-[140px] truncate">{ad.title}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-vermillion animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* Expanded Video Modal */}
      {videoModalAd && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="bg-slate-800 px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="bg-vermillion text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {videoModalAd.badge || 'VERIFIED AD'}
                </span>
                <h4 className="text-sm font-black text-white truncate max-w-md">
                  {videoModalAd.title}
                </h4>
              </div>
              <button
                onClick={() => setVideoModalAd(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {videoModalAd.videoUrl && isYouTubeUrl(videoModalAd.videoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(videoModalAd.videoUrl)}
                  title={videoModalAd.title}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : videoModalAd.videoUrl ? (
                <video
                  src={videoModalAd.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={videoModalAd.imageUrl}
                  alt={videoModalAd.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Modal Bottom Details & Direct Actions */}
            <div className="p-5 space-y-3 bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold text-slate-200">{videoModalAd.area}</span>
                </div>
                {videoModalAd.priceOrOffer && (
                  <span className="text-sm font-black text-amber-300 bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-700/60">
                    {videoModalAd.priceOrOffer}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {videoModalAd.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <a
                  href={`tel:${videoModalAd.contactPhone || '9632636718'}`}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>Call +91 {videoModalAd.contactPhone || '9632636718'}</span>
                </a>

                <a
                  href={`https://wa.me/${videoModalAd.whatsappPhone || '919632636718'}?text=${encodeURIComponent(
                    `Hello Agent Sagar, I watched the video tour for *${videoModalAd.title}* (${videoModalAd.area}). Please share more details and financing support.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
