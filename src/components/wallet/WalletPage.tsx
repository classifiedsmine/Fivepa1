import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Wallet as WalletIcon,
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Lock,
  DollarSign,
  CreditCard,
  Building,
  CheckCircle2,
  X,
} from 'lucide-react';
import { LedgerEntry, WithdrawalRequest } from '../../types';

export const WalletPage: React.FC = () => {
  const { currentUser, wallet, refreshWallet, fetchWithAuth } = useAuth();
  const { success, error } = useToast();

  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Deposit Form
  const [depositAmount, setDepositAmount] = useState(1000);
  const [paymentProvider, setPaymentProvider] = useState('STRIPE_CARD');
  const [isDepositing, setIsDepositing] = useState(false);

  // Withdrawal Form
  const [withdrawAmount, setWithdrawAmount] = useState(500);
  const [payoutMethod, setPayoutMethod] = useState<'BANK_TRANSFER' | 'UPI' | 'PAYPAL'>('BANK_TRANSFER');
  const [accountHolder, setAccountHolder] = useState(currentUser.name);
  const [accountNumber, setAccountNumber] = useState('US98765432101234');
  const [bankName, setBankName] = useState('JPMorgan Chase / Barclays');
  const [upiId, setUpiId] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const fetchWalletData = async () => {
    try {
      const res = await fetchWithAuth(`/api/wallet/${currentUser.id}`);
      const data = await res.json();
      if (data.ledger) setLedgerEntries(data.ledger);
      if (data.withdrawals) setWithdrawals(data.withdrawals);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [currentUser]);

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDepositing(true);
    try {
      const res = await fetchWithAuth('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          amount: Number(depositAmount),
          paymentMethod: paymentProvider,
        }),
      });
      const data = await res.json();
      if (data.wallet) {
        await refreshWallet();
        await fetchWalletData();
        success('Deposit Successful!', `$${depositAmount.toFixed(2)} credited to your wallet via ${paymentProvider}.`);
        setShowDepositModal(false);
      } else {
        error('Deposit Failed', data.error || 'Server error');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWithdrawing(true);
    try {
      const res = await fetchWithAuth('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          amount: Number(withdrawAmount),
          method: payoutMethod,
          destinationDetails: {
            accountHolder,
            accountNumber,
            bankName,
            upiId,
            paypalEmail,
          },
        }),
      });
      const data = await res.json();
      if (data.withdrawal) {
        await refreshWallet();
        await fetchWalletData();
        success('Payout Requested!', `Withdrawal of $${withdrawAmount.toFixed(2)} is now processing.`);
        setShowWithdrawModal(false);
      } else {
        error('Withdrawal Failed', data.error || 'Server error');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Authoritative Wallet & Financial Ledger
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Server-authoritative balance accounting with 14-day escrow protection tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDepositModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" /> Deposit Funds
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" /> Request Payout
          </button>
        </div>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Available Balance */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Available for Payout
          </span>
          <div className="text-3xl font-black text-slate-900">
            ${wallet ? wallet.availableBalance.toFixed(2) : '0.00'}
          </div>
          <span className="text-xs text-emerald-700 font-semibold block">
            ✓ Ready for withdrawal or contracts
          </span>
        </div>

        {/* 14-Day Protection Balance */}
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl shadow-xs space-y-2">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 14-Day Protection Hold
          </span>
          <div className="text-3xl font-black text-amber-950">
            ${wallet ? wallet.protectionPeriodBalance.toFixed(2) : '0.00'}
          </div>
          <span className="text-xs text-amber-800 font-medium block">
            Under clearance guarantee
          </span>
        </div>

        {/* Escrow Locked */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Active Escrow Locked
          </span>
          <div className="text-3xl font-black text-slate-900">
            ${wallet ? wallet.escrowLockedBalance.toFixed(2) : '0.00'}
          </div>
          <span className="text-xs text-slate-500 font-medium block">
            Locked in ongoing contracts
          </span>
        </div>

        {/* Lifetime Earnings */}
        <div className="p-6 bg-slate-900 text-white border border-slate-800 rounded-2xl shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Lifetime Net Earnings
          </span>
          <div className="text-3xl font-black text-emerald-400">
            ${wallet ? wallet.lifetimeEarnings.toFixed(2) : '0.00'}
          </div>
          <span className="text-xs text-slate-400 font-medium block">
            Withdrawn: ${(wallet?.withdrawnTotal || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Immutable Double-Entry Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Double-Entry Financial Ledger</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authoritative, immutable transaction records with idempotent verification keys
            </p>
          </div>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded font-semibold border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Reconciled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="p-4">Transaction ID & Key</th>
                <th className="p-4">Type</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-right">Balance After</th>
                <th className="p-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {ledgerEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                    No ledger transactions recorded yet.
                  </td>
                </tr>
              ) : (
                ledgerEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{entry.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{entry.idempotentKey}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          entry.type === 'DEPOSIT' || entry.type === 'ESCROW_RELEASE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : entry.type === 'WITHDRAWAL_REQUEST' || entry.type === 'ESCROW_FUND'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {entry.type}
                      </span>
                    </td>
                    <td className="p-4 font-sans text-slate-700 max-w-xs">{entry.description}</td>
                    <td className="p-4 text-right font-bold">
                      <span className={entry.amount > 0 ? 'text-emerald-700' : 'text-slate-900'}>
                        {entry.amount > 0 ? `+$${entry.amount.toFixed(2)}` : `-$${Math.abs(entry.amount).toFixed(2)}`}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-900">
                      ${entry.balanceAfter.toFixed(2)}
                    </td>
                    <td className="p-4 text-right text-slate-400 font-sans text-[11px]">
                      {new Date(entry.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900">Deposit Funds to Wallet</h3>
              <button onClick={() => setShowDepositModal(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Amount (USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentProvider}
                  onChange={(e) => setPaymentProvider(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="STRIPE_CARD">Credit / Debit Card (Stripe)</option>
                  <option value="RAZORPAY_UPI">Razorpay UPI / NetBanking (India)</option>
                  <option value="BANK_WIRE">Direct Wire Transfer (ACH / SEPA)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                Funds are immediately credited to your available balance and recorded on the immutable ledger.
              </div>

              <button
                type="submit"
                disabled={isDepositing}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition"
              >
                {isDepositing ? 'Processing Payment...' : `Confirm Deposit ($${depositAmount})`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900">Request Payout / Withdrawal</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Withdrawal Amount (Available: ${wallet?.availableBalance.toFixed(2)})
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="10"
                    max={wallet?.availableBalance || 0}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Destination Method
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="BANK_TRANSFER">Bank Wire Transfer (IBAN / ACH / IMPS)</option>
                  <option value="UPI">UPI Direct (India)</option>
                  <option value="PAYPAL">PayPal Payout</option>
                </select>
              </div>

              {payoutMethod === 'BANK_TRANSFER' && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Account Holder</label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Account Number / IBAN</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </>
              )}

              {payoutMethod === 'UPI' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">UPI ID (VPA)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourname@okhdfcbank"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              )}

              {payoutMethod === 'PAYPAL' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">PayPal Email</label>
                  <input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isWithdrawing || withdrawAmount <= 0 || withdrawAmount > (wallet?.availableBalance || 0)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {isWithdrawing ? 'Submitting Request...' : `Submit Withdrawal ($${withdrawAmount})`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
