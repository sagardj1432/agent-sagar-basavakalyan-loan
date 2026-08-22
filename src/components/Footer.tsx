import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, ShieldCheck, Heart, Lock, UserPlus, LogIn, KeyRound } from 'lucide-react';
import logoImg from '../assets/images/agent_sagar_logo_1786613776078.jpg';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateToSeoPage: (slug: string) => void;
  onNavigateAdmin: (mode?: 'login' | 'signup') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateToSeoPage,
  onNavigateAdmin
}) => {
  return (
    <footer className="bg-slate-100 text-slate-700 text-xs border-t border-slate-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: About & Logo */}
          <div className="space-y-3">
            <div 
              onClick={onNavigateHome}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="bg-white p-1 rounded-xl border border-slate-300 shadow-xs">
                <img 
                  src={logoImg} 
                  alt="Agent Sagar - Basavakalyan Loans" 
                  className="h-10 w-auto object-contain max-w-[160px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-extrabold text-sm text-slate-900 group-hover:text-vermillion transition-colors">
                Agent Sagar Loans
              </span>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed font-normal">
              Basavakalyan's #1 trusted local loan agent offering fast loan sanctioning for personal, housing, gold, shopkeeper business, agriculture, and credit card needs across Basavakalyan.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-vermillion font-bold pt-1">
              <ShieldCheck className="w-4 h-4 text-vermillion" />
              <span>100% Verified Local Financial Assistance</span>
            </div>
          </div>

          {/* Col 2: SEO Loan Categories & Pillar Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Loan Categories & Hub
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateHome();
                  }}
                  className="text-vermillion font-extrabold hover:underline transition-colors text-left cursor-pointer inline-flex items-center gap-1"
                >
                  <span>★ Master Loans Hub (Pillar)</span>
                </a>
              </li>
              {[
                { title: 'Personal Loan Basavakalyan', slug: 'personal-loan-basavakalyan' },
                { title: 'Home Loan Basavakalyan', slug: 'home-loan-basavakalyan' },
                { title: 'Business Loan Basavakalyan', slug: 'business-loan-basavakalyan' },
                { title: 'Vehicle Loan Basavakalyan', slug: 'vehicle-loan-basavakalyan' },
                { title: 'Gold Loan Basavakalyan', slug: 'gold-loan-basavakalyan' },
                { title: 'Mortgage Loan Basavakalyan', slug: 'mortgage-loan-basavakalyan' },
                { title: 'Agriculture Loan Basavakalyan', slug: 'agriculture-loan-basavakalyan' },
                { title: 'Credit Card Basavakalyan', slug: 'credit-card-basavakalyan' }
              ].map((item) => (
                <li key={item.slug}>
                  <a
                    href={`/${item.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateToSeoPage(item.slug);
                    }}
                    className="hover:text-vermillion transition-colors text-left cursor-pointer inline-block"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Local Coverage Areas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Coverage Areas
            </h4>
            <ul className="space-y-2 font-medium">
              <li className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-vermillion" />
                <span>Basavakalyan Main Town & Market</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-vermillion" />
                <span>Near Reliance Mart & Fort Area</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-vermillion" />
                <span>Model Colony & Rajeshwar</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-vermillion" />
                <span>Basavakalyan Region & Local Villages</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Office Contact
            </h4>

            <div className="space-y-2 text-slate-700 font-medium">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-vermillion flex-shrink-0 mt-0.5" />
                <span>Near Reliance Mart, Basavakalyan, Karnataka - 585327</span>
              </p>

              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-vermillion flex-shrink-0" />
                <a href="tel:+919632636718" className="hover:text-vermillion font-bold">+91 96326 36718</a>
              </p>

              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-vermillion flex-shrink-0" />
                <span>Mon – Sat: 9:00 AM – 7:30 PM</span>
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => onNavigateAdmin('login')}
                className="text-[11px] font-bold text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-vermillion" />
                <span>Admin Login</span>
              </button>

              <button
                onClick={() => onNavigateAdmin('signup')}
                className="text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin Signup (1 Slot)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Admin Portal Bottom Bar Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl border border-slate-200">
              <Lock className="w-5 h-5 text-vermillion" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Admin Management Portal</span>
                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                  1 Slot Restricted
                </span>
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Official single-administrator management system for Basavakalyan customer leads.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onNavigateAdmin('login')}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Login</span>
            </button>

            <button
              onClick={() => onNavigateAdmin('signup')}
              className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-200" />
              <span>Admin Signup</span>
            </button>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="border-t border-slate-200 pt-6 text-center space-y-2 text-[11px] text-slate-500 font-normal">
          <p>
            Disclaimer: Agent Sagar operates as an independent loan assistance service provider in Basavakalyan, Bidar district, Karnataka. Final loan sanction, interest rates, processing fees, and disbursement timelines are at the sole discretion of partner banks and RBI-registered NBFCs based on applicant eligibility and documentation verification.
          </p>
          <p className="flex items-center justify-center gap-1 font-bold text-slate-700">
            <span>© {new Date().getFullYear()} Agent Sagar – Basavakalyan Loan Assistance. All rights reserved. Basavakalyan, Bidar, Karnataka.</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
