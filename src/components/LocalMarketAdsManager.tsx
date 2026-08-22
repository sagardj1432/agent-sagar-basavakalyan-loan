import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Tag, 
  Building2, 
  Tractor, 
  Store, 
  Coins, 
  Wheat, 
  BadgePercent, 
  RefreshCw, 
  Search, 
  Filter, 
  Sliders, 
  TrendingUp, 
  Check, 
  X,
  ExternalLink,
  Video,
  Image as ImageIcon,
  Play
} from 'lucide-react';
import { LocalMarketAd, LocalAdCategory, DynamicRatesConfig } from '../types';
import { apiService } from '../services/api';

interface LocalMarketAdsManagerProps {
  adminToken?: string;
  onPreviewBulletin?: () => void;
}

export const LocalMarketAdsManager: React.FC<LocalMarketAdsManagerProps> = ({
  adminToken,
  onPreviewBulletin
}) => {
  // Ads State
  const [ads, setAds] = useState<LocalMarketAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Create Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LocalAdCategory>('Real Estate & Plots');
  const [area, setArea] = useState('Shivaji Chowk, Basavakalyan');
  const [priceOrOffer, setPriceOrOffer] = useState('');
  const [contactPhone, setContactPhone] = useState('9632636718');
  const [whatsappPhone, setWhatsappPhone] = useState('919632636718');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('HOT DEAL');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'both'>('both');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit Modal State
  const [editingAd, setEditingAd] = useState<LocalMarketAd | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editMsg, setEditMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Live Rates / Ticker Quick Config State
  const [ratesConfig, setRatesConfig] = useState<DynamicRatesConfig | null>(null);
  const [gold22k, setGold22k] = useState<number>(6850);
  const [gold24k, setGold24k] = useState<number>(7480);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [savingRates, setSavingRates] = useState(false);
  const [ratesMsg, setRatesMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories: LocalAdCategory[] = [
    'Real Estate & Plots',
    'Vehicles & Machinery',
    'Business & Shop Offers',
    'Gold & Jewellery',
    'Agriculture & Seeds',
    'Loan & Finance Melas',
    'Jobs & Services'
  ];

  const popularAreas = [
    'Shivaji Chowk, Basavakalyan',
    'Main Market Road, Basavakalyan',
    'Fort Area & Sasur Galli',
    'Humnabad Road, Basavakalyan',
    'Tripurant Bypass Road',
    'Gandhi Nagar & Auto Nagar',
    'Bidar Road Junction',
    'Near Reliance Smart Point'
  ];

  const badges = ['HOT DEAL', 'VERIFIED LOCAL', 'URGENT SALE', 'EXCLUSIVE', 'LIMITED TIME', 'SPECIAL OFFER'];

  // Sample Media Presets for Quick Insertion
  const sampleMediaPresets = [
    {
      label: 'Residential Plot Video Tour',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    {
      label: 'Tractor / Vehicle Walkaround',
      image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=1200&auto=format&fit=crop&q=80',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    },
    {
      label: 'Commercial Market Shop Tour',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    },
    {
      label: 'Gold Jewellery Spot Mela',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop&q=80',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
    },
    {
      label: 'Agricultural Land Footage',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
    }
  ];

  const loadAllAds = async () => {
    setLoading(true);
    try {
      const data = await apiService.fetchLocalAds(true);
      setAds(data);
    } catch (e) {
      console.warn('Error loading ads:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadRatesConfig = async () => {
    try {
      const cfg = await apiService.fetchDynamicConfig();
      if (cfg) {
        setRatesConfig(cfg);
        setGold22k(cfg.goldRatePerGram22k || 6850);
        setGold24k(cfg.goldRatePerGram24k || 7480);
        setAnnouncementText(cfg.announcementText || '');
        setAnnouncementActive(cfg.announcementActive ?? true);
      }
    } catch (e) {
      console.warn('Error loading rates:', e);
    }
  };

  useEffect(() => {
    loadAllAds();
    loadRatesConfig();
  }, []);

  // Handle Create Local Ad
  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);
    setSubmitting(true);

    try {
      const res = await apiService.createLocalAd({
        title: title.trim(),
        category,
        area: area.trim(),
        priceOrOffer: priceOrOffer.trim() || undefined,
        contactPhone: contactPhone.trim(),
        whatsappPhone: whatsappPhone.trim(),
        description: description.trim(),
        badge: badge.trim() || 'VERIFIED LOCAL',
        imageUrl: imageUrl.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        mediaType,
        isActive
      }, adminToken);

      if (res.success && res.ad) {
        setFeedbackMsg({
          type: 'success',
          text: `🎉 Local Ad "${res.ad.title}" successfully published to Header Banner & Live Market!`
        });
        // Reset form
        setTitle('');
        setPriceOrOffer('');
        setDescription('');
        await loadAllAds();
      } else {
        setFeedbackMsg({
          type: 'error',
          text: res.error || 'Failed to post ad. Please try again.'
        });
      }
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Error occurred while saving ad.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Toggle Active Status
  const handleToggleActive = async (id: string) => {
    try {
      const res = await apiService.toggleLocalAd(id, adminToken);
      if (res.success) {
        setAds(prev => prev.map(a => a.id === id ? { ...a, isActive: res.isActive ?? !a.isActive } : a));
      }
    } catch (e) {
      console.warn('Toggle failed:', e);
    }
  };

  // Handle Update Local Ad
  const handleSaveEditedAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd) return;
    setEditSubmitting(true);
    setEditMsg(null);

    try {
      const res = await apiService.updateLocalAd(editingAd.id, editingAd, adminToken);
      if (res.success) {
        setEditMsg({ type: 'success', text: 'Ad successfully updated!' });
        await loadAllAds();
        setTimeout(() => {
          setEditingAd(null);
          setEditMsg(null);
        }, 1000);
      } else {
        setEditMsg({ type: 'error', text: res.error || 'Failed to update ad' });
      }
    } catch (e: any) {
      setEditMsg({ type: 'error', text: e.message || 'Error updating ad' });
    } finally {
      setEditSubmitting(false);
    }
  };

  // Handle Delete Ad
  const handleDeleteAd = async (id: string) => {
    try {
      const res = await apiService.deleteLocalAd(id, adminToken);
      if (res.success) {
        setAds(prev => prev.filter(a => a.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (e) {
      console.warn('Delete failed:', e);
    }
  };

  // Handle Save Live Rates & Ticker
  const handleSaveRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRates(true);
    setRatesMsg(null);

    try {
      const updated = {
        ...(ratesConfig || {}),
        goldRatePerGram22k: Number(gold22k),
        goldRatePerGram24k: Number(gold24k),
        announcementText: announcementText.trim(),
        announcementActive,
        lastUpdated: new Date().toISOString()
      };
      const res = await apiService.updateDynamicConfig(updated);
      if (res.success) {
        setRatesConfig(res.config);
        setRatesMsg({ type: 'success', text: '⚡ Live Market Gold rates & Announcement Banner updated in real-time!' });
        setTimeout(() => setRatesMsg(null), 4000);
      } else {
        setRatesMsg({ type: 'error', text: 'Failed to update live rates.' });
      }
    } catch (e: any) {
      setRatesMsg({ type: 'error', text: e.message || 'Error saving rates config' });
    } finally {
      setSavingRates(false);
    }
  };

  const filteredAds = ads.filter(ad => {
    const matchesCat = categoryFilter === 'All' || ad.category === categoryFilter;
    const matchesSearch = !search || 
      ad.title.toLowerCase().includes(search.toLowerCase()) ||
      ad.area.toLowerCase().includes(search.toLowerCase()) ||
      ad.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Quick Summary Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 border-2 border-amber-300/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 font-extrabold text-xs border border-amber-400/40">
            <Megaphone className="w-4 h-4 text-amber-700 animate-pulse" />
            <span>Agent Sagar Local Classifieds Control</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Post & Manage Local Market Advertisements
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Publish exclusive Basavakalyan real estate plots, farming machinery, shop deals, and gold offers directly onto the Live Market section. You have exclusive admin authorization to add, toggle visibility, and edit all listings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadAllAds}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Ads ({ads.length})</span>
          </button>

          {onPreviewBulletin && (
            <button
              onClick={onPreviewBulletin}
              className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>View Public Bulletin</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: Left Column = Post New Ad Form; Right Column = Live Rates & Ticker Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form to Post New Local Ad (7 cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
                <Plus className="w-5 h-5 font-black" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Post a New Local Area Ad</h3>
                <p className="text-xs text-slate-500">Visible to thousands of Basavakalyan visitors</p>
              </div>
            </div>
            <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
              Admin Exclusive
            </span>
          </div>

          {feedbackMsg && (
            <div className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-2.5 ${
              feedbackMsg.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}>
              {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleCreateAd} className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Advertisement Headline / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 1200 Sq.Ft NA Residential Plot for Sale near Shivaji Chowk"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white transition-all"
              />
            </div>

            {/* Category & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as LocalAdCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-vermillion cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Promotional Tag / Badge
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-vermillion cursor-pointer"
                >
                  {badges.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Area & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Local Area / Landmark in Basavakalyan *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Shivaji Chowk, Basavakalyan"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Price / Offer (Optional)
                </label>
                <input
                  type="text"
                  value={priceOrOffer}
                  onChange={(e) => setPriceOrOffer(e.target.value)}
                  placeholder="e.g. ₹18.5 Lakhs (Negotiable) or 20% Off"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>
            </div>

            {/* Quick Area Presets */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500">Quick Area Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {popularAreas.map(pa => (
                  <button
                    key={pa}
                    type="button"
                    onClick={() => setArea(pa)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium cursor-pointer transition-colors"
                  >
                    {pa.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="9632636718"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  WhatsApp Number (with country code)
                </label>
                <input
                  type="text"
                  required
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="919632636718"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>
            </div>

            {/* Rich Media: Images & Video Tours for Header Banner */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl space-y-4 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                    Header Banner Media (Videos & Images)
                  </span>
                </div>
                <span className="text-[10px] bg-vermillion text-white px-2 py-0.5 rounded-md font-extrabold">
                  Plays in Top Banner
                </span>
              </div>

              {/* Sample Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400">Quick Media Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {sampleMediaPresets.map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setImageUrl(preset.image);
                        setVideoUrl(preset.video);
                        setMediaType('both');
                      }}
                      className="text-[10px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-semibold cursor-pointer transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image URL Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Banner Image URL (Poster / Photo)</span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or image link"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-vermillion"
                />
              </div>

              {/* Video URL Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-amber-400" />
                  <span>Video URL (Direct MP4 / WebM or YouTube Link)</span>
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://.../video.mp4 or https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-vermillion"
                />
              </div>

              {/* Live Media Preview Box */}
              {(videoUrl || imageUrl) && (
                <div className="mt-2 rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video relative max-h-48 flex items-center justify-center">
                  {videoUrl && !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be') ? (
                    <video
                      src={videoUrl}
                      poster={imageUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-xs text-slate-500">Media Preview</span>
                  )}
                  <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-amber-300">
                    Live Header Preview
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Full Details & Descriptions *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the property location, size, documents clear status, road width, water availability, or special festive offers..."
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
              />
            </div>

            {/* Active Toggle & Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-vermillion rounded focus:ring-vermillion"
                />
                <span>Publish as Active immediately</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Megaphone className="w-4 h-4 text-amber-300" />
                <span>{submitting ? 'Publishing Ad...' : 'Publish to Live Market'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Live Rates & Top Ticker Announcement Controller (5 cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700">
                  <TrendingUp className="w-5 h-5 font-black" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Live Market Rates Controller</h3>
                  <p className="text-xs text-slate-500">Controls top ticker prices & announcements</p>
                </div>
              </div>
            </div>

            {ratesMsg && (
              <div className={`p-3.5 rounded-2xl text-xs font-bold border flex items-center gap-2 ${
                ratesMsg.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}>
                {ratesMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                <span>{ratesMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveRates} className="space-y-4">
              
              {/* Gold Rates */}
              <div className="grid grid-cols-2 gap-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    22K Gold / Gram (₹)
                  </label>
                  <input
                    type="number"
                    value={gold22k}
                    onChange={(e) => setGold22k(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border-2 border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    24K Gold / Gram (₹)
                  </label>
                  <input
                    type="number"
                    value={gold24k}
                    onChange={(e) => setGold24k(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border-2 border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Ticker Announcement Text */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Top Live Ticker Flash Notice</span>
                  <span className="text-[11px] text-slate-400 font-normal">Shown in top bar</span>
                </label>
                <textarea
                  rows={3}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. ⚡ Special 2026 Loan Festival in Basavakalyan: Housing Loans from 8.4% p.a. | Gold Loan Instant Cash in 15 Mins"
                  className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              {/* Ticker Toggle & Save */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={announcementActive}
                    onChange={(e) => setAnnouncementActive(e.target.checked)}
                    className="w-4 h-4 text-vermillion rounded focus:ring-vermillion"
                  />
                  <span>Show Ticker Notice</span>
                </label>

                <button
                  type="submit"
                  disabled={savingRates}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>{savingRates ? 'Updating...' : 'Save Live Rates'}</span>
                </button>
              </div>

            </form>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-600 text-[11px] space-y-1 mt-4">
            <p className="font-bold text-slate-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Real-Time Ticker Integration</span>
            </p>
            <p>
              When new local ads are published, the top header ticker rotates them automatically so visitors across the portal can see your latest posts!
            </p>
          </div>
        </div>

      </div>

      {/* Active Listings Management Table & Cards */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Table Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-xl font-black text-slate-900">Manage Published Local Area Ads</h3>
            <p className="text-xs text-slate-500">Toggle live visibility, edit pricing, or remove expired listings</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-grow sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ads by keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-vermillion font-medium"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-vermillion cursor-pointer"
            >
              <option value="All">All Categories ({ads.length})</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ads List */}
        {filteredAds.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No local ads found</h4>
            <p className="text-xs text-slate-500">
              {search || categoryFilter !== 'All' ? 'Try adjusting your search query or category filter.' : 'Use the form above to publish your first verified local listing.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map((ad) => (
              <div
                key={ad.id}
                className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
                  ad.isActive !== false ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50/80 border-slate-200 opacity-70'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Top Bar: Badge, Category, Active status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-300">
                      {ad.badge || 'VERIFIED'}
                    </span>

                    <button
                      onClick={() => handleToggleActive(ad.id)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                        ad.isActive !== false 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                          : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
                      }`}
                      title={ad.isActive !== false ? 'Click to Hide from Public' : 'Click to Make Live'}
                    >
                      {ad.isActive !== false ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                      <span>{ad.isActive !== false ? 'Live Online' : 'Hidden / Inactive'}</span>
                    </button>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {ad.title}
                  </h4>

                  {/* Media Thumbnail preview if available */}
                  {(ad.imageUrl || ad.videoUrl) && (
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-200">
                      {ad.imageUrl ? (
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
                          <Video className="w-8 h-8 text-amber-400" />
                        </div>
                      )}
                      {ad.videoUrl && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-vermillion text-white flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                          <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-[9px] font-extrabold text-amber-300 px-1.5 py-0.5 rounded">
                            HD Video
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Area & Category */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                      <MapPin className="w-3 h-3 text-vermillion" />
                      <span>{ad.area}</span>
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                      {ad.category}
                    </span>
                  </div>

                  {/* Price */}
                  {ad.priceOrOffer && (
                    <div className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      Offer: <span className="font-extrabold">{ad.priceOrOffer}</span>
                    </div>
                  )}

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {ad.description}
                  </p>
                </div>

                {/* Bottom Actions: Edit, Delete */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {ad.id}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingAd({ ...ad });
                        setEditMsg(null);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit Ad Details"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(ad.id)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 cursor-pointer transition-colors"
                      title="Delete Ad"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Edit Ad Modal */}
      {editingAd && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-xl space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-vermillion" />
                <h3 className="text-base font-black text-slate-900">Edit Local Advertisement</h3>
              </div>
              <button 
                onClick={() => setEditingAd(null)} 
                className="text-slate-400 hover:text-slate-900 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                editMsg.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}>
                {editMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{editMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditedAd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Headline / Title</label>
                <input
                  type="text"
                  required
                  value={editingAd.title}
                  onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <select
                    value={editingAd.category}
                    onChange={(e) => setEditingAd({ ...editingAd, category: e.target.value as LocalAdCategory })}
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-vermillion cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Badge Tag</label>
                  <select
                    value={editingAd.badge || 'VERIFIED LOCAL'}
                    onChange={(e) => setEditingAd({ ...editingAd, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-vermillion cursor-pointer"
                  >
                    {badges.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Area / Landmark</label>
                  <input
                    type="text"
                    required
                    value={editingAd.area}
                    onChange={(e) => setEditingAd({ ...editingAd, area: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Price / Offer</label>
                  <input
                    type="text"
                    value={editingAd.priceOrOffer || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, priceOrOffer: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingAd.contactPhone || '9632636718'}
                    onChange={(e) => setEditingAd({ ...editingAd, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={editingAd.whatsappPhone || '919632636718'}
                    onChange={(e) => setEditingAd({ ...editingAd, whatsappPhone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                  />
                </div>
              </div>

              {/* Edit Media URLs */}
              <div className="bg-slate-900 p-3.5 rounded-xl space-y-2.5 border border-slate-700">
                <span className="text-[11px] font-black uppercase text-amber-400 block">Header Banner Media</span>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">Image / Poster URL</label>
                  <input
                    type="url"
                    value={editingAd.imageUrl || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-vermillion"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">Video Tour URL (MP4 or YouTube)</label>
                  <input
                    type="text"
                    value={editingAd.videoUrl || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, videoUrl: e.target.value })}
                    placeholder="https://.../video.mp4"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-vermillion"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingAd.description}
                  onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-vermillion focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingAd.isActive !== false}
                    onChange={(e) => setEditingAd({ ...editingAd, isActive: e.target.checked })}
                    className="w-4 h-4 text-vermillion rounded focus:ring-vermillion"
                  />
                  <span>Active & Visible in Live Market</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingAd(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    className="px-5 py-2 bg-vermillion hover:bg-vermillion-dark text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer"
                  >
                    {editSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 w-full max-w-md text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Delete Local Advertisement?</h3>
            <p className="text-xs text-slate-600 font-medium">
              Are you sure you want to permanently remove this local ad? This will immediately remove it from the Live Market section.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200 cursor-pointer border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAd(deleteConfirmId)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
