import React, { useState, useEffect } from 'react';
import { Search, Star, CheckCircle2, MapPin, DollarSign, Clock, MessageSquare } from 'lucide-react';
import { User } from '../../types';

interface FindFreelancersPageProps {
  navigate: (path: string) => void;
}

export const FindFreelancersPage: React.FC<FindFreelancersPageProps> = ({ navigate }) => {
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const fetchFreelancers = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (selectedSkill) params.append('skill', selectedSkill);

      const res = await fetch(`/api/marketplace/freelancers?${params.toString()}`);
      const data = await res.json();
      setFreelancers(data.freelancers || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, [selectedSkill]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFreelancers();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-[#e4e5e7]">
        <h1 className="text-3xl font-black text-[#222325] tracking-tight">
          Find Top-Rated Freelancers & Expert Talent
        </h1>
        <p className="text-[#74767e] text-sm mt-1">
          Work with verified professionals, agencies, and top-rated sellers backed by Escrow Protection
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#e4e5e7] rounded-xl p-5 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#74767e] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search talent by name, service, or skill (e.g. WordPress, React, Figma, SEO)..."
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

        <div className="flex flex-wrap gap-2 text-xs">
          {['', 'Google Cloud Run', 'React', 'TypeScript', 'Figma', 'Gemini API', 'PostgreSQL', 'SEO Audit'].map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-3 py-1.5 rounded-[4px] border transition cursor-pointer ${
                selectedSkill === skill
                  ? 'bg-[#1dbf73] text-white border-[#1dbf73] font-bold'
                  : 'bg-[#f7f7f7] text-[#404145] border-[#e4e5e7] hover:border-[#1dbf73]'
              }`}
            >
              {skill === '' ? 'All Skills' : skill}
            </button>
          ))}
        </div>
      </div>

      {/* Freelancers List */}
      <div className="space-y-4">
        {freelancers.map((user) => (
          <div
            key={user.id}
            onClick={() => navigate(`/freelancers/${user.username}`)}
            className="p-6 bg-white border border-[#e4e5e7] hover:border-[#1dbf73] rounded-xl cursor-pointer transition shadow-2xs hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#1dbf73]"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#1dbf73] rounded-full border-2 border-white" />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#222325] hover:text-[#1dbf73] transition">
                      {user.name}
                    </h2>
                    <span className="text-[#1dbf73] font-bold text-xs flex items-center gap-1 bg-[#f0fbf7] px-2 py-0.5 rounded border border-[#1dbf73]/20">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1dbf73]" /> Verified Professional
                    </span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-2xl font-black text-[#222325]">${user.hourlyRate}</span>
                    <span className="text-xs text-[#74767e] font-normal"> / hr</span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-[#1dbf73] mb-2">{user.title}</p>
                <div className="flex items-center gap-4 text-xs text-[#74767e] mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#74767e]" />
                    {user.city}, {user.country}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-[#222325] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#222325] text-[#222325]" />
                    {user.rating} ({user.reviewCount} reviews)
                  </span>
                  <span>·</span>
                  <span>Response time: ~{user.responseTimeHours}h</span>
                </div>

                <p className="text-[#62646a] text-sm leading-relaxed mb-4 line-clamp-2">
                  {user.bio}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {user.skills.map((s, idx) => (
                    <span key={idx} className="bg-[#f7f7f7] text-[#404145] text-xs px-2.5 py-1 rounded border border-[#e4e5e7] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
