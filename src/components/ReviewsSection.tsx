import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus, CheckCircle2, ShieldCheck, MapPin, Sparkles, X, Send } from 'lucide-react';
import { CustomerReview, LoanType } from '../types';
import { apiService } from '../services/api';

interface ReviewsSectionProps {
  onOpenApplyModal?: (loanType?: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onOpenApplyModal }) => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Review Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loanType, setLoanType] = useState<LoanType>('Home Loan');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadReviews = async () => {
    try {
      const data = await apiService.fetchReviews();
      setReviews(data);
    } catch (e) {
      console.warn('Failed to load reviews:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await apiService.submitReview({
        name,
        location: location || 'Basavakalyan',
        loanType,
        rating,
        comment,
        amount
      });
      if (res.success) {
        setSuccessMsg('Thank you! Your verified review has been posted.');
        setName('');
        setLocation('');
        setComment('');
        setAmount('');
        loadReviews();
        setTimeout(() => {
          setShowReviewModal(false);
          setSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      console.error('Submit review error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = selectedFilter === 'All'
    ? reviews
    : reviews.filter(r => r.loanType === selectedFilter);

  return (
    <section id="testimonials" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vermillion-light text-vermillion font-bold text-xs mb-2">
              <Star className="w-3.5 h-3.5 fill-vermillion" />
              <span>Verified Customer Feedback • Basavakalyan</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Real Stories from Local Borrowers
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Read verified testimonials from Basavakalyan residents who secured loans with Agent Sagar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'Home Loan', 'Personal Loan', 'Business Loan', 'Gold Loan', 'Agriculture Loan'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-vermillion text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Rating Stars & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 fill-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold bg-vermillion-light text-vermillion px-2.5 py-0.5 rounded-full">
                    {rev.loanType}
                  </span>
                </div>

                {/* Comment Text */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Verification Info */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <span>{rev.name}</span>
                    {rev.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{rev.location}</span>
                  </p>
                </div>

                {rev.amount && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-medium">Sanctioned</span>
                    <p className="font-extrabold text-xs text-emerald-700">{rev.amount}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Submitting a Review */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
              
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-5">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-vermillion-light text-vermillion text-xs font-bold mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>Basavakalyan Verified Feedback</span>
                </div>
                <h3 className="text-xl font-black text-slate-900">Share Your Experience</h3>
                <p className="text-xs text-slate-600 mt-0.5">Help fellow borrowers in Basavakalyan by reviewing your loan service experience.</p>
              </div>

              {successMsg ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-900">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">{successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Biradar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-vermillion focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Location / Area</label>
                      <input
                        type="text"
                        placeholder="e.g. Shivaji Nagar, Basavakalyan"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-vermillion focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Loan Category</label>
                      <select
                        value={loanType}
                        onChange={(e) => setLoanType(e.target.value as LoanType)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-vermillion focus:outline-none"
                      >
                        {['Personal Loan', 'Home Loan', 'Gold Loan', 'Business Loan', 'Agriculture Loan', 'Vehicle Loan', 'Mortgage Loan'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300 fill-slate-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="font-bold text-slate-700 ml-2">{rating} out of 5 Stars</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sanctioned Amount (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹15,00,000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-vermillion focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Review / Feedback *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe how Agent Sagar helped with documentation, rate negotiation, or fast approval..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-vermillion focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-vermillion hover:bg-vermillion-dark text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit Verified Review</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
