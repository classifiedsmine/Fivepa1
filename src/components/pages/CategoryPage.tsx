import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Briefcase,
  Star,
  Heart,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Check,
  Info,
  Layers,
  HelpCircle,
  Share2,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Project, Offer } from '../../types';
import { useToast } from '../../context/ToastContext';

interface CategoryPageProps {
  categorySlug: string;
  navigate: (path: string) => void;
  onOpenPostProject: () => void;
  onOpenCreateOffer?: () => void;
}

// Master Built-In Category Dictionary for 0ms Instant Rendering
const MASTER_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Programming & Tech',
    aliases: ['programming-tech', 'development-it', 'web-development', 'website-development', 'wordpress-development', 'full-stack', 'software-development'],
    slug: 'development-it',
    description: 'Build robust, scalable websites, custom web apps, mobile solutions, APIs, and cloud architecture from world-class developers.',
    icon: 'Code',
    subcategories: [
      { name: 'WordPress Development', slug: 'wordpress-development', jobCount: 310 },
      { name: 'Website Development', slug: 'website-development', jobCount: 245 },
      { name: 'Full Stack Development', slug: 'full-stack', jobCount: 142 },
      { name: 'React & Frontend', slug: 'frontend-react', jobCount: 98 },
      { name: 'Cloud & DevOps (GCP/AWS)', slug: 'devops-cloud', jobCount: 64 },
      { name: 'Mobile Apps (iOS/Android)', slug: 'mobile-apps', jobCount: 51 },
      { name: 'Node.js & Backend Architecture', slug: 'backend-nodejs', jobCount: 76 },
    ],
    popularSkills: ['WordPress', 'React', 'TypeScript', 'Node.js', 'WooCommerce', 'PostgreSQL', 'Google Cloud Run', 'Docker', 'Next.js'],
  },
  {
    id: 'cat-2',
    name: 'Graphics & Design',
    aliases: ['graphics-design', 'design-creative', 'ui-ux', 'logo-design', 'branding'],
    slug: 'design-creative',
    description: 'Transform your brand with bespoke UI/UX design, design systems in Figma, logo identities, and conversion-focused assets.',
    icon: 'Palette',
    subcategories: [
      { name: 'UI/UX & Product Design', slug: 'ui-ux', jobCount: 110 },
      { name: 'Brand Identity & Systems', slug: 'branding', jobCount: 49 },
      { name: 'Web & Mobile Design', slug: 'web-mobile-design', jobCount: 73 },
      { name: 'Design Systems in Figma', slug: 'design-systems', jobCount: 38 },
      { name: 'Logo Design & Brand Books', slug: 'logo-design', jobCount: 125 },
    ],
    popularSkills: ['Figma', 'UI/UX', 'Design Systems', 'Tailwind CSS', 'Prototyping', 'Visual Design', 'Wireframing'],
  },
  {
    id: 'cat-3',
    name: 'Digital Marketing',
    aliases: ['digital-marketing', 'sales-marketing', 'seo', 'social-media-marketing'],
    slug: 'sales-marketing',
    description: 'Scale traffic, drive conversions, and dominate search rankings with performance marketing, SEO, and paid ad funnels.',
    icon: 'TrendingUp',
    subcategories: [
      { name: 'Search Engine Optimization', slug: 'seo', jobCount: 54 },
      { name: 'Paid Ads & Google PPC', slug: 'ppc-ads', jobCount: 38 },
      { name: 'Growth Engineering & CRO', slug: 'growth-strategy', jobCount: 31 },
      { name: 'Social Media Marketing', slug: 'social-media', jobCount: 62 },
    ],
    popularSkills: ['SEO Audit', 'Google Ads', 'Funnel Optimization', 'Conversion Rate Optimization', 'Analytics', 'Meta Ads'],
  },
  {
    id: 'cat-4',
    name: 'Video & Animation',
    aliases: ['video-animation', 'video-editing', 'motion-graphics', 'animation'],
    slug: 'video-animation',
    description: 'Captivate your audience with high-converting video editing, 3D animations, motion graphics, and commercial post-production.',
    icon: 'Video',
    subcategories: [
      { name: 'Video Editing & Post-Production', slug: 'video-editing', jobCount: 84 },
      { name: '2D & 3D Animated Explainers', slug: 'animated-explainers', jobCount: 52 },
      { name: 'Motion Graphics & Logo Animation', slug: 'motion-graphics', jobCount: 67 },
      { name: 'Social Media & TikTok Reels', slug: 'short-form-video', jobCount: 114 },
      { name: '3D Product Animation & CGI', slug: '3d-product-animation', jobCount: 39 },
    ],
    popularSkills: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Blender', 'Cinema 4D', 'Sound Design', 'Color Grading'],
  },
  {
    id: 'cat-5',
    name: 'Writing & Translation',
    aliases: ['writing-translation', 'content-writing', 'copywriting', 'technical-writing'],
    slug: 'writing-translation',
    description: 'Clear, accurate technical writing, developer documentation, high-converting copy, and authoritative whitepapers.',
    icon: 'BookOpen',
    subcategories: [
      { name: 'Technical & Developer Writing', slug: 'technical-writing', jobCount: 45 },
      { name: 'SEO Copywriting & Content', slug: 'seo-content', jobCount: 62 },
      { name: 'Whitepapers & Research', slug: 'whitepapers', jobCount: 29 },
      { name: 'Website Copy & Landing Pages', slug: 'landing-page-copy', jobCount: 58 },
    ],
    popularSkills: ['Technical Writing', 'SEO Copywriting', 'API Docs', 'Content Strategy', 'Ghostwriting', 'Whitepapers'],
  },
  {
    id: 'cat-6',
    name: 'Music & Audio',
    aliases: ['music-audio', 'voice-over', 'audio-editing', 'podcast-editing'],
    slug: 'music-audio',
    description: 'Elevate your project with professional studio voice overs, audio mixing, mastering, custom beat production, and sound design.',
    icon: 'Headphones',
    subcategories: [
      { name: 'Voice Over & Narration', slug: 'voice-over', jobCount: 78 },
      { name: 'Mixing & Mastering', slug: 'mixing-mastering', jobCount: 46 },
      { name: 'Music Production & Beatmaking', slug: 'music-production', jobCount: 63 },
      { name: 'Podcast Audio Editing', slug: 'podcast-editing', jobCount: 58 },
      { name: 'Sound Design & Foley', slug: 'sound-design', jobCount: 32 },
    ],
    popularSkills: ['Pro Tools', 'Ableton Live', 'Voice Over', 'Audio Mastering', 'FL Studio', 'Podcast Cleanup', 'Logic Pro'],
  },
  {
    id: 'cat-7',
    name: 'AI Services',
    aliases: ['ai-services', 'ai-machine-learning', 'machine-learning', 'llm-rag'],
    slug: 'ai-machine-learning',
    description: 'Integrate state-of-the-art LLMs, multimodal Gemini agents, dense vector RAG pipelines, and autonomous AI applications.',
    icon: 'Cpu',
    subcategories: [
      { name: 'LLM Applications & RAG', slug: 'llm-rag', jobCount: 88 },
      { name: 'Computer Vision & NLP', slug: 'vision-nlp', jobCount: 42 },
      { name: 'AI Model Integration', slug: 'ai-integration', jobCount: 67 },
      { name: 'Data Science & Analytics', slug: 'data-science', jobCount: 53 },
    ],
    popularSkills: ['Gemini API', 'PyTorch', 'LangChain', 'Vector Databases', 'Python', 'FastAPI', 'HuggingFace'],
  },
  {
    id: 'cat-8',
    name: 'Business',
    aliases: ['business', 'business-plans', 'financial-modeling'],
    slug: 'business',
    description: 'Investor-grade business plans, dynamic 5-year financial models, market research, and operational consulting.',
    icon: 'Briefcase',
    subcategories: [
      { name: 'Business Plans & Pitch Decks', slug: 'business-plans', jobCount: 41 },
      { name: 'Financial Modeling & Forecasting', slug: 'financial-modeling', jobCount: 35 },
      { name: 'Market Research & Competitive Analysis', slug: 'market-research', jobCount: 29 },
      { name: 'Virtual Assistance & Operations', slug: 'virtual-assistant', jobCount: 92 },
      { name: 'CRM & ERP Systems', slug: 'crm-erp', jobCount: 38 },
    ],
    popularSkills: ['Financial Modeling', 'Pitch Deck Design', 'Market Analysis', 'HubSpot', 'Excel Financials', 'Salesforce'],
  },
  {
    id: 'cat-9',
    name: 'Consulting',
    aliases: ['consulting', 'tech-advisory', 'startup-strategy'],
    slug: 'consulting',
    description: 'Executive guidance and architectural advisory from seasoned tech leaders, startup founders, and compliance specialists.',
    icon: 'Compass',
    subcategories: [
      { name: 'Tech Architecture & CTO Advisory', slug: 'tech-advisory', jobCount: 47 },
      { name: 'Startup Fundraising & Strategy', slug: 'startup-strategy', jobCount: 36 },
      { name: 'Legal Consulting & IP', slug: 'legal-consulting', jobCount: 22 },
      { name: 'Security, SOC2 & Compliance', slug: 'security-compliance', jobCount: 19 },
    ],
    popularSkills: ['Cloud Architecture', 'Fundraising', 'Compliance', 'SOC 2', 'Product Strategy', 'Due Diligence'],
  },
];

