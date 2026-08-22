import React, { useState } from 'react';
import { Phone, MessageCircle, ShieldCheck, Menu, X, ChevronDown, Lock, Sparkles, MapPin } from 'lucide-react';
import logoImg from '../assets/images/agent_sagar_logo_1786613776078.jpg';
import logoImgWebp from '../assets/images/agent_sagar_logo_1786613776078.webp';
import { OptimizedImage } from './OptimizedImage';

interface HeaderProps {
  onOpenApplyModal: (loanType?: string) => void;
  onNavigate: (view: 'home' | 'loan-detail' | 'admin', slug?: string) => void;
  onOpenTrackModal: () => void;
  onOpenAdvisor: () => void;
  activeView: string;
  activeSlug?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenApplyModal,
  onNavigate,
  onOpenTrackModal,
  onOpenAdvisor,
  activeView,
  activeSlug
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [seoDropdownOpen, setSeoDropdownOpen] = useState(false);

  const seoPages = [
    { title: 'Personal Loan Basavakalyan', slug: 'personal-loan-basavakalyan' },
    { title: 'Home Loan Basavakalyan', slug: 'home-loan-basavakalyan' },
    { title: 'Business Loan Basavakalyan', slug: 'business-loan-basavakalyan' },
    { title: 'Vehicle Loan Basavakalyan', slug: 'vehicle-loan-basavakalyan' },
    { title: 'Gold Loan Basavakalyan', slug: 'gold-loan-basavakalyan' },
    { title: 'Mortgage Loan Basavakalyan', slug: 'mortgage-loan-basavakalyan' },
    { title: 'Agriculture Loan Basavakalyan', slug: 'agriculture-loan-basavakalyan' },
    { title: 'Credit Card Basavakalyan', slug: 'credit-card-basavakalyan' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200 shadow-sm">
      {/* Top Banner Notice - Clean Banking Bar */}
      <div className="bg-vermillion text-xs py-2 px-4 text-center font-medium text-white flex items-center justify-center gap-2 shadow-inner">
        <ShieldCheck className="w-4 h-4 text-amber-300" />
        <span className="font-semibold tracking-wide">#1 Trusted Loan Agent in Basavakalyan | Instant Approvals & Fast Service</span>
        <span className="hidden md:inline-block bg-white/15 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-white/20">
          Helpline: +91 96326 36718
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative h-12 sm:h-14 overflow-hidden rounded-xl border border-slate-200 p-1 bg-white shadow-xs group-hover:scale-105 transition-transform flex items-center">
              <OptimizedImage 
                src={logoImg}
                webpSrc={logoImgWebp}
                alt="Agent Sagar Loans - Basavakalyan Loan Agency Logo"
                width={240}
                height={56}
                priority={true}
                className="h-full w-auto object-contain max-w-[180px] sm:max-w-[240px]"
              />
            </div>
            <div className="hidden xl:block border-l border-slate-200 pl-3">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-vermillion transition-colors">
                  Basavakalyan <span className="text-vermillion">Loans</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-vermillion" />
                <span>Agent Sagar • Basavakalyan</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-bold transition-colors hover:text-vermillion cursor-pointer ${
                activeView === 'home' ? 'text-vermillion border-b-2 border-vermillion pb-1' : 'text-slate-700'
              }`}
            >
              Home
            </button>

            {/* SEO Loan Pages Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSeoDropdownOpen(!seoDropdownOpen)}
                className={`flex items-center gap-1 text-sm font-bold transition-colors hover:text-vermillion cursor-pointer ${
                  activeView === 'loan-detail' ? 'text-vermillion' : 'text-slate-700'
                }`}
              >
                <span>Loan Services</span>
                <ChevronDown className="w-4 h-4 text-vermillion" />
              </button>

              {seoDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setSeoDropdownOpen(false)}
                >
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                    Targeted Categories
                  </div>
                  {seoPages.map((page) => (
                    <a
                      key={page.slug}
                      href={`/${page.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('loan-detail', page.slug);
                        setSeoDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between font-medium cursor-pointer ${
                        activeSlug === page.slug 
                          ? 'bg-vermillion-light text-vermillion font-bold border border-vermillion-light' 
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span>{page.title}</span>
                      <Sparkles className="w-3 h-3 text-amber-500" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Smart Advisor Direct Link */}
            <button
              onClick={() => {
                if (activeView !== 'home') {
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('smart-advisor')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  document.getElementById('smart-advisor')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-sm font-bold text-slate-700 hover:text-vermillion transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Smart Advisor</span>
            </button>

            {/* Live Bank Rates */}
            <button
              onClick={() => {
                if (activeView !== 'home') {
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('bank-rates-matrix')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  document.getElementById('bank-rates-matrix')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-sm font-bold text-slate-700 hover:text-vermillion transition-colors cursor-pointer"
            >
              Live Rates
            </button>

            {/* Track Application Button */}
            <button
              onClick={onOpenTrackModal}
              className="text-sm font-bold text-slate-700 hover:text-vermillion transition-colors cursor-pointer"
            >
              Track Loan
            </button>

            <a
              href="#testimonials"
              onClick={(e) => {
                if (activeView !== 'home') {
                  e.preventDefault();
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="text-sm font-bold text-slate-700 hover:text-vermillion transition-colors cursor-pointer"
            >
              Reviews
            </a>

            {/* Admin Dashboard */}
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-vermillion" />
              <span>Admin</span>
            </button>
          </nav>


          {/* Quick Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+919632636718"
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors border border-slate-200"
            >
              <Phone className="w-3.5 h-3.5 text-vermillion" />
              <span>Call</span>
            </a>

            <a
              href="https://wa.me/919632636718?text=Hello%20Basavakalyan%20Loan%20Services,%20I%20would%20like%20to%20apply%20for%20a%20loan."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba59] transition-all shadow-sm transform hover:scale-105"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-white fill-white/20 stroke-[2.2]" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => onOpenApplyModal()}
              className="bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Apply Now
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => onOpenApplyModal()}
              className="bg-vermillion text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow cursor-pointer"
            >
              Apply Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-xl bg-slate-100 border border-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-3 shadow-lg">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 cursor-pointer"
          >
            Home
          </button>

          <button
            onClick={() => {
              onOpenTrackModal();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 cursor-pointer flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              Track My Loan Application
            </span>
            <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">Live Status</span>
          </button>

          <button
            onClick={() => {
              onOpenAdvisor();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 cursor-pointer flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Smart Loan Advisor (Eligibility)
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Calculators</span>
          </button>

          <div className="border-t border-b border-slate-200 py-2 my-2 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase px-3 py-1">
              Loan Services
            </div>
            {seoPages.map((page) => (
              <a
                key={page.slug}
                href={`/${page.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('loan-detail', page.slug);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2 px-4 rounded-xl text-xs flex items-center justify-between font-semibold cursor-pointer ${
                  activeSlug === page.slug ? 'bg-vermillion-light text-vermillion' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{page.title}</span>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </a>
            ))}
          </div>

          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold text-slate-900 bg-slate-100 border border-slate-200 flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-vermillion" />
              Admin Portal
            </span>
            <span className="text-xs bg-vermillion text-white px-2 py-0.5 rounded font-bold">Authorized</span>
          </button>

          <div className="pt-2 flex items-center gap-2">
            <a
              href="tel:+919632636718"
              className="flex-1 py-3 text-center text-xs font-bold rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-vermillion" />
              <span>Call +91 96326 36718</span>
            </a>
            <a
              href="https://wa.me/919632636718?text=Hello%20Basavakalyan%20Loan%20Services"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 text-center text-xs font-bold rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-1.5 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-white fill-white/20 stroke-[2.2]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
