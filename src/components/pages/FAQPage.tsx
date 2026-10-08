import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ArrowLeft, ShieldCheck } from 'lucide-react';

export const FAQPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the single unified user account work on WorkSphere?',
      a: 'On WorkSphere, there are no separate Buyer and Seller accounts. Every user has a single account, single profile, and single wallet/ledger. You can post projects as a client, purchase services, and simultaneously publish multi-tier offers or submit proposals as a freelancer.',
    },
    {
      q: 'How does the 14-day escrow protection period work?',
      a: 'When a client funds a contract, the funds are held securely in Escrow. Once the freelancer submits deliverables and the client clicks "Accept Deliverable", a 14-day clearance timer begins. If no disputes are raised within 14 days, the net earnings automatically release to the freelancer’s available wallet balance.',
    },
    {
      q: 'Can a client release funds before the 14-day timer expires?',
      a: 'Yes. If a client is completely satisfied with the deliverable, they have the option to click "Release Funds Immediately" to bypass the remaining clearance days and payout the freelancer instantly.',
    },
    {
      q: 'What happens if a dispute is raised during the contract or protection period?',
      a: 'Raising a dispute immediately freezes all automated escrow releases on the contract. An assigned Platform Arbiter reviews the statement of work, deliverables, and submitted evidence from both parties, and can rule with a full release to freelancer, full refund to client, or arbitrated split settlement.',
    },
    {
      q: 'What payment and payout methods are supported?',
      a: 'WorkSphere supports international credit/debit cards, bank wire transfers (ACH, SEPA, IMPS), Indian UPI payouts, and PayPal.',
    },
    {
      q: 'What are the platform fee rates?',
      a: 'Freelancers pay a transparent 10% platform commission on gross earnings when escrow is released. Clients pay a 3% payment gateway processing fee at checkout.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigate('/')}
        className="text-slate-500 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 text-sm">
          Everything you need to know about WorkSphere contracts, 14-day escrow, and unified accounts.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs divide-y divide-slate-100">
        {faqs.map((faq, idx) => (
          <div key={idx} className="py-4">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-base focus:outline-hidden"
            >
              <span>{faq.q}</span>
              {openIdx === idx ? (
                <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
              )}
            </button>
            {openIdx === idx && (
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
