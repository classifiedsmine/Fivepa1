import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { HelpCircle, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const SupportPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { currentUser } = useAuth();
  const { success, error } = useToast();

  const [category, setCategory] = useState<'PAYMENTS' | 'CONTRACT' | 'DISPUTE' | 'ACCOUNT' | 'OTHER'>('PAYMENTS');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      error('Missing fields', 'Please enter a subject and message.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate ticket creation
      success('Ticket Submitted', 'Our platform support staff will review and reply shortly.');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigate('/')}
        className="text-slate-500 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">WorkSphere Support & Help Desk</h1>
            <p className="text-xs text-slate-500">
              Submit an official ticket for escrow, payout, or account questions
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Inquiry Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            >
              <option value="PAYMENTS">Escrow & Wallet Payments</option>
              <option value="CONTRACT">Contract WorkStream Inquiries</option>
              <option value="DISPUTE">Arbitration & Dispute Guidance</option>
              <option value="ACCOUNT">Identity Verification & Account Security</option>
              <option value="OTHER">General Platform Assistance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Question regarding 14-day escrow clearance release"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Message Details</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide full details including Contract ID or transaction reference if applicable..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-xs flex items-center justify-center gap-2 text-xs"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};
