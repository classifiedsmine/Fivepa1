import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Star,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Heart,
  ShieldAlert,
} from 'lucide-react';
import { User, Offer, Review } from '../../types';

interface UserProfileViewProps {
  username: string;
  navigate: (path: string) => void;
  onOpenPostProject: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  username,
  navigate,
  onOpenPostProject,
}) => {
  const { allUsers, currentUser, impersonateUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [userOffers, setUserOffers] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [savedGigs, setSavedGigs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const found = allUsers.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (found) {
      setUser(found);
      // Fetch user's offers
      fetch(`/api/marketplace/offers`)
        .then((res) => res.json())
        .then((data) => {
          const matching = (data.offers || []).filter((o: Offer) => o.freelancerId === found.id);
          setUserOffers(matching);
        });
    }
  }, [username, allUsers]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={() => navigate('/find-freelancers')}
        className="text-slate-500 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Freelancers
      </button>

      {/* Main Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-32 h-32 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm shrink-0"
          />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                  {(currentUser.adminRoles?.length || currentUser.activeMode === 'ADMIN') && (
                    <button
                      onClick={async () => {
                        await impersonateUser(user.id);
                        navigate('/');
                      }}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                      title="Act as real profile or user"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" /> Act as User
                    </button>
                  )}
                </div>
                <p className="text-emerald-700 font-semibold text-sm mt-0.5">{user.title}</p>
              </div>

              <div className="sm:text-right">
                <div className="text-3xl font-black text-slate-900">
                  ${user.hourlyRate} <span className="text-sm font-normal text-slate-500">/ hr</span>
                </div>
                <span className="text-xs text-emerald-700 font-semibold">100% Job Success Score</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {user.city}, {user.country}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {user.rating} ({user.reviewCount} client reviews)
              </span>
              <span>·</span>
              <span>Response: ~{user.responseTimeHours}h</span>
              <span>·</span>
              <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed mb-6 whitespace-pre-line">
              {user.bio}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {user.skills.map((s, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded-lg font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Published Service Offers - Formatted exactly like Homepage Featured Services & Gigs */}
      {userOffers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Published Service Offers ({userOffers.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {userOffers.map((offer) => {
              const isSaved = !!savedGigs[offer.id];
              const startingPrice = offer.price || offer.packages?.basic?.price || offer.packages?.standard?.price || 75;
              const deliveryDays = offer.deliveryDays || offer.packages?.basic?.deliveryDays || 3;
              const coverImage = offer.images?.[0] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={offer.id}
                  onClick={() => navigate(`/offers/${offer.slug}`)}
                  className="overflow-hidden group cursor-pointer flex flex-col justify-between bg-white rounded-xl border border-[#e4e5e7] hover:border-[#b5b6ba] transition shadow-xs"
                >
                  <div>
                    {/* Gig Cover Image with Wishlist */}
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                      <img
                        src={coverImage}
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#1dbf73]" />
                          {deliveryDays}d delivery
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSavedGigs((prev) => ({ ...prev, [offer.id]: !prev[offer.id] }));
                        }}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center transition shadow-md z-10 cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 transition ${
                            isSaved ? 'fill-red-500 text-red-500' : 'text-[#74767e] hover:text-[#222325]'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Gig Details Body */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <img
                            src={offer.freelancer?.avatar || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={offer.freelancer?.name || user.name || 'Seller'}
                            className="w-7 h-7 rounded-full object-cover border border-[#e4e5e7]"
                          />
                          <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#1dbf73] rounded-full border border-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-[#222325] truncate">
                            {offer.freelancer?.name || user.name || 'Top Seller'}
                          </div>
                          <span className="text-[11px] text-[#74767e] block">
                            Level 2 Seller
                          </span>
                        </div>
                      </div>

                      <h3 className="text-[14px] text-[#222325] font-normal leading-snug line-clamp-2 group-hover:text-[#1dbf73] transition">
                        {offer.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-[#222325] font-bold">
                        <Star className="w-3.5 h-3.5 fill-[#222325] text-[#222325]" />
                        <span>{offer.rating?.toFixed(1) || '5.0'}</span>
                        <span className="text-[#74767e] font-normal">({offer.reviewCount || 48})</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Starting Price */}
                  <div className="px-4 py-3 border-t border-[#e4e5e7] flex items-center justify-between text-xs bg-white">
                    <span className="text-[#74767e] uppercase text-[11px] font-bold tracking-wider">
                      From
                    </span>
                    <div className="text-right">
                      <span className="text-[#222325] font-black text-base">${startingPrice}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Verified Reviews Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Client Reviews & Work History</h2>
        <div className="divide-y divide-slate-100">
          <div className="py-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">David Chen</span>
                <span className="text-xs text-slate-400">· VP of Engineering</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                5.0
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "Elena is the best cloud engineer I have ever collaborated with. Flawless architecture, clean documentation, sub-60ms response times, and exceptional reliability."
            </p>
            <span className="text-[10px] text-slate-400 block">Verified Completed Contract · Sept 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
