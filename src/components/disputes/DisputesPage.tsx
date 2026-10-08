import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ShieldAlert,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Clock,
  ArrowLeft,
  FileText,
  Send,
  Lock,
} from 'lucide-react';
import { Dispute, DisputeEvidence } from '../../types';

interface DisputesPageProps {
  navigate: (path: string) => void;
  disputeId?: string;
}

export const DisputesPage: React.FC<DisputesPageProps> = ({ navigate, disputeId }) => {
  const { currentUser } = useAuth();
  const { success, error } = useToast();

  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [evidenceMessage, setEvidenceMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDisputes = async () => {
    try {
      const res = await fetch(`/api/disputes?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.disputes) {
        setDisputes(data.disputes);
        if (disputeId) {
          const matching = data.disputes.find((d: Dispute) => d.id === disputeId);
          if (matching) setSelectedDispute(matching);
        } else if (data.disputes.length > 0 && !selectedDispute) {
          setSelectedDispute(data.disputes[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [currentUser, disputeId]);

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceMessage.trim() || !selectedDispute) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/disputes/${selectedDispute.id}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          message: evidenceMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.dispute) {
        setSelectedDispute(data.dispute);
        setEvidenceMessage('');
        success('Evidence Submitted', 'Your testimony has been logged for arbitrator evaluation.');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Scale className="w-8 h-8 text-rose-600" />
          Dispute Arbitration & Resolution Center
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Independent platform mediation with authoritative ledger settlement
        </p>
      </div>

      {disputes.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
          <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No active disputes</h3>
          <p className="text-xs text-slate-500 mt-1">
            All your contracts and milestones are proceeding smoothly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dispute List */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Your Open Disputes ({disputes.length})
            </h2>

            {disputes.map((d) => {
              const isSelected = selectedDispute?.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDispute(d)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs text-slate-500 font-bold">#{d.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        d.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-1">{d.contractTitle}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1 mb-3">{d.reason}</p>

                  <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Disputed: <strong className="text-slate-900">${d.amountDisputed}</strong></span>
                    <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Evidence Room & Resolution */}
          {selectedDispute && (
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono text-slate-400">Dispute #{selectedDispute.id}</span>
                    <h2 className="text-xl font-bold text-slate-900">{selectedDispute.contractTitle}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-rose-600">${selectedDispute.amountDisputed}</div>
                    <span className="text-xs text-slate-500">Escrow Frozen</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Claimant:</span>
                    <strong className="text-slate-900">{selectedDispute.claimantName} ({selectedDispute.claimantRole})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Respondent:</span>
                    <strong className="text-slate-900">{selectedDispute.respondentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Dispute Grounds:</span>
                    <strong className="text-slate-900">{selectedDispute.reason}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Assigned Arbiter:</span>
                    <strong className="text-slate-900">{selectedDispute.assignedAdminName || 'Alex Vance (Super Admin)'}</strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <strong className="block text-slate-900 font-semibold mb-1">Claim Statement:</strong>
                  {selectedDispute.description}
                </div>

                {selectedDispute.status === 'RESOLVED' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 space-y-1">
                    <strong className="block text-emerald-900 font-bold text-sm">
                      Arbitrator Official Ruling: {selectedDispute.resolution}
                    </strong>
                    <p>{selectedDispute.resolutionNotes}</p>
                    <div className="pt-2 text-[11px] text-emerald-800">
                      Settlement executed on double-entry ledger at {new Date(selectedDispute.resolvedAt!).toLocaleString()}.
                    </div>
                  </div>
                )}
              </div>

              {/* Evidence Log */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
                <h3 className="text-lg font-bold text-slate-900">Submitted Evidence Log</h3>

                <div className="space-y-3">
                  {selectedDispute.evidences.map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-4 rounded-xl text-xs space-y-1.5 border ${
                        ev.role === 'ADMIN'
                          ? 'bg-purple-50 border-purple-200 text-purple-950'
                          : ev.submittedBy === currentUser.id
                          ? 'bg-slate-50 border-slate-200 text-slate-900'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex justify-between font-semibold">
                        <span>{ev.submittedByName} ({ev.role})</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(ev.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="leading-relaxed">{ev.message}</p>
                    </div>
                  ))}
                </div>

                {/* Submit New Evidence Form */}
                {selectedDispute.status !== 'RESOLVED' && (
                  <form onSubmit={handleAddEvidence} className="pt-4 border-t border-slate-100 space-y-3">
                    <label className="block text-xs font-bold text-slate-900">
                      Add Statement / Additional Evidence
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={evidenceMessage}
                      onChange={(e) => setEvidenceMessage(e.target.value)}
                      placeholder="Add supplementary technical documentation, specifications, or communication logs..."
                      className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition"
                    >
                      {isSubmitting ? 'Submitting...' : 'Post Evidence to Room'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
