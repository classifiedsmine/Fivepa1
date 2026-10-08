import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Star,
  Check,
  Clock,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Share2,
  Bookmark,
  Plus,
  Lock,
  Sparkles,
  Zap,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { Offer, OfferAddon } from '../../types';

interface OfferDetailViewProps {
  slugOrId: string;
  navigate: (path: string) => void;
}

const defaultAddonsList: OfferAddon[] = [
  {
    id: 'addon-express',
    title: 'Fast Express Delivery',
    description: 'Priority placement to deliver your complete order in accelerated turnaround time.',
    price: 60,
    extraDays: -1,
  },
  {
    id: 'addon-source',
    title: 'Source Code & Design Asset Bundle',
    description: 'Includes full clean source repository, vector assets, and technical documentation.',
    price: 45,
    extraDays: 0,
  },
  {
    id: 'addon-revision',
    title: 'Extra Dedicated Revision Cycle',
    description: 'An additional thorough revision round for post-delivery refinements.',
    price: 30,
    extraDays: 1,
  },
  {
    id: 'addon-license',
    title: 'Commercial Resale & License Rights',
    description: 'Full commercial rights transfer for unlimited commercial distribution.',
    price: 50,
    extraDays: 0,
  },
];

export const OfferDetailView: React.FC<OfferDetailViewProps> = ({ slugOrId, navigate }) => {
  const { currentUser, wallet, refreshWallet } = useAuth();
  const { success, error, info } = useToast();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/marketplace/offers/${slugOrId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.offer) setOffer(data.offer);
      })
      .finally(() => setIsLoading(false));
  }, [slugOrId]);

  if (isLoading || !offer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-slate-500">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold text-slate-800">Loading service details...</p>
      </div>
    );
  }

  // Calculate base specs from offer or fallback
  const basePrice = offer.price || offer.packages?.standard?.price || offer.packages?.basic?.price || 150;
  const baseDeliveryDays = offer.deliveryDays || offer.packages?.standard?.deliveryDays || offer.packages?.basic?.deliveryDays || 3;
  const revisions = offer.revisions !== undefined ? offer.revisions : (offer.packages?.standard?.revisions || offer.packages?.basic?.revisions || 2);
  const features = offer.features || offer.packages?.standard?.features || offer.packages?.basic?.features || [
    'Core Deliverables & Documentation',
    '14-Day Escrow Buyer Guarantee',
    'Full Quality Check',
  ];

  const addonsToDisplay: OfferAddon[] = (offer.addons && offer.addons.length > 0) ? offer.addons : defaultAddonsList;

  // Selected extras calculation
  const selectedAddons = addonsToDisplay.filter((a) => selectedAddonIds.includes(a.id));
  const extrasTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const extraDaysTotal = selectedAddons.reduce((sum, a) => sum + (a.extraDays || 0), 0);

  const totalServicePrice = basePrice + extrasTotal;
  const processingFee = totalServicePrice * 0.03;
  const totalEscrowAmount = totalServicePrice + processingFee;
  const calculatedDeliveryDays = Math.max(1, baseDeliveryDays + extraDaysTotal);

  const toggleAddon = (id: string) => {
    if (selectedAddonIds.includes(id)) {
      setSelectedAddonIds(selectedAddonIds.filter((item) => item !== id));
    } else {
      setSelectedAddonIds([...selectedAddonIds, id]);
    }
  };

  const handleExecuteOrder = async () => {
    setIsProcessing(true);
    try {
      // 1. Create contract
      const orderRes = await fetch(`/api/marketplace/offers/${offer.id}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: currentUser.id,
          selectedAddonIds,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.contract) {
        throw new Error(orderData.error || 'Failed to initialize order contract');
      }

      const contractId = orderData.contract.id;

      // 2. Auto-deposit if wallet needs funds
      const available = wallet?.availableBalance || 0;
      if (available < totalEscrowAmount) {
        const topupAmount = totalEscrowAmount - available;
        await fetch('/api/wallet/deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            amount: topupAmount,
            paymentMethod: 'STRIPE_CARD',
          }),
        });
      }

      // 3. Fund Escrow
      const fundRes = await fetch(`/api/contracts/${contractId}/fund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: currentUser.id }),
      });
      const fundData = await fundRes.json();

      if (fundData.contract) {
        await refreshWallet();
        success(
          'Order Confirmed & Escrow Funded!',
          `Funds ($${totalEscrowAmount.toFixed(2)}) are safely locked in Escrow. Freelancer notified.`
        );
        navigate(`/contracts/${fundData.contract.id}`);
      } else {
        throw new Error(fundData.error || 'Failed to fund escrow');
      }
    } catch (err: any) {
      error('Checkout Error', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // FULL WEBPAGE CHECKOUT VIEW MODE (Full Width, No Popups)
  if (isCheckoutMode) {
    return (
      <div className="bg-slate-50 min-h-screen text-slate-900 pb-24">
        {/* Top Full Width Header */}
        <div className="bg-slate-900 text-white border-b border-slate-800 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <button
                onClick={() => setIsCheckoutMode(false)}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition mb-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Service Details
              </button>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Order Checkout & Escrow Setup</h1>
              <p className="text-xs text-slate-400">Complete Webpage Checkout • 14-Day Buyer Clearance Guarantee</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Escrow Funded Protection Active</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Order Customization */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Summary Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-start gap-5">
                  <img
                    src={offer.images[0]}
                    alt={offer.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border border-slate-200"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {offer.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 mb-2">
                      {offer.title}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="font-bold text-slate-900">By {offer.freelancer.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {offer.rating} ({offer.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-center text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Base Price</span>
                    <span className="text-lg font-black text-slate-900">${basePrice}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Turnaround</span>
                    <span className="text-lg font-bold text-slate-900">{calculatedDeliveryDays} Days</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Revisions</span>
                    <span className="text-lg font-bold text-slate-900">
                      {revisions === -1 ? 'Unlimited' : `${revisions} Cycles`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Extra Services & Add-ons Webpage Selection */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Optional Add-ons
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    Upgrade Order with Extra Services
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Select additional deliverables or expedited timeline options below
                  </p>
                </div>

                <div className="space-y-3">
                  {addonsToDisplay.map((addon) => {
                    const isChecked = selectedAddonIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                          isChecked
                            ? 'border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-slate-900">{addon.title}</h4>
                            <span className="font-black text-sm text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg">
                              +${addon.price}
                            </span>
                          </div>
                          {addon.description && (
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{addon.description}</p>
                          )}
                          {addon.extraDays !== 0 && (
                            <span className="inline-block mt-2 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {addon.extraDays! > 0 ? `+${addon.extraDays} days timeline` : `${addon.extraDays} days faster delivery`}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scope Features & Escrow Assurance */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Included Base Deliverables
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Summary Panel */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg sticky top-8 space-y-6">
                <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4">
                  Order Cost Breakdown
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Service Offer</span>
                    <span className="font-bold text-slate-900">${basePrice.toFixed(2)}</span>
                  </div>

                  {selectedAddons.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="font-bold text-slate-700 block mb-1">Selected Extra Services:</span>
                      {selectedAddons.map((add) => (
                        <div key={add.id} className="flex justify-between text-emerald-800 text-[11px]">
                          <span className="truncate max-w-[180px]">• {add.title}</span>
                          <span className="font-semibold">+${add.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-100">
                    <span>Client Processing Fee (3%)</span>
                    <span>${processingFee.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-baseline">
                    <span className="font-extrabold text-slate-900 text-sm">Total Escrow Amount</span>
                    <span className="font-black text-2xl text-emerald-700">${totalEscrowAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="block font-bold mb-0.5">14-Day Escrow Buyer Protection</strong>
                    Payment is locked in escrow and only released after you accept the final deliverable.
                  </div>
                </div>

                <button
                  onClick={handleExecuteOrder}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#1dbf73] hover:bg-[#19a463] text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-5 h-5" />
                  <span>{isProcessing ? 'Processing Escrow...' : `Pay & Fund Escrow ($${totalEscrowAmount.toFixed(2)})`}</span>
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  By placing this order, you initiate an escrow contract protected under WorkSphere Marketplace Terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD SERVICE DETAIL VIEW (Full Webpage, No 3-Tier Model)
  return (
    <div className="bg-white min-h-screen text-slate-900 selection:bg-emerald-500 selection:text-white pb-24">
      {/* Top Editorial Breadcrumbs & Actions */}
      <div className="border-b border-slate-100 bg-slate-50/70 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <button onClick={() => navigate('/')} className="hover:text-slate-900 transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/offers')} className="hover:text-slate-900 transition-colors">Predefined Offers</button>
            <span>/</span>
            <span className="text-emerald-700 font-bold truncate max-w-[200px] sm:max-w-none">{offer.title}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                success('Link Copied', 'Package link copied to clipboard.');
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share</span>
            </button>
            <button
              onClick={() => info('Bookmarked', 'Service package saved to your bookmarks.')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-500" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Back Link */}
        <button
          onClick={() => navigate('/offers')}
          className="text-slate-500 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Service Packages
        </button>

        {/* Hero Header */}
        <header className="max-w-4xl mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200/60">
              {offer.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              {offer.subcategory}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              14-Day Buyer Protection
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {offer.title}
          </h1>

          {/* Freelancer Author Card */}
          <div className="flex flex-wrap items-center justify-between py-4 border-y border-slate-200 gap-4">
            <div
              onClick={() => navigate(`/freelancers/${offer.freelancer.username}`)}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <img
                src={offer.freelancer.avatar}
                alt={offer.freelancer.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
              <div>
                <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition flex items-center gap-1.5">
                  <span>{offer.freelancer.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {offer.freelancer.verificationStatus === 'VERIFIED' ? 'VERIFIED SELLER' : 'TOP RATED'}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {offer.freelancer.title || 'Specialized Studio Contractor'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1 font-bold text-slate-900">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{offer.rating}</span>
                <span className="text-slate-400 font-normal">({offer.reviewCount} reviews)</span>
              </div>
              <div><span className="font-bold text-slate-900">{offer.ordersInQueue}</span> orders in queue</div>
              <div><span className="font-bold text-slate-900">100%</span> on-time delivery</div>
            </div>
          </div>
        </header>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Main Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Service Hero Showcase Image */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xs">
              <img
                src={offer.images[0]}
                alt={offer.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* About This Offer Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Scope & Specifications
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                About this Service Offer
              </h2>
              <div className="text-slate-700 text-base leading-relaxed space-y-4 font-normal">
                <p className="whitespace-pre-line">{offer.description}</p>
              </div>

              {/* Skills & Technologies */}
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Technologies & Skills Included:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {offer.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-800 text-xs px-3 py-1.5 rounded-lg font-semibold"
                    >
                      #{skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Extra Services / Add-ons Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-600" />
                  Customize Your Order
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-2">
                  Extra Services & Add-ons
                </h2>
                <p className="text-slate-600 text-sm">
                  Add extra features, faster delivery times, or additional deliverables to customize your package below.
                </p>
              </div>

              <div className="space-y-3">
                {addonsToDisplay.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-base text-slate-900">{addon.title}</h4>
                          <span className="font-black text-sm text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                            +${addon.price}
                          </span>
                        </div>
                        {addon.description && (
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{addon.description}</p>
                        )}
                        {addon.extraDays !== 0 && (
                          <span className="inline-block mt-2 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {addon.extraDays! > 0 ? `+${addon.extraDays} days delivery` : `${addon.extraDays} days faster`}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FAQs Accordion */}
            {offer.faqs && offer.faqs.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Questions & Clarity
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {offer.faqs.map((faq, idx) => (
                    <div key={idx} className="py-4">
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                        className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-slate-900 focus:outline-hidden cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {openFaqIndex === idx ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      {openFaqIndex === idx && (
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Webpage Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg sticky top-24 space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mb-3">
                  Service Package
                </span>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-black text-4xl text-slate-900">${totalServicePrice}</h3>
                  {selectedAddons.length > 0 && (
                    <span className="text-xs text-slate-500">(${basePrice} base + ${extrasTotal} extras)</span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 text-base mt-2 mb-2">{offer.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{offer.description}</p>
              </div>

              {/* Delivery and Revisions metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 py-3.5 border-y border-slate-100 font-semibold">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{calculatedDeliveryDays} Days Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-emerald-600" />
                  <span>{revisions === -1 ? 'Unlimited' : `${revisions} Revisions`}</span>
                </div>
              </div>

              {/* Selected Extras summary if any */}
              {selectedAddons.length > 0 && (
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/60 text-xs space-y-1">
                  <span className="font-bold text-emerald-900 block text-[11px] mb-1">Included Add-ons ({selectedAddons.length}):</span>
                  {selectedAddons.map((a) => (
                    <div key={a.id} className="flex justify-between text-emerald-800 text-[11px]">
                      <span className="truncate">• {a.title}</span>
                      <span className="font-bold">+${a.price}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Features Checklist */}
              <div className="space-y-2 text-xs text-slate-700">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Transition to Full Webpage Checkout */}
              <button
                onClick={() => setIsCheckoutMode(true)}
                className="w-full py-4 bg-[#1dbf73] hover:bg-[#19a463] text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <CreditCard className="w-5 h-5" />
                <span>Continue (${totalServicePrice})</span>
              </button>

              {/* 14-Day Buyer Protection Card */}
              <div className="p-4 bg-[#f0fbf7] border border-[#1dbf73]/30 rounded-2xl text-xs text-[#222325] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#1dbf73] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-[#222325] block mb-0.5">Escrow Guarantee</span>
                  Funds are securely held in escrow until you inspect and approve the completed order.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
