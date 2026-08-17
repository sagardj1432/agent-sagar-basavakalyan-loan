import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      {/* Call Button */}
      <a
        href="tel:+919632636718"
        className="bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 p-3.5 rounded-full shadow-xl transition-all transform hover:scale-110 flex items-center justify-center group"
        title="Call Basavakalyan Loan Office: +91 96326 36718"
      >
        <Phone className="w-5 h-5 text-vermillion group-hover:rotate-12 transition-transform" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-xs font-bold text-slate-900 transition-all duration-300">
          Call +91 96326 36718
        </span>
      </a>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919632636718?text=Hello%20Basavakalyan%20Loan%20Services,%20I%20would%20like%20to%20apply%20for%20a%20loan."
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-full shadow-xl transition-all transform hover:scale-110 flex items-center justify-center group relative"
        title="Chat on WhatsApp (+91 96326 36718)"
      >
        <MessageCircle className="w-6 h-6 text-white fill-white/20 stroke-[2.2]" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-xs font-bold text-white transition-all duration-300">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};
