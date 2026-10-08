import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Send,
  UserCheck,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { Project, Proposal } from '../../types';
import { SubmitProposalModal } from '../modals/SubmitProposalModal';

interface ProjectDetailViewProps {
  slugOrId: string;
  navigate: (path: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ slugOrId, navigate }) => {
  const { currentUser } = useAuth();
  const { success, error } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [isAccepting, setIsAccepting] = useState<string | null>(null);

  const fetchProjectDetails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/marketplace/projects/${slugOrId}`);
      const data = await res.json();
      if (data.project) {
        setProject(data.project);
        setProposals(data.proposals || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [slugOrId]);

  const handleAcceptProposal = async (proposalId: string) => {
    setIsAccepting(proposalId);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.contract) {
        success('Contract Initialized!', 'Proposal accepted. You can now fund the escrow safely.');
        navigate(`/contracts/${data.contract.id}`);
      } else {
        error('Error', data.error || 'Failed to accept proposal');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsAccepting(null);
    }
  };

  if (isLoading || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading project details...
      </div>
    );
  }

  const isClientOwner = project.clientId === currentUser.id;
  const userHasSubmittedProposal = proposals.some((p) => p.freelancerId === currentUser.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/find-projects')}
        className="text-slate-500 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Projects Directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Job Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="text-emerald-700 font-semibold">{project.category}</span>
              <span>/</span>
              <span>{project.subcategory}</span>
              <span>·</span>
              <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pb-6 border-b border-slate-100">
              <span className="font-semibold text-slate-900">Experience: {project.experienceLevel}</span>
              <span>·</span>
              <span>Duration: {project.duration}</span>
              <span>·</span>
              <span>Proposals: {proposals.length}</span>
            </div>

            {/* Scope Text */}
            <div className="py-6 border-b border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-line space-y-4">
              <h2 className="font-bold text-slate-900 text-base">Project Overview & Deliverables</h2>
              <p>{project.description}</p>
            </div>

            {/* Skills */}
            <div className="pt-6">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Required Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((s, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Proposals List (Visible to Client Owner) */}
          {isClientOwner && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Received Proposals ({proposals.length})
                </h3>
                <span className="text-xs text-slate-500">Select candidate to initiate funded contract</span>
              </div>

              {proposals.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No proposals submitted yet. Freelancers will appear here as they apply.
                </div>
              ) : (
                proposals.map((prop) => (
                  <div key={prop.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.freelancer.avatar}
                          alt={prop.freelancer.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-300"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{prop.freelancer.name}</h4>
                          <span className="text-xs text-emerald-700 font-medium">{prop.freelancer.title}</span>
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <div className="text-lg font-extrabold text-slate-900">${prop.bidAmount}</div>
                        <span className="text-[11px] text-slate-500">{prop.deliveryDays} Days Timeline</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {prop.coverLetter}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-slate-500">
                        {prop.milestones.length} Proposed Milestones
                      </div>
                      <button
                        disabled={isAccepting === prop.id || prop.status === 'ACCEPTED'}
                        onClick={() => handleAcceptProposal(prop.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition disabled:opacity-50"
                      >
                        {prop.status === 'ACCEPTED'
                          ? 'Accepted'
                          : isAccepting === prop.id
                          ? 'Creating Contract...'
                          : 'Accept Proposal & Hire'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar: Budget, Client Info, Apply Action */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <span className="text-xs text-slate-500 block font-medium">Total Project Budget</span>
              <div className="text-3xl font-black text-slate-900">${project.budget}</div>
              <span className="text-xs text-slate-500 font-medium">
                {project.pricingModel === 'MILESTONE' ? 'Milestone Escrow' : 'Fixed Price'}
              </span>
            </div>

            {!isClientOwner && (
              <div>
                {userHasSubmittedProposal ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold text-center">
                    ✓ You have submitted a proposal for this project.
                  </div>
                ) : (
                  <button
                    onClick={() => setShowProposalModal(true)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Submit a Proposal
                  </button>
                )}
              </div>
            )}

            {/* 14-Day Escrow badge */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold mb-0.5">14-Day Escrow Protection</strong>
                <span>
                  Contract milestones are fully funded in advance. Payouts are protected with 14-day clearance after deliverable approval.
                </span>
              </div>
            </div>
          </div>

          {/* Client Profile Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">About the Client</h3>
            <div className="flex items-center gap-3">
              <img
                src={project.client.avatar}
                alt={project.client.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{project.client.name}</h4>
                <span className="text-slate-500">{project.client.country}</span>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-slate-600">
              <div className="flex justify-between">
                <span>Rating</span>
                <span className="font-bold text-slate-900">★ {project.client.rating} ({project.client.reviewCount} reviews)</span>
              </div>
              <div className="flex justify-between">
                <span>Total Spent</span>
                <span className="font-bold text-slate-900">${project.client.totalSpent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Verification</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Proposal Modal */}
      {showProposalModal && (
        <SubmitProposalModal
          isOpen={showProposalModal}
          project={project}
          onClose={() => setShowProposalModal(false)}
          onProposalSubmitted={(newProp) => {
            setProposals([newProp, ...proposals]);
          }}
        />
      )}
    </div>
  );
};
