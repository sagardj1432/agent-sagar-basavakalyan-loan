import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertCircle, Phone, MessageCircle, Building2, User, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/api';

interface TrackApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyNew: () => void;
}

export const TrackApplicationModal: React.FC<TrackApplicationModalProps> = ({
  isOpen,
  onClose,
  onApplyNew
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setErrorMsg('Please enter your 10-digit mobile number or Application Lead ID.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    try {
      const data = await apiService.trackApplication(query.trim());
      if (data.found && data.applications && data.applications.length > 0) {
        setResult(data.applications);
      } else {
        setErrorMsg(data.message || 'No application record found. Please verify the mobile number.');
        setResult(null);
      }
    } catch (err: any) {
      setErrorMsg('Failed to fetch status. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Enquiry Received', desc: 'Assigned to Agent Sagar Basavakalyan' },
    { title: 'Document KYC Review', desc: 'Income & Identity proof evaluation' },
    { title: 'Bank Credit Appraisal', desc: 'Filed with partner branch in Basavakalyan' },
    { title: 'Sanction & Disbursement', desc: 'Loan sanctioned and credited' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center sm:text-left mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vermillion-light text-vermillion font-bold text-xs mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Basavakalyan Loan Authority</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Track Loan Application Status
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Enter your registered 10-digit mobile number or Lead ID to check real-time processing status.
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleTrack} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. 9632636718 or Lead ID (lead-...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-vermillion font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-vermillion hover:bg-vermillion-dark text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Track Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        {/* Results Container */}
        {result && result.length > 0 ? (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
            {result.map((app: any, idx: number) => {
              const currentStage = Math.max(app.stage || 1, 1);

              return (
                <div key={app.id || idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  {/* Top Bar of Application */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Application ID:</span>
                      <p className="font-mono font-bold text-xs text-slate-800">{app.id}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full ${
                        app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'Contacted' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-200 text-slate-800'
                      }`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Applicant</span>
                      <p className="font-bold text-slate-900">{app.applicantName}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Loan Type</span>
                      <p className="font-bold text-vermillion">{app.loanType}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Requested Amount</span>
                      <p className="font-bold text-slate-900">{app.amount || 'Flexible'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Contact Number</span>
                      <p className="font-mono font-medium text-slate-700">{app.maskedMobile}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Applied Date</span>
                      <p className="font-medium text-slate-700">{new Date(app.appliedDate).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Assigned Officer</span>
                      <p className="font-bold text-slate-900">Agent Sagar</p>
                    </div>
                  </div>

                  {/* Stepper Progress Bar */}
                  <div className="pt-2">
                    <p className="text-xs font-bold text-slate-700 mb-3">Current Processing Stage:</p>
                    
                    <div className="relative flex items-center justify-between mb-2">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0" />
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-vermillion transition-all duration-500 z-0" 
                        style={{ width: `${((Math.min(currentStage, 4) - 1) / 3) * 100}%` }}
                      />

                      {[1, 2, 3, 4].map((s) => {
                        const isDone = s <= currentStage;
                        const isCurrent = s === currentStage;

                        return (
                          <div key={s} className="relative z-10 flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isDone 
                                ? 'bg-vermillion text-white shadow-sm ring-4 ring-vermillion-light' 
                                : 'bg-slate-200 text-slate-500'
                            }`}>
                              {s < currentStage ? <CheckCircle2 className="w-4 h-4" /> : s}
                            </div>
                            <span className={`text-[10px] font-semibold mt-1 hidden sm:block text-center max-w-[80px] leading-tight ${
                              isCurrent ? 'text-vermillion font-bold' : 'text-slate-500'
                            }`}>
                              {steps[s - 1].title}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">{app.stageTitle}</strong>
                        <p className="text-amber-800 text-[11px] mt-0.5">{app.stageDesc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Direct Contact Officer Options */}
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                    <a
                      href={`https://wa.me/919632636718?text=Hello%20Agent%20Sagar,%20I%20am%20tracking%20my%20loan%20application%20(${app.id})%20for%20${encodeURIComponent(app.loanType)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                      <span>WhatsApp Agent Sagar</span>
                    </a>
                    <a
                      href="tel:+919632636718"
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-vermillion" />
                      <span>Call +91 96326 36718</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-vermillion-light text-vermillion flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Haven't applied yet?</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Get an instant quotation across 8 top banks in Basavakalyan with doorstep document pickup.
            </p>
            <button
              onClick={() => {
                onClose();
                onApplyNew();
              }}
              className="bg-vermillion text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-vermillion-dark transition-colors cursor-pointer shadow-sm"
            >
              Start New Loan Application
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
