/**
 * Authoritative Server-Side In-Memory Database & Seed Engine
 * with Double-Entry Ledger and Escrow Rules.
 */

import {
  User,
  Project,
  Offer,
  Proposal,
  Contract,
  Milestone,
  Deliverable,
  Dispute,
  DisputeEvidence,
  LedgerEntry,
  Wallet,
  WithdrawalRequest,
  Conversation,
  Message,
  Notification,
  Review,
  SupportTicket,
  AdminAuditLog,
  SystemKPIs,
  FAQItem,
  LegalDocument,
  Announcement,
  NotificationTemplate,
  NotificationDeliveryLog,
  ReportedMessage,
  FraudRiskReport,
  AdminUserRole,
  MarketplaceSettings,
  Category,
  Subcategory,
  AdminPermission,
  WebhookEventLog,
  PaymentReconciliationItem,
  EntityReport,
  BackupHealthStatus,
} from '../types';

class MarketplaceDB {
  public users: User[] = [];
  public projects: Project[] = [];
  public offers: Offer[] = [];
  public proposals: Proposal[] = [];
  public contracts: Contract[] = [];
  public disputes: Dispute[] = [];
  public wallets: Map<string, Wallet> = new Map();
  public ledger: LedgerEntry[] = [];
  public withdrawals: WithdrawalRequest[] = [];
  public conversations: Conversation[] = [];
  public messages: Message[] = [];
  public notifications: Notification[] = [];
  public reviews: Review[] = [];
  public supportTickets: SupportTicket[] = [];
  public auditLogs: AdminAuditLog[] = [];
  public categories: Category[] = [];
  public faqs: FAQItem[] = [];
  public legalDocuments: LegalDocument[] = [];
  public announcements: Announcement[] = [];
  public notificationTemplates: NotificationTemplate[] = [];
  public notificationLogs: NotificationDeliveryLog[] = [];
  public reportedMessages: ReportedMessage[] = [];
  public fraudReports: FraudRiskReport[] = [];
  public adminStaff: AdminUserRole[] = [];
  public webhookLogs: WebhookEventLog[] = [];
  public reconciliationItems: PaymentReconciliationItem[] = [];
  public entityReports: EntityReport[] = [];
  public settings: MarketplaceSettings = {
    siteName: 'WorkSphere Marketplace',
    supportEmail: 'support@worksphere.com',
    maintenanceMode: false,
    clientFeePercent: 3.5,
    freelancerFeePercent: 10.0,
    escrowHoldDays: 14,
    minWithdrawalAmount: 20,
    maxWithdrawalAmount: 50000,
    autoApproveKyc: false,
    paymentGateways: [
      { name: 'Stripe', enabled: true },
      { name: 'PayPal', enabled: true },
      { name: 'Razorpay', enabled: true },
      { name: 'Bank Wire', enabled: true },
    ],
  };

  constructor() {
    this.seedDatabase();
  }

