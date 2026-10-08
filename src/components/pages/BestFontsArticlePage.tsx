import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  ArrowRight,
  Share2,
  Bookmark,
  Check,
  Search,
  Sliders,
  Type,
  BookOpen,
  ArrowUpRight,
  Copy,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
  Download,
  Palette,
  Eye,
  SlidersHorizontal,
  Lightbulb,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface FontItem {
  id: string;
  name: string;
  family: string;
  category: 'Sans-Serif' | 'Serif' | 'Display' | 'Geometric' | 'Variable';
  creator: string;
  source: 'Google Fonts' | 'Web Safe' | 'Open Source';
  bestFor: string;
  description: string;
  weights: string[];
  pairing: string;
  stats: {
    legibility: number;
    versatility: number;
    modernity: number;
  };
  sampleHeadline: string;
  sampleBody: string;
  tags: string[];
  googleFontUrl: string;
}

const FONTS_CATALOG: FontItem[] = [
  {
    id: 'plus-jakarta-sans',
    name: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', sans-serif",
    category: 'Geometric',
    creator: 'Tokotype & Gumpita Rahayu',
    source: 'Google Fonts',
    bestFor: 'Modern SaaS, Design Agencies, High-growth Tech Portals',
    description: 'The signature modern typeface used by One Thing Design. A fresh, geometric sans-serif with nuanced humanist proportions that deliver exceptional crispness and authority across high-density displays.',
    weights: ['ExtraLight 200', 'Regular 400', 'Medium 500', 'SemiBold 600', 'Bold 700', 'ExtraBold 800'],
    pairing: 'Lora, Merriweather, or Roboto Mono',
    stats: { legibility: 98, versatility: 96, modernity: 99 },
    sampleHeadline: 'Design that speaks before it sells.',
    sampleBody: 'Crafting digital experiences with clear visual hierarchy, calibrated geometric balance, and uncompromising typography.',
    tags: ['Hero Type', 'SaaS', 'High Legibility', 'Modern'],
    googleFontUrl: 'https://fonts.google.com/specimen/Plus+Jakarta+Sans',
  },
  {
    id: 'inter',
    name: 'Inter',
    family: "'Inter', sans-serif",
    category: 'Sans-Serif',
    creator: 'Rasmus Andersson',
    source: 'Google Fonts',
    bestFor: 'Complex Web Apps, Enterprise Dashboards, Data Heavy UIs',
    description: 'Specially crafted for computer screens, Inter features a tall x-height to aid in reading mixed-case and lower-case text. It is arguably the most dependable UI workhorse of the modern web.',
    weights: ['Thin 100', 'Regular 400', 'Medium 500', 'SemiBold 600', 'Bold 700', 'Black 900'],
    pairing: 'Playfair Display or Newsreader',
    stats: { legibility: 100, versatility: 99, modernity: 92 },
    sampleHeadline: 'The universal language of modern user interfaces.',
    sampleBody: 'Inter provides micro-adjusted letterforms designed specifically to prevent optical blur and visual fatigue on standard RGB screens.',
    tags: ['UI Master', 'Accessibility', 'Variable', 'Clean'],
    googleFontUrl: 'https://fonts.google.com/specimen/Inter',
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    family: "'Space Grotesk', sans-serif",
    category: 'Display',
    creator: 'Florian Karsten',
    source: 'Google Fonts',
    bestFor: 'Web3, FinTech, Creative Studios, Bold Headlines',
    description: 'A proportional sans-serif variant based on Colophon Foundry’s Space Mono. It retains monospace idiosyncrasies while offering smooth proportions for impactful titles.',
    weights: ['Light 300', 'Regular 400', 'Medium 500', 'SemiBold 600', 'Bold 700'],
    pairing: 'Inter or DM Sans',
    stats: { legibility: 90, versatility: 88, modernity: 98 },
    sampleHeadline: 'Architecting tomorrow with geometric precision.',
    sampleBody: 'Infusing brutalist edge and modern distinction into technical platforms, next-gen portfolios, and editorial features.',
    tags: ['Brutalist', 'Fintech', 'Distinctive', 'Tech'],
    googleFontUrl: 'https://fonts.google.com/specimen/Space+Grotesk',
  },
  {
    id: 'manrope',
    name: 'Manrope',
    family: "'Manrope', sans-serif",
    category: 'Geometric',
    creator: 'Mikhail Sharanda',
    source: 'Google Fonts',
    bestFor: 'Contemporary E-commerce, Clean Dashboards, Brand Landing Pages',
    description: 'An open-source modern geometric sans-serif typeface that bridges the gap between classic DIN styles and fresh neo-grotesque readability.',
    weights: ['ExtraLight 200', 'Regular 400', 'Medium 500', 'Bold 700', 'ExtraBold 800'],
    pairing: 'Fraunces or Garamond',
    stats: { legibility: 95, versatility: 94, modernity: 96 },
    sampleHeadline: 'Simplicity meets refined Scandinavian precision.',
    sampleBody: 'Engineered with balanced geometry and clear letter shapes to provide effortless readability in both headings and dense body paragraphs.',
    tags: ['Clean', 'E-commerce', 'Geometric', 'Balanced'],
    googleFontUrl: 'https://fonts.google.com/specimen/Manrope',
  },
  {
    id: 'outfit',
    name: 'Outfit',
    family: "'Outfit', sans-serif",
    category: 'Geometric',
    creator: 'Rodrigo Fuenzalida',
    source: 'Google Fonts',
    bestFor: 'Brand Identities, Mobile Web Apps, Modern Lifestyle Brands',
    description: 'The official brand typeface of the Outfit.io platform. An inspired geometric sans-serif that radiates warmth and clean-cut digital friendliness.',
    weights: ['Thin 100', 'Light 300', 'Regular 400', 'Medium 500', 'SemiBold 600', 'Bold 700', 'Black 900'],
    pairing: 'Merriweather or Lato',
    stats: { legibility: 94, versatility: 93, modernity: 97 },
    sampleHeadline: 'Elevating digital presence with friendly geometry.',
    sampleBody: 'Outfit delivers circular harmony and razor-sharp outlines tailored for modern screens and high-engagement consumer apps.',
    tags: ['Warm', 'Friendly', 'Contemporary', 'Lifestyle'],
    googleFontUrl: 'https://fonts.google.com/specimen/Outfit',
  },
  {
    id: 'syne',
    name: 'Syne',
    family: "'Syne', sans-serif",
    category: 'Display',
    creator: 'Bonjour Monde & Lucas Descroix',
    source: 'Google Fonts',
    bestFor: 'Art Galleries, Luxury Portfolios, Editorial Fashion Sites',
    description: 'Originally designed for the Art Center "Synesthésie", Syne features an explosive personality in its ExtraBold weights while remaining composed in Regular weights.',
    weights: ['Regular 400', 'Medium 500', 'SemiBold 600', 'Bold 700', 'ExtraBold 800'],
    pairing: 'Inter or Roboto',
    stats: { legibility: 85, versatility: 82, modernity: 100 },
    sampleHeadline: 'Defying the ordinary in bold editorial expression.',
    sampleBody: 'A captivating display typeface engineered to captivate audiences and establish undeniable brand identity in luxury and creative contexts.',
    tags: ['Editorial', 'Luxury', 'Avant-Garde', 'Creative'],
    googleFontUrl: 'https://fonts.google.com/specimen/Syne',
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    family: "'DM Sans', sans-serif",
    category: 'Geometric',
    creator: 'Colophon Foundry',
    source: 'Google Fonts',
    bestFor: 'High-speed Mobile UIs, News Apps, Clean Corporate Portals',
    description: 'A low-contrast geometric sans-serif design, intended for use at smaller text sizes where crispness and speed of visual processing are paramount.',
    weights: ['Regular 400', 'Medium 500', 'Bold 700'],
    pairing: 'Playfair Display or Fraunces',
    stats: { legibility: 97, versatility: 95, modernity: 94 },
    sampleHeadline: 'Effortless clarity on every viewport dimension.',
    sampleBody: 'Optimized for high-throughput digital interfaces where content hierarchy must be clear without visual clutter.',
    tags: ['Corporate', 'Mobile-First', 'Clean', 'Minimalist'],
    googleFontUrl: 'https://fonts.google.com/specimen/DM+Sans',
  },
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    family: "'Playfair Display', serif",
    category: 'Serif',
    creator: 'Claus Eggers Sørensen',
    source: 'Google Fonts',
    bestFor: 'Luxury Lifestyle, High-End Publishing, Boutique E-Commerce',
    description: 'Influenced by the transition in the late 18th century from broad-nib quills to pointed steel pens. Features delicate high-contrast serifs with undeniable elegance.',
    weights: ['Regular 400', 'Medium 500', 'SemiBold 600', 'Bold 700', 'Black 900'],
    pairing: 'Plus Jakarta Sans or Inter',
    stats: { legibility: 91, versatility: 89, modernity: 93 },
    sampleHeadline: 'Elegance refined through timeless typographic tradition.',
    sampleBody: 'Playfair Display introduces sophistication and editorial grace to premium websites, luxury portals, and culinary brands.',
    tags: ['Editorial', 'Luxury', 'Classic', 'Serif'],
    googleFontUrl: 'https://fonts.google.com/specimen/Playfair+Display',
  },
  {
    id: 'fraunces',
    name: 'Fraunces',
    family: "'Fraunces', serif",
    category: 'Variable',
    creator: 'Undercase Type',
    source: 'Google Fonts',
    bestFor: 'Warm Editorial Sites, Organic Brands, Craft Magazines',
    description: 'A "wonky" 20th-century retro display serif with dynamic optical sizing, softness axes, and rich personality for human-centric brands.',
    weights: ['Light 300', 'Regular 400', 'Medium 500', 'SemiBold 600', 'Bold 700', 'Black 900'],
    pairing: 'Manrope or Satoshi',
    stats: { legibility: 92, versatility: 90, modernity: 97 },
    sampleHeadline: 'Character, warmth, and artisanal storytelling.',
    sampleBody: 'Blends vintage 1970s warmth with cutting-edge variable font technology for modern creators who value personality.',
    tags: ['Artisanal', 'Variable', 'Retro-Modern', 'Storytelling'],
    googleFontUrl: 'https://fonts.google.com/specimen/Fraunces',
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    family: "'Merriweather', serif",
    category: 'Serif',
    creator: 'Eben Sorkin',
    source: 'Google Fonts',
    bestFor: 'Long-form Reading, Editorial Blogs, Academic Articles',
    description: 'Designed to be a text face that is pleasant to read on screens. Merriweather has a very large x-height, slightly condensed letterforms, and robust serifs.',
    weights: ['Light 300', 'Regular 400', 'Bold 700', 'Black 900'],
    pairing: 'Plus Jakarta Sans, Open Sans, or Inter',
    stats: { legibility: 99, versatility: 92, modernity: 88 },
    sampleHeadline: 'Engineered for seamless long-form immersion.',
    sampleBody: 'Reading extended journalism or technical whitepapers is a delight thanks to generous counters and sturdy serif feet.',
    tags: ['Long-form', 'Editorial', 'High-Legibility', 'Books'],
    googleFontUrl: 'https://fonts.google.com/specimen/Merriweather',
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    family: "'Montserrat', sans-serif",
    category: 'Geometric',
    creator: 'Julieta Ulanovsky',
    source: 'Google Fonts',
    bestFor: 'Bold Hero Headings, Posters, Navigation Menus, Agency Sites',
    description: 'Inspired by the vintage signs and posters from the historical Montserrat neighborhood in Buenos Aires. Full of bold architectural rhythm.',
    weights: ['Thin 100', 'Light 300', 'Regular 400', 'Medium 500', 'Bold 700', 'Black 900'],
    pairing: 'Lora, Merriweather, or Open Sans',
    stats: { legibility: 93, versatility: 95, modernity: 94 },
    sampleHeadline: 'Urban energy captured in geometric proportions.',
    sampleBody: 'Montserrat commands immediate attention in uppercase headings, hero banners, and brand taglines across global sites.',
    tags: ['Bold', 'Urban', 'Posters', 'Impactful'],
    googleFontUrl: 'https://fonts.google.com/specimen/Montserrat',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    family: "'Poppins', sans-serif",
    category: 'Geometric',
    creator: 'Indian Type Foundry',
    source: 'Google Fonts',
    bestFor: 'SaaS Startups, Mobile Apps, Interactive Portals',
    description: 'A pure geometric sans-serif that supports both Devanagari and Latin writing systems. Almost monolinear with clean circular letterforms.',
    weights: ['Light 300', 'Regular 400', 'Medium 500', 'SemiBold 600', 'Bold 700', 'ExtraBold 800'],
    pairing: 'Roboto, Open Sans, or Lora',
    stats: { legibility: 96, versatility: 95, modernity: 95 },
    sampleHeadline: 'Friendly curves engineered for universal clarity.',
    sampleBody: 'Poppins brings inviting warmth, consistent optical weight, and approachable character to every interactive state.',
    tags: ['Universal', 'SaaS', 'Startup', 'Friendly'],
    googleFontUrl: 'https://fonts.google.com/specimen/Poppins',
  },
];

