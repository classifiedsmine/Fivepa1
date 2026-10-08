import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/pages/HomePage';
import { FindProjectsPage } from './components/pages/FindProjectsPage';
import { OffersDirectoryPage } from './components/pages/OffersDirectoryPage';
import { FindFreelancersPage } from './components/pages/FindFreelancersPage';
import { ProjectDetailView } from './components/pages/ProjectDetailView';
import { OfferDetailView } from './components/pages/OfferDetailView';
import { UserProfileView } from './components/pages/UserProfileView';
import { ContractsListView } from './components/contracts/ContractsListView';
import { ContractWorkspace } from './components/contracts/ContractWorkspace';
import { WalletPage } from './components/wallet/WalletPage';
import { MessagingPage } from './components/messages/MessagingPage';
import { DisputesPage } from './components/disputes/DisputesPage';
import { AdminPortal } from './components/admin/AdminPortal';
import { EscrowPolicyPage } from './components/pages/EscrowPolicyPage';
import { FAQPage } from './components/pages/FAQPage';
import { LegalPage } from './components/pages/LegalPage';
import { CategoryPage } from './components/pages/CategoryPage';
import { SupportPage } from './components/pages/SupportPage';
import { BestFontsArticlePage } from './components/pages/BestFontsArticlePage';
import { PostProjectModal } from './components/modals/PostProjectModal';
import { CreateOfferModal } from './components/modals/CreateOfferModal';

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [showPostProjectModal, setShowPostProjectModal] = useState(false);
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Dispatcher
  const renderCurrentRoute = () => {
    const path = currentPath;

    if (path === '/' || path === '') {
      return (
        <HomePage
          navigate={navigate}
          onOpenPostProject={() => setShowPostProjectModal(true)}
          onOpenCreateOffer={() => setShowCreateOfferModal(true)}
        />
      );
    }

    if (path.startsWith('/find-projects')) {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q') || '';
      return (
        <FindProjectsPage
          navigate={navigate}
          onOpenPostProject={() => setShowPostProjectModal(true)}
          initialQuery={q}
        />
      );
    }

    if (path.startsWith('/offers/') && path !== '/offers') {
      const slug = path.replace('/offers/', '');
      return <OfferDetailView slugOrId={slug} navigate={navigate} />;
    }

    if (path === '/offers') {
      return (
        <OffersDirectoryPage
          navigate={navigate}
          onOpenCreateOffer={() => setShowCreateOfferModal(true)}
        />
      );
    }

    if (path.startsWith('/projects/')) {
      const slug = path.replace('/projects/', '');
      return <ProjectDetailView slugOrId={slug} navigate={navigate} />;
    }

    if (path.startsWith('/freelancers/')) {
      const username = path.replace('/freelancers/', '');
      return (
        <UserProfileView
          username={username}
          navigate={navigate}
          onOpenPostProject={() => setShowPostProjectModal(true)}
        />
      );
    }

    if (path === '/find-freelancers') {
      return <FindFreelancersPage navigate={navigate} />;
    }

    if (path.startsWith('/category/') || path.startsWith('/categories/') || path === '/categories' || path === '/category') {
      const cleanPath = path.split('?')[0].replace(/^\/(category|categories)\/?/, '') || 'all';
      return (
        <CategoryPage
          categorySlug={cleanPath}
          navigate={navigate}
          onOpenPostProject={() => setShowPostProjectModal(true)}
          onOpenCreateOffer={() => setShowCreateOfferModal(true)}
        />
      );
    }

    if (path.startsWith('/contracts/') && path !== '/contracts') {
      const cid = path.replace('/contracts/', '');
      return <ContractWorkspace contractId={cid} navigate={navigate} />;
    }

    if (path === '/contracts') {
      return <ContractsListView navigate={navigate} />;
    }

    if (path === '/wallet') {
      return <WalletPage />;
    }

    if (path === '/messages') {
      return <MessagingPage navigate={navigate} />;
    }

    if (path.startsWith('/disputes')) {
      const parts = path.split('/disputes/');
      const did = parts.length > 1 ? parts[1] : undefined;
      return <DisputesPage navigate={navigate} disputeId={did} />;
    }

    if (path === '/admin') {
      return <AdminPortal />;
    }

    if (path === '/escrow-policy') {
      return <EscrowPolicyPage navigate={navigate} />;
    }

    if (path === '/faq') {
      return <FAQPage navigate={navigate} />;
    }

    if (path === '/terms') {
      return <LegalPage type="terms" navigate={navigate} />;
    }

    if (path === '/privacy') {
      return <LegalPage type="privacy" navigate={navigate} />;
    }

    if (path === '/dispute-policy') {
      return <LegalPage type="dispute-policy" navigate={navigate} />;
    }

    if (path === '/post/best-fonts-for-websites' || path === '/post/best-fonts-for-websites/' || path === '/best-fonts' || path === '/fonts') {
      return <BestFontsArticlePage navigate={navigate} />;
    }

    if (path === '/support') {
      return <SupportPage navigate={navigate} />;
    }

    // Default Fallback to Homepage
    return (
      <HomePage
        navigate={navigate}
        onOpenPostProject={() => setShowPostProjectModal(true)}
        onOpenCreateOffer={() => setShowCreateOfferModal(true)}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#404145] selection:bg-[#1dbf73] selection:text-white">
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        onOpenPostProject={() => setShowPostProjectModal(true)}
        onOpenCreateOffer={() => setShowCreateOfferModal(true)}
      />

      <main className="flex-1">{renderCurrentRoute()}</main>

      <Footer navigate={navigate} />

      {/* Global Modals */}
      <PostProjectModal
        isOpen={showPostProjectModal}
        onClose={() => setShowPostProjectModal(false)}
        onProjectCreated={(project) => {
          navigate(`/projects/${project.slug}`);
        }}
      />

      <CreateOfferModal
        isOpen={showCreateOfferModal}
        onClose={() => setShowCreateOfferModal(false)}
        onOfferCreated={(offer) => {
          navigate(`/offers/${offer.slug}`);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