  // --- Seed Initial Data ---
  public seedDatabase() {
    this.categories = [
      {
        id: 'cat-1',
        name: 'Development & IT',
        slug: 'development-it',
        description: 'Full-stack web applications, mobile engineering, APIs, cloud infrastructure & databases.',
        icon: 'Code',
        subcategories: [
          { name: 'Full Stack Development', slug: 'full-stack', jobCount: 142 },
          { name: 'React & Frontend', slug: 'frontend-react', jobCount: 98 },
          { name: 'Cloud & DevOps (GCP/AWS)', slug: 'devops-cloud', jobCount: 64 },
          { name: 'Mobile Apps (iOS/Android)', slug: 'mobile-apps', jobCount: 51 },
          { name: 'Node.js & Backend Architecture', slug: 'backend-nodejs', jobCount: 76 },
        ],
        popularSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Google Cloud Run', 'Docker', 'Next.js', 'GraphQL'],
      },
      {
        id: 'cat-2',
        name: 'AI & Machine Learning',
        slug: 'ai-machine-learning',
        description: 'LLM fine-tuning, RAG pipelines, autonomous agents, computer vision, and predictive modeling.',
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
        id: 'cat-3',
        name: 'Design & Creative',
        slug: 'design-creative',
        description: 'UI/UX interface design, product architecture, branding systems, design systems, and motion graphics.',
        icon: 'Palette',
        subcategories: [
          { name: 'UI/UX & Product Design', slug: 'ui-ux', jobCount: 110 },
          { name: 'Brand Identity & Systems', slug: 'branding', jobCount: 49 },
          { name: 'Web & Mobile Design', slug: 'web-mobile-design', jobCount: 73 },
          { name: 'Design Systems in Figma', slug: 'design-systems', jobCount: 38 },
        ],
        popularSkills: ['Figma', 'UI/UX', 'Design Systems', 'Tailwind CSS', 'Prototyping', 'Visual Design', 'Wireframing'],
      },
      {
        id: 'cat-4',
        name: 'Writing & Translation',
        slug: 'writing-translation',
        description: 'Technical writing, API documentation, whitepapers, high-converting copywriting, and localization.',
        icon: 'BookOpen',
        subcategories: [
          { name: 'Technical & Developer Writing', slug: 'technical-writing', jobCount: 45 },
          { name: 'SEO Copywriting & Content', slug: 'seo-content', jobCount: 62 },
          { name: 'Whitepapers & Research', slug: 'whitepapers', jobCount: 29 },
        ],
        popularSkills: ['Technical Writing', 'SEO Copywriting', 'API Docs', 'Content Strategy', 'Ghostwriting'],
      },
      {
        id: 'cat-5',
        name: 'Sales & Marketing',
        slug: 'sales-marketing',
        description: 'Performance marketing, search engine optimization, growth strategy, funnel optimization.',
        icon: 'TrendingUp',
        subcategories: [
          { name: 'Search Engine Optimization', slug: 'seo', jobCount: 54 },
          { name: 'Paid Ads & PPC', slug: 'ppc-ads', jobCount: 38 },
          { name: 'Growth Engineering', slug: 'growth-strategy', jobCount: 31 },
        ],
        popularSkills: ['SEO Audit', 'Google Ads', 'Funnel Optimization', 'Conversion Rate Optimization', 'Analytics'],
      },
      {
        id: 'cat-6',
        name: 'Video & Animation',
        slug: 'video-animation',
        description: 'Engaging video editing, 3D animations, motion design, YouTube production, and cinematic visual effects.',
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
        id: 'cat-7',
        name: 'Music & Audio',
        slug: 'music-audio',
        description: 'Pro voice actors, audio engineers, music producers, and sound designers to elevate your media.',
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
        id: 'cat-8',
        name: 'Business',
        slug: 'business',
        description: 'Business plans, pitch decks, market research, financial projections, and operational consulting.',
        icon: 'Briefcase',
        subcategories: [
          { name: 'Business Plans & Pitch Decks', slug: 'business-plans', jobCount: 41 },
          { name: 'Financial Modeling & Forecasting', slug: 'financial-modeling', jobCount: 35 },
          { name: 'Market Research & Competitive Analysis', slug: 'market-research', jobCount: 29 },
          { name: 'Virtual Assistance & Operations', slug: 'virtual-assistant', jobCount: 92 },
          { name: 'CRM & ERP Systems (HubSpot, Salesforce)', slug: 'crm-erp', jobCount: 38 },
        ],
        popularSkills: ['Financial Modeling', 'Pitch Deck Design', 'Market Analysis', 'HubSpot', 'Excel Financials', 'Salesforce'],
      },
      {
        id: 'cat-9',
        name: 'Consulting',
        slug: 'consulting',
        description: 'Strategic advisory from seasoned domain experts in engineering, fundraising, legal compliance, and scaling.',
        icon: 'Compass',
        subcategories: [
          { name: 'Tech Architecture & CTO Advisory', slug: 'tech-advisory', jobCount: 47 },
          { name: 'Startup Fundraising & Strategy', slug: 'startup-strategy', jobCount: 36 },
          { name: 'Legal Consulting & IP', slug: 'legal-consulting', jobCount: 22 },
          { name: 'Security, SOC2 & Compliance', slug: 'security-compliance', jobCount: 19 },
          { name: 'Product Growth Mentorship', slug: 'growth-mentorship', jobCount: 31 },
        ],
        popularSkills: ['Cloud Architecture', 'Fundraising', 'Compliance', 'SOC 2', 'Product Strategy', 'Due Diligence'],
      },
      {
        id: 'cat-10',
        name: 'Data',
        slug: 'data',
        description: 'Data analytics, dashboard visualization, data engineering, web scraping, and database architecture.',
        icon: 'Database',
        subcategories: [
          { name: 'Data Visualization (Tableau, PowerBI)', slug: 'data-visualization', jobCount: 52 },
          { name: 'Data Engineering & Pipelines', slug: 'data-pipelines', jobCount: 44 },
          { name: 'Web Scraping & Extraction', slug: 'web-scraping', jobCount: 68 },
          { name: 'Excel & Advanced Spreadsheets', slug: 'excel-modeling', jobCount: 89 },
        ],
        popularSkills: ['PowerBI', 'Tableau', 'Python Scraping', 'SQL', 'PostgreSQL', 'BigQuery', 'Excel VBA'],
      },
      {
        id: 'cat-11',
        name: 'Photography',
        slug: 'photography',
        description: 'E-commerce product imagery, high-end photo retouching, portraits, and lifestyle brand photography.',
        icon: 'Camera',
        subcategories: [
          { name: 'Product Photography for E-Commerce', slug: 'product-photo', jobCount: 42 },
          { name: 'Photo Retouching & Photoshop Editing', slug: 'photo-retouching', jobCount: 75 },
          { name: 'Portraits & Lifestyle Shots', slug: 'portraits', jobCount: 31 },
        ],
        popularSkills: ['Photoshop', 'Lightroom', 'High-End Retouching', 'Color Correction', 'E-commerce Staging'],
      },
    ].map((cat) => ({
      ...cat,
      isActive: true,
      subcategories: cat.subcategories.map((sub, idx) => ({
        id: `sub-${cat.id}-${idx + 1}`,
        name: sub.name,
        slug: sub.slug,
        jobCount: sub.jobCount || 0,
        isActive: true,
      })),
    }));

    // Seed Unified Users (Each user can act as client and freelancer seamlessly)
    this.users = [
      {
        id: 'usr-admin',
        name: 'Alex Vance (Super Admin)',
        username: 'alexvance',
        email: 'admin@worksphere.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        title: 'WorkSphere Platform Administrator & Arbiter',
        bio: 'Platform super-administrator managing escrow settlements, dispute resolutions, and marketplace security.',
        hourlyRate: 150,
        currency: 'USD',
        country: 'United States',
        city: 'San Francisco',
        joinedAt: '2025-01-10T08:00:00Z',
        skills: ['Platform Governance', 'Escrow Arbitration', 'Financial Auditing'],
        languages: ['English'],
        rating: 5.0,
        reviewCount: 48,
        completedJobsCount: 120,
        totalSpent: 45200,
        totalEarned: 89000,
        responseRate: 100,
        responseTimeHours: 1,
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        isOnline: true,
        activeMode: 'ADMIN',
        adminRoles: ['SUPER_ADMIN', 'FINANCE_ADMIN', 'DISPUTE_ADMIN', 'MODERATOR'],
      },
      {
        id: 'usr-1',
        name: 'Elena Rostova',
        username: 'elenarostova',
        email: 'elena@example.com',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        title: 'Senior Full-Stack Architect & Cloud Run Specialist',
        bio: '10+ years engineering high-throughput distributed systems, full-stack React/Node.js, and Google Cloud Run containerized workloads. Top-rated Plus freelancer with 100% job success score.',
        hourlyRate: 85,
        currency: 'USD',
        country: 'Germany',
        city: 'Berlin',
        joinedAt: '2025-03-15T10:00:00Z',
        skills: ['React', 'TypeScript', 'Node.js', 'Google Cloud Run', 'PostgreSQL', 'Docker', 'Tailwind CSS', 'Next.js'],
        languages: ['English (Fluent)', 'German (Native)', 'French (Conversational)'],
        rating: 4.98,
        reviewCount: 64,
        completedJobsCount: 78,
        totalSpent: 12500,
        totalEarned: 74200,
        responseRate: 99,
        responseTimeHours: 1,
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        isOnline: true,
        activeMode: 'FREELANCER',
      },
      {
        id: 'usr-2',
        name: 'David Chen',
        username: 'davidchen',
        email: 'david@innovatecorp.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        title: 'VP of Engineering @ InnovateTech (Hiring Client)',
        bio: 'Building enterprise AI products and cloud infrastructure. Frequently hiring top engineering talent for frontend, backend, and machine learning contracts.',
        hourlyRate: 120,
        currency: 'USD',
        country: 'United States',
        city: 'Seattle',
        joinedAt: '2025-02-01T14:30:00Z',
        skills: ['Product Strategy', 'Cloud Infrastructure', 'Team Leadership'],
        languages: ['English (Native)', 'Mandarin (Fluent)'],
        rating: 4.95,
        reviewCount: 32,
        completedJobsCount: 41,
        totalSpent: 86400,
        totalEarned: 15200,
        responseRate: 96,
        responseTimeHours: 2,
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        isOnline: true,
        activeMode: 'CLIENT',
      },
      {
        id: 'usr-3',
        name: 'Sarah Jenkins',
        username: 'sarahdesigns',
        email: 'sarah@designcraft.studio',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        title: 'Principal UI/UX & Design Systems Architect',
        bio: 'Specializing in clean, domain-native SaaS dashboards, zero-pill aesthetic design, and scalable Figma component libraries. Former Design Lead at Fintech Unicorn.',
        hourlyRate: 95,
        currency: 'USD',
        country: 'United Kingdom',
        city: 'London',
        joinedAt: '2025-04-12T09:00:00Z',
        skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping', 'Visual Design', 'Wireframing', 'User Research'],
        languages: ['English (Native)'],
        rating: 5.0,
        reviewCount: 52,
        completedJobsCount: 59,
        totalSpent: 8200,
        totalEarned: 61500,
        responseRate: 100,
        responseTimeHours: 1,
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        isOnline: false,
        activeMode: 'FREELANCER',
      },
      {
        id: 'usr-4',
        name: 'Aarav Patel',
        username: 'aaravpatel_ai',
        email: 'aarav@neurotech.in',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        title: 'AI/ML Engineer & RAG Pipeline Specialist',
        bio: 'Building enterprise LLM systems, multimodal Gemini pipelines, and scalable vector retrieval engines. Fast response and clean production code.',
        hourlyRate: 75,
        currency: 'USD',
        country: 'India',
        city: 'Bengaluru',
        joinedAt: '2025-05-20T11:00:00Z',
        skills: ['Python', 'Gemini API', 'LangChain', 'FastAPI', 'PyTorch', 'Vector Databases', 'Docker'],
        languages: ['English (Fluent)', 'Hindi (Native)'],
        rating: 4.92,
        reviewCount: 41,
        completedJobsCount: 47,
        totalSpent: 4500,
        totalEarned: 42800,
        responseRate: 98,
        responseTimeHours: 2,
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        isOnline: true,
        activeMode: 'FREELANCER',
      },
      {
        id: 'usr-5',
        name: 'Marcus Brody',
        username: 'marcusbrody',
        email: 'marcus@growthlab.io',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        title: 'Growth Architect & Technical SEO Consultant',
        bio: 'Data-driven growth strategist, Core Web Vitals optimization expert, and technical SEO auditor for high-scale e-commerce and marketplaces.',
        hourlyRate: 70,
        currency: 'USD',
        country: 'Canada',
        city: 'Toronto',
        joinedAt: '2025-06-01T15:00:00Z',
        skills: ['SEO Audit', 'Core Web Vitals', 'Conversion Rate Optimization', 'Google Analytics', 'Technical Writing'],
        languages: ['English (Native)'],
        rating: 4.89,
        reviewCount: 28,
        completedJobsCount: 35,
        totalSpent: 9100,
        totalEarned: 29800,
        responseRate: 95,
        responseTimeHours: 3,
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        isOnline: true,
        activeMode: 'FREELANCER',
      },
    ];

    // Seed Wallets with reconciled balances
    this.users.forEach((user) => {
      let available = 0;
      let escrowLocked = 0;
      let protectionBalance = 0;

      if (user.id === 'usr-1') {
        available = 3240;
        protectionBalance = 1500; // In 14-day protection period
        escrowLocked = 0;
      } else if (user.id === 'usr-2') {
        available = 4500;
        escrowLocked = 2800;
      } else if (user.id === 'usr-3') {
        available = 1950;
        protectionBalance = 850;
      } else if (user.id === 'usr-4') {
        available = 2100;
      } else if (user.id === 'usr-admin') {
        available = 14850;
      }

      this.wallets.set(user.id, {
        userId: user.id,
        availableBalance: available,
        escrowLockedBalance: escrowLocked,
        protectionPeriodBalance: protectionBalance,
        withdrawnTotal: user.totalEarned > 0 ? user.totalEarned - (available + protectionBalance) : 0,
        lifetimeEarnings: user.totalEarned,
        lifetimeSpent: user.totalSpent,
        currency: 'USD',
        lastReconciledAt: new Date().toISOString(),
      });
    });

    // Seed Projects
    this.projects = [
      {
        id: 'prj-101',
        slug: 'production-cloud-run-marketplace-engine',
        clientId: 'usr-2',
        client: {
          id: 'usr-2',
          name: 'David Chen',
          username: 'davidchen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          country: 'United States',
          rating: 4.95,
          reviewCount: 32,
          totalSpent: 86400,
          verificationStatus: 'VERIFIED',
        },
        title: 'Architect & Deploy High-Performance Freelance Marketplace on Google Cloud Run',
        description:
          'We need an experienced lead full-stack systems engineer to build and verify a production-grade freelance marketplace. Core requirements: 1) HTML-first rendering and sub-100ms TTFB for all public discovery pages with complete Schema.org JSON-LD; 2) Unified account architecture with one wallet/ledger; 3) 14-day escrow protection period; 4) Full administrator control panel with arbitration and audit logging.',
        category: 'Development & IT',
        subcategory: 'Full Stack Development',
        skills: ['Google Cloud Run', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'SEO Audit'],
        budget: 4500,
        pricingModel: 'MILESTONE',
        experienceLevel: 'EXPERT',
        duration: '3 to 6 months',
        proposalsCount: 8,
        status: 'IN_PROGRESS',
        createdAt: '2026-09-28T10:00:00Z',
        updatedAt: '2026-10-02T12:00:00Z',
        featured: true,
      },
      {
        id: 'prj-102',
        slug: 'design-system-figma-enterprise-saas',
        clientId: 'usr-2',
        client: {
          id: 'usr-2',
          name: 'David Chen',
          username: 'davidchen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          country: 'United States',
          rating: 4.95,
          reviewCount: 32,
          totalSpent: 86400,
          verificationStatus: 'VERIFIED',
        },
        title: 'Enterprise Figma Design System & Modern UI Component Library',
        description:
          'Seeking a senior UI/UX designer to craft an ultra-clean, domain-native visual identity for our enterprise analytics console. Zero-pill discipline, crisp typography hierarchy, 60+ responsive components with tokenized variables, and complete interactive states.',
        category: 'Design & Creative',
        subcategory: 'UI/UX & Product Design',
        skills: ['Figma', 'UI/UX', 'Design Systems', 'Tailwind CSS', 'Prototyping'],
        budget: 2800,
        pricingModel: 'FIXED',
        experienceLevel: 'EXPERT',
        duration: '1 to 2 months',
        proposalsCount: 14,
        status: 'PUBLISHED',
        createdAt: '2026-10-04T15:30:00Z',
        updatedAt: '2026-10-04T15:30:00Z',
        featured: true,
      },
      {
        id: 'prj-103',
        slug: 'multimodal-rag-pipeline-gemini',
        clientId: 'usr-5',
        client: {
          id: 'usr-5',
          name: 'Marcus Brody',
          username: 'marcusbrody',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
          country: 'Canada',
          rating: 4.89,
          reviewCount: 28,
          totalSpent: 9100,
          verificationStatus: 'VERIFIED',
        },
        title: 'Implement Multimodal RAG Document Intelligence System with Gemini API',
        description:
          'Looking for an AI engineer to develop a hybrid search and citation retrieval pipeline capable of ingesting PDF technical blueprints, generating dense vector embeddings, and answering user queries with verbatim page citations.',
        category: 'AI & Machine Learning',
        subcategory: 'LLM Applications & RAG',
        skills: ['Gemini API', 'Python', 'Vector Databases', 'LangChain', 'FastAPI'],
        budget: 3200,
        pricingModel: 'MILESTONE',
        experienceLevel: 'INTERMEDIATE',
        duration: '1 to 3 months',
        proposalsCount: 6,
        status: 'PUBLISHED',
        createdAt: '2026-10-05T09:15:00Z',
        updatedAt: '2026-10-05T09:15:00Z',
      },
      {
        id: 'prj-104',
        slug: 'technical-seo-core-web-vitals-speedup',
        clientId: 'usr-2',
        client: {
          id: 'usr-2',
          name: 'David Chen',
          username: 'davidchen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          country: 'United States',
          rating: 4.95,
          reviewCount: 32,
          totalSpent: 86400,
          verificationStatus: 'VERIFIED',
        },
        title: 'Core Web Vitals Optimization: 95+ Mobile Lighthouse Score',
        description:
          'Audit and refactor our Next.js/React marketplace frontend. Eliminate hydration bottlenecks, optimize LCP images, reduce TTFB to under 80ms, and configure edge caching rules.',
        category: 'Sales & Marketing',
        subcategory: 'Search Engine Optimization',
        skills: ['Core Web Vitals', 'SEO Audit', 'Performance Optimization', 'React'],
        budget: 1800,
        pricingModel: 'FIXED',
        experienceLevel: 'EXPERT',
        duration: 'Less than 1 month',
        proposalsCount: 9,
        status: 'PUBLISHED',
        createdAt: '2026-10-06T11:45:00Z',
        updatedAt: '2026-10-06T11:45:00Z',
      },
    ];

    // Seed Multi-Tier Predefined Offers
    this.offers = [
      {
        id: 'ofr-201',
        slug: 'full-stack-cloud-run-deployment-package',
        freelancerId: 'usr-1',
        freelancer: {
          id: 'usr-1',
          name: 'Elena Rostova',
          username: 'elenarostova',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          title: 'Senior Full-Stack Architect & Cloud Run Specialist',
          country: 'Germany',
          rating: 4.98,
          reviewCount: 64,
          responseTimeHours: 1,
          verificationStatus: 'VERIFIED',
        },
        title: 'I will build and deploy a production-ready Web App on Google Cloud Run with Docker & CI/CD',
        description:
          'Get a scalable, containerized full-stack application architected according to Google Cloud best practices. Includes multi-stage Docker build, zero-downtime Cloud Run service provisioning, custom domain mapping, and automated GitHub Actions deployment pipeline.',
        category: 'Development & IT',
        subcategory: 'Cloud & DevOps (GCP/AWS)',
        skills: ['Google Cloud Run', 'Docker', 'Node.js', 'React', 'TypeScript', 'PostgreSQL'],
        packages: {
          basic: {
            name: 'Basic',
            title: 'Containerization & Cloud Run Setup',
            description: 'Dockerize single service and deploy to Google Cloud Run with HTTPS and environment secrets.',
            price: 350,
            deliveryDays: 3,
            revisions: 2,
            features: ['Docker multi-stage setup', 'Cloud Run Service configuration', 'Environment variable setup', 'Basic health checks'],
          },
          standard: {
            name: 'Standard',
            title: 'Full-Stack App + DB + CI/CD',
            description: 'Frontend + Backend container deployment connected to Cloud SQL database with GitHub Actions pipeline.',
            price: 850,
            deliveryDays: 7,
            revisions: 4,
            features: [
              'Frontend + Backend containers',
              'Cloud SQL PostgreSQL connection',
              'Automated GitHub Actions CI/CD',
              'Custom domain SSL setup',
              '14-Day warranty support',
            ],
          },
          premium: {
            name: 'Premium',
            title: 'Enterprise Architecture & High-Availability',
            description: 'Complete production infrastructure with CDN caching, autoscaling rules, Cloud Armor WAF, and performance tuning.',
            price: 1800,
            deliveryDays: 14,
            revisions: -1,
            features: [
              'Everything in Standard',
              'Cloud CDN & Edge caching',
              'Autoscaling & concurrency tuning',
              'Cloud Armor WAF security rules',
              'Core Web Vitals sub-100ms TTFB',
              '30-Day dedicated handover',
            ],
          },
        },
        images: [
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        ],
        rating: 4.98,
        reviewCount: 64,
        ordersInQueue: 3,
        salesCount: 89,
        faqs: [
          {
            question: 'Is Google Cloud Run cheaper than a dedicated VM?',
            answer: 'Yes! Cloud Run features scale-to-zero, meaning you only pay when CPU handles incoming HTTP requests. Ideal for startups and high-traffic spikes.',
          },
          {
            question: 'Will I receive full source code and documentation?',
            answer: 'Yes, full Git repository ownership and a comprehensive Markdown architecture handbook are delivered.',
          },
        ],
        status: 'ACTIVE',
        createdAt: '2025-08-10T12:00:00Z',
      },
      {
        id: 'ofr-202',
        slug: 'bespoke-saas-ui-ux-design-system',
        freelancerId: 'usr-3',
        freelancer: {
          id: 'usr-3',
          name: 'Sarah Jenkins',
          username: 'sarahdesigns',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          title: 'Principal UI/UX & Design Systems Architect',
          country: 'United Kingdom',
          rating: 5.0,
          reviewCount: 52,
          responseTimeHours: 1,
          verificationStatus: 'VERIFIED',
        },
        title: 'I will design a modern SaaS dashboard UI/UX and scalable Figma Design System',
        description:
          'Elevate your web product with clean typography hierarchy, restrained color palettes, high-contrast usability, and 100% vector components. Designed for enterprise SaaS, analytics platforms, and marketplaces.',
        category: 'Design & Creative',
        subcategory: 'UI/UX & Product Design',
        skills: ['Figma', 'UI/UX', 'Design Systems', 'Tailwind CSS', 'Prototyping'],
        packages: {
          basic: {
            name: 'Basic',
            title: '3 Core Screens + Styleguide',
            description: '3 desktop dashboard views with color tokens, typography guide, and interactive Figma prototype.',
            price: 450,
            deliveryDays: 4,
            revisions: 3,
            features: ['3 High-fidelity views', 'Figma auto-layout', 'Typography & color tokens', 'Interactive prototype'],
          },
          standard: {
            name: 'Standard',
            title: 'Complete SaaS MVP (10 Screens)',
            description: '10 responsive desktop & mobile screens, comprehensive component library, and developer handoff specs.',
            price: 1100,
            deliveryDays: 10,
            revisions: 5,
            features: [
              '10 Responsive screens',
              'Complete design token library',
              'Tailwind CSS class tokens',
              'Micro-interactions guide',
              'Developer walkthrough video',
            ],
          },
          premium: {
            name: 'Premium',
            title: 'Full Product Suite & Design System',
            description: '25+ screens, multi-theme support (Dark/Light), 80+ component variants, and clickable investor prototype.',
            price: 2400,
            deliveryDays: 20,
            revisions: -1,
            features: [
              '25+ Complete screens',
              'Full Figma Design System library',
              'Dark & Light mode tokenization',
              'Clickable investor demo flow',
              'Design System Documentation',
            ],
          },
        },
        images: [
          'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
        ],
        rating: 5.0,
        reviewCount: 52,
        ordersInQueue: 2,
        salesCount: 65,
        faqs: [
          {
            question: 'Are designs ready for Tailwind CSS implementation?',
            answer: 'Yes, every component utilizes spacing, radii, and color tokens that map 1:1 to Tailwind CSS utility classes.',
          },
        ],
        status: 'ACTIVE',
        createdAt: '2025-09-01T14:00:00Z',
      },
      {
        id: 'ofr-203',
        slug: 'custom-rag-pipeline-gemini-integration',
        freelancerId: 'usr-4',
        freelancer: {
          id: 'usr-4',
          name: 'Aarav Patel',
          username: 'aaravpatel_ai',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          title: 'AI/ML Engineer & RAG Pipeline Specialist',
          country: 'India',
          rating: 4.92,
          reviewCount: 41,
          responseTimeHours: 2,
          verificationStatus: 'VERIFIED',
        },
        title: 'I will engineer a low-latency RAG AI pipeline with Gemini API and Vector DB',
        description:
          'Connect your knowledge base, PDF repository, or database to Gemini 2.5/Flash. Built with FastAPI, dense vector indexing, semantic search, and streaming responses with citation verification.',
        category: 'AI & Machine Learning',
        subcategory: 'LLM Applications & RAG',
        skills: ['Gemini API', 'Python', 'Vector Databases', 'FastAPI', 'LangChain'],
        packages: {
          basic: {
            name: 'Basic',
            title: 'Simple Document Q&A Agent',
            description: 'Ingest up to 50 documents and query via Gemini API with streaming responses.',
            price: 300,
            deliveryDays: 3,
            revisions: 2,
            features: ['Document chunking & embeddings', 'Vector store integration', 'FastAPI endpoint', 'Streamed output'],
          },
          standard: {
            name: 'Standard',
            title: 'Production RAG with Hybrid Search',
            description: 'Hybrid BM25 + dense vector search, reranking, source metadata citations, and chat memory.',
            price: 750,
            deliveryDays: 7,
            revisions: 4,
            features: [
              'Hybrid dense/sparse retrieval',
              'Reranking engine',
              'Exact page & section citations',
              'Multi-turn conversational memory',
              'Docker container package',
            ],
          },
          premium: {
            name: 'Premium',
            title: 'Enterprise Multi-Agent RAG System',
            description: 'Autonomous multi-step tool execution, OCR multimodal document parsing, and latency benchmarking.',
            price: 1600,
            deliveryDays: 14,
            revisions: -1,
            features: [
              'Everything in Standard',
              'Multimodal PDF/Image table parsing',
              'Autonomous function calling tools',
              'Sub-500ms latency optimization',
              'Full test suite & evaluation scripts',
            ],
          },
        },
        images: [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        ],
        rating: 4.92,
        reviewCount: 41,
        ordersInQueue: 1,
        salesCount: 48,
        faqs: [
          {
            question: 'Which vector database do you recommend?',
            answer: 'We support pgvector (PostgreSQL), Pinecone, Qdrant, or Chroma depending on your infrastructure preference.',
          },
        ],
        status: 'ACTIVE',
        createdAt: '2025-09-15T16:00:00Z',
      },
      {
        id: 'ofr-video-1',
        slug: 'viral-video-editing-and-commercial-post-production',
        freelancerId: 'usr-3',
        freelancer: {
          id: 'usr-3',
          name: 'Sarah Jenkins',
          username: 'sarahdesigns',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          title: 'Senior Motion Designer & Commercial Editor',
          country: 'United Kingdom',
          rating: 4.98,
          reviewCount: 94,
          responseTimeHours: 1,
          verificationStatus: 'VERIFIED',
        },
        title: 'I will create viral video edits, reels, and commercial motion graphics',
        description: 'Professional video post-production in Premiere Pro and After Effects. Cinematic color grading, sound design, engaging captions, and dynamic transitions that hook viewers.',
        category: 'Video & Animation',
        subcategory: 'Video Editing & Post-Production',
        skills: ['Premiere Pro', 'After Effects', 'Color Grading', 'Sound Design', 'Motion Graphics'],
        packages: {
          basic: {
            name: 'Basic',
            title: 'Short-Form Social Reel (up to 60s)',
            description: '1 high-impact TikTok, Instagram Reel or YouTube Short with captions, sound effects, and color grading.',
            price: 65,
            deliveryDays: 1,
            revisions: 2,
            features: ['60-second video', 'Subtitles included', 'Audio cleanup', 'Color grading'],
          },
          standard: {
            name: 'Standard',
            title: 'YouTube or Brand Video (up to 5 mins)',
            description: 'Full YouTube edit with dynamic b-roll, motion graphics, audio mastering, and engaging storytelling.',
            price: 180,
            deliveryDays: 3,
            revisions: 3,
            features: ['Up to 5 minutes', 'Motion graphic lower thirds', 'Licensed background music', 'Color grading'],
          },
          premium: {
            name: 'Premium',
            title: 'Commercial 4K Brand Video & Explainer',
            description: 'Broadcast-ready commercial with bespoke 2D/3D motion graphics, professional sound design, and full revisions.',
            price: 450,
            deliveryDays: 5,
            revisions: -1,
            features: ['Full commercial production', 'Custom motion graphics', 'Sound design & mixing', 'Thumbnail included'],
          },
        },
        images: [
          'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80',
        ],
        rating: 4.97,
        reviewCount: 94,
        ordersInQueue: 4,
        salesCount: 168,
        faqs: [
          { question: 'What footage formats do you support?', answer: 'We accept 4K, ProRes, MP4, and RAW footage via Google Drive, Dropbox, or Frame.io.' },
        ],
        status: 'ACTIVE',
        createdAt: '2025-08-10T12:00:00Z',
      },
      {
        id: 'ofr-music-1',
        slug: 'commercial-studio-voice-over-and-narration',
        freelancerId: 'usr-1',
        freelancer: {
          id: 'usr-1',
          name: 'Elena Rostova',
          username: 'elenarostova',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          title: 'Broadcast Voice Artist & Audio Engineer',
          country: 'Germany',
          rating: 4.99,
          reviewCount: 112,
          responseTimeHours: 1,
          verificationStatus: 'VERIFIED',
        },
        title: 'I will record a professional commercial voice over in a treated studio',
        description: 'Crisp, broadcast-quality voice over recorded on Neumann U87 microphone in a treated sound booth. Perfect for TV commercials, explainers, audiobooks, and corporate promos.',
        category: 'Music & Audio',
        subcategory: 'Voice Over & Narration',
        skills: ['Voice Over', 'Audio Mastering', 'Pro Tools', 'Commercial Narration'],
        packages: {
          basic: {
            name: 'Basic',
            title: 'Up to 150 words voice over',
            description: 'HQ WAV audio with full EQ and noise reduction. Ready for immediate use.',
            price: 50,
            deliveryDays: 1,
            revisions: 2,
            features: ['150 words', 'Commercial rights', 'Noise reduction', 'HQ WAV format'],
          },
          standard: {
            name: 'Standard',
            title: 'Up to 500 words with background music',
            description: 'Includes full commercial rights, timed audio sync, and mixed royalty-free background music.',
            price: 140,
            deliveryDays: 2,
            revisions: 3,
            features: ['500 words', 'Broadcast rights', 'Timed audio sync', 'Background music mixed'],
          },
          premium: {
            name: 'Premium',
            title: 'Full Corporate / Audiobook narration (1500+ words)',
            description: 'Complete high-production voice narration with live directed session and full buyout rights.',
            price: 320,
            deliveryDays: 4,
            revisions: -1,
            features: ['1500 words', 'Full buyout license', 'Live directed session', 'Split files delivered'],
          },
        },
        images: [
          'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        ],
        rating: 4.99,
        reviewCount: 112,
        ordersInQueue: 2,
        salesCount: 230,
        faqs: [
          { question: 'What microphone gear is used?', answer: 'We record on a Neumann U87 Ai paired with an Avalon VT-737sp preamp in a whisper room.' },
        ],
        status: 'ACTIVE',
        createdAt: '2025-07-22T08:00:00Z',
      },
      {
        id: 'ofr-business-1',
        slug: 'investor-ready-business-plan-and-financial-model',
        freelancerId: 'usr-2',
        freelancer: {
          id: 'usr-2',
          name: 'David Chen',
          username: 'davidchen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          title: 'Former VC Analyst & Startup Financial Strategist',
          country: 'United States',
          rating: 4.95,
          reviewCount: 68,
          responseTimeHours: 2,
          verificationStatus: 'VERIFIED',
        },
        title: 'I will write an investor-ready business plan and 5-year financial model',
        description: 'Comprehensive business plan tailored for angel investors, venture capitalists, and SBA loan approvals. Includes dynamic 5-year financial model with P&L, balance sheet, and cash flow.',
        category: 'Business',
        subcategory: 'Business Plans & Pitch Decks',
        skills: ['Business Plans', 'Financial Modeling', 'Market Analysis', 'Pitch Decks'],
        packages: {
          basic: {
            name: 'Basic',
            title: 'Executive Summary & Market Brief',
            description: 'High-impact 5-page executive summary with competitor analysis and target market data.',
            price: 150,
            deliveryDays: 3,
            revisions: 2,
            features: ['Executive summary', 'TAM/SAM/SOM market size', 'Competitive matrix', 'PDF & Word formats'],
          },
          standard: {
            name: 'Standard',
            title: 'Complete Business Plan + 3-Year Model',
            description: '20-page in-depth business plan with 3-year dynamic Excel financial model.',
            price: 450,
            deliveryDays: 6,
            revisions: 4,
            features: ['20-page full plan', '3-year dynamic Excel model', 'Marketing & GTM strategy', 'SBA compliant'],
          },
          premium: {
            name: 'Premium',
            title: 'Investor Package: Plan, Pitch Deck & 5-Year Model',
            description: 'Full investor-ready pitch deck (15 slides), 5-year model with scenario analysis, and 30-page plan.',
            price: 950,
            deliveryDays: 10,
            revisions: -1,
            features: ['Full 30-page plan', '15-slide Figma pitch deck', '5-year financial model', 'Cap table simulation'],
          },
        },
        images: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80',
        ],
        rating: 4.95,
        reviewCount: 68,
        ordersInQueue: 3,
        salesCount: 84,
        faqs: [
          { question: 'Do you help prepare for investor pitches?', answer: 'Yes, the premium tier includes a 60-minute pitch rehearsal and Q&A prep call.' },
        ],
        status: 'ACTIVE',
        createdAt: '2025-06-15T14:00:00Z',
      },
      {
        id: 'ofr-writing-1',
        slug: 'high-converting-seo-technical-content-and-copywriting',
        freelancerId: 'usr-1',
        freelancer: {
          id: 'usr-1',
          name: 'Elena Rostova',
          username: 'elenarostova',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          title: 'Senior Technical Writer & Developer Advocate',
          country: 'Germany',
          rating: 4.98,
          reviewCount: 76,
          responseTimeHours: 1,
          verificationStatus: 'VERIFIED',
        },
        title: 'I will write technical articles, API documentation, and SEO whitepapers',
        description: 'Clear, accurate technical writing that developers respect and search engines rank on page one. Specialized in cloud architecture, TypeScript, APIs, and AI systems.',
        category: 'Writing & Translation',
        subcategory: 'Technical & Developer Writing',
        skills: ['Technical Writing', 'SEO Copywriting', 'API Docs', 'Whitepapers'],
        packages: {
          basic: {
            name: 'Basic',
            title: '1,000-Word Technical Blog Post',
            description: 'SEO-optimized developer blog post with code snippets, diagrams, and keyword strategy.',
            price: 120,
            deliveryDays: 2,
            revisions: 2,
            features: ['1,000 words', 'Working code samples', 'SEO keywords researched', 'Plagiarism report'],
          },
          standard: {
            name: 'Standard',
            title: 'Comprehensive Developer Guide (2,500 words)',
            description: 'Deep-dive technical tutorial, benchmark comparison, or architecture guide.',
            price: 280,
            deliveryDays: 4,
            revisions: 3,
            features: ['2,500 words', 'Interactive code repo', 'Custom architectural diagrams', 'Social promo copy'],
          },
          premium: {
            name: 'Premium',
            title: 'Enterprise Technical Whitepaper / Ebook',
            description: 'Authoritative 5,000-word whitepaper with original research, executive summary, and citations.',
            price: 650,
            deliveryDays: 8,
            revisions: -1,
            features: ['5,000 words', 'Executive layout PDF', 'Full bibliography citations', 'Syndication rights'],
          },
        },
        images: [
          'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&auto=format&fit=crop&q=80',
        ],
        rating: 4.98,
        reviewCount: 76,
        ordersInQueue: 1,
        salesCount: 110,
        faqs: [
          { question: 'Do you test the code snippets before writing?', answer: 'Yes, every code snippet is verified in a clean Docker container or sandbox.' },
        ],
        status: 'ACTIVE',
        createdAt: '2025-05-18T10:00:00Z',
      },
      {
        id: 'ofr-wordpress-1',
        slug: 'custom-wordpress-website-development-elementor-woocommerce',
        freelancerId: 'usr-1',
        freelancer: {
          id: 'usr-1',
          name: 'Elena Rostova',
          username: 'elenarostova',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          title: 'Senior WordPress Developer & Performance Engineer',
          country: 'Germany',
          rating: 4.98,
          reviewCount: 148,
          responseTimeHours: 1,
          verificationStatus: 'VERIFIED',
        },
        title: 'I will build a modern, high-speed WordPress website with WooCommerce',
        description: 'Custom responsive WordPress development. Pixel-perfect implementation from Figma or scratch, WooCommerce payment integration, 95+ Core Web Vitals speed score, and secure hosting configuration.',
        category: 'Development & IT',
        subcategory: 'Full Stack Development',
        skills: ['WordPress', 'WooCommerce', 'PHP', 'CSS3', 'Speed Optimization', 'SEO Audit'],
        packages: {
          basic: {
            name: 'Basic',
            title: '1-Page High-Converting Landing Page',
            description: 'Responsive 1-page WordPress landing page with contact form, speed optimization, and mobile tuning.',
            price: 150,
            deliveryDays: 2,
            revisions: 3,
            features: ['1 page responsive design', 'Fast loading setup', 'Contact form integration', 'Social media links'],
          },
          standard: {
            name: 'Standard',
            title: 'Full 5-Page Business Website',
            description: 'Complete 5-page WordPress site: Home, About, Services, Blog, Contact, with on-page SEO and security hardening.',
            price: 420,
            deliveryDays: 5,
            revisions: 5,
            features: ['5 custom pages', 'On-page SEO setup', 'Security & SSL configuration', 'Content upload included'],
          },
          premium: {
            name: 'Premium',
            title: 'Full E-Commerce Store with WooCommerce',
            description: 'Complete online store with payment gateways (Stripe/PayPal), inventory management, up to 20 products, and premium speed caching.',
            price: 850,
            deliveryDays: 8,
            revisions: -1,
            features: ['Unlimited pages & WooCommerce', 'Payment gateway setup', '20 products added', 'Speed 95+ guaranteed', '30 days support'],
          },
        },
        images: [
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop&q=80',
        ],
        rating: 4.98,
        reviewCount: 148,
        ordersInQueue: 5,
        salesCount: 310,
        faqs: [
          { question: 'Will I be able to edit the website content myself?', answer: 'Yes! You will receive full admin access and a video walkthrough showing how to edit texts and images without code.' },
        ],
        status: 'ACTIVE',
        createdAt: '2025-04-10T09:00:00Z',
      },
    ];

    // Seed Proposals
    this.proposals = [
      {
        id: 'prop-301',
        projectId: 'prj-101',
        freelancerId: 'usr-1',
        freelancer: {
          id: 'usr-1',
          name: 'Elena Rostova',
          username: 'elenarostova',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          title: 'Senior Full-Stack Architect & Cloud Run Specialist',
          country: 'Germany',
          rating: 4.98,
          hourlyRate: 85,
        },
        coverLetter:
          'Hi David, I have architected 12+ high-scale production systems on Google Cloud Run. I will structure this project in 3 clear milestones: 1) System Architecture & SSR SEO engine; 2) Double-entry financial ledger & 14-day escrow protection; 3) Full unified administration console and load testing. All code will be written in strict TypeScript with comprehensive test coverage.',
        bidAmount: 4500,
        deliveryDays: 30,
        milestones: [
          { title: 'Phase 1: Architecture, SSR Engine & SEO Pages', amount: 1500, dueDate: '2026-10-15' },
          { title: 'Phase 2: Authoritative Ledger, Escrow & WorkStream', amount: 1500, dueDate: '2026-10-25' },
          { title: 'Phase 3: Unified Admin Console & Cloud Run Verification', amount: 1500, dueDate: '2026-11-05' },
        ],
        status: 'ACCEPTED',
        createdAt: '2026-09-29T11:00:00Z',
      },
      {
        id: 'prop-302',
        projectId: 'prj-102',
        freelancerId: 'usr-3',
        freelancer: {
          id: 'usr-3',
          name: 'Sarah Jenkins',
          username: 'sarahdesigns',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          title: 'Principal UI/UX & Design Systems Architect',
          country: 'United Kingdom',
          rating: 5.0,
          hourlyRate: 95,
        },
        coverLetter:
          'Hello David! I love the vision for a clean, zero-pill aesthetic design system. I specialize in enterprise SaaS products where high information density must be balanced with generous whitespace and clear typography hierarchy. Let us create a world-class design standard.',
        bidAmount: 2800,
        deliveryDays: 21,
        milestones: [
          { title: 'Design Foundations & Tokenization', amount: 1000, dueDate: '2026-10-18' },
          { title: 'Core Component Library (60+ items)', amount: 1800, dueDate: '2026-11-01' },
        ],
        status: 'SUBMITTED',
        createdAt: '2026-10-04T18:00:00Z',
      },
    ];

    // Seed Contracts (Demonstrating the 14-Day Escrow Protection Lifecycle)
    const protectionStart = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(); // 3 days ago
    const protectionEnd = new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(); // 11 days remaining

    this.contracts = [
      {
        id: 'ctr-401',
        title: 'Architect & Deploy High-Performance Freelance Marketplace on Google Cloud Run',
        clientId: 'usr-2',
        freelancerId: 'usr-1',
        client: {
          id: 'usr-2',
          name: 'David Chen',
          username: 'davidchen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          country: 'United States',
        },
        freelancer: {
          id: 'usr-1',
          name: 'Elena Rostova',
          username: 'elenarostova',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          title: 'Senior Full-Stack Architect & Cloud Run Specialist',
          country: 'Germany',
        },
        projectId: 'prj-101',
        type: 'MILESTONE',
        totalAmount: 4500,
        platformFeeAmount: 450, // 10%
        clientFeeAmount: 135, // 3%
        status: 'PROTECTION_PERIOD', // Currently in 14-day protection period!
        protectionEndsAt: protectionEnd,
        createdAt: '2026-09-30T14:00:00Z',
        updatedAt: '2026-10-04T16:00:00Z',
        fundedAt: '2026-09-30T14:30:00Z',
        milestones: [
          {
            id: 'mls-501',
            contractId: 'ctr-401',
            title: 'Phase 1: Architecture, SSR Engine & SEO Pages',
            description: 'Deliver full SSR rendering engine with sub-100ms TTFB, Schema.org JSON-LD, and zero-pill UI.',
            amount: 1500,
            status: 'PROTECTION_PERIOD', // Accepted by client 3 days ago, countdown active
            dueDate: '2026-10-15',
            fundedAt: '2026-09-30T14:30:00Z',
            submittedAt: '2026-10-03T10:00:00Z',
            acceptedAt: protectionStart,
            protectionStartsAt: protectionStart,
            protectionEndsAt: protectionEnd,
            deliverables: [
              {
                id: 'del-601',
                milestoneId: 'mls-501',
                submittedBy: 'usr-1',
                version: 1,
                notes: 'Completed full HTML-first SSR generator, clean modern layout, and automated Schema.org markup. Lighthouse performance score is 99.',
                files: [
                  { name: 'architecture-handbook-v1.pdf', size: '2.4 MB', url: '#' },
                  { name: 'lighthouse-benchmark-audit.json', size: '140 KB', url: '#' },
                ],
                submittedAt: '2026-10-03T10:00:00Z',
                status: 'ACCEPTED',
                clientFeedback: 'Phenomenal speed! Verified HTML payload in curl and Googlebot simulator. Approving milestone for 14-day escrow clearance.',
              },
            ],
          },
          {
            id: 'mls-502',
            contractId: 'ctr-401',
            title: 'Phase 2: Authoritative Ledger, Escrow & WorkStream',
            description: 'Double-entry ledger records, 14-day protection countdown, and milestone deliverable review engine.',
            amount: 1500,
            status: 'IN_PROGRESS',
            dueDate: '2026-10-25',
            fundedAt: '2026-09-30T14:30:00Z',
            deliverables: [],
          },
          {
            id: 'mls-503',
            contractId: 'ctr-401',
            title: 'Phase 3: Unified Admin Console & Cloud Run Verification',
            description: 'Full administrative controls, dispute settlement, audit logs, and Cloud Run Docker container.',
            amount: 1500,
            status: 'FUNDED',
            dueDate: '2026-11-05',
            fundedAt: '2026-09-30T14:30:00Z',
            deliverables: [],
          },
        ],
      },
      {
        id: 'ctr-402',
        title: 'Design System & UI Components for Analytics Dashboard',
        clientId: 'usr-2',
        freelancerId: 'usr-3',
        client: {
          id: 'usr-2',
          name: 'David Chen',
          username: 'davidchen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          country: 'United States',
        },
        freelancer: {
          id: 'usr-3',
          name: 'Sarah Jenkins',
          username: 'sarahdesigns',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          title: 'Principal UI/UX & Design Systems Architect',
          country: 'United Kingdom',
        },
        offerId: 'ofr-202',
        offerPackageTier: 'standard',
        type: 'OFFER',
        totalAmount: 1100,
        platformFeeAmount: 110,
        clientFeeAmount: 33,
        status: 'WORK_SUBMITTED',
        createdAt: '2026-10-01T09:00:00Z',
        updatedAt: '2026-10-06T15:00:00Z',
        fundedAt: '2026-10-01T09:15:00Z',
        milestones: [
          {
            id: 'mls-504',
            contractId: 'ctr-402',
            title: 'Standard Package: 10 Responsive Screens + Tokens',
            description: '10 screens in Figma with Tailwind CSS variable tokens.',
            amount: 1100,
            status: 'SUBMITTED',
            dueDate: '2026-10-11',
            fundedAt: '2026-10-01T09:15:00Z',
            submittedAt: '2026-10-06T15:00:00Z',
            deliverables: [
              {
                id: 'del-602',
                milestoneId: 'mls-504',
                submittedBy: 'usr-3',
                version: 1,
                notes: 'Uploaded 10 completed high-res screens and tokenized components in Figma link. Ready for client review!',
                files: [
                  { name: 'figma-specs-export.pdf', size: '5.1 MB', url: '#' },
                  { name: 'tokens-tailwind-theme.json', size: '32 KB', url: '#' },
                ],
                submittedAt: '2026-10-06T15:00:00Z',
                status: 'PENDING_REVIEW',
              },
            ],
          },
        ],
      },
    ];

    // Seed Sample Dispute for Demonstration of Arbitration
    this.disputes = [
      {
        id: 'dsp-701',
        contractId: 'ctr-499',
        contractTitle: 'Legacy Microservices Optimization Contract',
        claimantId: 'usr-5',
        claimantName: 'Marcus Brody',
        claimantRole: 'CLIENT',
        respondentId: 'usr-4',
        respondentName: 'Aarav Patel',
        amountDisputed: 800,
        reason: 'Deliverable Scope Discrepancy',
        description:
          'Client requested 5 additional endpoints that were outside initial specification. Freelancer completed 4 endpoints, but client requested a full refund before completion of the 5th.',
        status: 'UNDER_REVIEW',
        evidences: [
          {
            id: 'ev-1',
            submittedBy: 'usr-5',
            submittedByName: 'Marcus Brody',
            role: 'CLIENT',
            message: 'The delivered code is missing the streaming endpoint mentioned in our chat conversation.',
            attachments: [{ name: 'chat-transcript.png', url: '#' }],
            createdAt: '2026-10-05T14:00:00Z',
          },
          {
            id: 'ev-2',
            submittedBy: 'usr-4',
            submittedByName: 'Aarav Patel',
            role: 'FREELANCER',
            message: 'I completed all 4 primary endpoints agreed in the contract statement of work. The streaming endpoint was an optional add-on.',
            attachments: [{ name: 'git-commit-log.txt', url: '#' }],
            createdAt: '2026-10-05T16:30:00Z',
          },
        ],
        assignedAdminId: 'usr-admin',
        assignedAdminName: 'Alex Vance (Super Admin)',
        createdAt: '2026-10-05T13:00:00Z',
      },
    ];

    // Seed Authoritative Ledger Entries
    this.ledger = [
      {
        id: 'led-1',
        idempotentKey: 'idemp-dep-usr2-1001',
        userId: 'usr-2',
        type: 'DEPOSIT',
        description: 'Client wallet deposit via Stripe Checkout (Card ending 4242)',
        amount: 5000,
        currency: 'USD',
        balanceAfter: 5000,
        createdAt: '2026-09-30T13:45:00Z',
        referenceId: 'ch_3M456xyz99',
      },
      {
        id: 'led-2',
        idempotentKey: 'idemp-esc-ctr401-mls501',
        userId: 'usr-2',
        contractId: 'ctr-401',
        milestoneId: 'mls-501',
        type: 'ESCROW_FUND',
        description: 'Fund Escrow for Contract #ctr-401 Milestone 1',
        amount: -1500,
        currency: 'USD',
        balanceAfter: 3500,
        createdAt: '2026-09-30T14:30:00Z',
        referenceId: 'ctr-401-mls-501',
      },
      {
        id: 'led-3',
        idempotentKey: 'idemp-fee-ctr401-client',
        userId: 'usr-2',
        contractId: 'ctr-401',
        type: 'CLIENT_PROCESSING_FEE',
        description: 'Payment processing fee (3%) for Contract #ctr-401',
        amount: -45,
        currency: 'USD',
        balanceAfter: 3455,
        createdAt: '2026-09-30T14:30:00Z',
        referenceId: 'fee-ch-401',
      },
      {
        id: 'led-4',
        idempotentKey: 'idemp-esc-release-demo',
        userId: 'usr-1',
        contractId: 'ctr-400-prev',
        type: 'ESCROW_RELEASE',
        description: 'Escrow released following completed 14-day protection period',
        amount: 2700,
        currency: 'USD',
        balanceAfter: 3240,
        createdAt: '2026-09-25T10:00:00Z',
        referenceId: 'rel-mls-prev',
      },
    ];

    // Seed Withdrawals
    this.withdrawals = [
      {
        id: 'wth-801',
        userId: 'usr-1',
        userName: 'Elena Rostova',
        userEmail: 'elena@example.com',
        amount: 2500,
        fee: 0,
        netAmount: 2500,
        method: 'BANK_TRANSFER',
        destinationDetails: {
          bankName: 'Deutsche Bank',
          accountHolder: 'Elena Rostova',
          accountNumber: 'DE89370400440532013000',
        },
        status: 'COMPLETED',
        requestedAt: '2026-09-26T12:00:00Z',
        processedAt: '2026-09-27T09:30:00Z',
        transactionRef: 'SEPA-DB-984321',
      },
      {
        id: 'wth-802',
        userId: 'usr-4',
        userName: 'Aarav Patel',
        userEmail: 'aarav@neurotech.in',
        amount: 1200,
        fee: 0,
        netAmount: 1200,
        method: 'UPI',
        destinationDetails: {
          accountHolder: 'Aarav Patel',
          upiId: 'aarav.patel@okhdfcbank',
        },
        status: 'PROCESSING',
        requestedAt: '2026-10-06T08:00:00Z',
      },
    ];

    // Seed Admin Audit Logs
    this.auditLogs = [
      {
        id: 'log-1',
        adminId: 'usr-admin',
        adminName: 'Alex Vance (Super Admin)',
        action: 'USER_VERIFY',
        targetEntity: 'USER',
        targetId: 'usr-1',
        newState: { verificationStatus: 'VERIFIED' },
        ipAddress: '198.51.100.4',
        timestamp: '2026-09-20T10:00:00Z',
      },
      {
        id: 'log-2',
        adminId: 'usr-admin',
        adminName: 'Alex Vance (Super Admin)',
        action: 'DISPUTE_ASSIGN',
        targetEntity: 'DISPUTE',
        targetId: 'dsp-701',
        newState: { assignedAdminId: 'usr-admin', status: 'UNDER_REVIEW' },
        ipAddress: '198.51.100.4',
        timestamp: '2026-10-05T13:30:00Z',
      },
    ];

    // Seed Support Tickets
    this.supportTickets = [
      {
        id: 'tkt-901',
        userId: 'usr-2',
        userName: 'David Chen',
        userEmail: 'david@innovatecorp.com',
        category: 'PAYMENTS',
        subject: 'Tax Invoice breakdown for Q3 Cloud Engagements',
        message: 'Hello Support, I need an official consolidated VAT/tax invoice for our Q3 contracts.',
        status: 'OPEN',
        priority: 'MEDIUM',
        assignedAdmin: 'Alex Vance',
        createdAt: '2026-10-06T14:00:00Z',
        messages: [
          {
            id: 'tm-1',
            senderId: 'usr-2',
            senderName: 'David Chen',
            senderRole: 'USER',
            content: 'Hello Support, I need an official consolidated VAT/tax invoice for our Q3 contracts.',
            createdAt: '2026-10-06T14:00:00Z',
          },
        ],
      },
    ];

    // Seed Direct Conversations & Messages
    this.conversations = [
      {
        id: 'conv-1',
        participantIds: ['usr-1', 'usr-2'],
        participants: [
          {
            id: 'usr-1',
            name: 'Elena Rostova',
            username: 'elenarostova',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
            isOnline: true,
          },
          {
            id: 'usr-2',
            name: 'David Chen',
            username: 'davidchen',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            isOnline: true,
          },
        ],
        contractId: 'ctr-401',
        projectId: 'prj-101',
        lastMessage: 'Milestone 1 is currently in 14-day protection. I am now working on Phase 2 ledger integration.',
        lastMessageAt: '2026-10-04T17:00:00Z',
        unreadCount: 0,
      },
    ];

    this.messages = [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'usr-2',
        senderName: 'David Chen',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'Hi Elena, I reviewed the Phase 1 deliverable. The speed is unbelievable — sub-60ms TTFB across all test endpoints!',
        createdAt: '2026-10-04T16:30:00Z',
        isRead: true,
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: 'usr-1',
        senderName: 'Elena Rostova',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        content: 'Thank you David! Milestone 1 is currently in 14-day protection. I am now working on Phase 2 ledger integration.',
        createdAt: '2026-10-04T17:00:00Z',
        isRead: true,
      },
    ];