interface BestFontsArticlePageProps {
  navigate: (path: string) => void;
}

export const BestFontsArticlePage: React.FC<BestFontsArticlePageProps> = ({ navigate }) => {
  const { success, info } = useToast();

  // Interactive Live Type Playground State
  const [selectedFont, setSelectedFont] = useState<FontItem>(FONTS_CATALOG[0]);
  const [previewText, setPreviewText] = useState('Design isn’t just what it looks like, it’s how it works.');
  const [fontSize, setFontSize] = useState<number>(36);
  const [fontWeight, setFontWeight] = useState<number>(600);
  const [lineHeight, setLineHeight] = useState<number>(1.25);
  const [letterSpacing, setLetterSpacing] = useState<number>(-0.02);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'playground' | 'pairing-guide' | 'psychology'>('catalog');

  // Copy CSS helper
  const copyCssSnippet = (font: FontItem) => {
    const css = `font-family: ${font.family};\nfont-weight: ${fontWeight};\nfont-size: ${fontSize}px;\nline-height: ${lineHeight};\nletter-spacing: ${letterSpacing}em;`;
    navigator.clipboard.writeText(css);
    success('CSS Copied!', `CSS for ${font.name} copied to clipboard.`);
  };

  const filteredFonts = FONTS_CATALOG.filter((f) => {
    const matchesCategory = filterCategory === 'All' || f.category === filterCategory;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen text-slate-900 selection:bg-emerald-500 selection:text-white pb-24">
      {/* Top Breadcrumb & Social Bar */}
      <div className="border-b border-slate-100 bg-slate-50/70 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <button onClick={() => navigate('/')} className="hover:text-slate-900 transition-colors">Home</button>
            <span>/</span>
            <span className="text-slate-400">Design Journal</span>
            <span>/</span>
            <span className="text-emerald-600 font-bold">Best Fonts for Websites</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                success('Link Copied', 'Article link copied to clipboard.');
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share</span>
            </button>
            <button
              onClick={() => info('Bookmarked', 'Article saved to your design bookmarks.')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-500" />
              <span>Save Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Article Hero */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-10">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200/60">
            Typography Masterclass
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            Web Design 2026
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            Design Systems
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          The 25 Best Fonts for Websites and Web Design in 2026
        </h1>

        <p className="text-xl sm:text-2xl text-slate-600 font-normal leading-relaxed mb-8">
          A comprehensive design-studio guide to typography, visual hierarchy, screen legibility, and geometric vs. humanist font psychology for high-converting digital products.
        </p>

        {/* Author / Metadata Card */}
        <div className="flex flex-wrap items-center justify-between py-6 border-y border-slate-200 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              OD
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">One Thing Design Editorial</div>
              <div className="text-xs text-slate-500">UI/UX Studio & Typography Research Lab</div>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-xs text-slate-500">
            <div><span className="font-semibold text-slate-700">Updated:</span> October 2026</div>
            <div><span className="font-semibold text-slate-700">Read Time:</span> 8 min read</div>
            <div><span className="font-semibold text-slate-700">Typefaces Tested:</span> 25+</div>
          </div>
        </div>
      </header>

      {/* Navigation Pills for Guide Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
              activeTab === 'catalog'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="inline-flex items-center justify-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Curated Font Catalog</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
              activeTab === 'playground'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="inline-flex items-center justify-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Live Type Playground</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('pairing-guide')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
              activeTab === 'pairing-guide'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="inline-flex items-center justify-center space-x-2">
              <Palette className="w-4 h-4 text-emerald-600" />
              <span>Font Pairing Matrix</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('psychology')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
              activeTab === 'psychology'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="inline-flex items-center justify-center space-x-2">
              <Lightbulb className="w-4 h-4 text-emerald-600" />
              <span>Typography Psychology</span>
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area Based on Active Tab */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ===================== TAB 1: CATALOG ===================== */}
        {activeTab === 'catalog' && (
          <div>
            {/* Filter and Search Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search font by name, vibe (e.g. 'SaaS', 'Luxury', 'Geometric')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
                {['All', 'Geometric', 'Sans-Serif', 'Serif', 'Display', 'Variable'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      filterCategory === cat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredFonts.map((font) => (
                <div
                  key={font.id}
                  className="bg-white border border-slate-200 hover:border-emerald-500/80 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/5 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                            {font.category}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">by {font.creator}</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {font.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFont(font);
                          setActiveTab('playground');
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition-all flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Test Live</span>
                      </button>
                    </div>

                    {/* Live Font Sample Showcase */}
                    <div
                      className="p-5 my-4 bg-slate-50/80 rounded-xl border border-slate-100 transition-all"
                      style={{ fontFamily: font.family }}
                    >
                      <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-2">
                        {font.sampleHeadline}
                      </div>
                      <div className="text-sm text-slate-600 leading-relaxed font-normal">
                        {font.sampleBody}
                      </div>
                    </div>

                    {/* Description & Best For */}
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {font.description}
                    </p>

                    <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs">
                      <span className="font-bold text-slate-900">Best For: </span>
                      <span className="text-slate-600">{font.bestFor}</span>
                    </div>

                    {/* Recommended Pairing */}
                    <div className="text-xs text-slate-500 mb-4 flex items-center space-x-1.5">
                      <span className="font-semibold text-slate-700">Perfect Pairing:</span>
                      <span className="text-emerald-700 font-medium">{font.pairing}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {font.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => copyCssSnippet(font)}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy CSS</span>
                    </button>
                    <a
                      href={font.googleFontUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      <span>Get on Google Fonts</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: LIVE PLAYGROUND ===================== */}
        {activeTab === 'playground' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Controls Column */}
              <div className="lg:w-1/3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
                  <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                  <span>Type Controls</span>
                </h3>

                {/* Font Selector */}
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Select Font Family
                  </label>
                  <select
                    value={selectedFont.id}
                    onChange={(e) => {
                      const found = FONTS_CATALOG.find((f) => f.id === e.target.value);
                      if (found) setSelectedFont(found);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    {FONTS_CATALOG.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Size Slider */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Font Size</span>
                    <span className="text-emerald-600">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="72"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                {/* Font Weight */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Font Weight</span>
                    <span className="text-emerald-600">{fontWeight}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[300, 400, 600, 700, 800].map((w) => (
                      <button
                        key={w}
                        onClick={() => setFontWeight(w)}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          fontWeight === w
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Line Height */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Line Height</span>
                    <span className="text-emerald-600">{lineHeight}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.0"
                    step="0.05"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                {/* Letter Spacing */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Letter Spacing (tracking)</span>
                    <span className="text-emerald-600">{letterSpacing}em</span>
                  </div>
                  <input
                    type="range"
                    min="-0.05"
                    max="0.10"
                    step="0.005"
                    value={letterSpacing}
                    onChange={(e) => setLetterSpacing(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                {/* Quick Presets */}
                <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">One Thing Presets:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setFontSize(48);
                        setFontWeight(800);
                        setLineHeight(1.1);
                        setLetterSpacing(-0.035);
                      }}
                      className="flex-1 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                    >
                      Hero Heading
                    </button>
                    <button
                      onClick={() => {
                        setFontSize(18);
                        setFontWeight(400);
                        setLineHeight(1.7);
                        setLetterSpacing(-0.01);
                      }}
                      className="flex-1 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                    >
                      Editorial Body
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Canvas Preview Column */}
              <div className="lg:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Live Output Canvas • {selectedFont.name}
                    </div>
                    <button
                      onClick={() => copyCssSnippet(selectedFont)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy CSS</span>
                    </button>
                  </div>

                  {/* Editable Input Box */}
                  <textarea
                    rows={3}
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    placeholder="Type anything here to test..."
                    className="w-full p-4 mb-6 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500"
                  />

                  {/* Rendered Live Box */}
                  <div className="p-8 bg-gradient-to-b from-slate-50/50 to-white rounded-2xl border border-slate-200 min-h-[220px] flex items-center justify-center text-center">
                    <div
                      style={{
                        fontFamily: selectedFont.family,
                        fontSize: `${fontSize}px`,
                        fontWeight: fontWeight,
                        lineHeight: lineHeight,
                        letterSpacing: `${letterSpacing}em`,
                      }}
                      className="text-slate-900 transition-all"
                    >
                      {previewText}
                    </div>
                  </div>
                </div>

                {/* CSS Output Box */}
                <div className="mt-8 bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono">
                  <div className="text-slate-400 mb-1">// CSS Rule</div>
                  <div>font-family: {selectedFont.family};</div>
                  <div>font-size: {fontSize}px;</div>
                  <div>font-weight: {fontWeight};</div>
                  <div>line-height: {lineHeight};</div>
                  <div>letter-spacing: {letterSpacing}em;</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: PAIRING GUIDE ===================== */}
        {activeTab === 'pairing-guide' && (
          <div className="space-y-8">
            <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Golden Rule of Typography
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
                  Contrast Creates Hierarchy, Harmony Creates Trust.
                </h2>
                <p className="text-emerald-100 text-base leading-relaxed">
                  Never pair two fonts that look almost identical. Instead, create purposeful contrast: pair a geometric sans-serif heading with a humanistic serif body, or a distinctive display title with an ultra-clean UI workhorse.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pair 1 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                    SaaS & Digital Agency Classic
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">Recommended</span>
                </div>
                <div className="space-y-4 mb-6">
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-3xl font-extrabold text-slate-900">
                    Plus Jakarta Sans (Heading)
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif" }} className="text-base text-slate-600 leading-relaxed">
                    Paired with Inter for crisp UI controls, metadata badges, and high-density dashboard metrics.
                  </div>
                </div>
                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                  <strong>Why it works:</strong> Shared neo-grotesque x-height with subtle geometric flair in headings and unmatched legibility in dense body copy.
                </div>
              </div>

              {/* Pair 2 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                    Modern Editorial & Boutique
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">High Aesthetic</span>
                </div>
                <div className="space-y-4 mb-6">
                  <div style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold text-slate-900">
                    Playfair Display (Heading)
                  </div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-base text-slate-600 leading-relaxed">
                    Paired with Plus Jakarta Sans to balance timeless European serif luxury with clean, modern digital clarity.
                  </div>
                </div>
                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                  <strong>Why it works:</strong> High-contrast transitional serifs anchored by rock-solid geometric body text.
                </div>
              </div>

              {/* Pair 3 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                    Fintech & Future Tech
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">High Authority</span>
                </div>
                <div className="space-y-4 mb-6">
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-3xl font-bold text-slate-900">
                    Space Grotesk (Title)
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-base text-slate-600 leading-relaxed">
                    Paired with DM Sans for rapid comprehension across mobile screens, transactional receipts, and pricing tables.
                  </div>
                </div>
                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                  <strong>Why it works:</strong> Monospace-inspired headlines give a technical edge, while DM Sans delivers zero-friction body readability.
                </div>
              </div>

              {/* Pair 4 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                    Long-Form Publishing & Blogs
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">Max Readability</span>
                </div>
                <div className="space-y-4 mb-6">
                  <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Montserrat (Heading)
                  </div>
                  <div style={{ fontFamily: "'Merriweather', serif" }} className="text-base text-slate-600 leading-relaxed">
                    Paired with Merriweather to give extended articles the comfortable, immersive reading cadence of a printed book.
                  </div>
                </div>
                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                  <strong>Why it works:</strong> Uppercase architectural punch at the top, effortless reading fatigue prevention throughout long paragraphs.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: PSYCHOLOGY & RULES ===================== */}
        {activeTab === 'psychology' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-xs space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Studio Principles</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1 mb-4">
                The Science of Web Typography & Cognitive Fluency
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                Typography accounts for over 90% of web design information transfer. When a font is effortlessly legible, cognitive load decreases, user comprehension increases, and conversion rates rise exponentially.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">The 1.25x Modular Scale</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Use proportional mathematical scales for heading hierarchy (e.g. Major Third: 16px body → 20px subtext → 25px h3 → 31px h2 → 39px h1 → 48px hero).
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Tight Tracking on Large Type</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  As font sizes increase above 32px, letter spacing must tighten (from -0.02em to -0.04em) to maintain visual density and editorial punch.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">The 65-Character Measure</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Limit reading line length to 55–75 characters per line (max-w-prose or max-w-2xl). Lines that are too wide cause readers to lose their place when jumping down.
                </p>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Typeface Category</th>
                    <th className="p-4">Psychological Association</th>
                    <th className="p-4">Best Industry Use Case</th>
                    <th className="p-4">Recommended Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Geometric Sans (Plus Jakarta Sans, Manrope)</td>
                    <td className="p-4">Modernity, innovation, precision, progressive vision</td>
                    <td className="p-4">SaaS, Tech startups, Digital products, AI</td>
                    <td className="p-4 font-mono text-xs">16px–56px</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Humanist / Neo-Grotesque (Inter, Roboto)</td>
                    <td className="p-4">Reliability, objectivity, transparency, utility</td>
                    <td className="p-4">Complex Dashboards, Enterprise tools, Financial UIs</td>
                    <td className="p-4 font-mono text-xs">14px–24px</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Transitional Serif (Playfair, Merriweather)</td>
                    <td className="p-4">Heritage, authority, luxury, intellectual rigor</td>
                    <td className="p-4">Editorial journalism, Fine art, Luxury goods, Law</td>
                    <td className="p-4 font-mono text-xs">18px–64px</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Technical Display (Space Grotesk, Syne)</td>
                    <td className="p-4">Disruption, bold character, avant-garde creativity</td>
                    <td className="p-4">Web3, Creative Portfolios, Posters, Fashion</td>
                    <td className="p-4 font-mono text-xs">32px–80px</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* CTA Box matching One Thing Design */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4 inline-block">
              WorkSphere Marketplace Typography
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Explore Verified Talent & Curated Gigs on WorkSphere
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Experience this world-class typography and 14-day buyer protection escrow across thousands of web development, UI/UX design, and AI projects.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate('/find-projects')}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center space-x-2"
              >
                <span>Browse Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/offers')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all"
              >
                Explore Service Gigs
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
