import React from 'react';
import { ShieldCheck, Lock, Clock, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

export const EscrowPolicyPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigate('/')}
        className="text-slate-500 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" /> OFFICIAL PLATFORM GUARANTEE
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          14-Day Escrow Protection & Financial Clearance Policy
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
          WorkSphere guarantees financial safety for all marketplace participants. Learn how milestone funds are locked, verified, held in the 14-day protection window, and credited securely.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs space-y-8 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. Escrow Funding Prior to Work Initiation</h2>
          <p>
            When a client hires a freelancer via proposal acceptance or orders a predefined service package, the agreed contract milestone amount (plus standard 3% client processing fee) is immediately charged and held in the WorkSphere Authoritative Escrow vault.
          </p>
          <p>
            Freelancers can start working with 100% confidence that funds exist in platform escrow and cannot be unilaterally withdrawn by the client during contract execution.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">2. Deliverable Review & Acceptance</h2>
          <p>
            Upon completing a milestone, the freelancer submits the deliverables including source links, documentation, and archive files. The client reviews the submitted deliverables and may:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Accept Deliverable:</strong> Signals satisfaction and immediately initiates the 14-Day Protection Period.</li>
            <li><strong>Request Revisions:</strong> Specifies feedback for adjustments without releasing funds.</li>
            <li><strong>Initiate Formal Dispute:</strong> If deliverables violate the statement of work and direct communication fails.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">3. The Mandatory 14-Day Protection Window</h2>
          <p>
            Following client acceptance, funds enter a mandatory 14-day clearance hold. During this time:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
              <strong className="block font-bold mb-1">For Freelancers:</strong>
              Earnings are guaranteed and visible in your wallet under <em>14-Day Protection Balance</em>. Upon timer expiration, net earnings automatically transfer to your available balance for instant payout.
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900">
              <strong className="block font-bold mb-1">For Clients:</strong>
              Provides full safety if latent defects, intellectual property infringements, or missing assets are discovered within 14 days of acceptance.
            </div>
          </div>
        </section>

        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">4. Transparent Platform Fee Structure</h2>
          <p>
            WorkSphere maintains zero hidden fees:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Freelancer Platform Commission:</strong> 10% deducted automatically upon milestone escrow release.</li>
            <li><strong>Client Processing Fee:</strong> 3% applied at escrow checkout for payment gateway & credit card processing.</li>
            <li><strong>Withdrawal Fees:</strong> $0 standard ACH/IBAN/UPI withdrawal fee.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
