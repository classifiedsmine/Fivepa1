import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Star,
  Layers,
  CheckCircle2,
  ChevronRight,
  Clock,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  SlidersHorizontal,
  Copy,
  Zap,
  Check,
  Heart,
  ChevronDown,
  ChevronLeft,
  Filter,
  ArrowUpDown,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Info,
  ExternalLink,
  Award,
  Globe,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Offer } from '../../types';
import { useToast } from '../../context/ToastContext';

interface OffersDirectoryPageProps {
  navigate: (path: string) => void;
  onOpenCreateOffer: () => void;
}

const ALL_CATEGORIES = [
  { id: 'all', name: 'All Services', tag: '' },
  { id: 'dev', name: 'Programming & Tech', tag: 'development & it' },
  { id: 'design', name: 'Graphics & Design', tag: 'design & creative' },
  { id: 'marketing', name: 'Digital Marketing', tag: 'sales & marketing' },
  { id: 'video', name: 'Video & Animation', tag: 'video & animation' },
  { id: 'writing', name: 'Writing & Translation', tag: 'writing & translation' },
  { id: 'music', name: 'Music & Audio', tag: 'music & audio' },
  { id: 'business', name: 'Business', tag: 'business' },
  { id: 'ai', name: 'AI Services', tag: 'ai & machine learning' },
];