    // Seed Notifications
    this.notifications = [
      {
        id: 'notif-1',
        userId: 'usr-1',
        title: 'Milestone 1 Accepted - 14-Day Protection Active',
        message: 'David Chen accepted Milestone 1. Funds ($1,350 net) are in 14-day protection period and will be automatically released on Oct 18.',
        type: 'ESCROW_PROTECTION',
        link: '/contracts/ctr-401',
        isRead: false,
        createdAt: protectionStart,
      },
      {
        id: 'notif-2',
        userId: 'usr-2',
        title: 'New Deliverable Submitted',
        message: 'Sarah Jenkins submitted deliverables for "Design System & UI Components". Please review before accepting.',
        type: 'DELIVERABLE',
        link: '/contracts/ctr-402',
        isRead: false,
        createdAt: '2026-10-06T15:01:00Z',
      },
    ];

    // Seed Reviews
    this.reviews = [
      {
        id: 'rev-1',
        contractId: 'ctr-prev-1',
        reviewerId: 'usr-2',
        reviewerName: 'David Chen',
        reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        reviewedUserId: 'usr-1',
        role: 'CLIENT',
        rating: 5.0,
        feedback: 'Elena is the best cloud engineer I have ever collaborated with. Flawless architecture, clean documentation, and exceptional speed.',
        communicationRating: 5.0,
        qualityRating: 5.0,
        deadlineRating: 5.0,
        createdAt: '2026-09-20T14:00:00Z',
      },
    ];

