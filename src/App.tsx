import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LiveRatesTicker } from './components/LiveRatesTicker';
import { HeroSection } from './components/HeroSection';
import { SmartLoanAdvisor } from './components/SmartLoanAdvisor';
import { LiveBankRatesMatrix } from './components/LiveBankRatesMatrix';
import { LocalMarketAdsSection } from './components/LocalMarketAdsSection';
import { LoanCategories } from './components/LoanCategories';
import { EmiCalculator } from './components/EmiCalculator';
import { HomeContentSections } from './components/HomeContentSections';
import { ReviewsSection } from './components/ReviewsSection';
import { SeoLoanPage } from './components/SeoLoanPage';
import { AdminDashboard } from './components/AdminDashboard';
import { LeadFormModal } from './components/LeadFormModal';
import { TrackApplicationModal } from './components/TrackApplicationModal';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { SEOHead } from './components/SEOHead';
import { LOAN_CATEGORIES } from './data/loansData';
import { LoanType } from './types';

export default function App() {
  // Determine initial route from window.location.pathname
  const getInitialRoute = (): { view: 'home' | 'loan-detail' | 'admin'; slug: string } => {
    if (typeof window === 'undefined') return { view: 'home', slug: 'personal-loan-basavakalyan' };
    const pathname = window.location.pathname.replace(/^\/|\/$/g, '');
    
    if (pathname === 'admin') {
      return { view: 'admin', slug: 'personal-loan-basavakalyan' };
    }

    const matchedCategory = LOAN_CATEGORIES.find(c => c.slug === pathname);
    if (matchedCategory) {
      return { view: 'loan-detail', slug: matchedCategory.slug };
    }

    return { view: 'home', slug: 'personal-loan-basavakalyan' };
  };

  const initialRoute = getInitialRoute();
  const [activeView, setActiveView] = useState<'home' | 'loan-detail' | 'admin'>(initialRoute.view);
  const [activeSlug, setActiveSlug] = useState<string>(initialRoute.slug);
  const [adminMode, setAdminMode] = useState<'login' | 'signup'>('login');

  // Lead Application Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<string>('Personal Loan');
  const [modalAmount, setModalAmount] = useState<string>('');

  // Track Application Modal State
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  // Sync URL when activeView or activeSlug changes, and handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const currentRoute = getInitialRoute();
      setActiveView(currentRoute.view);
      setActiveSlug(currentRoute.slug);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView, activeSlug]);

  const handleOpenApplyModal = (loanType = 'Personal Loan', amount = '') => {
    setModalCategory(loanType);
    setModalAmount(amount);
    setIsApplyModalOpen(true);
  };

  const handleNavigate = (view: 'home' | 'loan-detail' | 'admin', slug?: string) => {
    setActiveView(view);
    const targetSlug = slug || activeSlug;
    if (slug) {
      setActiveSlug(slug);
    }

    // Update browser URL without full reload
    if (typeof window !== 'undefined' && window.history) {
      let targetPath = '/';
      if (view === 'loan-detail' && targetSlug) {
        targetPath = `/${targetSlug}`;
      } else if (view === 'admin') {
        targetPath = '/admin';
      }
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-vermillion selection:text-white">
      
      {/* Dynamic SEO Meta, Open Graph, Canonical, JSON-LD Schema */}
      <SEOHead activeView={activeView} activeSlug={activeSlug} />

      {/* Global Header */}
      <Header
        onOpenApplyModal={(type) => handleOpenApplyModal(type || 'Personal Loan')}
        onNavigate={handleNavigate}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAdvisor={() => {
          if (activeView !== 'home') {
            handleNavigate('home');
            setTimeout(() => {
              document.getElementById('smart-advisor')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          } else {
            document.getElementById('smart-advisor')?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        activeView={activeView}
        activeSlug={activeSlug}
      />

      {/* Dynamic Live Rates Ticker (Gold price, live interest rates, updates) */}
      <LiveRatesTicker 
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAdvisor={() => {
          if (activeView !== 'home') {
            handleNavigate('home');
            setTimeout(() => {
              document.getElementById('smart-advisor')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          } else {
            document.getElementById('smart-advisor')?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onNavigateToLocalAds={() => {
          if (activeView !== 'home') {
            handleNavigate('home');
            setTimeout(() => {
              document.getElementById('local-market-bulletin')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          } else {
            document.getElementById('local-market-bulletin')?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        {activeView === 'home' && (
          <>
            {/* Phase 1: Hero Section with Basavakalyan Gate, Logo & Lead Form */}
            <HeroSection
              onLeadSubmitted={() => {
                // Refreshes leads if admin is open
              }}
              onSelectCategory={(type) => {
                handleOpenApplyModal(type);
              }}
            />

            {/* Dynamic Smart Loan Advisor (Eligibility Engine) */}
            <div id="smart-advisor">
              <SmartLoanAdvisor onApplyWithResult={(type, amount) => handleOpenApplyModal(type, amount)} />
            </div>

            {/* Live Bank Rates & Partner Comparison Matrix */}
            <div id="bank-rates-matrix">
              <LiveBankRatesMatrix onOpenApplyModal={(type) => handleOpenApplyModal(type)} />
            </div>

            {/* Local Market Bulletin & Area Advertisements (Agent Sagar Exclusives) */}
            <LocalMarketAdsSection 
              onOpenApplyModal={(type, amount) => handleOpenApplyModal(type, amount)}
              onNavigateToAdmin={() => handleNavigate('admin')} 
            />

            {/* Loan Categories */}
            <LoanCategories
              onOpenApplyModal={(type) => handleOpenApplyModal(type)}
              onNavigateToSeoPage={(slug) => handleNavigate('loan-detail', slug)}
            />

            {/* Interactive Loan EMI Calculator */}
            <EmiCalculator
              onOpenApplyModal={(type, amount) => handleOpenApplyModal(type || 'Personal Loan', amount || '')}
            />

            {/* Semantic Sections: Why Choose Us, Process, Documents, Local Info, FAQs, Disclaimers */}
            <HomeContentSections
              onOpenApplyModal={(type) => handleOpenApplyModal(type)}
              onNavigateToSeoPage={(slug) => handleNavigate('loan-detail', slug)}
            />

            {/* Verified Customer Testimonials & Dynamic Reviews Section */}
            <ReviewsSection
              onOpenApplyModal={(type) => handleOpenApplyModal(type)}
            />
          </>
        )}

        {/* Dedicated SEO Landing Pages */}
        {activeView === 'loan-detail' && (
          <SeoLoanPage
            slug={activeSlug}
            onOpenApplyModal={(type) => handleOpenApplyModal(type)}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateToSeoPage={(slug) => handleNavigate('loan-detail', slug)}
          />
        )}

        {/* Admin Dashboard */}
        {activeView === 'admin' && (
          <AdminDashboard initialMode={adminMode} />
        )}
      </main>

      {/* Floating Sticky Call & WhatsApp buttons */}
      <FloatingActions />

      {/* Lead Application Popup Modal */}
      <LeadFormModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        defaultLoanType={modalCategory}
        defaultAmount={modalAmount}
        onSubmitted={() => {
          // Handled inside modal
        }}
      />

      {/* Dynamic Loan Status Tracking Modal */}
      <TrackApplicationModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />

      {/* Global Footer */}
      <Footer
        onNavigateHome={() => handleNavigate('home')}
        onNavigateToSeoPage={(slug) => handleNavigate('loan-detail', slug)}
        onNavigateAdmin={(mode) => {
          setAdminMode(mode || 'login');
          handleNavigate('admin');
        }}
      />

    </div>
  );
}

