import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { X, Send, DollarSign, Calendar, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { Project, ProposalMilestone } from '../../types';

interface SubmitProposalModalProps {
  isOpen: boolean;
  project: Project;
  onClose: () => void;
  onProposalSubmitted: (proposal: any) => void;
}

export const SubmitProposalModal: React.FC<SubmitProposalModalProps> = ({
  isOpen,
  project,
  onClose,
  onProposalSubmitted,
}) => {
  const { currentUser, fetchWithAuth } = useAuth();
  const { success, error } = useToast();

  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState(project.budget);
  const [deliveryDays, setDeliveryDays] = useState(14);
  const [milestones, setMilestones] = useState<ProposalMilestone[]>([
    { title: 'Milestone 1: Architecture & Initial Prototype', amount: Math.floor(project.budget * 0.5), dueDate: '2026-10-20' },
    { title: 'Milestone 2: Final Verification & Deployment', amount: Math.ceil(project.budget * 0.5), dueDate: '2026-11-05' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const platformFee = bidAmount * 0.1;
  const netEarnings = bidAmount - platformFee;

  const handleMilestoneChange = (index: number, field: keyof ProposalMilestone, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
    if (field === 'amount') {
      const sum = updated.reduce((acc, m) => acc + Number(m.amount || 0), 0);
      setBidAmount(sum);
    }
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { title: `Milestone ${milestones.length + 1}: Deliverable`, amount: 500, dueDate: '2026-11-15' },
    ]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    const updated = milestones.filter((_, i) => i !== index);
    setMilestones(updated);
    const sum = updated.reduce((acc, m) => acc + Number(m.amount || 0), 0);
    setBidAmount(sum);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      error('Cover letter required', 'Please explain your technical approach and relevant experience.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetchWithAuth('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          freelancerId: currentUser.id,
          coverLetter,
          bidAmount: Number(bidAmount),
          deliveryDays: Number(deliveryDays),
          milestones,
        }),
      });

      const data = await res.json();
      if (data.proposal) {
        success('Proposal Sent!', `Your bid of $${bidAmount} was submitted to ${project.client.name}.`);
        onProposalSubmitted(data.proposal);
        onClose();
      } else {
        error('Submission failed', data.error || 'Server error');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Submit Proposal</h2>
              <p className="text-xs text-slate-300">
                To project: <span className="text-emerald-400 font-semibold">{project.title}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-sm">
          {/* Bid & Earnings Calculator */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Total Bid Price ($)</span>
              <input
                type="number"
                min="50"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 text-sm"
              />
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Platform Fee (10%)</span>
              <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-mono text-slate-600 text-sm">
                -${platformFee.toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Your Net Payout ($)</span>
              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded-lg font-bold text-emerald-800 text-sm">
                ${netEarnings.toFixed(2)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Estimated Delivery Time (Days)
            </label>
            <input
              type="number"
              min="1"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Cover Letter & Technical Approach
            </label>
            <textarea
              required
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Detail your exact execution roadmap, tech stack, and deliverable commitments..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Milestones Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Suggested Milestones Breakdown
              </label>
              <button
                type="button"
                onClick={addMilestone}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Milestone
              </button>
            </div>

            <div className="space-y-2.5">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <input
                    type="text"
                    value={m.title}
                    onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                    placeholder="Milestone description"
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded"
                  />
                  <div className="w-24">
                    <input
                      type="number"
                      value={m.amount}
                      onChange={(e) => handleMilestoneChange(idx, 'amount', Number(e.target.value))}
                      placeholder="Amount ($)"
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-semibold text-right"
                    />
                  </div>
                  <input
                    type="date"
                    value={m.dueDate}
                    onChange={(e) => handleMilestoneChange(idx, 'dueDate', e.target.value)}
                    className="w-32 px-2 py-1.5 bg-white border border-slate-300 rounded"
                  />
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Guaranteed 14-Day Escrow Payout:</strong> Once the client accepts milestone deliverables, funds enter the 14-day clearance guarantee with automatic ledger transfer.
            </span>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
