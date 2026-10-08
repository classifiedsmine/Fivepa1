import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, DollarSign, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { Project } from '../../types';

interface FindProjectsPageProps {
  navigate: (path: string) => void;
  onOpenPostProject: () => void;
  initialQuery?: string;
}

export const FindProjectsPage: React.FC<FindProjectsPageProps> = ({
  navigate,
  onOpenPostProject,
  initialQuery = '',
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedPricingModel, setSelectedPricingModel] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedExperience !== 'all') params.append('experience', selectedExperience);
      if (selectedPricingModel !== 'all') params.append('pricingModel', selectedPricingModel);

      const res = await fetch(`/api/marketplace/projects?${params.toString()}`);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, selectedExperience, selectedPricingModel]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e4e5e7]">
        <div>
          <h1 className="text-3xl font-black text-[#222325] tracking-tight">Buyer Requests & Projects</h1>
          <p className="text-[#74767e] text-sm mt-1">
            Browse customized requirements posted by verified buyers with 100% escrow protection
          </p>
        </div>
        <button
          onClick={onOpenPostProject}
          className="market-btn-primary px-5 py-2.5 text-sm font-bold shadow-xs transition flex items-center justify-center cursor-pointer"
        >
          Post a Request
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#e4e5e7] rounded-xl p-5 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#74767e] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords, technical stack (e.g. WordPress, React, AI, Python, Figma)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-[4px] border border-[#e4e5e7] text-sm focus:border-[#222325] focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#222325] hover:bg-[#1dbf73] text-white font-bold text-sm rounded-[4px] transition cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#e4e5e7] text-xs">
          <div>
            <label className="block text-[#74767e] font-semibold mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-[#f7f7f7] border border-[#e4e5e7] rounded font-medium text-[#222325] focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              <option value="Development & IT">Programming & Tech</option>
              <option value="AI & Machine Learning">AI Services</option>
              <option value="Design & Creative">Graphics & Design</option>
              <option value="Writing & Translation">Writing & Translation</option>
              <option value="Sales & Marketing">Digital Marketing</option>
            </select>
          </div>

          <div>
            <label className="block text-[#74767e] font-semibold mb-1">Pricing Model</label>
            <select
              value={selectedPricingModel}
              onChange={(e) => setSelectedPricingModel(e.target.value)}
              className="w-full p-2 bg-[#f7f7f7] border border-[#e4e5e7] rounded font-medium text-[#222325] focus:outline-hidden"
            >
              <option value="all">Any Pricing Model</option>
              <option value="MILESTONE">Milestone-Based</option>
              <option value="FIXED">Fixed Price</option>
              <option value="HOURLY">Hourly</option>
            </select>
          </div>

          <div>
            <label className="block text-[#74767e] font-semibold mb-1">Experience Level</label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full p-2 bg-[#f7f7f7] border border-[#e4e5e7] rounded font-medium text-[#222325] focus:outline-hidden"
            >
              <option value="all">All Experience Levels</option>
              <option value="ENTRY">Entry Level</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <div className="text-xs text-[#74767e] font-medium">
          Showing <strong>{projects.length}</strong> open requests
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#e4e5e7] rounded-xl">
            <Briefcase className="w-10 h-10 text-[#74767e] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#222325]">No requests match your filter criteria</h3>
            <p className="text-xs text-[#74767e] mt-1">Try broadening your search keywords or resetting filters.</p>
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/projects/${p.slug}`)}
              className="p-6 bg-white border border-[#e4e5e7] hover:border-[#1dbf73] rounded-xl cursor-pointer transition shadow-2xs hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-[#74767e] mb-1">
                    <span className="text-[#1dbf73] font-bold">{p.category}</span>
                    <span>/</span>
                    <span>{p.subcategory}</span>
                    <span>·</span>
                    <span>Posted {new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#222325] hover:text-[#1dbf73] transition">
                    {p.title}
                  </h2>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="text-2xl font-black text-[#222325]">${p.budget}</div>
                  <span className="text-xs text-[#74767e] font-medium block">
                    {p.pricingModel === 'MILESTONE' ? 'Milestone Budget' : 'Fixed Price'}
                  </span>
                </div>
              </div>

              <p className="text-[#62646a] text-sm leading-relaxed mb-4 line-clamp-3">
                {p.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#e4e5e7] text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {p.skills.map((s, idx) => (
                    <span key={idx} className="bg-[#f7f7f7] text-[#404145] text-xs px-2.5 py-1 rounded border border-[#e4e5e7] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-[#74767e]">
                  <span>Proposals: <strong className="text-[#222325]">{p.proposalsCount}</strong></span>
                  <span>Buyer: <strong className="text-[#222325]">{p.client.name}</strong> ({p.client.country})</span>
                  <span className="text-[#1dbf73] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1dbf73]" /> Verified Escrow
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
