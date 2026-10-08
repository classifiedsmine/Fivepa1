import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  DollarSign,
  Layers,
} from 'lucide-react';
import { Contract, ContractStatus } from '../../types';

interface ContractsListViewProps {
  navigate: (path: string) => void;
}

export const ContractsListView: React.FC<ContractsListViewProps> = ({ navigate }) => {
  const { currentUser } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PROTECTION_PERIOD' | 'COMPLETED' | 'DISPUTED'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchContracts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/contracts?userId=${currentUser.id}`);
      const data = await res.json();
      setContracts(data.contracts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [currentUser]);

  const filtered = contracts.filter((c) => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return ['FUNDED', 'ACTIVE', 'WORK_SUBMITTED', 'PAYMENT_PENDING'].includes(c.status);
    if (filter === 'PROTECTION_PERIOD') return c.status === 'PROTECTION_PERIOD';
    if (filter === 'COMPLETED') return c.status === 'COMPLETED' || c.status === 'RELEASED';
    if (filter === 'DISPUTED') return c.status === 'DISPUTED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contract WorkStream</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your funded milestones, deliverables, and 14-day escrow protection clearances
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        {(['ALL', 'ACTIVE', 'PROTECTION_PERIOD', 'COMPLETED', 'DISPUTED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl border transition ${
              filter === tab
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab === 'PROTECTION_PERIOD' ? '14-Day Protection Active' : tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No contracts found</h3>
            <p className="text-xs text-slate-500 mt-1">You do not have any contracts matching the selected filter.</p>
          </div>
        ) : (
          filtered.map((contract) => {
            const isClient = contract.clientId === currentUser.id;
            const counterparty = isClient ? contract.freelancer : contract.client;

            return (
              <div
                key={contract.id}
                onClick={() => navigate(`/contracts/${contract.id}`)}
                className="p-6 bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl cursor-pointer transition shadow-xs hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-400">#{contract.id}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-semibold text-slate-600">
                        {isClient ? 'Freelancer' : 'Client'}: {counterparty.name}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 hover:text-emerald-700 transition">
                      {contract.title}
                    </h2>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="text-2xl font-black text-slate-900">${contract.totalAmount}</div>
                    <div className="mt-1">
                      {contract.status === 'PROTECTION_PERIOD' ? (
                        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" /> 14-Day Clearance Active
                        </span>
                      ) : contract.status === 'WORK_SUBMITTED' ? (
                        <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                          Deliverable Ready for Review
                        </span>
                      ) : contract.status === 'FUNDED' ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          Escrow Funded
                        </span>
                      ) : contract.status === 'COMPLETED' ? (
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          Completed & Released
                        </span>
                      ) : contract.status === 'DISPUTED' ? (
                        <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                          In Dispute Arbitration
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {contract.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span>Milestones: <strong>{contract.milestones.length}</strong></span>
                    <span>Created: <strong>{new Date(contract.createdAt).toLocaleDateString()}</strong></span>
                  </div>

                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    Open WorkStream Workspace <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
