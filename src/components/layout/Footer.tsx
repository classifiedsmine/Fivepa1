import React from 'react';
import {
  ShieldCheck,
  Globe,
  DollarSign,
  Heart,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Award,
} from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-white text-[#74767e] pt-16 pb-10 border-t border-[#e4e5e7] mt-auto text-[14px]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-14 border-b border-[#e4e5e7]">
          {/* Column 1: Categories */}
          <div>
            <h4 className="text-[#404145] font-bold text-[16px] mb-4">Categories</h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <button
                  onClick={() => navigate('/category/design-creative')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Graphics & Design
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/offers')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Programming & Tech
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/sales-marketing')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Digital Marketing
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/video-animation')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Video & Animation
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/writing-translation')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Writing & Translation
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/music-audio')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Music & Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/ai-machine-learning')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer font-medium text-[#1dbf73]"
                >
                  AI Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/business')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Business
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: About */}
          <div>
            <h4 className="text-[#404145] font-bold text-[16px] mb-4">About</h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Press & News
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Partnerships
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/dispute-policy')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Intellectual Property Claims
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Investor Relations
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Education */}
          <div>
            <h4 className="text-[#404145] font-bold text-[16px] mb-4">Support & Education</h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <button
                  onClick={() => navigate('/support')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Help & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/escrow-policy')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer font-semibold text-[#1dbf73]"
                >
                  14-Day Escrow Protection
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Trust & Safety
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/find-projects')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Selling Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/offers')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Buying Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Platform Guides
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Community */}
          <div>
            <h4 className="text-[#404145] font-bold text-[16px] mb-4">Community</h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <button
                  onClick={() => navigate('/find-freelancers')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Customer Success Stories
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/find-freelancers')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Community Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/messages')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Forum & Conversations
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/post/best-fonts-for-websites')}
                  className="hover:underline hover:text-[#1dbf73] transition text-left cursor-pointer font-medium"
                >
                  Best Fonts for Websites
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Podcast & Creator Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Business Solutions */}
          <div>
            <h4 className="text-[#404145] font-bold text-[16px] mb-4">Business Solutions</h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <button
                  onClick={() => navigate('/offers')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Enterprise Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contracts')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Verified Network
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/wallet')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Corporate WorkStream
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/disputes')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Resolution Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="hover:underline hover:text-[#222325] transition text-left cursor-pointer"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Settings */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[14px]">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-baseline text-[#222325] cursor-pointer"
            >
              <span className="font-black text-[26px] tracking-tighter leading-none">workstream</span>
              <span className="text-[#1dbf73] font-black text-[28px] leading-none">.</span>
            </button>
            <span className="text-[13px] text-[#b5b6ba]">
              © WorkStream Ltd. {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[#74767e]">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <span className="hover:text-[#222325] cursor-pointer transition">
                <Twitter className="w-5 h-5" />
              </span>
              <span className="hover:text-[#222325] cursor-pointer transition">
                <Facebook className="w-5 h-5" />
              </span>
              <span className="hover:text-[#222325] cursor-pointer transition">
                <Linkedin className="w-5 h-5" />
              </span>
              <span className="hover:text-[#222325] cursor-pointer transition">
                <Instagram className="w-5 h-5" />
              </span>
            </div>

            {/* Language & Currency Controls */}
            <div className="flex items-center gap-4 text-xs font-bold text-[#62646a]">
              <button className="flex items-center gap-1.5 hover:text-[#222325] cursor-pointer">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </button>
              <button className="flex items-center gap-1 hover:text-[#222325] cursor-pointer">
                <DollarSign className="w-4 h-4" />
                <span>USD</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
