import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UploadCloud,
  RotateCcw,
  DollarSign,
  ArrowLeft,
  Lock,
  MessageSquare,
  ChevronRight,
  ShieldAlert,
  Download,
} from 'lucide-react';
import { Contract, Milestone, Deliverable } from '../../types';
import { SubmitDeliverableModal } from '../modals/SubmitDeliverableModal';
import { RaiseDisputeModal } from '../modals/RaiseDisputeModal';

interface ContractWorkspaceProps {
  contractId: string;
  navigate: (path: string) => void;
}

export const ContractWorkspace: React.FC<ContractWorkspaceProps> = ({ contractId, navigate }) => {
  const { currentUser, refreshWallet, fetchWithAuth } = useAuth();
  const { success, error } = useToast();

  const [contract, setContract] = useState<Contract | null>(null);
  const [selectedMilestoneForSubmit, setSelectedMilestoneForSubmit] = useState<Milestone | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState<{ [milestoneId: string]: string }>({});
  const [showRevisionInput, setShowRevisionInput] = useState<{ [milestoneId: string]: boolean }>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  const fetchContract = async () => {
    try {
      const res = await fetchWithAuth(`/api/contracts/${contractId}`);
      const data = await res.json();
      if (data.contract) {
        setContract(data.contract);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [contractId]);

  // Real-time 14-day escrow protection countdown calculation
  useEffect(() => {
    if (!contract?.protectionEndsAt) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(contract.protectionEndsAt!).getTime();
      const distance = end - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contract?.protectionEndsAt]);

  if (!contract) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading Contract WorkStream...
      </div>
    );
  }

  const isClient = contract.clientId === currentUser.id;
  const isFreelancer = contract.freelancerId === currentUser.id;

  // Fund Contract into Escrow
  const handleFundContract = async () => {
    setIsProcessing(true);
    try {
      const res = await fetchWithAuth(`/api/contracts/${contract.id}/fund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: currentUser.id }),
      });
      const data = await res.json();
      if (data.contract) {
        await refreshWallet();
        success('Escrow Funded!', `Funds ($${contract.totalAmount}) have been securely deposited into Escrow.`);
        setContract(data.contract);
      } else {
        error('Funding Error', data.error || 'Failed to fund contract');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Client Accept Milestone Deliverable -> Triggers 14-Day Escrow Protection
  const handleAcceptMilestone = async (milestoneId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetchWithAuth(`/api/contracts/${contract.id}/milestones/${milestoneId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: currentUser.id }),
      });
      const data = await res.json();
      if (data.milestone) {
        await refreshWallet();
        success(
          'Deliverable Accepted!',
          'Milestone accepted. 14-day escrow protection clearance has started.'
        );
        fetchContract();
      } else {
        error('Error', data.error || 'Failed to accept deliverable');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Request Revision
  const handleRequestRevision = async (milestoneId: string) => {
    const feedback = revisionFeedback[milestoneId];
    if (!feedback || !feedback.trim()) {
      error('Feedback required', 'Please describe what changes are needed.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetchWithAuth(`/api/contracts/${contract.id}/milestones/${milestoneId}/revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: currentUser.id, feedback }),
      });
      const data = await res.json();
      if (data.milestone) {
        success('Revision Requested', 'The freelancer has been notified with your feedback.');
        setShowRevisionInput({ ...showRevisionInput, [milestoneId]: false });
        fetchContract();
      } else {
        error('Error', data.error || 'Failed to request revision');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Release Escrow Funds Early or Post-Clearance
  const handleReleaseEscrow = async (milestoneId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetchWithAuth(`/api/contracts/${contract.id}/milestones/${milestoneId}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggeredBy: currentUser.name }),
      });
      const data = await res.json();
      if (data.milestone) {
        await refreshWallet();
        success('Escrow Released!', 'Funds have been credited directly to the freelancer available balance.');
        fetchContract();
      } else {
        error('Release Error', data.error || 'Failed to release escrow');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={() => navigate('/contracts')}
            className="text-slate-500 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 mb-2 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Contracts
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {contract.title}
            </h1>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
              #{contract.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/messages')}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-slate-500" />
            Direct Messages
          </button>

          {contract.status !== 'DISPUTED' && contract.status !== 'COMPLETED' && (
            <button
              onClick={() => setShowDisputeModal(true)}
              className="px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Raise Dispute
            </button>
          )}
        </div>
      </div>

      {/* Contract Terms Summary & Parties */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center gap-4">
          <img
            src={contract.client.avatar}
            alt={contract.client.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
          />
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Client</span>
            <strong className="text-slate-900 text-sm font-bold block">{contract.client.name}</strong>
            <span className="text-xs text-slate-500">{contract.client.country}</span>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center gap-4">
          <img
            src={contract.freelancer.avatar}
            alt={contract.freelancer.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
          />
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Freelancer</span>
            <strong className="text-slate-900 text-sm font-bold block">{contract.freelancer.name}</strong>
            <span className="text-xs text-slate-500">{contract.freelancer.country}</span>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
            Total Contract Escrow
          </span>
          <div className="text-3xl font-black text-emerald-700">${contract.totalAmount.toFixed(2)}</div>
          <span className="text-xs text-slate-500 mt-1">
            Platform Fee: ${(contract.platformFeeAmount).toFixed(2)} (10%)
          </span>
        </div>
      </div>

      {/* PAYMENT PENDING BANNER */}
      {contract.status === 'PAYMENT_PENDING' && (
        <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-950 text-base">Escrow Funding Required</h3>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                Work cannot begin until the client locks the contract funds (${contract.totalAmount}) into Escrow.
              </p>
            </div>
          </div>
          {isClient ? (
            <button
              onClick={handleFundContract}
              disabled={isProcessing}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition shrink-0"
            >
              {isProcessing ? 'Depositing Funds...' : `Fund Escrow Now ($${contract.totalAmount})`}
            </button>
          ) : (
            <span className="text-xs font-semibold text-amber-800 bg-amber-200/80 px-3 py-1.5 rounded-lg">
              Waiting for Client to Fund Escrow
            </span>
          )}
        </div>
      )}

      {/* 14-DAY ESCROW PROTECTION COUNTDOWN WIDGET (Light Theme) */}
      {contract.status === 'PROTECTION_PERIOD' && timeLeft && (
        <div className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 border-2 border-emerald-500/80 text-slate-900 p-8 rounded-3xl shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase block">
                  14-DAY CLEARANCE GUARANTEE
                </span>
                <h2 className="text-2xl font-black text-slate-900">Escrow Protection Period Active</h2>
              </div>
            </div>
            <div className="text-xs text-emerald-900 font-semibold bg-emerald-100/90 px-3.5 py-1.5 rounded-xl border border-emerald-300">
              Clearance Deadline: {new Date(contract.protectionEndsAt!).toLocaleDateString()}
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            The client accepted the milestone deliverable. Funds are safely in the 14-day clearance hold. If no disputes are raised within this window, the net earnings will automatically credit to the freelancer's available wallet balance.
          </p>

          {/* Countdown Clock Display */}
          <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">{timeLeft.days}</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mt-1">Days</span>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">{timeLeft.hours}</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mt-1">Hours</span>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">{timeLeft.minutes}</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mt-1">Mins</span>
            </div>
            <div className="bg-white border-2 border-emerald-500 p-4 rounded-2xl text-center shadow-xs">
              <span className="text-3xl sm:text-4xl font-black text-emerald-700 font-mono">{timeLeft.seconds}</span>
              <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-bold block mt-1">Secs</span>
            </div>
          </div>

          {/* Client Early Release Button */}
          {isClient && (
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-600">
                100% satisfied with all deliverables? You can clear funds early without waiting.
              </span>
              <button
                onClick={() => handleReleaseEscrow(contract.milestones[0].id)}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Release Funds Immediately
              </button>
            </div>
          )}
        </div>
      )}

      {/* DISPUTE STATUS BANNER */}
      {contract.status === 'DISPUTED' && (
        <div className="p-6 bg-rose-950 text-white rounded-2xl border-2 border-rose-600 shadow-md flex items-start gap-4">
          <ShieldAlert className="w-8 h-8 text-rose-400 shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-rose-200">Contract Under Platform Dispute Arbitration</h3>
            <p className="text-xs text-rose-100 leading-relaxed">
              All automated escrow releases have been frozen. A platform arbitrator is examining the submitted deliverables and evidence to issue a binding financial ruling.
            </p>
            <button
              onClick={() => navigate(`/disputes/${contract.disputeId}`)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition"
            >
              View Dispute Evidence Room →
            </button>
          </div>
        </div>
      )}

      {/* Milestones WorkStream Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Milestone Deliverables & Approval</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review submissions, version history, and manage escrow release triggers
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {contract.milestones.length} Milestones
          </span>
        </div>

        <div className="space-y-6">
          {contract.milestones.map((m, idx) => (
            <div
              key={m.id}
              className="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{m.title}</h3>
                    <p className="text-xs text-slate-500">{m.description}</p>
                  </div>
                </div>

                <div className="sm:text-right flex items-center sm:flex-col gap-2 sm:gap-1">
                  <span className="text-xl font-extrabold text-slate-900">${m.amount}</span>
                  <div>
                    {m.status === 'RELEASED' ? (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Escrow Released
                      </span>
                    ) : m.status === 'PROTECTION_PERIOD' ? (
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 14-Day Clearance Active
                      </span>
                    ) : m.status === 'SUBMITTED' ? (
                      <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                        Deliverable Submitted
                      </span>
                    ) : m.status === 'REVISION_REQUESTED' ? (
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        Revision Requested
                      </span>
                    ) : m.status === 'FUNDED' ? (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Escrow Funded (Work in Progress)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full">
                        {m.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Deliverables History List */}
              {m.deliverables && m.deliverables.length > 0 && (
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                    Latest Deliverable Submission (v{m.deliverables[0].version})
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {m.deliverables[0].notes}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {m.deliverables[0].files.map((file, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{file.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({file.size})</span>
                        <Download className="w-3.5 h-3.5 text-slate-400 hover:text-slate-800 cursor-pointer ml-1" />
                      </div>
                    ))}
                  </div>

                  {m.deliverables[0].clientFeedback && (
                    <div className="text-xs p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 mt-2">
                      <strong>Client Feedback:</strong> {m.deliverables[0].clientFeedback}
                    </div>
                  )}
                </div>
              )}

              {/* Revision Input Box */}
              {showRevisionInput[m.id] && (
                <div className="p-4 bg-white border border-amber-300 rounded-xl space-y-3">
                  <label className="text-xs font-bold text-slate-900 block">
                    Specific Revision Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={revisionFeedback[m.id] || ''}
                    onChange={(e) =>
                      setRevisionFeedback({ ...revisionFeedback, [m.id]: e.target.value })
                    }
                    placeholder="Clearly list the required adjustments, edge cases, or corrections..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowRevisionInput({ ...showRevisionInput, [m.id]: false })}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRequestRevision(m.id)}
                      disabled={isProcessing}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                    >
                      Send Revision Request
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons for Freelancer & Client */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Due: <strong>{m.dueDate}</strong>
                </div>

                <div className="flex items-center gap-2">
                  {/* Freelancer Submit Action */}
                  {isFreelancer && (m.status === 'FUNDED' || m.status === 'IN_PROGRESS' || m.status === 'REVISION_REQUESTED') && (
                    <button
                      onClick={() => setSelectedMilestoneForSubmit(m)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-4 h-4" />
                      Submit Deliverables
                    </button>
                  )}

                  {/* Client Review & Accept Actions */}
                  {isClient && m.status === 'SUBMITTED' && (
                    <>
                      <button
                        onClick={() => setShowRevisionInput({ ...showRevisionInput, [m.id]: true })}
                        className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                        Request Revision
                      </button>
                      <button
                        onClick={() => handleAcceptMilestone(m.id)}
                        disabled={isProcessing}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accept Deliverable (Start 14-Day Clearance)
                      </button>
                    </>
                  )}

                  {/* Early Escrow Release */}
                  {isClient && m.status === 'PROTECTION_PERIOD' && (
                    <button
                      onClick={() => handleReleaseEscrow(m.id)}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Clear & Release Escrow Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverable Submission Modal */}
      {selectedMilestoneForSubmit && (
        <SubmitDeliverableModal
          isOpen={!!selectedMilestoneForSubmit}
          contractId={contract.id}
          milestone={selectedMilestoneForSubmit}
          onClose={() => setSelectedMilestoneForSubmit(null)}
          onSubmitted={() => {
            fetchContract();
          }}
        />
      )}

      {/* Raise Dispute Modal */}
      {showDisputeModal && (
        <RaiseDisputeModal
          isOpen={showDisputeModal}
          contract={contract}
          onClose={() => setShowDisputeModal(false)}
          onDisputeRaised={() => {
            fetchContract();
          }}
        />
      )}
    </div>
  );
};
