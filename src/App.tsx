import React, { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LoanCategories } from './components/LoanCategories';
import { Testimonials } from './components/Testimonials';
import { SeoLoanPage } from './components/SeoLoanPage';
import { AdminDashboard } from './components/AdminDashboard';
import { LaunchDeployGuide } from './components/LaunchDeployGuide';
import { LeadFormModal } from './components/LeadFormModal';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { LoanType } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'loan-detail' | 'admin' | 'launch'>('home');
  const [activeSlug, setActiveSlug] = useState<string>('personal-loan-basavakalyan');
  const [adminMode, setAdminMode] = useState<'login' | 'signup'>('login');

  // Lead Application Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<string>('Personal Loan');
  const [modalAmount, setModalAmount] = useState<string>('');

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView, activeSlug]);

  const handleOpenApplyModal = (loanType = 'Personal Loan', amount = '') => {
    setModalCategory(loanType);
    setModalAmount(amount);
    setIsApplyModalOpen(true);
  };

  const handleNavigate = (view: 'home' | 'loan-detail' | 'admin' | 'launch', slug?: string) => {
    setActiveView(view);
    if (slug) {
      setActiveSlug(slug);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-vermillion selection:text-white">
      
      {/* Global Header */}
      <Header
        onOpenApplyModal={(type) => handleOpenApplyModal(type || 'Personal Loan')}
        onNavigate={handleNavigate}
        activeView={activeView}
        activeSlug={activeSlug}
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

            {/* Phase 1 & 4: Loan Categories */}
            <LoanCategories
              onOpenApplyModal={(type) => handleOpenApplyModal(type)}
              onNavigateToSeoPage={(slug) => handleNavigate('loan-detail', slug)}
            />

            {/* Customer Testimonials & Reviews */}
            <Testimonials
              onOpenApplyModal={(type) => handleOpenApplyModal(type)}
            />
          </>
        )}

        {/* Phase 4: Dedicated SEO Landing Pages */}
        {activeView === 'loan-detail' && (
          <SeoLoanPage
            slug={activeSlug}
            onOpenApplyModal={(type) => handleOpenApplyModal(type)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {/* Phase 3: Admin Dashboard (1 Single Slot Admin Authentication) */}
        {activeView === 'admin' && (
          <AdminDashboard initialMode={adminMode} />
        )}

        {/* Phase 5: Launch, Vercel & Custom Domain Guide */}
        {activeView === 'launch' && (
          <LaunchDeployGuide />
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

      {/* Global Footer */}
      <Footer
        onNavigateHome={() => handleNavigate('home')}
        onNavigateToSeoPage={(slug) => handleNavigate('loan-detail', slug)}
        onNavigateAdmin={(mode) => {
          setAdminMode(mode || 'login');
          handleNavigate('admin');
        }}
        onNavigateLaunch={() => handleNavigate('launch')}
      />

      {/* Vercel Speed Insights */}
      <SpeedInsights />

    </div>
  );
}
