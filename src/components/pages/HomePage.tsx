import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Star, Clock, Heart, ChevronRight, Briefcase, DollarSign, CheckCircle2, LayoutGrid, List } from 'lucide-react';
import { Offer, Project } from '../../types';

interface HomePageProps {
  navigate: (path: string) => void;
  onOpenPostProject: () => void;
  onOpenCreateOffer: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  navigate,
  onOpenPostProject,
  onOpenCreateOffer,
}) => {
  const { activeMode } = useAuth();
  const [featuredOffers, setFeaturedOffers] = useState<Offer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [savedGigs, setSavedGigs] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetch('/api/marketplace/offers')
      .then((res) => res.json())
      .then((data) => setFeaturedOffers(data.offers || []));

    fetch('/api/marketplace/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []));
  }, []);

  return (
    <div className="space-y-12 pb-24 bg-[#fafafa] min-h-screen">
      {/* Header Introduction */}
      <section className="bg-white border-b border-[#e4e5e7] py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#222325] tracking-tight mb-2">
                Professional Freelance Services & Expert Gigs
              </h1>
              <p className="text-[#74767e] text-sm sm:text-base max-w-2xl">
                Browse verified project services and connect with top-rated independent experts for your business.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenPostProject}
                className="px-5 py-2.5 rounded-md bg-[#222325] hover:bg-black text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Post a Project Request
              </button>
              <button
                onClick={() => navigate('/offers')}
                className="px-5 py-2.5 rounded-md bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Explore All Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Gigs Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#222325] tracking-tight">
              Featured Services & Gigs
            </h2>
            <p className="text-[#74767e] text-sm mt-1">
              Top-rated gig packages ready to order with instant turnaround
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle Switch */}
            <div className="flex items-center bg-white border border-[#e4e5e7] rounded-lg p-1 shadow-2xs">
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
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
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
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            <button
              onClick={() => navigate('/offers')}
              className="text-[#1dbf73] hover:underline font-bold text-sm flex items-center gap-1 cursor-pointer"
            >
              <span>See more services</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gigs Display (Grid or Listicle View) */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredOffers.map((offer) => {
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
                            src={offer.freelancer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={offer.freelancer?.name || 'Seller'}
                            className="w-7 h-7 rounded-full object-cover border border-[#e4e5e7]"
                          />
                          <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#1dbf73] rounded-full border border-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-[#222325] truncate">
                            {offer.freelancer?.name || 'Top Seller'}
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
        ) : (
          /* Listicle View Layout */
          <div className="space-y-4">
            {featuredOffers.map((offer) => {
              const isSaved = !!savedGigs[offer.id];
              const startingPrice = offer.price || offer.packages?.basic?.price || offer.packages?.standard?.price || 75;
              const deliveryDays = offer.deliveryDays || offer.packages?.basic?.deliveryDays || 3;
              const coverImage = offer.images?.[0] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={offer.id}
                  onClick={() => navigate(`/offers/${offer.slug}`)}
                  className="bg-white rounded-xl border border-[#e4e5e7] hover:border-[#b5b6ba] hover:shadow-md transition duration-200 cursor-pointer flex flex-col sm:flex-row overflow-hidden group"
                >
                  {/* Left Thumbnail Image */}
                  <div className="relative w-full sm:w-48 h-44 sm:h-36 shrink-0 bg-slate-100 overflow-hidden">
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

                  {/* Middle Details Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="relative">
                          <img
                            src={offer.freelancer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={offer.freelancer?.name || 'Seller'}
                            className="w-7 h-7 rounded-full object-cover border border-[#e4e5e7]"
                          />
                          <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#1dbf73] rounded-full border border-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-[#222325] truncate">
                            {offer.freelancer?.name || 'Top Seller'}
                          </div>
                          <span className="text-[11px] text-[#74767e] block">
                            Level 2 Seller
                          </span>
                        </div>
                      </div>

                      <h3 className="text-base text-[#222325] font-bold leading-snug group-hover:text-[#1dbf73] transition mb-2">
                        {offer.title}
                      </h3>

                      <p className="text-xs text-[#62646a] line-clamp-2 leading-relaxed">
                        {offer.description || 'Verified production-ready service package with transparent deliverables, fast turnaround, and buyer escrow protection.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#222325]">
                      <div className="flex items-center gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-[#222325] text-[#222325]" />
                        <span>{offer.rating?.toFixed(1) || '5.0'}</span>
                        <span className="text-[#74767e] font-normal">({offer.reviewCount || 48})</span>
                      </div>
                      <span className="text-[#e4e5e7]">|</span>
                      <span className="text-[#1dbf73] font-semibold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Express Escrow Guaranteed
                      </span>
                    </div>
                  </div>

                  {/* Right Pricing & Action */}
                  <div className="p-5 sm:w-48 shrink-0 bg-[#fbfbfb] sm:border-l border-t sm:border-t-0 border-[#e4e5e7] flex flex-col justify-between items-start sm:items-end text-left sm:text-right">
                    <div>
                      <span className="text-[#74767e] uppercase text-[10px] font-bold tracking-wider block">
                        Starting From
                      </span>
                      <div className="text-[#222325] font-black text-2xl mt-0.5">${startingPrice}</div>
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
      </section>

      {/* Buyer Requests & Projects Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#222325] tracking-tight">
              Buyer Requests & Open Projects
            </h2>
            <p className="text-[#74767e] text-sm mt-1">
              Custom requirements posted by clients looking for qualified freelancers
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenPostProject}
              className="px-4 py-2 bg-[#222325] hover:bg-black text-white font-bold text-xs rounded transition cursor-pointer"
            >
              Post a Request
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="text-[#1dbf73] hover:underline font-bold text-sm flex items-center gap-1 cursor-pointer"
            >
              <span>View all requests</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#e4e5e7] rounded-xl">
              <Briefcase className="w-10 h-10 text-[#74767e] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#222325]">No buyer requests available</h3>
              <p className="text-xs text-[#74767e] mt-1">Be the first to post a new project request.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.slug}`)}
                className="p-6 bg-white border border-[#e4e5e7] hover:border-[#1dbf73] rounded-xl cursor-pointer transition shadow-2xs hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-[#74767e] mb-1">
                      <span className="text-[#1dbf73] font-bold">{project.category}</span>
                      {project.subcategory && (
                        <>
                          <span>/</span>
                          <span>{project.subcategory}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#222325] hover:text-[#1dbf73] transition">
                      {project.title}
                    </h3>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-2xl font-black text-[#222325]">${project.budget}</div>
                    <span className="text-xs text-[#74767e] font-medium block">
                      {project.pricingModel === 'MILESTONE' ? 'Milestone Budget' : 'Fixed Price'}
                    </span>
                  </div>
                </div>

                <p className="text-[#62646a] text-sm leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#e4e5e7] text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills?.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-[#f7f7f7] text-[#404145] text-xs px-2.5 py-1 rounded border border-[#e4e5e7] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-[#74767e]">
                    <span>Proposals: <strong className="text-[#222325]">{project.proposalsCount}</strong></span>
                    {project.client?.name && (
                      <span>Buyer: <strong className="text-[#222325]">{project.client.name}</strong> ({project.client.country})</span>
                    )}
                    <span className="text-[#1dbf73] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1dbf73]" /> Verified Escrow
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