// Helper to resolve slug into a category
function resolveCategoryFromSlug(rawSlug: string) {
  if (!rawSlug || rawSlug === 'all') return MASTER_CATEGORIES[0];

  // Clean slug
  const normalized = rawSlug
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
    .split('?')[0]
    .split('#')[0];

  // Segment check (e.g. programming-tech/website-development/wordpress-development)
  const segments = normalized.split('/');
  const targetSlug = segments[segments.length - 1]; // leaf or first
  const rootSlug = segments[0];

  // 1. Direct match on slug
  let found = MASTER_CATEGORIES.find(
    (c) => c.slug === targetSlug || c.slug === rootSlug || c.slug === normalized
  );

  // 2. Alias match
  if (!found) {
    found = MASTER_CATEGORIES.find((c) =>
      c.aliases.some(
        (a) =>
          a === targetSlug ||
          a === rootSlug ||
          targetSlug.includes(a) ||
          a.includes(targetSlug) ||
          normalized.includes(a)
      )
    );
  }

  // 3. Subcategory match
  if (!found) {
    found = MASTER_CATEGORIES.find((c) =>
      c.subcategories.some(
        (sub) =>
          sub.slug === targetSlug ||
          targetSlug.includes(sub.slug) ||
          sub.slug.includes(targetSlug)
      )
    );
  }

  // 4. Fallback: synthesize clean category
  if (!found) {
    const formattedTitle = targetSlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      id: `cat-${targetSlug}`,
      name: formattedTitle || 'All Services',
      slug: targetSlug,
      aliases: [targetSlug],
      description: `Explore top-rated freelance services and curated gig packages in ${formattedTitle}.`,
      icon: 'Briefcase',
      subcategories: [
        { name: 'All ' + formattedTitle, slug: targetSlug, jobCount: 45 },
        { name: 'Top Rated Services', slug: 'top-rated', jobCount: 28 },
        { name: 'Fast Delivery', slug: 'fast-delivery', jobCount: 19 },
      ],
      popularSkills: ['Verified Quality', 'Fast Turnaround', 'Expert Talent'],
    };
  }

  return found;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  navigate,
  onOpenPostProject,
  onOpenCreateOffer,
}) => {
  const { success, info } = useToast();

  // Instant category resolution (0ms latency)
  const initialCategory = useMemo(() => resolveCategoryFromSlug(categorySlug), [categorySlug]);
  const [category, setCategory] = useState(initialCategory);

  // Offers and Projects state
  const [offers, setOffers] = useState<Offer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);

  // Filter States
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [selectedSellerLevel, setSelectedSellerLevel] = useState<string>('all');
  const [budgetRange, setBudgetRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [appliedBudget, setAppliedBudget] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string>('any');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'best-selling' | 'price-low' | 'price-high' | 'rating'>('recommended');

  // UI state
  const [activeTab, setActiveTab] = useState<'offers' | 'projects'>('offers');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [openDropdown, setOpenDropdown] = useState<'seller' | 'budget' | 'delivery' | null>(null);
  const [savedOffers, setSavedOffers] = useState<Set<string>>(new Set());
  const [activeImageIndex, setActiveImageIndex] = useState<{ [id: string]: number }>({});
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Sync category when categorySlug prop changes
  useEffect(() => {
    const resolved = resolveCategoryFromSlug(categorySlug);
    setCategory(resolved);
    setActiveSubcategory('all');
  }, [categorySlug]);

  // Fetch real offers and projects from server
  useEffect(() => {
    setIsLoadingOffers(true);

    const catQuery = category.name;
    const catSlugQuery = category.slug;

    // Fetch matching offers
    fetch(`/api/marketplace/offers?category=${encodeURIComponent(catSlugQuery)}`)
      .then((r) => r.json())
      .then((oData) => {
        let items: Offer[] = oData.offers || [];
        // If specific category had few items, also fetch all and filter client-side
        if (items.length === 0) {
          fetch('/api/marketplace/offers')
            .then((r) => r.json())
            .then((allData) => {
              const all: Offer[] = allData.offers || [];
              const matched = all.filter((o) => {
                const oCat = o.category.toLowerCase();
                const oSub = (o.subcategory || '').toLowerCase();
                const qCat = catQuery.toLowerCase();
                const qSlug = catSlugQuery.toLowerCase().replace(/[^a-z0-9]/g, '');
                return (
                  oCat.includes(qCat) ||
                  qCat.includes(oCat) ||
                  oSub.includes(qCat) ||
                  oCat.replace(/[^a-z0-9]/g, '').includes(qSlug)
                );
              });
              setOffers(matched.length > 0 ? matched : all);
            })
            .catch(() => {})
            .finally(() => setIsLoadingOffers(false));
        } else {
          setOffers(items);
          setIsLoadingOffers(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load category offers:', err);
        setIsLoadingOffers(false);
      });

    // Fetch matching projects
    fetch(`/api/marketplace/projects?category=${encodeURIComponent(catSlugQuery)}`)
      .then((r) => r.json())
      .then((pData) => {
        let items = pData.projects || [];
        if (items.length === 0) {
          fetch('/api/marketplace/projects')
            .then((r) => r.json())
            .then((allP) => {
              const all: Project[] = allP.projects || [];
              const matched = all.filter((p) => {
                const pCat = p.category.toLowerCase();
                return pCat.includes(catQuery.toLowerCase()) || catQuery.toLowerCase().includes(pCat);
              });
              setProjects(matched.length > 0 ? matched : all.slice(0, 4));
            });
        } else {
          setProjects(items);
        }
      })
      .catch((err) => console.error('Failed to load category projects:', err));
  }, [category]);

  // Wishlist toggle
  const toggleSave = (e: React.MouseEvent, offerId: string) => {
    e.stopPropagation();
    setSavedOffers((prev) => {
      const next = new Set(prev);
      if (next.has(offerId)) {
        next.delete(offerId);
        info('Removed from Favorites', 'Gig removed from your saved list.');
      } else {
        next.add(offerId);
        success('Saved to Favorites', 'Gig saved to your list.');
      }
      return next;
    });
  };

  // Image slider
  const handlePrevImage = (e: React.MouseEvent, offerId: string, total: number) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => ({
      ...prev,
      [offerId]: ((prev[offerId] || 0) - 1 + total) % total,
    }));
  };

  const handleNextImage = (e: React.MouseEvent, offerId: string, total: number) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => ({
      ...prev,
      [offerId]: ((prev[offerId] || 0) + 1) % total,
    }));
  };

  // Filtered & Sorted Offers
  const filteredOffers = useMemo(() => {
    return offers
      .filter((o) => {
        // Subcategory pill filter
        if (activeSubcategory !== 'all') {
          const sub = category.subcategories.find((s) => s.slug === activeSubcategory);
          const target = (sub?.name || activeSubcategory).toLowerCase();
          const matchSub = (o.subcategory || '').toLowerCase().includes(target);
          const matchTitle = o.title.toLowerCase().includes(target);
          const matchSkills = o.skills.some((sk) => sk.toLowerCase().includes(target));
          if (!matchSub && !matchTitle && !matchSkills) return false;
        }

        // Seller Level
        if (selectedSellerLevel !== 'all') {
          if (selectedSellerLevel === 'verified' && o.freelancer.verificationStatus !== 'VERIFIED') return false;
          if (selectedSellerLevel === 'top-rated' && o.freelancer.rating < 4.95) return false;
        }

        // Budget
        const price = o.price || o.packages?.basic?.price || o.packages?.standard?.price || 0;
        if (appliedBudget.min !== null && price < appliedBudget.min) return false;
        if (appliedBudget.max !== null && price > appliedBudget.max) return false;

        // Delivery
        const deliveryDays = o.deliveryDays || o.packages?.basic?.deliveryDays || o.packages?.standard?.deliveryDays || 1;
        if (selectedDeliveryTime === '24h' && deliveryDays > 1) return false;
        if (selectedDeliveryTime === '3d' && deliveryDays > 3) return false;
        if (selectedDeliveryTime === '7d' && deliveryDays > 7) return false;

        // Verified sellers toggle
        if (verifiedOnly && o.freelancer.verificationStatus !== 'VERIFIED') return false;

        // Fast delivery toggle
        if (fastDeliveryOnly && deliveryDays > 2) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          return (a.price || a.packages?.basic?.price || 0) - (b.price || b.packages?.basic?.price || 0);
        }
        if (sortBy === 'price-high') {
          return (b.price || b.packages?.basic?.price || 0) - (a.price || a.packages?.basic?.price || 0);
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'best-selling') {
          return (b.salesCount || 0) - (a.salesCount || 0);
        }
        return 0; // recommended
      });
  }, [
    offers,
    activeSubcategory,
    selectedSellerLevel,
    appliedBudget,
    selectedDeliveryTime,
    verifiedOnly,
    fastDeliveryOnly,
    sortBy,
    category,
  ]);

  const hasActiveFilters =
    activeSubcategory !== 'all' ||
    selectedSellerLevel !== 'all' ||
    appliedBudget.min !== null ||
    appliedBudget.max !== null ||
    selectedDeliveryTime !== 'any' ||
    verifiedOnly ||
    fastDeliveryOnly;

  const clearAllFilters = () => {
    setActiveSubcategory('all');
    setSelectedSellerLevel('all');
    setBudgetRange({ min: '', max: '' });
    setAppliedBudget({ min: null, max: null });
    setSelectedDeliveryTime('any');
    setVerifiedOnly(false);
    setFastDeliveryOnly(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleWindowClick = () => setOpenDropdown(null);
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-24 text-[#222325]">
      {/* 1. Breadcrumbs Trail */}
      <div className="bg-white border-b border-[#e4e5e7]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-[#74767e] overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => navigate('/')}
              className="hover:text-[#1dbf73] font-medium transition cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-[#b5b6ba]" />
            <button
              onClick={() => navigate('/offers')}
              className="hover:text-[#1dbf73] font-medium transition cursor-pointer"
            >
              Categories
            </button>
            <ChevronRight className="w-3 h-3 text-[#b5b6ba]" />
            <span className="font-semibold text-[#222325]">{category.name}</span>
            {activeSubcategory !== 'all' && (
              <>
                <ChevronRight className="w-3 h-3 text-[#b5b6ba]" />
                <span className="font-semibold text-[#1dbf73]">
                  {category.subcategories.find((s) => s.slug === activeSubcategory)?.name || activeSubcategory}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Category Hero Header */}
      <div className="bg-white border-b border-[#e4e5e7]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 rounded bg-[#f0fbf7] text-[#1dbf73] font-bold text-xs uppercase tracking-wider border border-[#1dbf73]/20">
                  Curated Category
                </span>
                <span className="text-xs text-[#74767e] font-medium">
                  100% Escrow Protected
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#222325] tracking-tight mb-3">
                {category.name}
              </h1>
              <p className="text-[#62646a] text-sm sm:text-base max-w-3xl leading-relaxed">
                {category.description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onOpenPostProject}
                className="px-5 py-2.5 rounded-md bg-[#222325] hover:bg-black text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-[#1dbf73]" />
                Post a Buyer Request
              </button>
              {onOpenCreateOffer && (
                <button
                  onClick={onOpenCreateOffer}
                  className="px-5 py-2.5 rounded-md bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Create a Gig
                </button>
              )}
            </div>
          </div>

          {/* Subcategories Horizontal Pills */}
          <div className="mt-8 pt-6 border-t border-[#f0f0f0]">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
              <button
                onClick={() => setActiveSubcategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  activeSubcategory === 'all'
                    ? 'bg-[#222325] text-white border-[#222325]'
                    : 'bg-white text-[#62646a] border-[#e4e5e7] hover:border-[#222325]'
                }`}
              >
                All Services ({offers.length})
              </button>
              {category.subcategories.map((sub: any) => (
                <button
                  key={sub.slug}
                  onClick={() => setActiveSubcategory(sub.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer border flex items-center gap-1.5 ${
                    activeSubcategory === sub.slug
                      ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                      : 'bg-white text-[#62646a] border-[#e4e5e7] hover:border-[#1dbf73]'
                  }`}
                >
                  <span>{sub.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      activeSubcategory === sub.slug ? 'bg-black/20 text-white' : 'bg-slate-100 text-[#74767e]'
                    }`}
                  >
                    {sub.jobCount || '40+'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filters Toolbar */}
      <div className="bg-white border-b border-[#e4e5e7] sticky top-[68px] z-20 shadow-2xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Seller Details Dropdown */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'seller' ? null : 'seller')}
                  className={`px-3.5 py-1.5 rounded-md border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    selectedSellerLevel !== 'all'
                      ? 'border-[#1dbf73] text-[#1dbf73] bg-[#f0fbf7]'
                      : 'border-[#dadbdd] text-[#222325] hover:border-[#222325]'
                  }`}
                >
                  <span>Seller Details</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#74767e]" />
                </button>

                {openDropdown === 'seller' && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-[#e4e5e7] rounded-xl shadow-xl z-50 p-3 space-y-2">
                    <div className="font-bold text-xs text-[#222325] pb-2 border-b border-[#f0f0f0]">
                      Seller Tier
                    </div>
                    {[
                      { id: 'all', label: 'All Sellers' },
                      { id: 'top-rated', label: 'Top Rated Sellers (4.95+)' },
                      { id: 'verified', label: 'Identity & Escrow Verified' },
                    ].map((lvl) => (
                      <label
                        key={lvl.id}
                        className="flex items-center gap-2.5 text-xs text-[#404145] hover:text-black cursor-pointer py-1"
                      >
                        <input
                          type="radio"
                          name="sellerLevel"
                          checked={selectedSellerLevel === lvl.id}
                          onChange={() => {
                            setSelectedSellerLevel(lvl.id);
                            setOpenDropdown(null);
                          }}
                          className="accent-[#1dbf73]"
                        />
                        <span>{lvl.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget Dropdown */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'budget' ? null : 'budget')}
                  className={`px-3.5 py-1.5 rounded-md border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    appliedBudget.min !== null || appliedBudget.max !== null
                      ? 'border-[#1dbf73] text-[#1dbf73] bg-[#f0fbf7]'
                      : 'border-[#dadbdd] text-[#222325] hover:border-[#222325]'
                  }`}
                >
                  <span>
                    {appliedBudget.min !== null || appliedBudget.max !== null
                      ? `$${appliedBudget.min || 0} - $${appliedBudget.max || 'Any'}`
                      : 'Budget'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#74767e]" />
                </button>

                {openDropdown === 'budget' && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-[#e4e5e7] rounded-xl shadow-xl z-50 p-4 space-y-3">
                    <div className="font-bold text-xs text-[#222325]">Custom Price Range</div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-2 text-xs text-[#74767e] font-bold">$</span>
                        <input
                          type="number"
                          placeholder="Min"
                          value={budgetRange.min}
                          onChange={(e) => setBudgetRange({ ...budgetRange, min: e.target.value })}
                          className="w-full pl-6 pr-2 py-1.5 border border-[#dadbdd] rounded text-xs focus:outline-none focus:border-[#1dbf73]"
                        />
                      </div>
                      <span className="text-[#74767e] text-xs">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-2 text-xs text-[#74767e] font-bold">$</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={budgetRange.max}
                          onChange={(e) => setBudgetRange({ ...budgetRange, max: e.target.value })}
                          className="w-full pl-6 pr-2 py-1.5 border border-[#dadbdd] rounded text-xs focus:outline-none focus:border-[#1dbf73]"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => {
                          setBudgetRange({ min: '', max: '' });
                          setAppliedBudget({ min: null, max: null });
                          setOpenDropdown(null);
                        }}
                        className="text-xs text-[#74767e] hover:text-black font-semibold cursor-pointer"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => {
                          setAppliedBudget({
                            min: budgetRange.min ? Number(budgetRange.min) : null,
                            max: budgetRange.max ? Number(budgetRange.max) : null,
                          });
                          setOpenDropdown(null);
                        }}
                        className="px-3 py-1 bg-[#1dbf73] hover:bg-[#19a463] text-white rounded text-xs font-bold transition cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Time Dropdown */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'delivery' ? null : 'delivery')}
                  className={`px-3.5 py-1.5 rounded-md border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    selectedDeliveryTime !== 'any'
                      ? 'border-[#1dbf73] text-[#1dbf73] bg-[#f0fbf7]'
                      : 'border-[#dadbdd] text-[#222325] hover:border-[#222325]'
                  }`}
                >
                  <span>
                    {selectedDeliveryTime === '24h'
                      ? 'Up to 24 hours'
                      : selectedDeliveryTime === '3d'
                      ? 'Up to 3 days'
                      : selectedDeliveryTime === '7d'
                      ? 'Up to 7 days'
                      : 'Delivery Time'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#74767e]" />
                </button>

                {openDropdown === 'delivery' && (
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-[#e4e5e7] rounded-xl shadow-xl z-50 p-3 space-y-2">
                    <div className="font-bold text-xs text-[#222325] pb-2 border-b border-[#f0f0f0]">
                      Turnaround Time
                    </div>
                    {[
                      { id: 'any', label: 'Anytime' },
                      { id: '24h', label: 'Express 24 Hours' },
                      { id: '3d', label: 'Up to 3 Days' },
                      { id: '7d', label: 'Up to 7 Days' },
                    ].map((d) => (
                      <label
                        key={d.id}
                        className="flex items-center gap-2.5 text-xs text-[#404145] hover:text-black cursor-pointer py-1"
                      >
                        <input
                          type="radio"
                          name="deliveryTime"
                          checked={selectedDeliveryTime === d.id}
                          onChange={() => {
                            setSelectedDeliveryTime(d.id);
                            setOpenDropdown(null);
                          }}
                          className="accent-[#1dbf73]"
                        />
                        <span>{d.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Sellers Switch */}
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#e4e5e7]">
                <label className="flex items-center gap-2 text-xs font-bold text-[#222325] cursor-pointer select-none">
                  <div
                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      verifiedOnly ? 'bg-[#1dbf73]' : 'bg-[#ccc]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        verifiedOnly ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                  <span>Verified Sellers</span>
                </label>
              </div>

              {/* Fast Delivery Switch */}
              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#e4e5e7]">
                <label className="flex items-center gap-2 text-xs font-bold text-[#222325] cursor-pointer select-none">
                  <div
                    onClick={() => setFastDeliveryOnly(!fastDeliveryOnly)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      fastDeliveryOnly ? 'bg-[#1dbf73]' : 'bg-[#ccc]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        fastDeliveryOnly ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                  <span>Fast 48h Delivery</span>
                </label>
              </div>

              {/* Clear filters button */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#e00] hover:underline font-bold pl-2 cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Right: Results Count, View Toggle & Sort */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-[#74767e] font-semibold hidden sm:inline">
                <strong className="text-[#222325]">{filteredOffers.length}</strong> services available
              </span>

              {/* Grid / List View Toggle */}
              <div className="flex items-center bg-[#fafafa] border border-[#e4e5e7] rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 rounded transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                    viewMode === 'grid'
                      ? 'bg-[#222325] text-white shadow-xs'
                      : 'text-[#74767e] hover:text-[#222325] hover:bg-slate-200/60'
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
                      : 'text-[#74767e] hover:text-[#222325] hover:bg-slate-200/60'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">List</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[#74767e] font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-bold text-[#222325] border-none focus:outline-none cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Budget: Low to High</option>
                  <option value="price-high">Budget: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tab Switcher: Gigs vs Buyer Requests */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-4 border-b border-[#e4e5e7]">
          <button
            onClick={() => setActiveTab('offers')}
            className={`pb-3 text-sm font-black transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'offers'
                ? 'border-[#1dbf73] text-[#1dbf73]'
                : 'border-transparent text-[#74767e] hover:text-[#222325]'
            }`}
          >
            <span>Curated Gigs & Packages</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#f0fbf7] text-[#1dbf73] font-bold">
              {filteredOffers.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 text-sm font-black transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'border-[#1dbf73] text-[#1dbf73]'
                : 'border-transparent text-[#74767e] hover:text-[#222325]'
            }`}
          >
            <span>Buyer Requests in this Category</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-[#404145] font-bold">
              {projects.length}
            </span>
          </button>
        </div>
      </div>

      {/* 5. Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'offers' ? (
          /* Gigs Grid Card UX */
          <div>
            {filteredOffers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e4e5e7] p-12 text-center max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-[#f0fbf7] text-[#1dbf73] flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#222325] mb-2">No matching gigs found</h3>
                <p className="text-xs text-[#74767e] mb-6 leading-relaxed">
                  Try clearing active filters or explore all subcategories to find available talent.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 rounded-md bg-[#1dbf73] text-white text-xs font-bold hover:bg-[#19a463] transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredOffers.map((offer) => {
                  const images = offer.images && offer.images.length > 0
                    ? offer.images
                    : ['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'];
                  const curIdx = activeImageIndex[offer.id] || 0;
                  const isSaved = savedOffers.has(offer.id);
                  const price = offer.price || offer.packages?.basic?.price || offer.packages?.standard?.price || 50;

                  return (
                    <div
                      key={offer.id}
                      onClick={() => navigate(`/offers/${offer.slug}`)}
                      className="bg-white rounded-xl border border-[#e4e5e7] hover:border-[#b5b6ba] hover:shadow-md transition duration-200 cursor-pointer flex flex-col group overflow-hidden"
                    >
                      {/* Image Gallery */}
                      <div className="relative aspect-[16/10] bg-[#f0f0f0] overflow-hidden">
                        <img
                          src={images[curIdx]}
                          alt={offer.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                        />

                        {/* Image Slide Controls */}
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => handlePrevImage(e, offer.id, images.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#222325] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleNextImage(e, offer.id, images.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#222325] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* Heart Wishlist Button */}
                        <button
                          onClick={(e) => toggleSave(e, offer.id)}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#74767e] hover:text-[#e00] shadow-sm transition z-10"
                        >
                          <Heart
                            className={`w-4 h-4 transition ${
                              isSaved ? 'fill-[#e00] text-[#e00]' : 'text-[#74767e]'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Seller Row */}
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={
                                offer.freelancer?.avatar ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                              }
                              alt={offer.freelancer?.name || 'Seller'}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-xs text-[#222325] truncate">
                                {offer.freelancer?.name || 'Top Seller'}
                              </span>
                              {offer.freelancer?.verificationStatus === 'VERIFIED' && (
                                <span className="text-[10px] text-[#1dbf73] font-bold">
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Gig Title */}
                          <h3 className="font-medium text-sm text-[#222325] group-hover:text-[#1dbf73] transition line-clamp-2 leading-snug mb-3">
                            {offer.title}
                          </h3>
                        </div>

                        {/* Rating & Pricing Footer */}
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-[#222325] font-bold mb-3">
                            <Star className="w-3.5 h-3.5 fill-[#222325] text-[#222325]" />
                            <span>{offer.rating ? offer.rating.toFixed(1) : '5.0'}</span>
                            <span className="text-[#74767e] font-normal">
                              ({offer.reviewCount || 42})
                            </span>
                          </div>

                          <div className="pt-3 border-t border-[#f0f0f0] flex items-center justify-between">
                            <span className="text-[11px] text-[#74767e] uppercase font-bold tracking-wider">
                              From
                            </span>
                            <span className="text-base font-black text-[#222325]">
                              ${price}
                            </span>
                          </div>
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
                  const images = offer.images && offer.images.length > 0
                    ? offer.images
                    : ['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'];
                  const curIdx = activeImageIndex[offer.id] || 0;
                  const isSaved = savedOffers.has(offer.id);
                  const price = offer.price || offer.packages?.basic?.price || offer.packages?.standard?.price || 50;

                  return (
                    <div
                      key={offer.id}
                      onClick={() => navigate(`/offers/${offer.slug}`)}
                      className="bg-white rounded-xl border border-[#e4e5e7] hover:border-[#b5b6ba] hover:shadow-md transition duration-200 cursor-pointer flex flex-col sm:flex-row overflow-hidden group"
                    >
                      {/* Image Gallery */}
                      <div className="relative w-full sm:w-48 h-44 sm:h-36 shrink-0 bg-[#f0f0f0] overflow-hidden">
                        <img
                          src={images[curIdx]}
                          alt={offer.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                        />

                        {/* Image Slide Controls */}
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => handlePrevImage(e, offer.id, images.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#222325] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleNextImage(e, offer.id, images.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#222325] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* Heart Wishlist Button */}
                        <button
                          onClick={(e) => toggleSave(e, offer.id)}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#74767e] hover:text-[#e00] shadow-sm transition z-10"
                        >
                          <Heart
                            className={`w-4 h-4 transition ${
                              isSaved ? 'fill-[#e00] text-[#e00]' : 'text-[#74767e]'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={
                                offer.freelancer?.avatar ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                              }
                              alt={offer.freelancer?.name || 'Seller'}
                              className="w-7 h-7 rounded-full object-cover border border-[#e4e5e7]"
                            />
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-xs text-[#222325] truncate">
                                {offer.freelancer?.name || 'Top Seller'}
                              </span>
                              {offer.freelancer?.verificationStatus === 'VERIFIED' && (
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
                            <span>{offer.rating ? offer.rating.toFixed(1) : '5.0'}</span>
                            <span className="text-[#74767e] font-normal">
                              ({offer.reviewCount || 42})
                            </span>
                          </div>
                          <span className="text-[#e4e5e7]">|</span>
                          <span className="text-[#1dbf73] font-semibold text-xs flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Fast Delivery
                          </span>
                        </div>
                      </div>

                      {/* Pricing Column */}
                      <div className="p-5 sm:w-48 shrink-0 bg-[#fbfbfb] sm:border-l border-t sm:border-t-0 border-[#e4e5e7] flex flex-col justify-between items-start sm:items-end text-left sm:text-right">
                        <div>
                          <span className="text-[10px] text-[#74767e] uppercase font-bold tracking-wider block">
                            Starting From
                          </span>
                          <span className="text-2xl font-black text-[#222325] mt-0.5 block">
                            ${price}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/offers/${offer.slug}`);
                          }}
                          className="w-full mt-4 sm:mt-0 px-4 py-2 rounded bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                        >
                          View Gig
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Buyer Requests (Projects) Tab */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#222325]">
                  Active Buyer Requests in {category.name}
                </h2>
                <p className="text-xs text-[#74767e] mt-0.5">
                  Clients actively hiring verified talent with 100% escrow-backed milestones.
                </p>
              </div>
              <button
                onClick={() => navigate('/find-projects')}
                className="text-xs font-bold text-[#1dbf73] hover:underline cursor-pointer"
              >
                View all marketplace projects →
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#e4e5e7] p-8 text-center text-slate-500 text-xs">
                No active buyer requests currently posted in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.slug}`)}
                    className="p-6 bg-white border border-[#e4e5e7] hover:border-[#1dbf73] rounded-xl cursor-pointer transition shadow-2xs flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-[#1dbf73] font-bold bg-[#f0fbf7] px-2 py-0.5 rounded border border-[#1dbf73]/20">
                          {p.subcategory || category.name}
                        </span>
                        <span className="font-black text-[#222325] text-lg">${p.budget}</span>
                      </div>
                      <h3 className="font-bold text-[#222325] text-base mb-2 group-hover:text-[#1dbf73] transition">
                        {p.title}
                      </h3>
                      <p className="text-xs text-[#62646a] line-clamp-3 mb-4 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#e4e5e7] flex items-center justify-between text-xs text-[#74767e]">
                      <span>
                        Proposals: <strong className="text-[#222325]">{p.proposalsCount || 0}</strong>
                      </span>
                      <span>
                        Buyer: <strong className="text-[#222325]">{p.client?.name || 'Verified Buyer'}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. Explore Subcategories Grid */}
        <div className="mt-16 pt-12 border-t border-[#e4e5e7] space-y-6">
          <h2 className="text-2xl font-black text-[#222325] tracking-tight">
            Explore All Disciplines in {category.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {category.subcategories.map((sub: any, idx: number) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveSubcategory(sub.slug);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="p-5 bg-white border border-[#e4e5e7] hover:border-[#1dbf73] hover:shadow-sm rounded-xl cursor-pointer transition flex items-center justify-between group"
              >
                <div>
                  <h3 className="font-bold text-[#222325] text-sm group-hover:text-[#1dbf73] transition">
                    {sub.name}
                  </h3>
                  <span className="text-xs text-[#74767e]">
                    {sub.jobCount || '40+'} services available
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#74767e] group-hover:text-[#1dbf73] transition" />
              </div>
            ))}
          </div>
        </div>

        {/* 7. SEO FAQ Section */}
        <div className="mt-16 pt-12 border-t border-[#e4e5e7] space-y-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-black text-[#222325] tracking-tight mb-2">
              {category.name} FAQs & Hiring Guide
            </h2>
            <p className="text-xs text-[#74767e] mb-6">
              Everything you need to know about purchasing gigs and hiring freelance talent safely through WorkSphere.
            </p>

            <div className="space-y-3">
              {[
                {
                  q: `How do service offers work in ${category.name}?`,
                  a: `Freelancers offer transparent flat-rate service packages with customizable extra add-ons. Each offer clearly defines deliverables, turnaround time, and included revisions before you commit.`,
                },
                {
                  q: 'How is my payment protected with escrow?',
                  a: `When you order a gig, your funds are securely deposited into WorkSphere Escrow. The freelancer is only paid once they deliver the completed work and you approve the deliverable. You have a 14-day inspection window.`,
                },
                {
                  q: 'Can I request custom specifications or milestones?',
                  a: `Yes! If predefined packages do not match your exact scope, you can click "Contact Seller" or post a custom Buyer Request with your own timeline, budget, and milestone terms.`,
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-[#e4e5e7] overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between hover:text-[#1dbf73] transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#74767e] transition-transform ${
                        expandedFaq === index ? 'rotate-180 text-[#1dbf73]' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="p-4 pt-0 text-xs text-[#62646a] leading-relaxed border-t border-[#f0f0f0] bg-[#fafafa]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