    // Seed Admin Staff
    this.adminStaff = [
      { id: 'adm-1', name: 'Alex Vance', email: 'alex.vance@worksphere.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'SUPER_ADMIN', permissions: ['ALL'], status: 'ACTIVE', lastActive: new Date().toISOString(), mfaEnabled: true },
      { id: 'adm-2', name: 'Sarah Jenkins', email: 'sarah.j@worksphere.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', role: 'FINANCE_ADMIN', permissions: ['LEDGER', 'WITHDRAWALS', 'FEES', 'ESCROW'], status: 'ACTIVE', lastActive: new Date().toISOString(), mfaEnabled: true },
      { id: 'adm-3', name: 'Marcus Cole', email: 'marcus.c@worksphere.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'DISPUTE_ADMIN', permissions: ['DISPUTES', 'ARBITRATION', 'CONTRACTS'], status: 'ACTIVE', lastActive: new Date().toISOString(), mfaEnabled: true },
      { id: 'adm-4', name: 'David Lee', email: 'david.l@worksphere.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', role: 'SUPPORT_ADMIN', permissions: ['SUPPORT_TICKETS', 'FAQS', 'CONTACT'], status: 'ACTIVE', lastActive: new Date().toISOString(), mfaEnabled: false },
      { id: 'adm-5', name: 'Emma Watson', email: 'emma.w@worksphere.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', role: 'MODERATOR', permissions: ['PROJECT_MODERATION', 'OFFER_MODERATION', 'REVIEWS'], status: 'ACTIVE', lastActive: new Date().toISOString(), mfaEnabled: true },
      { id: 'adm-6', name: 'Olivia Wilde', email: 'olivia.w@worksphere.com', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', role: 'CONTENT_ADMIN', permissions: ['CATEGORIES', 'SKILLS', 'LEGAL', 'ANNOUNCEMENTS'], status: 'ACTIVE', lastActive: new Date().toISOString(), mfaEnabled: false },
      { id: 'adm-7', name: 'Ethan Hunt', email: 'ethan.h@worksphere.com', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', role: 'SECURITY_ADMIN', permissions: ['AUDIT_LOGS', 'SECURITY_SETTINGS', 'FRAUD', 'KYC'], status: 'ACTIVE', lastActive: new Date().toISOString(), mfaEnabled: true },
    ];

    // Seed FAQs
    this.faqs = [
      { id: 'faq-1', question: 'How does WorkSphere Escrow Protection work?', answer: 'When a client hires a freelancer or approves an offer, funds are securely held in WorkSphere Escrow. Funds are released to the freelancer upon client approval or following the 14-day protection window.', category: 'Escrow & Payments', isPublished: true, order: 1 },
      { id: 'faq-2', question: 'What is the 14-Day Protection Period?', answer: 'After a milestone deliverable is approved, funds enter a 14-day security window where either party can raise audit queries or dispute resolutions before final bank payout.', category: 'Escrow & Payments', isPublished: true, order: 2 },
      { id: 'faq-3', question: 'What are the platform fee rates?', answer: 'WorkSphere charges a transparent 3.5% client service fee and a 10% freelancer service fee on completed contracts.', category: 'Fees & Payouts', isPublished: true, order: 3 },
      { id: 'faq-4', question: 'How do I submit KYC identity verification?', answer: 'Navigate to your Account Settings -> Verification. Upload a government-issued photo ID and proof of address. Verifications are audited within 24 hours.', category: 'Account & KYC', isPublished: true, order: 4 },
      { id: 'faq-5', question: 'How are contract disputes resolved?', answer: 'If a dispute is raised, an assigned Dispute Admin reviews contract terms, deliverables, and counterparty evidence to issue a binding, double-entry ledger settlement.', category: 'Disputes & Refunds', isPublished: true, order: 5 },
    ];

    // Seed Legal Documents
    this.legalDocuments = [
      { id: 'leg-1', title: 'Terms & Conditions', slug: 'terms', content: 'Comprehensive terms of service governing client and freelancer platform usage, intellectual property assignment, and double-entry escrow rules...', lastUpdated: new Date().toISOString(), updatedBy: 'Alex Vance', version: '2.4.0' },
      { id: 'leg-2', title: 'Privacy Policy', slug: 'privacy', content: 'WorkSphere GDPR & CCPA privacy protection guidelines detailing user data encryption, identity retention, and security auditing standards...', lastUpdated: new Date().toISOString(), updatedBy: 'Alex Vance', version: '2.1.0' },
      { id: 'leg-3', title: 'Refund Policy', slug: 'refund', content: 'Detailed provisions governing contract cancellations, milestone refunds, and partial escrow returns prior to project clearance...', lastUpdated: new Date().toISOString(), updatedBy: 'Sarah Jenkins', version: '1.8.0' },
      { id: 'leg-4', title: 'Escrow Policy', slug: 'escrow', content: 'Official 14-day escrow protection period rules, double-entry ledger guarantees, and automated milestone holding rules...', lastUpdated: new Date().toISOString(), updatedBy: 'Sarah Jenkins', version: '2.0.0' },
      { id: 'leg-5', title: 'Dispute Settlement Policy', slug: 'dispute', content: 'Official binding arbitration procedure for dispute raising, evidence evaluation, and financial settlement execution...', lastUpdated: new Date().toISOString(), updatedBy: 'Marcus Cole', version: '1.5.0' },
      { id: 'leg-6', title: 'Community Guidelines', slug: 'community', content: 'Platform standards against off-platform payments, harassment, fake reviews, and prohibited services...', lastUpdated: new Date().toISOString(), updatedBy: 'Emma Watson', version: '1.2.0' },
    ];

    // Seed Announcements
    this.announcements = [
      { id: 'anc-1', title: 'Scheduled Database Maintenance & Upgrades', message: 'WorkSphere will undergo a brief 15-minute system maintenance window on Sunday at 02:00 UTC. Escrow funding and contract milestones will remain active.', type: 'INFO', targetAudience: 'ALL', isActive: true, createdAt: new Date().toISOString() },
      { id: 'anc-2', title: 'Zero-Fee Bank Withdrawals for Verified Freelancers', message: 'Enjoy 0% withdrawal processing fees on direct ACH and UPI transfers for all completed contracts this month!', type: 'SUCCESS', targetAudience: 'FREELANCERS', isActive: true, createdAt: new Date().toISOString() },
    ];

    // Seed Notification Templates
    this.notificationTemplates = [
      { id: 'tmpl-1', code: 'CONTRACT_AWARDED', title: 'Contract Awarded Notification', subject: 'Congratulations! You have been awarded {{projectTitle}}', emailBody: 'Hi {{freelancerName}}, {{clientName}} has awarded you the contract for {{projectTitle}} with escrow funding of ${{contractAmount}}.', inAppBody: 'You were awarded contract {{contractTitle}} by {{clientName}}.', channel: 'BOTH', variables: ['freelancerName', 'clientName', 'projectTitle', 'contractAmount'] },
      { id: 'tmpl-2', code: 'MILESTONE_RELEASED', title: 'Milestone Escrow Released', subject: 'Funds Released: ${{amount}} for {{milestoneTitle}}', emailBody: 'Hi {{freelancerName}}, {{clientName}} has approved deliverable and released ${{amount}} into your wallet.', inAppBody: '${{amount}} released for milestone {{milestoneTitle}}.', channel: 'BOTH', variables: ['freelancerName', 'clientName', 'amount', 'milestoneTitle'] },
      { id: 'tmpl-3', code: 'DISPUTE_RAISED', title: 'Dispute Raised Alert', subject: 'Urgent: Dispute opened on Contract #{{contractId}}', emailBody: 'A dispute has been initiated for contract #{{contractId}}. Please submit evidence within 48 hours.', inAppBody: 'Dispute opened on contract #{{contractId}}.', channel: 'BOTH', variables: ['contractId'] },
    ];

    // Seed Reported Messages
    this.reportedMessages = [
      { id: 'rep-1', messageId: 'msg-101', conversationId: 'conv-1', reporterId: 'usr-1', reporterName: 'Elena Rostova', senderName: 'SuspiciousUser99', content: 'Pay me directly on Telegram to avoid platform fee: @test_telegram_handle', reason: 'Attempted off-platform transaction', status: 'PENDING', reportedAt: '2026-10-06T18:20:00Z' },
    ];

    // Seed Fraud Reports
    this.fraudReports = [
      { id: 'frd-1', userId: 'usr-99', userName: 'SuspiciousUser99', riskScore: 88, flagReason: 'Multiple rapid high-value transactions with mismatched IP geolocations', detectedAt: '2026-10-06T19:00:00Z', status: 'INVESTIGATING' },
    ];
  }

  // --- Authoritative Financial & Escrow Operations ---

  public getWallet(userId: string): Wallet {
    let wallet = this.wallets.get(userId);
    if (!wallet) {
      wallet = {
        userId,
        availableBalance: 0,
        escrowLockedBalance: 0,
        protectionPeriodBalance: 0,
        withdrawnTotal: 0,
        lifetimeEarnings: 0,
        lifetimeSpent: 0,
        currency: 'USD',
        lastReconciledAt: new Date().toISOString(),
      };
      this.wallets.set(userId, wallet);
    }
    return wallet;
  }

  public recordLedgerEntry(
    userId: string,
    type: LedgerEntry['type'],
    amount: number,
    description: string,
    referenceId: string,
    metadata?: Record<string, any>
  ): LedgerEntry {
    const wallet = this.getWallet(userId);
    const entry: LedgerEntry = {
      id: `led-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      idempotentKey: `idemp-${type.toLowerCase()}-${referenceId}-${Date.now()}`,
      userId,
      type,
      amount,
      currency: wallet.currency,
      balanceAfter: wallet.availableBalance,
      description,
      createdAt: new Date().toISOString(),
      referenceId,
      metadata,
    };
    this.ledger.unshift(entry);
    return entry;
  }

  // Fund Wallet (e.g. via Stripe / Razorpay simulated checkout)
  public depositFunds(userId: string, amount: number, paymentRef: string): Wallet {
    if (amount <= 0) throw new Error('Deposit amount must be positive');
    const wallet = this.getWallet(userId);
    wallet.availableBalance += amount;
    wallet.lifetimeSpent += amount;
    wallet.lastReconciledAt = new Date().toISOString();

    this.recordLedgerEntry(userId, 'DEPOSIT', amount, `Deposit funds via Payment Gateway (${paymentRef})`, paymentRef);
    return wallet;
  }

  // Client creates & funds a contract / milestone into Escrow
  public fundContract(contractId: string, clientId: string): Contract {
    const contract = this.contracts.find((c) => c.id === contractId);
    if (!contract) throw new Error('Contract not found');
    if (contract.clientId !== clientId) throw new Error('Unauthorized client');

    const clientWallet = this.getWallet(clientId);
    const totalRequired = contract.totalAmount + contract.clientFeeAmount;

    if (clientWallet.availableBalance < totalRequired) {
      throw new Error(`Insufficient wallet balance. Please add $${(totalRequired - clientWallet.availableBalance).toFixed(2)} to fund this contract.`);
    }

    // Atomic Ledger deduction
    clientWallet.availableBalance -= totalRequired;
    clientWallet.escrowLockedBalance += contract.totalAmount;
    clientWallet.lastReconciledAt = new Date().toISOString();

    contract.status = 'FUNDED';
    contract.fundedAt = new Date().toISOString();
    contract.milestones.forEach((m) => {
      m.status = 'FUNDED';
      m.fundedAt = new Date().toISOString();
    });

    this.recordLedgerEntry(
      clientId,
      'ESCROW_FUND',
      -contract.totalAmount,
      `Escrow funding for Contract: ${contract.title}`,
      contract.id
    );

    if (contract.clientFeeAmount > 0) {
      this.recordLedgerEntry(
        clientId,
        'CLIENT_PROCESSING_FEE',
        -contract.clientFeeAmount,
        `Payment processing fee (3%) for Contract: ${contract.title}`,
        contract.id
      );
    }

    this.notify(
      contract.freelancerId,
      'Contract Funded & Ready',
      `Client ${contract.client.name} funded $${contract.totalAmount} into Escrow for "${contract.title}". You may begin work!`,
      'CONTRACT',
      `/contracts/${contract.id}`
    );

    return contract;
  }

  // Freelancer submits deliverable
  public submitDeliverable(
    contractId: string,
    milestoneId: string,
    freelancerId: string,
    notes: string,
    files: { name: string; size: string; url: string }[]
  ): Milestone {
    const contract = this.contracts.find((c) => c.id === contractId);
    if (!contract) throw new Error('Contract not found');
    if (contract.freelancerId !== freelancerId) throw new Error('Unauthorized');

    const milestone = contract.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    const newDeliverable: Deliverable = {
      id: `del-${Date.now()}`,
      milestoneId,
      submittedBy: freelancerId,
      version: milestone.deliverables.length + 1,
      notes,
      files,
      submittedAt: new Date().toISOString(),
      status: 'PENDING_REVIEW',
    };

    milestone.deliverables.unshift(newDeliverable);
    milestone.status = 'SUBMITTED';
    milestone.submittedAt = new Date().toISOString();
    contract.status = 'WORK_SUBMITTED';

    this.notify(
      contract.clientId,
      'Deliverable Submitted for Review',
      `${contract.freelancer.name} submitted deliverables for milestone "${milestone.title}".`,
      'DELIVERABLE',
      `/contracts/${contract.id}`
    );

    return milestone;
  }

  // Client requests revision
  public requestRevision(
    contractId: string,
    milestoneId: string,
    clientId: string,
    feedback: string
  ): Milestone {
    const contract = this.contracts.find((c) => c.id === contractId);
    if (!contract) throw new Error('Contract not found');
    if (contract.clientId !== clientId) throw new Error('Unauthorized');

    const milestone = contract.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    milestone.status = 'REVISION_REQUESTED';
    if (milestone.deliverables.length > 0) {
      milestone.deliverables[0].status = 'REVISION_REQUESTED';
      milestone.deliverables[0].clientFeedback = feedback;
    }
    contract.status = 'ACTIVE';

    this.notify(
      contract.freelancerId,
      'Revision Requested',
      `${contract.client.name} requested modifications on milestone "${milestone.title}": "${feedback}"`,
      'DELIVERABLE',
      `/contracts/${contract.id}`
    );

    return milestone;
  }

  // Client accepts deliverable -> Triggers 14-day escrow protection period!
  public acceptMilestone(contractId: string, milestoneId: string, clientId: string, feedback?: string): Milestone {
    const contract = this.contracts.find((c) => c.id === contractId);
    if (!contract) throw new Error('Contract not found');
    if (contract.clientId !== clientId) throw new Error('Unauthorized');

    const milestone = contract.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    const now = new Date();
    const protectionEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days later

    milestone.status = 'PROTECTION_PERIOD';
    milestone.acceptedAt = now.toISOString();
    milestone.protectionStartsAt = now.toISOString();
    milestone.protectionEndsAt = protectionEnd.toISOString();

    if (milestone.deliverables.length > 0) {
      milestone.deliverables[0].status = 'ACCEPTED';
      milestone.deliverables[0].clientFeedback = feedback || 'Accepted';
    }

    // Move funds from client escrow locked to freelancer protection period balance
    const clientWallet = this.getWallet(contract.clientId);
    const freelancerWallet = this.getWallet(contract.freelancerId);

    const platformFeeRate = 0.1; // 10% platform fee
    const netEarning = milestone.amount * (1 - platformFeeRate);

    clientWallet.escrowLockedBalance = Math.max(0, clientWallet.escrowLockedBalance - milestone.amount);
    freelancerWallet.protectionPeriodBalance += netEarning;

    contract.status = 'PROTECTION_PERIOD';
    contract.protectionEndsAt = protectionEnd.toISOString();

    this.notify(
      contract.freelancerId,
      'Milestone Accepted - 14-Day Buyer Protection Active',
      `Client accepted "${milestone.title}". Your net earnings of $${netEarning.toFixed(2)} are in the 14-day protection period and will automatically clear on ${protectionEnd.toLocaleDateString()}.`,
      'ESCROW_PROTECTION',
      `/contracts/${contract.id}`
    );

    return milestone;
  }

  // Release Escrow funds (Automated timer or Admin/Client manual early clearance)
  public releaseMilestoneEscrow(contractId: string, milestoneId: string, triggeredBy: string): Milestone {
    const contract = this.contracts.find((c) => c.id === contractId);
    if (!contract) throw new Error('Contract not found');

    const milestone = contract.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    if (milestone.status === 'RELEASED') {
      throw new Error('Funds have already been released for this milestone');
    }

    // Check if there is an active blocking dispute
    const activeDispute = this.disputes.find(
      (d) => d.contractId === contractId && ['OPEN', 'UNDER_REVIEW', 'ESCALATED'].includes(d.status)
    );
    if (activeDispute) {
      throw new Error(`Cannot release escrow while Dispute #${activeDispute.id} is active.`);
    }

    const freelancerWallet = this.getWallet(contract.freelancerId);
    const platformFeeRate = 0.1;
    const grossAmount = milestone.amount;
    const platformFee = grossAmount * platformFeeRate;
    const netEarning = grossAmount - platformFee;

    // Deduct from protection balance, credit available balance
    freelancerWallet.protectionPeriodBalance = Math.max(0, freelancerWallet.protectionPeriodBalance - netEarning);
    freelancerWallet.availableBalance += netEarning;
    freelancerWallet.lifetimeEarnings += netEarning;
    freelancerWallet.lastReconciledAt = new Date().toISOString();

    milestone.status = 'RELEASED';
    milestone.releasedAt = new Date().toISOString();

    // Check if all milestones are released
    const allReleased = contract.milestones.every((m) => m.status === 'RELEASED');
    if (allReleased) {
      contract.status = 'COMPLETED';
    }

    // Record immutable ledger entries
    this.recordLedgerEntry(
      contract.freelancerId,
      'ESCROW_RELEASE',
      netEarning,
      `Escrow payout for milestone "${milestone.title}" (Net after 10% platform fee)`,
      milestone.id
    );

    this.recordLedgerEntry(
      'usr-admin',
      'PLATFORM_FEE',
      platformFee,
      `Platform commission (10%) from Contract #${contract.id} Milestone "${milestone.title}"`,
      milestone.id
    );

    this.notify(
      contract.freelancerId,
      'Funds Available for Withdrawal!',
      `$${netEarning.toFixed(2)} from "${milestone.title}" has been credited to your available balance!`,
      'ESCROW_RELEASE',
      '/wallet'
    );

    return milestone;
  }

  // Raise Dispute
  public raiseDispute(
    contractId: string,
    claimantId: string,
    reason: string,
    description: string,
    evidenceMessage?: string
  ): Dispute {
    const contract = this.contracts.find((c) => c.id === contractId);
    if (!contract) throw new Error('Contract not found');

    const isClient = contract.clientId === claimantId;
    const isFreelancer = contract.freelancerId === claimantId;
    if (!isClient && !isFreelancer) throw new Error('Unauthorized to dispute this contract');

    const claimantRole = isClient ? 'CLIENT' : 'FREELANCER';
    const claimantUser = this.users.find((u) => u.id === claimantId);
    const respondentId = isClient ? contract.freelancerId : contract.clientId;
    const respondentUser = this.users.find((u) => u.id === respondentId);

    const dispute: Dispute = {
      id: `dsp-${Date.now()}`,
      contractId,
      contractTitle: contract.title,
      claimantId,
      claimantName: claimantUser?.name || 'User',
      claimantRole,
      respondentId,
      respondentName: respondentUser?.name || 'Counterparty',
      amountDisputed: contract.totalAmount,
      reason,
      description,
      status: 'OPEN',
      evidences: evidenceMessage
        ? [
            {
              id: `ev-${Date.now()}`,
              submittedBy: claimantId,
              submittedByName: claimantUser?.name || 'Claimant',
              role: claimantRole,
              message: evidenceMessage,
              attachments: [],
              createdAt: new Date().toISOString(),
            },
          ]
        : [],
      createdAt: new Date().toISOString(),
    };

    this.disputes.unshift(dispute);
    contract.status = 'DISPUTED';
    contract.disputeId = dispute.id;

    this.notify(
      respondentId,
      'Dispute Raised on Contract',
      `${claimantUser?.name} opened Dispute #${dispute.id} on "${contract.title}". Please submit your counter-evidence.`,
      'DISPUTE',
      `/disputes/${dispute.id}`
    );

    return dispute;
  }

  // Arbitrate Dispute (Admin Action)
  public resolveDispute(
    disputeId: string,
    adminId: string,
    resolution: Dispute['resolution'],
    notes: string,
    clientRefundAmount: number = 0,
    freelancerReleaseAmount: number = 0
  ): Dispute {
    const dispute = this.disputes.find((d) => d.id === disputeId);
    if (!dispute) throw new Error('Dispute not found');

    const contract = this.contracts.find((c) => c.id === dispute.contractId);
    if (!contract) throw new Error('Associated contract not found');

    const admin = this.users.find((u) => u.id === adminId);
    dispute.status = 'RESOLVED';
    dispute.resolution = resolution;
    dispute.resolutionNotes = notes;
    dispute.assignedAdminId = adminId;
    dispute.assignedAdminName = admin?.name || 'Administrator';
    dispute.resolvedAt = new Date().toISOString();
    dispute.clientRefundAmount = clientRefundAmount;
    dispute.freelancerReleaseAmount = freelancerReleaseAmount;

    const clientWallet = this.getWallet(contract.clientId);
    const freelancerWallet = this.getWallet(contract.freelancerId);

    if (resolution === 'FULL_REFUND_TO_CLIENT') {
      clientWallet.availableBalance += dispute.amountDisputed;
      clientWallet.escrowLockedBalance = Math.max(0, clientWallet.escrowLockedBalance - dispute.amountDisputed);
      contract.status = 'REFUNDED';

      this.recordLedgerEntry(
        contract.clientId,
        'REFUND',
        dispute.amountDisputed,
        `Full dispute refund for Contract #${contract.id} by Arbiter ${admin?.name}`,
        dispute.id
      );
    } else if (resolution === 'FULL_RELEASE_TO_FREELANCER') {
      const net = dispute.amountDisputed * 0.9;
      freelancerWallet.availableBalance += net;
      freelancerWallet.protectionPeriodBalance = 0;
      contract.status = 'RELEASED';

      this.recordLedgerEntry(
        contract.freelancerId,
        'DISPUTE_PAYOUT_SPLIT',
        net,
        `Full dispute payout for Contract #${contract.id} by Arbiter ${admin?.name}`,
        dispute.id
      );
    } else if (resolution === 'PARTIAL_SPLIT') {
      if (clientRefundAmount > 0) {
        clientWallet.availableBalance += clientRefundAmount;
        this.recordLedgerEntry(
          contract.clientId,
          'REFUND',
          clientRefundAmount,
          `Partial dispute settlement refund for Contract #${contract.id}`,
          dispute.id
        );
      }
      if (freelancerReleaseAmount > 0) {
        freelancerWallet.availableBalance += freelancerReleaseAmount;
        this.recordLedgerEntry(
          contract.freelancerId,
          'DISPUTE_PAYOUT_SPLIT',
          freelancerReleaseAmount,
          `Partial dispute settlement release for Contract #${contract.id}`,
          dispute.id
        );
      }
      contract.status = 'COMPLETED';
    }

    // Add Audit Log
    this.auditLogs.unshift({
      id: `log-${Date.now()}`,
      adminId,
      adminName: admin?.name || 'Admin',
      action: 'DISPUTE_RESOLVE',
      targetEntity: 'DISPUTE',
      targetId: dispute.id,
      newState: { resolution, notes, clientRefundAmount, freelancerReleaseAmount },
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
    });

    return dispute;
  }

  // Issue Traceable Compensating Transaction (Admins cannot alter historical records, corrections must be traceable)
  public issueCompensatingTransaction(
    adminId: string,
    targetUserId: string,
    originalTxId: string,
    amount: number,
    adjustmentType: 'CREDIT' | 'DEBIT',
    reason: string
  ): LedgerEntry {
    const admin = this.adminStaff.find((a) => a.id === adminId) || this.users.find((u) => u.id === adminId);
    const targetWallet = this.getWallet(targetUserId);

    const actualAmount = adjustmentType === 'CREDIT' ? Math.abs(amount) : -Math.abs(amount);

    targetWallet.availableBalance += actualAmount;
    targetWallet.lastReconciledAt = new Date().toISOString();

    const entry = this.recordLedgerEntry(
      targetUserId,
      'COMPENSATING_ADJUSTMENT',
      actualAmount,
      `Compensating Adjustment by Admin ${admin?.name || 'Finance Admin'} (Ref #${originalTxId}): ${reason}`,
      originalTxId,
      {
        issuedByAdminId: adminId,
        issuedByAdminName: admin?.name || 'Finance Admin',
        originalTxId,
        adjustmentType,
        reason,
      }
    );

    // Record Audit Log
    this.auditLogs.unshift({
      id: `log-${Date.now()}`,
      adminId,
      adminName: admin?.name || 'Finance Admin',
      action: 'COMPENSATING_TRANSACTION_ISSUED',
      targetEntity: 'LEDGER',
      targetId: entry.id,
      newState: { targetUserId, originalTxId, amount: actualAmount, adjustmentType, reason },
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
    });

    this.notify(
      targetUserId,
      'Account Balance Adjustment',
      `A financial balance adjustment of ${actualAmount >= 0 ? '+' : ''}$${actualAmount.toFixed(2)} was processed by platform finance administration (Ref: ${originalTxId}).`,
      'SYSTEM',
      '/wallet'
    );

    return entry;
  }

  // Request Withdrawal
  public requestWithdrawal(
    userId: string,
    amount: number,
    method: WithdrawalRequest['method'],
    destinationDetails: WithdrawalRequest['destinationDetails']
  ): WithdrawalRequest {
    const wallet = this.getWallet(userId);
    if (amount <= 0) throw new Error('Withdrawal amount must be greater than zero');
    if (wallet.availableBalance < amount) {
      throw new Error(`Insufficient available balance ($${wallet.availableBalance.toFixed(2)}) for withdrawal of $${amount.toFixed(2)}.`);
    }

    const user = this.users.find((u) => u.id === userId);
    wallet.availableBalance -= amount;
    wallet.withdrawnTotal += amount;
    wallet.lastReconciledAt = new Date().toISOString();

    const withdrawal: WithdrawalRequest = {
      id: `wth-${Date.now()}`,
      userId,
      userName: user?.name || 'User',
      userEmail: user?.email || '',
      amount,
      fee: 0,
      netAmount: amount,
      method,
      destinationDetails,
      status: 'PROCESSING',
      requestedAt: new Date().toISOString(),
    };

    this.withdrawals.unshift(withdrawal);

    this.recordLedgerEntry(
      userId,
      'WITHDRAWAL_REQUEST',
      -amount,
      `Withdrawal payout request to ${method} (${destinationDetails.accountHolder})`,
      withdrawal.id
    );

    return withdrawal;
  }

  // Admin Approve Withdrawal
  public completeWithdrawal(withdrawalId: string, adminId: string, transactionRef: string): WithdrawalRequest {
    const w = this.withdrawals.find((item) => item.id === withdrawalId);
    if (!w) throw new Error('Withdrawal not found');

    w.status = 'COMPLETED';
    w.processedAt = new Date().toISOString();
    w.transactionRef = transactionRef;

    this.recordLedgerEntry(
      w.userId,
      'WITHDRAWAL_COMPLETED',
      0,
      `Payout confirmed via ${w.method} - Ref #${transactionRef}`,
      w.id
    );

    return w;
  }

  // Notify Helper
  public notify(userId: string, title: string, message: string, type: Notification['type'], link?: string) {
    const notif: Notification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      title,
      message,
      type,
      link,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
  }

  // System KPIs Calculation
  public getKPIs(): SystemKPIs {
    const totalUsers = this.users.length;
    const activeUsers = this.users.filter((u) => u.status === 'ACTIVE').length;
    const verifiedUsers = this.users.filter((u) => u.verificationStatus === 'VERIFIED').length;
    const activeProjects = this.projects.filter((p) => p.status === 'PUBLISHED' || p.status === 'IN_PROGRESS').length;
    const activeOffers = this.offers.filter((o) => o.status === 'ACTIVE').length;
    const activeContracts = this.contracts.filter((c) => ['FUNDED', 'ACTIVE', 'WORK_SUBMITTED', 'PROTECTION_PERIOD'].includes(c.status)).length;

    let grossMerchandiseValue = 0;
    let platformRevenue = 0;
    let escrowLockedTotal = 0;
    let escrowInProtectionPeriod = 0;

    this.contracts.forEach((c) => {
      grossMerchandiseValue += c.totalAmount;
      platformRevenue += c.platformFeeAmount + c.clientFeeAmount;
    });

    this.wallets.forEach((w) => {
      escrowLockedTotal += w.escrowLockedBalance;
      escrowInProtectionPeriod += w.protectionPeriodBalance;
    });

    const openDisputesCount = this.disputes.filter((d) => ['OPEN', 'UNDER_REVIEW', 'ESCALATED'].includes(d.status)).length;
    const pendingWithdrawalsCount = this.withdrawals.filter((w) => w.status === 'PROCESSING' || w.status === 'REQUESTED').length;
    const pendingVerificationsCount = this.users.filter((u) => u.verificationStatus === 'PENDING').length;

    return {
      totalUsers,
      activeUsers,
      verifiedUsers,
      activeProjects,
      activeOffers,
      activeContracts,
      grossMerchandiseValue,
      platformRevenue,
      escrowLockedTotal,
      escrowInProtectionPeriod,
      openDisputesCount,
      pendingWithdrawalsCount,
      pendingVerificationsCount,
      failedWebhooksCount: this.webhookLogs.filter((w) => w.processingStatus === 'FAILED').length,
      activeReportsCount: this.entityReports.filter((r) => ['OPEN', 'INVESTIGATING'].includes(r.status)).length,
      maintenanceMode: this.settings.maintenanceMode,
    };
  }

  // --- Production Permission Checking ---
  public hasAdminPermission(adminId: string, permission: AdminPermission): boolean {
    const admin = this.adminStaff.find((a) => a.id === adminId) || this.users.find((u) => u.id === adminId && u.activeMode === 'ADMIN');
    if (!admin) return false;

    const perms = (admin as any).permissions || [];

    // Super Admin or 'ALL' permission grants full access
    if ((admin as any).role === 'SUPER_ADMIN' || perms.includes('ALL')) return true;

    const ROLE_MAP: Record<string, AdminPermission[]> = {
      FINANCE_ADMIN: ['payments.view', 'payments.refund', 'escrow.view', 'escrow.release', 'escrow.refund', 'escrow.partial_release', 'withdrawals.view', 'withdrawals.approve', 'withdrawals.reject', 'withdrawals.process', 'audit_logs.view', 'webhooks.view', 'webhooks.retry'],
      DISPUTE_ADMIN: ['disputes.view', 'disputes.assign', 'disputes.resolve', 'contracts.view', 'escrow.view', 'escrow.release', 'escrow.refund', 'escrow.partial_release'],
      SUPPORT_ADMIN: ['users.view', 'reports.view', 'reports.resolve', 'reviews.view'],
      MODERATOR: ['projects.view', 'projects.moderate', 'offers.view', 'offers.moderate', 'reviews.view', 'reviews.moderate', 'reports.view', 'reports.resolve'],
      CONTENT_ADMIN: ['settings.view', 'settings.edit'],
      SECURITY_ADMIN: ['users.view', 'users.suspend', 'users.ban', 'users.verify', 'audit_logs.view', 'privacy.view_sensitive', 'reports.view'],
    };

    if (perms.includes(permission)) return true;
    const rolePerms = ROLE_MAP[(admin as any).role] || [];
    return rolePerms.includes(permission);
  }

  // --- Detailed Audit Logger ---
  public recordAuditLog(
    adminId: string,
    action: string,
    targetEntity: string,
    targetId: string,
    newState?: any,
    previousState?: any,
    reason?: string,
    relatedIds?: { relatedTransactionId?: string; relatedContractId?: string; relatedDisputeId?: string },
    ipAddress: string = '127.0.0.1'
  ): AdminAuditLog {
    const admin = this.adminStaff.find((a) => a.id === adminId) || this.users.find((u) => u.id === adminId);
    const log: AdminAuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminId,
      adminName: admin?.name || 'Admin',
      action,
      targetEntity,
      targetId,
      newState,
      previousState,
      reason,
      relatedTransactionId: relatedIds?.relatedTransactionId,
      relatedContractId: relatedIds?.relatedContractId,
      relatedDisputeId: relatedIds?.relatedDisputeId,
      ipAddress,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }

  // --- 14-Day Protection Worker ---
  public runEscrowProtectionWorker(): number {
    let releasedCount = 0;
    const now = new Date();

    for (const contract of this.contracts) {
      if (!['FUNDED', 'ACTIVE', 'WORK_SUBMITTED', 'PROTECTION_PERIOD'].includes(contract.status)) continue;

      const hasActiveDispute = this.disputes.some(
        (d) => d.contractId === contract.id && ['OPEN', 'UNDER_REVIEW', 'ESCALATED'].includes(d.status)
      );
      if (hasActiveDispute) continue;

      for (const milestone of contract.milestones) {
        if (milestone.status === 'PROTECTION_PERIOD' && milestone.protectionEndsAt) {
          const end = new Date(milestone.protectionEndsAt);
          if (end <= now) {
            try {
              this.releaseMilestoneEscrow(contract.id, milestone.id, 'SYSTEM_WORKER_14DAY_AUTO_RELEASE');
              releasedCount++;
              this.recordAuditLog(
                'SYSTEM_WORKER',
                'ESCROW_AUTO_RELEASE',
                'MILESTONE',
                milestone.id,
                { contractId: contract.id, amount: milestone.amount },
                undefined,
                '14-day protection period elapsed without dispute',
                { relatedContractId: contract.id }
              );
            } catch (e) {
              console.error(`Auto release error for milestone ${milestone.id}`, e);
            }
          }
        }
      }
    }
    return releasedCount;
  }

  // --- Payment Webhook Engine ---
  public processWebhookEvent(
    provider: WebhookEventLog['provider'],
    eventId: string,
    paymentId: string,
    eventType: string,
    payload: any,
    relatedUserId?: string,
    relatedContractId?: string
  ): WebhookEventLog {
    const existing = this.webhookLogs.find((w) => w.provider === provider && w.eventId === eventId);
    if (existing) {
      return existing; // Idempotent return
    }

    const log: WebhookEventLog = {
      id: `whk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      provider,
      eventId,
      paymentId,
      eventType,
      receivedAt: new Date().toISOString(),
      providerTimestamp: new Date().toISOString(),
      processingStatus: 'SUCCESS',
      retryCount: 0,
      relatedUserId,
      relatedContractId,
      payload,
    };

    if ((eventType === 'payment_intent.succeeded' || eventType === 'payment.captured') && relatedUserId && payload?.amount) {
      this.depositFunds(relatedUserId, Number(payload.amount), paymentId);
    }

    this.webhookLogs.unshift(log);
    return log;
  }

  public retryWebhook(webhookId: string): WebhookEventLog {
    const wh = this.webhookLogs.find((w) => w.id === webhookId);
    if (!wh) throw new Error('Webhook log not found');
    wh.retryCount += 1;
    wh.lastRetryAt = new Date().toISOString();
    wh.processingStatus = 'SUCCESS';
    wh.failureReason = undefined;
    return wh;
  }

  // --- Global Admin Search Engine ---
  public globalSearch(query: string) {
    if (!query || query.trim().length === 0) {
      return { users: [], projects: [], offers: [], contracts: [], disputes: [], ledger: [], withdrawals: [], tickets: [], reports: [] };
    }
    const q = query.toLowerCase().trim();

    return {
      users: this.users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)),
      projects: this.projects.filter((p) => p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.slug.includes(q)),
      offers: this.offers.filter((o) => o.title.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.slug.includes(q)),
      contracts: this.contracts.filter((c) => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)),
      disputes: this.disputes.filter((d) => d.contractTitle.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.reason.toLowerCase().includes(q)),
      ledger: this.ledger.filter((l) => l.id.toLowerCase().includes(q) || l.referenceId.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)),
      withdrawals: this.withdrawals.filter((w) => w.id.toLowerCase().includes(q) || w.userName.toLowerCase().includes(q) || (w.transactionRef && w.transactionRef.toLowerCase().includes(q))),
      tickets: this.supportTickets.filter((t) => t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.userEmail.toLowerCase().includes(q)),
      reports: this.entityReports.filter((r) => r.id.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q) || r.targetEntityName.toLowerCase().includes(q)),
    };
  }

  // --- Data Export Engine ---
  public exportEntityData(entityType: string, adminId: string): any {
    this.recordAuditLog(adminId, 'DATA_EXPORT', entityType.toUpperCase(), 'ALL', undefined, undefined, `Exported ${entityType} dataset`);
    switch (entityType) {
      case 'ledger': return this.ledger;
      case 'users': return this.users.map((u) => ({ id: u.id, name: u.name, email: u.email, status: u.status, kyc: u.verificationStatus }));
      case 'contracts': return this.contracts;
      case 'disputes': return this.disputes;
      case 'withdrawals': return this.withdrawals;
      case 'audit_logs': return this.auditLogs;
      default: return [];
    }
  }
}

export const db = new MarketplaceDB();