export const OffersDirectoryPage: React.FC<OffersDirectoryPageProps> = ({
  navigate,
  onOpenCreateOffer,
}) => {
  const { success, info } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Navigation
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubService, setSelectedSubService] = useState('all');

  // Dropdown Filter States
  const [openDropdown, setOpenDropdown] = useState<'service' | 'seller' | 'budget' | 'delivery' | null>(null);

  // Filters State
  const [selectedWebsiteTypes, setSelectedWebsiteTypes] = useState<string[]>([]);
  const [selectedSellerLevels, setSelectedSellerLevels] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [appliedBudget, setAppliedBudget] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string>('any');

  // Quick Switch Toggles
  const [proServicesOnly, setProServicesOnly] = useState(false);
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);
  const [onlineSellersOnly, setOnlineSellersOnly] = useState(false);

  // Sort & View Mode State
  const [sortBy, setSortBy] = useState<'recommended' | 'best-selling' | 'price-low' | 'price-high' | 'rating'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Wishlist Heart state
  const [savedOffers, setSavedOffers] = useState<Set<string>>(new Set());

  // Active image slide per gig
  const [activeImageIndex, setActiveImageIndex] = useState<{ [offerId: string]: number }>({});

  // Expanded FAQ state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/marketplace/offers');
      const data = await res.json();
      setOffers(data.offers || []);
    } catch (e) {
      console.error('Failed to fetch offers:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const toggleWishlist = (e: React.MouseEvent, offerId: string) => {
    e.stopPropagation();
    setSavedOffers((prev) => {
      const next = new Set(prev);
      if (next.has(offerId)) {
        next.delete(offerId);
        info('Removed from List', 'Saved gig removed from your favorites.');
      } else {
        next.add(offerId);
        success('Saved to List', 'Gig saved to your favorites collection.');
      }
      return next;
    });
  };

  const copyGigLink = (e: React.MouseEvent, offer: Offer) => {
    e.stopPropagation();
    const url = `${window.location.origin}/offers/${offer.slug}`;
    navigator.clipboard.writeText(url);
    success('Link Copied', `Direct link to "${offer.title}" copied to clipboard.`);
  };

  const handleNextImage = (e: React.MouseEvent, offerId: string, totalImages: number) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => ({
      ...prev,
      [offerId]: ((prev[offerId] || 0) + 1) % totalImages,
    }));
  };

  const handlePrevImage = (e: React.MouseEvent, offerId: string, totalImages: number) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => ({
      ...prev,
      [offerId]: ((prev[offerId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  // Filter & Sort Logic
  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = offer.title.toLowerCase().includes(query);
        const matchDesc = offer.description.toLowerCase().includes(query);
        const matchSkills = offer.skills.some((s) => s.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchSkills) return false;
      }

      // Category filter
      if (selectedSubService !== 'all') {
        const cat = ALL_CATEGORIES.find((s) => s.id === selectedSubService);
        if (cat && cat.tag) {
          const matchCategory = offer.category.toLowerCase().includes(cat.tag);
          const matchSub = offer.subcategory?.toLowerCase().includes(cat.tag);
          const matchTitle = offer.title.toLowerCase().includes(cat.tag);
          const matchSkills = offer.skills.some((s) => s.toLowerCase().includes(cat.tag));
          if (!matchCategory && !matchSub && !matchTitle && !matchSkills) return false;
        }
      }

      // Budget filter
      const price = offer.price || offer.packages?.basic?.price || offer.packages?.standard?.price || 0;
      if (appliedBudget.min !== null && price < appliedBudget.min) return false;
      if (appliedBudget.max !== null && price > appliedBudget.max) return false;

      // Delivery time
      const deliveryDays = offer.deliveryDays || offer.packages?.basic?.deliveryDays || offer.packages?.standard?.deliveryDays || 1;
      if (selectedDeliveryTime === '24h' && deliveryDays > 1) return false;
      if (selectedDeliveryTime === '3d' && deliveryDays > 3) return false;
      if (selectedDeliveryTime === '7d' && deliveryDays > 7) return false;

      // Pro Services
      if (proServicesOnly && offer.freelancer.verificationStatus !== 'VERIFIED') return false;

      // Fast Delivery
      if (fastDeliveryOnly && deliveryDays > 2) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.price || a.packages?.basic?.price || 0;
      const priceB = b.price || b.packages?.basic?.price || 0;
      if (sortBy === 'price-low') {
        return priceA - priceB;
      }
      if (sortBy === 'price-high') {
        return priceB - priceA;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'best-selling') {
        return (b.salesCount || 0) - (a.salesCount || 0);
      }
      return 0; // recommended default
    });
  }, [
    offers,
    searchTerm,
    selectedSubService,
    appliedBudget,
    selectedDeliveryTime,
    proServicesOnly,
    fastDeliveryOnly,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedSubService('all');
    setSelectedWebsiteTypes([]);
    setSelectedSellerLevels([]);
    setBudgetRange({ min: '', max: '' });
    setAppliedBudget({ min: null, max: null });
    setSelectedDeliveryTime('any');
    setProServicesOnly(false);
    setFastDeliveryOnly(false);
    setOnlineSellersOnly(false);
    setSortBy('recommended');
  };

  const hasActiveFilters =
    searchTerm ||
    selectedSubService !== 'all' ||
    appliedBudget.min !== null ||
    appliedBudget.max !== null ||
    selectedDeliveryTime !== 'any' ||
    proServicesOnly ||
    fastDeliveryOnly ||
    onlineSellersOnly;

  return (
    <div className="bg-[#f7f7f7] min-h-screen text-[#222325] pb-24 font-sans">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-[#e4e5e7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-xs text-[#74767e]">
            <button onClick={() => navigate('/')} className="hover:text-[#222325] transition-colors">
              Home
            </button>
            <span>/</span>
            <span className="text-[#222325] font-bold">Curated Gigs Directory</span>
          </nav>

          <button
            onClick={onOpenCreateOffer}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publish a Gig</span>
          </button>
        </div>
      </div>

      {/* Category Hero Header */}
      <div className="bg-white border-b border-[#e4e5e7] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
                Curated Gigs & Service Packages
              </h1>
              <p className="text-sm text-[#74767e] mt-1 max-w-3xl">
                Explore top-rated freelance services and curated fixed-price gig packages across all professional categories, backed by 14-day escrow protection.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>14-Day Escrow Protected</span>
              </div>
            </div>
          </div>

          {/* Subcategory Horizontal Carousel / Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-6 pb-1">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedSubService(cat.id)}
                className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all border ${
                  selectedSubService === cat.id
                    ? 'bg-[#222325] text-white border-[#222325] shadow-xs'
                    : 'bg-white text-[#62646a] border-[#dadbdd] hover:border-[#222325] hover:text-[#222325]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Multi-Dropdown Filter Toolbar */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#e4e5e7] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Dropdown Filters Left */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Service Options Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'service' ? null : 'service')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border transition ${
                    openDropdown === 'service' || selectedWebsiteTypes.length > 0
                      ? 'border-[#222325] text-[#222325] bg-slate-50'
                      : 'border-[#dadbdd] text-[#62646a] hover:border-[#222325] bg-white'
                  }`}
                >
                  <span>Service Options</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'service' && (
                  <div className="absolute left-0 mt-2 w-72 bg-white border border-[#dadbdd] rounded-xl shadow-xl z-50 p-4">
                    <h4 className="font-bold text-xs text-[#222325] mb-2">Website Specialization</h4>
                    <div className="space-y-2 text-xs text-[#62646a] max-h-48 overflow-y-auto">
                      {['E-Commerce Store', 'Business & Corporate', 'Blog / Editorial', 'Portfolio', 'Landing Page', 'LMS & Courses'].map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer hover:text-[#222325]">
                          <input
                            type="checkbox"
                            checked={selectedWebsiteTypes.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedWebsiteTypes([...selectedWebsiteTypes, type]);
                              } else {
                                setSelectedWebsiteTypes(selectedWebsiteTypes.filter((t) => t !== type));
                              }
                            }}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#e4e5e7]">
                      <button
                        onClick={() => setSelectedWebsiteTypes([])}
                        className="text-xs text-[#74767e] hover:text-[#222325] font-semibold"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setOpenDropdown(null)}
                        className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-md hover:bg-emerald-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Seller Details Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'seller' ? null : 'seller')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border transition ${
                    openDropdown === 'seller' || selectedSellerLevels.length > 0
                      ? 'border-[#222325] text-[#222325] bg-slate-50'
                      : 'border-[#dadbdd] text-[#62646a] hover:border-[#222325] bg-white'
                  }`}
                >
                  <span>Seller Details</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'seller' && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-[#dadbdd] rounded-xl shadow-xl z-50 p-4">
                    <h4 className="font-bold text-xs text-[#222325] mb-2">Seller Tier</h4>
                    <div className="space-y-2 text-xs text-[#62646a]">
                      {['Top Rated Seller', 'Level 2 Seller', 'Level 1 Seller', 'Top Verified'].map((level) => (
                        <label key={level} className="flex items-center gap-2 cursor-pointer hover:text-[#222325]">
                          <input
                            type="checkbox"
                            checked={selectedSellerLevels.includes(level)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSellerLevels([...selectedSellerLevels, level]);
                              } else {
                                setSelectedSellerLevels(selectedSellerLevels.filter((l) => l !== level));
                              }
                            }}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{level}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#e4e5e7]">
                      <button
                        onClick={() => setSelectedSellerLevels([])}
                        className="text-xs text-[#74767e] hover:text-[#222325] font-semibold"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setOpenDropdown(null)}
                        className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-md hover:bg-emerald-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Budget Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'budget' ? null : 'budget')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border transition ${
                    openDropdown === 'budget' || appliedBudget.min !== null || appliedBudget.max !== null
                      ? 'border-[#222325] text-[#222325] bg-slate-50'
                      : 'border-[#dadbdd] text-[#62646a] hover:border-[#222325] bg-white'
                  }`}
                >
                  <span>
                    {appliedBudget.min !== null || appliedBudget.max !== null
                      ? `Budget: $${appliedBudget.min || 0} - $${appliedBudget.max || 'Any'}`
                      : 'Budget'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'budget' && (
                  <div className="absolute left-0 mt-2 w-72 bg-white border border-[#dadbdd] rounded-xl shadow-xl z-50 p-4">
                    <h4 className="font-bold text-xs text-[#222325] mb-2">Price Range ($ USD)</h4>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <label className="text-[10px] text-[#74767e] font-bold block mb-1">MIN</label>
                        <input
                          type="number"
                          placeholder="$ Min"
                          value={budgetRange.min}
                          onChange={(e) => setBudgetRange({ ...budgetRange, min: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs border border-[#dadbdd] rounded-md focus:border-emerald-600 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#74767e] font-bold block mb-1">MAX</label>
                        <input
                          type="number"
                          placeholder="$ Max"
                          value={budgetRange.max}
                          onChange={(e) => setBudgetRange({ ...budgetRange, max: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs border border-[#dadbdd] rounded-md focus:border-emerald-600 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 mb-3">
                      <button
                        onClick={() => {
                          setBudgetRange({ min: '', max: '50' });
                          setAppliedBudget({ min: 0, max: 50 });
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left text-xs text-[#62646a] hover:text-emerald-700 py-1"
                      >
                        Value: Under $50
                      </button>
                      <button
                        onClick={() => {
                          setBudgetRange({ min: '50', max: '150' });
                          setAppliedBudget({ min: 50, max: 150 });
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left text-xs text-[#62646a] hover:text-emerald-700 py-1"
                      >
                        Mid-range: $50 - $150
                      </button>
                      <button
                        onClick={() => {
                          setBudgetRange({ min: '150', max: '' });
                          setAppliedBudget({ min: 150, max: null });
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left text-xs text-[#62646a] hover:text-emerald-700 py-1"
                      >
                        High-end: $150 & Above
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#e4e5e7]">
                      <button
                        onClick={() => {
                          setBudgetRange({ min: '', max: '' });
                          setAppliedBudget({ min: null, max: null });
                        }}
                        className="text-xs text-[#74767e] hover:text-[#222325] font-semibold"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => {
                          setAppliedBudget({
                            min: budgetRange.min ? parseFloat(budgetRange.min) : null,
                            max: budgetRange.max ? parseFloat(budgetRange.max) : null,
                          });
                          setOpenDropdown(null);
                        }}
                        className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-md hover:bg-emerald-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Time Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'delivery' ? null : 'delivery')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border transition ${
                    openDropdown === 'delivery' || selectedDeliveryTime !== 'any'
                      ? 'border-[#222325] text-[#222325] bg-slate-50'
                      : 'border-[#dadbdd] text-[#62646a] hover:border-[#222325] bg-white'
                  }`}
                >
                  <span>
                    {selectedDeliveryTime === '24h'
                      ? 'Express 24H'
                      : selectedDeliveryTime === '3d'
                      ? 'Up to 3 Days'
                      : selectedDeliveryTime === '7d'
                      ? 'Up to 7 Days'
                      : 'Delivery Time'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'delivery' && (
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-[#dadbdd] rounded-xl shadow-xl z-50 p-4">
                    <h4 className="font-bold text-xs text-[#222325] mb-2">Turnaround Speed</h4>
                    <div className="space-y-2 text-xs text-[#62646a]">
                      {[
                        { id: '24h', label: 'Express 24 Hours' },
                        { id: '3d', label: 'Up to 3 Days' },
                        { id: '7d', label: 'Up to 7 Days' },
                        { id: 'any', label: 'Any Delivery Time' },
                      ].map((item) => (
                        <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:text-[#222325]">
                          <input
                            type="radio"
                            name="delivery"
                            checked={selectedDeliveryTime === item.id}
                            onChange={() => {
                              setSelectedDeliveryTime(item.id);
                              setOpenDropdown(null);
                            }}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Verified Services Switch */}
              <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#e4e5e7]">
                <label className="flex items-center gap-2 text-xs font-bold text-[#222325] cursor-pointer select-none">
                  <div
                    onClick={() => setProServicesOnly(!proServicesOnly)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      proServicesOnly ? 'bg-emerald-600' : 'bg-[#dadbdd]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        proServicesOnly ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </div>
                  <span className="flex items-center gap-1">
                    <span className="text-emerald-600 font-bold text-xs">Verified</span>
                    <span>Sellers</span>
                  </span>
                </label>
              </div>

              {/* Fast Delivery Switch */}
              <div className="hidden xl:flex items-center gap-2 pl-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#222325] cursor-pointer select-none">
                  <div
                    onClick={() => setFastDeliveryOnly(!fastDeliveryOnly)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      fastDeliveryOnly ? 'bg-emerald-600' : 'bg-[#dadbdd]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        fastDeliveryOnly ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </div>
                  <span>⚡ Instant Delivery</span>
                </label>
              </div>
            </div>

            {/* Right: Results Count, View Toggle & Sort Dropdown */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-[#74767e] font-semibold">
                <strong className="text-[#222325]">{filteredOffers.length}</strong> services available
              </span>

              {/* Grid / List View Toggle */}
              <div className="flex items-center bg-white border border-[#dadbdd] rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 rounded transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                    viewMode === 'grid'
                      ? 'bg-[#222325] text-white shadow-xs'
                      : 'text-[#74767e] hover:text-[#222325] hover:bg-slate-100'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  title="Listicle View"
                  className={`p-1.5 rounded transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                    viewMode === 'list'
                      ? 'bg-[#222325] text-white shadow-xs'
                      : 'text-[#74767e] hover:text-[#222325] hover:bg-slate-100'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">List</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[#74767e] hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white text-[#222325] font-bold text-xs border border-[#dadbdd] rounded-lg px-2.5 py-1.5 focus:outline-hidden cursor-pointer hover:border-[#222325]"
                >
                  <option value="recommended">Recommended</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Customer Review</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Gig Cards Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-xl border border-[#e4e5e7] overflow-hidden animate-pulse">
                <div className="h-44 bg-slate-200"></div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                    <div className="h-3 w-24 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="flex justify-between pt-3 border-t border-slate-100">
                    <div className="h-4 w-12 bg-slate-200 rounded"></div>
                    <div className="h-4 w-16 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e4e5e7] p-12 text-center max-w-lg mx-auto my-12">
            <Filter className="w-12 h-12 text-[#b5b6ba] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#222325] mb-2">No matching services found</h3>
            <p className="text-xs text-[#74767e] mb-6">
              Try adjusting your search criteria, price range, or category filter to discover more expert packages.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOffers.map((offer) => {
              const currentImgIdx = activeImageIndex[offer.id] || 0;
              const imagesList = offer.images && offer.images.length > 0
                ? offer.images
                : ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'];
              const isWishlisted = savedOffers.has(offer.id);

              return (
                <div
                  key={offer.id}
                  onClick={() => navigate(`/offers/${offer.slug}`)}
                  className="bg-white rounded-xl border border-[#e4e5e7] hover:border-[#b5b6ba] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group overflow-hidden"
                >
                  <div>
                    {/* Gig Image Carousel */}
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden select-none">
                      <img
                        src={imagesList[currentImgIdx]}
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                      />

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={(e) => toggleWishlist(e, offer.id)}
                        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition shadow-xs z-10 ${
                          isWishlisted ? 'text-rose-500 hover:text-rose-600' : 'text-[#74767e] hover:text-rose-500'
                        }`}
                        title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                      </button>


                      {/* Carousel Arrow Controls (Visible on hover when multiple images exist) */}
                      {imagesList.length > 1 && (
                        <>
                          <button
                            onClick={(e) => handlePrevImage(e, offer.id, imagesList.length)}
                            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 text-[#222325] opacity-0 group-hover:opacity-100 flex items-center justify-center transition shadow-xs hover:bg-white"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleNextImage(e, offer.id, imagesList.length)}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 text-[#222325] opacity-0 group-hover:opacity-100 flex items-center justify-center transition shadow-xs hover:bg-white"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Dots Indicator */}
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full">
                            {imagesList.map((_, dotIdx) => (
                              <div
                                key={dotIdx}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  dotIdx === currentImgIdx ? 'bg-white scale-125' : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Gig Details */}
                    <div className="p-3.5 sm:p-4">
                      {/* Seller Profile Row */}
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={offer.freelancer.avatar}
                          alt={offer.freelancer.name}
                          className="w-6 h-6 rounded-full object-cover border border-[#dadbdd]"
                        />
                        <div className="flex items-center gap-1 text-xs truncate">
                          <span className="font-bold text-[#222325] truncate">{offer.freelancer.name}</span>
                          <span className="text-[#74767e] text-[11px] shrink-0 font-medium">
                            · {offer.freelancer.verificationStatus === 'VERIFIED' ? 'Top Rated' : 'Level 2'}
                          </span>
                        </div>
                      </div>

                      {/* Gig Title */}
                      <h3 className="text-xs sm:text-[13px] font-semibold text-[#222325] group-hover:text-emerald-700 transition leading-snug line-clamp-2 mb-2 min-h-[36px]">
                        {offer.title}
                      </h3>

                      {/* Rating & Review Count */}
                      <div className="flex items-center gap-1 text-xs font-bold text-[#222325] mb-2.5">
                        <Star className="w-3.5 h-3.5 fill-[#222325] text-[#222325]" />
                        <span>{offer.rating.toFixed(1)}</span>
                        <span className="text-[#74767e] font-normal">({offer.reviewCount})</span>
                      </div>

                      {/* Delivery & Revisions snippet */}
                      <div className="text-[11px] text-[#74767e] flex items-center gap-1.5 truncate">
                        <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{offer.deliveryDays || offer.packages?.standard?.deliveryDays || offer.packages?.basic?.deliveryDays || 3}d delivery</span>
                        <span>·</span>
                        <span>{offer.revisions === -1 || offer.packages?.basic?.revisions === -1 ? 'Unlimited revs' : `${offer.revisions || offer.packages?.basic?.revisions || 2} revs`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gig Footer: Price & Copy Link */}
                  <div className="p-3 sm:px-4 sm:py-3 border-t border-[#f2f2f2] flex items-center justify-between">
                    <button
                      onClick={(e) => copyGigLink(e, offer)}
                      className="text-[#74767e] hover:text-[#222325] p-1 rounded transition"
                      title="Copy gig link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <div className="text-right">
                      <span className="text-[10px] text-[#74767e] font-semibold uppercase block leading-none">
                        From
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-[#222325]">
                        ${offer.price || offer.packages?.basic?.price || 0}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Listicle View Layout */
          <div className="space-y-4">
            {filteredOffers.map((offer) => {
              const currentImgIdx = activeImageIndex[offer.id] || 0;
              const imagesList = offer.images && offer.images.length > 0
                ? offer.images
                : ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'];
              const isWishlisted = savedOffers.has(offer.id);

              return (
                <div
                  key={offer.id}
                  onClick={() => navigate(`/offers/${offer.slug}`)}
                  className="bg-white rounded-xl border border-[#e4e5e7] hover:border-[#b5b6ba] hover:shadow-md transition duration-200 cursor-pointer flex flex-col sm:flex-row overflow-hidden group"
                >
                  {/* Image Gallery */}
                  <div className="relative w-full sm:w-48 h-44 sm:h-36 shrink-0 bg-[#f0f0f0] overflow-hidden">
                    <img
                      src={imagesList[currentImgIdx]}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                    />

                    {/* Heart Wishlist Button */}
                    <button
                      onClick={(e) => toggleWishlist(e, offer.id)}
                      className={`absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white transition shadow-xs z-10 ${
                        isWishlisted ? 'text-rose-500' : 'text-[#74767e] hover:text-rose-500'
                      }`}
                      title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                    </button>

                  </div>

                  {/* Details Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={offer.freelancer.avatar}
                          alt={offer.freelancer.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#e4e5e7]"
                        />
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-xs text-[#222325] truncate">
                            {offer.freelancer.name}
                          </span>
                          {offer.freelancer.verificationStatus === 'VERIFIED' && (
                            <span className="text-[10px] text-[#1dbf73] font-bold bg-[#f0fbf7] px-1.5 py-0.5 rounded border border-[#1dbf73]/20">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="font-bold text-base text-[#222325] group-hover:text-[#1dbf73] transition leading-snug mb-2">
                        {offer.title}
                      </h3>

                      <p className="text-xs text-[#62646a] line-clamp-2 leading-relaxed">
                        {offer.description || 'Verified production-ready service package with transparent deliverables, fast turnaround, and buyer escrow protection.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#222325] font-bold">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-[#222325] text-[#222325]" />
                        <span>{offer.rating.toFixed(1)}</span>
                        <span className="text-[#74767e] font-normal">
                          ({offer.reviewCount})
                        </span>
                      </div>
                      <span className="text-[#e4e5e7]">|</span>
                      <span className="text-[#1dbf73] font-semibold text-xs flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {offer.deliveryDays || offer.packages?.standard?.deliveryDays || offer.packages?.basic?.deliveryDays || 3}d delivery
                      </span>
                    </div>
                  </div>

                  {/* Price Column */}
                  <div className="p-5 sm:w-48 shrink-0 bg-[#fbfbfb] sm:border-l border-t sm:border-t-0 border-[#e4e5e7] flex flex-col justify-between items-start sm:items-end text-left sm:text-right">
                    <div>
                      <span className="text-[10px] text-[#74767e] uppercase font-bold tracking-wider block">
                        Starting From
                      </span>
                      <span className="text-2xl font-black text-[#222325] mt-0.5 block">
                        ${offer.price || offer.packages?.basic?.price || 0}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/offers/${offer.slug}`);
                      }}
                      className="w-full mt-4 sm:mt-0 px-4 py-2 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      View Service
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* SEO & WordPress FAQ Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-[#e4e5e7]">
        <h2 className="text-2xl font-extrabold text-[#222325] mb-2 text-center">
          WordPress Development FAQs
        </h2>
        <p className="text-xs text-[#74767e] text-center mb-8">
          Everything you need to know about hiring freelance WordPress experts on our marketplace.
        </p>

        <div className="space-y-3">
          {[
            {
              q: 'What should I provide to the WordPress developer before starting?',
              a: 'You should provide your hosting details (or cPanel/FTP credentials), domain name, logo and branding assets, page copy, reference websites you like, and any specific plugins or third-party integrations required for your project.',
            },
            {
              q: 'What is the difference between custom development and theme customization?',
              a: 'Theme customization involves modifying existing commercial themes (like Astra, Divi, or Hello Elementor) to fit your brand. Custom development builds tailored WordPress themes, custom post types, Gutenberg blocks, or bespoke plugins from scratch.',
            },
            {
              q: 'How does the 14-day escrow buyer protection work on this platform?',
              a: 'When you purchase an Offer, your funds are safely deposited into escrow. Once the freelancer completes and delivers the project, you have time to review. Upon acceptance, the 14-day clearance window ensures you have full support before funds are released.',
            },
            {
              q: 'Can the freelancer optimize my website for Google Core Web Vitals and SEO?',
              a: 'Yes! Most WordPress developers offer speed optimization packages including caching setup, image compression, database cleaning, CDN integration, and on-page SEO meta configuration.',
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#e4e5e7] rounded-xl overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-[#222325] hover:text-emerald-700 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#74767e] transform transition-transform ${
                    expandedFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFaq === idx && (
                <div className="px-4 pb-4 text-xs text-[#62646a] leading-relaxed border-t border-slate-50 pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Searches Cloud */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-[#e4e5e7]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#74767e] mb-3">
          Related Searches
        </h3>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            'Elementor Pro',
            'WooCommerce Development',
            'WordPress Speed Optimization',
            'Figma to WordPress',
            'Shopify to WordPress',
            'WordPress Malware Removal',
            'Custom Plugin Development',
            'Landing Page Design',
            'Divi Theme Customization',
            'Responsive Web Design',
          ].map((tag, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchTerm(tag);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white border border-[#dadbdd] hover:border-[#222325] text-[#62646a] hover:text-[#222325] px-3 py-1.5 rounded-full transition font-medium"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
