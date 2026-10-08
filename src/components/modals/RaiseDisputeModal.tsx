import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { X, AlertTriangle, ShieldAlert, FileText } from 'lucide-react';
import { Contract } from '../../types';

interface RaiseDisputeModalProps {
  isOpen: boolean;
  contract: Contract;
  onClose: () => void;
  onDisputeRaised: (dispute: any) => void;
}

export const RaiseDisputeModal: React.FC<RaiseDisputeModalProps> = ({
  isOpen,
  contract,
  onClose,
  onDisputeRaised,
}) => {
  const { currentUser, fetchWithAuth } = useAuth();
  const { success, error } = useToast();

  const [reason, setReason] = useState('Non-conforming Deliverables');
  const [description, setDescription] = useState('');
  const [evidenceMessage, setEvidenceMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      error('Description required', 'Please explain the specific issue or breach of agreed deliverables.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetchWithAuth('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract.id,
          claimantId: currentUser.id,
          reason,
          description,
          evidenceMessage,
        }),
      });

      const data = await res.json();
      if (data.dispute) {
        success('Dispute Raised', `Dispute #${data.dispute.id} has been opened and assigned to Platform Arbitration.`);
        onDisputeRaised(data.dispute);
        onClose();
      } else {
        error('Failed to raise dispute', data.error || 'Server error');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-8">
        <div className="p-6 bg-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Initiate Official Dispute</h2>
              <p className="text-xs text-rose-200">
                Contract: <span className="font-semibold text-white">{contract.title}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-rose-300 hover:text-white transition p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <strong>Escrow Freezing Notice:</strong> Raising an official dispute immediately freezes automated 14-day escrow releases on this contract until a platform arbitrator investigates and rules on the evidence.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Dispute Category / Ground
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-rose-500 focus:outline-hidden"
            >
              <option value="Non-conforming Deliverables">Non-conforming Deliverables / Scope Mismatch</option>
              <option value="Unresponsive Counterparty">Unresponsive Counterparty / Missed Deadlines</option>
              <option value="Incomplete Work">Incomplete Work / Missing Source Code</option>
              <option value="Unfair Rejection of Work">Unfair Rejection of Conforming Deliverables</option>
              <option value="Other Breach of Terms">Other Breach of Terms</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Statement of Fact & Scope Breach
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State exactly what was agreed in the contract statement of work, what was delivered or missing, and your proposed resolution..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-rose-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Initial Supporting Evidence / Communication Notes
            </label>
            <textarea
              rows={3}
              value={evidenceMessage}
              onChange={(e) => setEvidenceMessage(e.target.value)}
              placeholder="Provide references to timestamps, chat messages, pull requests, or specification links..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-rose-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
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
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Opening Dispute...' : 'Submit Official Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
