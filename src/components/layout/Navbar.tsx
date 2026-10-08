import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Heart,
  MessageSquare,
  Bell,
  ChevronDown,
  ShieldCheck,
  Wallet as WalletIcon,
  PlusCircle,
  Layers,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenPostProject: () => void;
  onOpenCreateOffer: () => void;
}

const MARKETPLACE_CATEGORIES = [
  { id: 'graphics-design', name: 'Graphics & Design', path: '/category/design-creative' },
  { id: 'prog-tech', name: 'Programming & Tech', path: '/offers' },
  { id: 'digital-marketing', name: 'Digital Marketing', path: '/category/sales-marketing' },
  { id: 'video-animation', name: 'Video & Animation', path: '/category/video-animation' },
  { id: 'writing-translation', name: 'Writing & Translation', path: '/category/writing-translation' },
  { id: 'music-audio', name: 'Music & Audio', path: '/category/music-audio' },
  { id: 'business', name: 'Business', path: '/category/business' },
  { id: 'consulting', name: 'Consulting', path: '/category/consulting' },
  { id: 'ai-services', name: 'AI Services', path: '/category/ai-machine-learning' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  navigate,
  onOpenPostProject,
  onOpenCreateOffer,
}) => {
  const {
    currentUser,
    wallet,
    activeMode,
    switchMode,
    allUsers,
    switchUser,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    isImpersonating,
    impersonatedAdmin,
    exitImpersonation,
  } = useAuth();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showExploreDropdown, setShowExploreDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/offers?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e4e5e7] shadow-xs">
      {/* Impersonation Active Banner */}
      {isImpersonating && (
        <div className="bg-amber-600 text-white px-4 py-2 text-xs sm:text-sm font-semibold flex flex-wrap items-center justify-between gap-2 shadow-inner border-b border-amber-700 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-200 shrink-0" />
            <span>
              <strong>ADMIN IMPERSONATION MODE:</strong> You are currently acting as <strong>{currentUser.name}</strong> (@{currentUser.username}) [Mode: {activeMode}]. All actions performed are logged.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                exitImpersonation();
                navigate('/admin');
              }}
              className="px-3 py-1 bg-white text-amber-900 font-extrabold rounded-lg text-xs hover:bg-amber-100 transition shadow-xs"
            >
              Exit Impersonation & Return to Admin
            </button>
          </div>
        </div>
      )}

      {/* Top Escrow & Pro Trust Bar */}
      <div className="bg-[#f7f7f7] text-[#62646a] border-b border-[#e4e5e7] text-xs py-1 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#1dbf73]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1dbf73]" />
              Escrow Buyer Protection & Guaranteed Quality
            </span>
            <span className="text-[#dadbdd] hidden sm:inline">|</span>
            <span className="text-[#74767e] hidden md:inline">
              Single Unified Account: Seamlessly buy gigs, hire top talent, and sell services from one profile.
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Active Persona Demo Switcher */}
            <div className="flex items-center gap-1.5 text-[#74767e]">
              <span className="text-[11px] font-semibold text-[#62646a]">Persona:</span>
              <select
                value={currentUser.id}
                onChange={(e) => switchUser(e.target.value)}
                className="bg-white text-[#222325] text-xs px-2 py-0.5 rounded border border-[#e4e5e7] focus:outline-hidden font-medium cursor-pointer shadow-2xs hover:border-[#1dbf73]"
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.adminRoles?.length ? 'Admin' : u.activeMode})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-4 sm:gap-6">
          {/* Logo */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => navigate('/')}
              className="flex items-baseline text-[#222325] hover:opacity-95 transition focus:outline-hidden cursor-pointer"
            >
              <span className="font-black text-[32px] tracking-tighter leading-none font-sans">
                workstream
              </span>
              <span className="text-[#1dbf73] font-black text-[34px] leading-none">.</span>
            </button>
          </div>

          {/* Centered / Expanded Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              <div className="relative w-full flex items-center border border-[#e4e5e7] hover:border-[#b5b6ba] focus-within:border-[#222325] rounded-[4px] bg-white transition shadow-2xs">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service are you looking for today?"
                  className="w-full bg-transparent text-[#222325] text-[14px] pl-4 pr-12 py-2.5 focus:outline-hidden placeholder:text-[#74767e]"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 px-4 bg-[#222325] hover:bg-[#1dbf73] text-white flex items-center justify-center rounded-r-[3px] transition cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 text-[14px] font-semibold text-[#62646a]">
            {/* Explore dropdown */}
            <div className="relative hidden xl:block">
              <button
                onClick={() => setShowExploreDropdown(!showExploreDropdown)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[#62646a] hover:text-[#1dbf73] transition cursor-pointer"
              >
                <span>Explore</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#74767e]" />
              </button>
              {showExploreDropdown && (
                <div className="absolute left-0 mt-2 w-52 bg-white border border-[#e4e5e7] rounded-lg shadow-xl py-2 z-50">
                  <button
                    onClick={() => {
                      navigate('/offers');
                      setShowExploreDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#f7f7f7] text-xs font-semibold text-[#222325]"
                  >
                    Curated Gigs Directory
                  </button>
                  <button
                    onClick={() => {
                      navigate('/find-projects');
                      setShowExploreDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#f7f7f7] text-xs font-semibold text-[#222325]"
                  >
                    Buyer Project Requests
                  </button>
                  <button
                    onClick={() => {
                      navigate('/find-freelancers');
                      setShowExploreDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#f7f7f7] text-xs font-semibold text-[#222325]"
                  >
                    Top Freelancers & Agencies
                  </button>
                  <button
                    onClick={() => {
                      navigate('/escrow-policy');
                      setShowExploreDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#f7f7f7] text-xs font-semibold text-[#222325]"
                  >
                    14-Day Escrow Protection
                  </button>
                </div>
              )}
            </div>

            {/* Orders / Contracts */}
            <button
              onClick={() => navigate('/contracts')}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 transition rounded cursor-pointer ${
                currentPath.startsWith('/contracts') ? 'text-[#1dbf73] font-bold' : 'hover:text-[#1dbf73]'
              }`}
            >
              Orders
            </button>

            {/* Switch Selling / Buying Toggle */}
            <button
              onClick={() => switchMode(activeMode === 'CLIENT' ? 'FREELANCER' : 'CLIENT')}
              className="hidden md:flex text-xs font-bold text-[#1dbf73] hover:underline cursor-pointer"
            >
              {activeMode === 'CLIENT' ? 'Switch to Selling' : 'Switch to Buying'}
            </button>

            {/* Messages */}
            <button
              onClick={() => navigate('/messages')}
              className={`p-2 rounded-full hover:bg-[#f7f7f7] hover:text-[#222325] transition relative cursor-pointer ${
                currentPath === '/messages' ? 'text-[#1dbf73] bg-[#f0fbf7]' : 'text-[#74767e]'
              }`}
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Saved / Lists */}
            <button
              onClick={() => navigate('/offers?saved=true')}
              className="p-2 rounded-full text-[#74767e] hover:bg-[#f7f7f7] hover:text-[#e00] transition cursor-pointer"
              title="Saved Gigs"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2 rounded-full text-[#74767e] hover:bg-[#f7f7f7] hover:text-[#222325] transition relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#1dbf73] text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#e4e5e7] rounded-xl shadow-xl z-50 p-2">
                  <div className="flex items-center justify-between p-2 border-b border-[#e4e5e7]">
                    <span className="font-bold text-xs text-[#222325]">Notifications</span>
                    <span className="text-[11px] text-[#74767e]">{notifications.length} alerts</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#f7f7f7]">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[#74767e]">No notifications yet</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.link) navigate(n.link);
                            setShowNotifDropdown(false);
                          }}
                          className={`p-3 text-xs cursor-pointer hover:bg-[#f7f7f7] transition rounded-lg ${
                            !n.isRead ? 'bg-[#f0fbf7] font-medium' : ''
                          }`}
                        >
                          <div className="font-semibold text-[#222325] mb-0.5">{n.title}</div>
                          <p className="text-[#62646a] leading-snug line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-[#74767e] mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wallet Balance Badge */}
            <button
              onClick={() => navigate('/wallet')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f0fbf7] hover:bg-[#e1f7ed] border border-[#1dbf73]/30 text-[#1dbf73] text-xs font-bold transition cursor-pointer"
              title="Escrow Wallet Balance"
            >
              <WalletIcon className="w-3.5 h-3.5 text-[#1dbf73]" />
              <span>${wallet ? wallet.availableBalance.toFixed(2) : '0.00'}</span>
            </button>

            {/* Post / Create Action */}
            {activeMode === 'CLIENT' ? (
              <button
                onClick={onOpenPostProject}
                className="hidden sm:inline-flex items-center justify-center border border-[#1dbf73] text-[#1dbf73] hover:bg-[#1dbf73] hover:text-white px-3.5 py-1.5 text-xs font-bold rounded-[4px] transition cursor-pointer"
              >
                Post a Request
              </button>
            ) : (
              <button
                onClick={onOpenCreateOffer}
                className="hidden sm:inline-flex items-center justify-center bg-[#1dbf73] hover:bg-[#19a463] text-white px-3.5 py-1.5 text-xs font-bold rounded-[4px] transition shadow-2xs cursor-pointer"
              >
                + Create a Gig
              </button>
            )}

            {/* User Profile Avatar with dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1 p-0.5 rounded-full hover:ring-2 hover:ring-[#1dbf73] transition focus:outline-hidden cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#e4e5e7]"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#1dbf73] rounded-full border-2 border-white" />
                </div>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#e4e5e7] rounded-xl shadow-xl z-50 p-2 text-xs">
                  <div className="p-3 border-b border-[#e4e5e7]">
                    <div className="font-bold text-[#222325] text-sm">{currentUser.name}</div>
                    <div className="text-[11px] text-[#74767e] font-mono">@{currentUser.username}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-[#1dbf73] font-bold bg-[#f0fbf7] px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-[#1dbf73]" /> Verified Professional
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate(`/freelancers/${currentUser.username}`);
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[#404145] hover:bg-[#f7f7f7] rounded-lg transition"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/offers');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[#404145] hover:bg-[#f7f7f7] rounded-lg transition"
                    >
                      Explore Gigs & Services
                    </button>
                    <button
                      onClick={() => {
                        navigate('/contracts');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[#404145] hover:bg-[#f7f7f7] rounded-lg transition"
                    >
                      Manage Orders & Deliveries
                    </button>
                    <button
                      onClick={() => {
                        navigate('/wallet');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[#404145] hover:bg-[#f7f7f7] rounded-lg transition"
                    >
                      Billing & Escrow Balance
                    </button>
                    <button
                      onClick={() => {
                        navigate('/disputes');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[#404145] hover:bg-[#f7f7f7] rounded-lg transition"
                    >
                      Resolution Center
                    </button>
                    {currentUser.adminRoles && currentUser.adminRoles.length > 0 && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-[#1dbf73] font-bold hover:bg-[#f0fbf7] rounded-lg transition"
                      >
                        Admin Control Center
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Marketplace Category Horizontal Subnavigation Bar */}
      <div className="bg-white border-t border-[#e4e5e7] hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-none py-2.5 gap-6 text-[14px] text-[#62646a]">
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(cat.path)}
                className={`whitespace-nowrap transition cursor-pointer font-medium hover:text-[#1dbf73] border-b-2 py-0.5 ${
                  currentPath === cat.path
                    ? 'border-[#1dbf73] text-[#1dbf73] font-bold'
                    : 'border-transparent text-[#62646a]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
