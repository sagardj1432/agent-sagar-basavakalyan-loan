import React, { useState } from 'react';
import { Star, Quote, CheckCircle2, MapPin, UserCheck, Plus, Sparkles, MessageSquare, ThumbsUp } from 'lucide-react';
import { initialTestimonials } from '../data/testimonialsData';
import { Testimonial, LoanType } from '../types';

interface TestimonialsProps {
  onOpenApplyModal?: (loanType?: string) => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ onOpenApplyModal }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  // Review submission state
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    location: 'Basavakalyan',
    loanType: 'Personal Loan' as LoanType,
    rating: 5,
    quote: '',
    amountSanctioned: ''
  });
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  const categories = ['All', 'Personal Loan', 'Business Loan', 'Home Loan', 'Gold Loan', 'Agriculture Loan'];

  const filteredTestimonials = activeFilter === 'All'
    ? testimonials
    : testimonials.filter((t) => t.loanType === activeFilter);

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.quote.trim()) return;

    const createdTestimonial: Testimonial = {
      id: `test-${Date.now()}`,
      name: newReview.name,
      location: newReview.location || 'Basavakalyan',
      loanType: newReview.loanType,
      rating: newReview.rating,
      date: 'Just now',
      quote: newReview.quote,
      amountSanctioned: newReview.amountSanctioned ? `₹${newReview.amountSanctioned}` : undefined,
      verified: true,
      avatarBg: 'bg-vermillion text-white'
    };

    setTestimonials([createdTestimonial, ...testimonials]);
    setSubmitSuccessMsg('Thank you! Your review has been published.');
    setTimeout(() => {
      setSubmitSuccessMsg('');
      setShowAddReview(false);
      setNewReview({
        name: '',
        location: 'Basavakalyan',
        loanType: 'Personal Loan',
        rating: 5,
        quote: '',
        amountSanctioned: ''
      });
    }, 2000);
  };

  return (
    <section id="testimonials" className="py-16 bg-white border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vermillion-light border border-vermillion-light text-vermillion text-xs font-bold">
              <UserCheck className="w-4 h-4 text-vermillion" />
              <span>Customer Success Stories</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Hundreds Across <span className="text-vermillion">Basavakalyan</span>
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed">
              Read real experiences from local business owners, farmers, and residents who received fast, hassle-free loan approvals with dedicated assistance.
            </p>
          </div>

          {/* Rating Summary Card & Write Review Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-slate-900">4.9</div>
              <div>
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <div className="text-[11px] text-slate-500 font-bold mt-0.5">240+ Verified Local Reviews</div>
              </div>
            </div>

            <button
              onClick={() => setShowAddReview(!showAddReview)}
              className="px-4 py-2.5 bg-vermillion hover:bg-vermillion-dark text-white text-xs font-bold rounded-xl border border-vermillion flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddReview ? 'Cancel' : 'Write a Review'}</span>
            </button>
          </div>
        </div>

        {/* Add Review Form Drawer */}
        {showAddReview && (
          <div className="bg-slate-50 border-2 border-vermillion/30 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-vermillion" />
                Share Your Experience with Basavakalyan Loan Services
              </h3>
              <span className="text-xs text-vermillion font-bold">Instant Review</span>
            </div>

            {submitSuccessMsg ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                {submitSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleAddReviewSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajkumar Patil"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-vermillion"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">Village / Landmark in Basavakalyan</label>
                  <input
                    type="text"
                    placeholder="e.g. Bus Stand Road, Main Market"
                    value={newReview.location}
                    onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-vermillion"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">Loan Category</label>
                  <select
                    value={newReview.loanType}
                    onChange={(e) => setNewReview({ ...newReview, loanType: e.target.value as LoanType })}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-vermillion"
                  >
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Gold Loan">Gold Loan</option>
                    <option value="Business Loan">Business Loan</option>
                    <option value="Agriculture Loan">Agriculture Loan</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Vehicle Loan">Vehicle Loan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">Rating (Stars)</label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= newReview.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">Sanctioned Amount (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 2.5 Lakhs"
                    value={newReview.amountSanctioned}
                    onChange={(e) => setNewReview({ ...newReview, amountSanctioned: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-vermillion"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-3">
                  <label className="block text-slate-800 font-bold mb-1">Your Review / Experience *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="How was the service? Mention approval speed or customer support..."
                    value={newReview.quote}
                    onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-vermillion"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-3 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddReview(false)}
                    className="px-4 py-2.5 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-vermillion hover:bg-vermillion-dark text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === cat
                  ? 'bg-vermillion text-white shadow-xs'
                  : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-slate-200 hover:border-vermillion rounded-3xl p-6 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group relative"
            >
              <Quote className="w-8 h-8 text-slate-200 group-hover:text-vermillion/20 transition-colors absolute top-6 right-6 pointer-events-none" />

              <div className="space-y-4">
                {/* Header: User Avatar + Name + Verification */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-vermillion text-white rounded-2xl font-black text-lg flex items-center justify-center shadow-xs flex-shrink-0">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-vermillion transition-colors">
                        {item.name}
                      </h3>
                      {item.verified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" title="Verified Local Customer" />
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5">
                      <MapPin className="w-3 h-3 text-vermillion flex-shrink-0" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Stars & Loan Tag */}
                <div className="flex items-center justify-between gap-2 border-y border-slate-100 py-2.5">
                  <div className="flex items-center text-amber-500">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>

                  <span className="text-[10px] font-bold text-vermillion bg-vermillion-light border border-vermillion-light px-2.5 py-0.5 rounded-full">
                    {item.loanType}
                  </span>
                </div>

                {/* Quote Body */}
                <p className="text-xs text-slate-700 leading-relaxed font-normal italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Footer info: Sanctioned amount & date */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                {item.amountSanctioned ? (
                  <span className="text-slate-800 font-bold">
                    Sanctioned: <strong className="text-vermillion">{item.amountSanctioned}</strong>
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold">Verified Customer</span>
                )}
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black text-white">
              Ready for Fast Loan Sanctioning in Basavakalyan?
            </h3>
            <p className="text-xs text-slate-300 font-normal">
              Get fast document processing and 15-minute quick loan assistance today.
            </p>
          </div>

          <button
            onClick={() => onOpenApplyModal && onOpenApplyModal('Personal Loan')}
            className="px-6 py-3.5 bg-vermillion hover:bg-vermillion-dark text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span>Apply Now in 2 Minutes</span>
          </button>
        </div>

      </div>
    </section>
  );
};
