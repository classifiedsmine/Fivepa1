import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ShieldAlert,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  Scale,
  CreditCard,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Check,
  X,
  HelpCircle,
  Database,
  Activity,
  Menu,
  Settings,
  Layers,
  Sparkles,
  Megaphone,
  ShieldCheck,
  Download,
  Terminal,
  Flag,
  UserCheck,
  Eye,
  Edit3,
  Plus,
  Trash2,
  Bell,
  Cpu,
  BarChart3,
  Shield,
  Send,
  ExternalLink,
  Filter,
  ToggleLeft,
  ToggleRight,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square,
  Power,
  Edit2,
} from 'lucide-react';
import {
  SystemKPIs,
  User,
  Contract,
  Dispute,
  LedgerEntry,
  WithdrawalRequest,
  SupportTicket,
  AdminAuditLog,
  AdminRoleType,
  AdminUserRole,
  FAQItem,
  LegalDocument,
  Announcement,
  NotificationTemplate,
  ReportedMessage,
  FraudRiskReport,
  SystemHealthStatus,
  MarketplaceSettings,
  Project,
  Offer,
  Proposal,
} from '../../types';

export const AdminPortal: React.FC = () => {
  const { currentUser, refreshWallet, impersonateUser } = useAuth();
  const { success, error } = useToast();

  // Helper for authenticated admin requests
  const authFetch = (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'x-user-id': currentUser?.id || '',
        'x-admin-id': currentUser?.id || '',
      },
    });
  };

  // Active Admin Role State (Role Switcher)
  const [activeAdminRole, setActiveAdminRole] = useState<AdminRoleType>('SUPER_ADMIN');

  // Navigation State
  const [activeTab, setActiveTab] = useState<
    | 'KPI'
    | 'ADMIN_ROLES'
    | 'USERS'
    | 'FRAUD'
    | 'PROJECTS'
    | 'OFFERS'
    | 'TAXONOMY'
    | 'PROPOSALS'
    | 'CONTRACTS'
    | 'DISPUTES'
    | 'LEDGER'
    | 'WITHDRAWALS'
    | 'SUPPORT'
    | 'MODERATION'
    | 'CONTENT'
    | 'NOTIFICATIONS'
    | 'REPORTS'
    | 'SETTINGS'
    | 'AUDIT'
  >('KPI');

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Domain Data States
  const [kpis, setKpis] = useState<SystemKPIs | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [adminStaff, setAdminStaff] = useState<AdminUserRole[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [reportedMessages, setReportedMessages] = useState<ReportedMessage[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [legalDocs, setLegalDocs] = useState<LegalDocument[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [fraudReports, setFraudReports] = useState<FraudRiskReport[]>([]);
  const [settings, setSettings] = useState<MarketplaceSettings | null>(null);
  const [health, setHealth] = useState<SystemHealthStatus | null>(null);

  // Form & Selection States
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionType, setResolutionType] = useState<
    'FULL_RELEASE_TO_FREELANCER' | 'FULL_REFUND_TO_CLIENT' | 'PARTIAL_SPLIT'
  >('FULL_RELEASE_TO_FREELANCER');
  const [clientRefundAmount, setClientRefundAmount] = useState(0);
  const [freelancerReleaseAmount, setFreelancerReleaseAmount] = useState(0);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isArbitrating, setIsArbitrating] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);
  const [docContent, setDocContent] = useState('');

  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newFaqCat, setNewFaqCat] = useState('General');

  const [ancTitle, setAncTitle] = useState('');
  const [ancMsg, setAncMsg] = useState('');
  const [ancType, setAncType] = useState<'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS'>('INFO');

  const [newSkillName, setNewSkillName] = useState('');

  // Category & Subcategory Management State
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<Record<string, string[]>>({});
  const [expandedCatIds, setExpandedCatIds] = useState<Record<string, boolean>>({});

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('Code');
  const [catSkills, setCatSkills] = useState('');
  const [catIsActive, setCatIsActive] = useState(true);

  // Subcategory Modal State
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [targetCatForSub, setTargetCatForSub] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<any | null>(null);
  const [subName, setSubName] = useState('');
  const [subSlug, setSubSlug] = useState('');
  const [subJobCount, setSubJobCount] = useState(0);
  const [subIsActive, setSubIsActive] = useState(true);

  // --- Category Handlers ---
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setCatIcon('Code');
    setCatSkills('');
    setCatIsActive(true);
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description || '');
    setCatIcon(cat.icon || 'Code');
    setCatSkills(Array.isArray(cat.popularSkills) ? cat.popularSkills.join(', ') : '');
    setCatIsActive(cat.isActive !== false);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      error('Validation Error', 'Category name is required.');
      return;
    }
    const payload = {
      name: catName,
      slug: catSlug || catName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      description: catDesc,
      icon: catIcon,
      popularSkills: catSkills.split(',').map(s => s.trim()).filter(Boolean),
      isActive: catIsActive,
    };

    try {
      let res;
      if (editingCategory) {
        res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await authFetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        success('Success', editingCategory ? 'Category updated successfully.' : 'Category created successfully.');
        setShowCategoryModal(false);
        fetchAdminData();
      } else {
        error('Error', data.error || 'Failed to save category.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleToggleCategoryStatus = async (catId: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/categories/${catId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Category Status Changed', `Category is now ${!currentActive ? 'ON (Active)' : 'OFF (Inactive)'}.`);
        fetchAdminData();
      } else {
        error('Error', data.error || 'Failed to toggle status.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleDeleteCategory = async (catId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${catId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Category Deleted', `Category "${name}" has been removed.`);
        setSelectedCategoryIds(prev => prev.filter(id => id !== catId));
        fetchAdminData();
      } else {
        error('Error', data.error || 'Failed to delete category.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleBulkCategoryStatus = async (isActive: boolean) => {
    if (selectedCategoryIds.length === 0) return;
    try {
      const res = await authFetch('/api/admin/categories/bulk-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryIds: selectedCategoryIds, isActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Bulk Status Updated', `${data.updatedCount} categories updated to ${isActive ? 'ON' : 'OFF'}.`);
        setSelectedCategoryIds([]);
        fetchAdminData();
      } else {
        error('Error', data.error || 'Bulk update failed.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleBulkDeleteCategories = async () => {
    if (selectedCategoryIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedCategoryIds.length} categories?`)) return;
    try {
      const res = await authFetch('/api/admin/categories/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryIds: selectedCategoryIds }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Bulk Delete Complete', `${data.deletedCount} categories deleted.`);
        setSelectedCategoryIds([]);
        fetchAdminData();
      } else {
        error('Error', data.error || 'Bulk delete failed.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  // --- Subcategory Handlers ---
  const handleOpenAddSubcategory = (catId: string) => {
    setTargetCatForSub(catId);
    setEditingSubcategory(null);
    setSubName('');
    setSubSlug('');
    setSubJobCount(0);
    setSubIsActive(true);
    setShowSubcategoryModal(true);
  };

  const handleOpenEditSubcategory = (catId: string, sub: any) => {
    setTargetCatForSub(catId);
    setEditingSubcategory(sub);
    setSubName(sub.name);
    setSubSlug(sub.slug);
    setSubJobCount(sub.jobCount || 0);
    setSubIsActive(sub.isActive !== false);
    setShowSubcategoryModal(true);
  };

  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCatForSub || !subName.trim()) {
      error('Validation Error', 'Subcategory name is required.');
      return;
    }
    const payload = {
      name: subName,
      slug: subSlug || subName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      jobCount: Number(subJobCount),
      isActive: subIsActive,
    };

    try {
      let res;
      if (editingSubcategory) {
        res = await fetch(`/api/admin/categories/${targetCatForSub}/subcategories/${editingSubcategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/categories/${targetCatForSub}/subcategories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        success('Success', editingSubcategory ? 'Subcategory updated.' : 'Subcategory created.');
        setShowSubcategoryModal(false);
        fetchAdminData();
      } else {
        error('Error', data.error || 'Failed to save subcategory.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleToggleSubcategoryStatus = async (catId: string, subId: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/categories/${catId}/subcategories/${subId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Subcategory Status Changed', `Subcategory is now ${!currentActive ? 'ON (Active)' : 'OFF (Inactive)'}.`);
        fetchAdminData();
      } else {
        error('Error', data.error || 'Failed to toggle subcategory status.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleDeleteSubcategory = async (catId: string, subId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete subcategory "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${catId}/subcategories/${subId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Subcategory Deleted', `Subcategory "${name}" removed.`);
        setSelectedSubcategoryIds(prev => ({
          ...prev,
          [catId]: (prev[catId] || []).filter(id => id !== subId),
        }));
        fetchAdminData();
      } else {
        error('Error', data.error || 'Failed to delete subcategory.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleBulkSubcategoryStatus = async (catId: string, isActive: boolean) => {
    const subIds = selectedSubcategoryIds[catId] || [];
    if (subIds.length === 0) return;
    try {
      const res = await fetch(`/api/admin/categories/${catId}/subcategories/bulk-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subIds, isActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Bulk Status Updated', `${data.updatedCount} subcategories updated to ${isActive ? 'ON' : 'OFF'}.`);
        setSelectedSubcategoryIds(prev => ({ ...prev, [catId]: [] }));
        fetchAdminData();
      } else {
        error('Error', data.error || 'Bulk update failed.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleBulkDeleteSubcategories = async (catId: string) => {
    const subIds = selectedSubcategoryIds[catId] || [];
    if (subIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${subIds.length} subcategories?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${catId}/subcategories/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subIds }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Bulk Delete Complete', `${data.deletedCount} subcategories deleted.`);
        setSelectedSubcategoryIds(prev => ({ ...prev, [catId]: [] }));
        fetchAdminData();
      } else {
        error('Error', data.error || 'Bulk delete failed.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  // Compensating Transaction State
  const [showCompensatingModal, setShowCompensatingModal] = useState(false);
  const [compTargetUserId, setCompTargetUserId] = useState('');
  const [compOriginalTxId, setCompOriginalTxId] = useState('');
  const [compAmount, setCompAmount] = useState<number>(0);
  const [compAdjustmentType, setCompAdjustmentType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [compReason, setCompReason] = useState('');
  const [isSubmittingComp, setIsSubmittingComp] = useState(false);

  const handleIssueCompensatingTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compTargetUserId || !compOriginalTxId || compAmount <= 0 || !compReason.trim()) {
      error('Validation Error', 'Please fill all required fields for compensating transaction.');
      return;
    }
    setIsSubmittingComp(true);
    try {
      const res = await authFetch('/api/admin/compensating-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: currentUser?.id || 'usr-admin',
          targetUserId: compTargetUserId,
          originalTxId: compOriginalTxId,
          amount: compAmount,
          adjustmentType: compAdjustmentType,
          reason: compReason,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Compensating Transaction Issued', `Traceable adjustment #${data.entry.id} recorded in double-entry ledger.`);
        setShowCompensatingModal(false);
        setCompTargetUserId('');
        setCompOriginalTxId('');
        setCompAmount(0);
        setCompReason('');
        await refreshWallet();
        await fetchAdminData();
      } else {
        error('Transaction Failed', data.error || 'Failed to issue compensating transaction.');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsSubmittingComp(false);
    }
  };

  // Fetch Master Admin Data
  const fetchAdminData = async () => {
    try {
      const [
        kpiRes,
        usrRes,
        ctrRes,
        dspRes,
        ledRes,
        wthRes,
        tktRes,
        logRes,
        stfRes,
        prjRes,
        ofrRes,
        catRes,
        sklRes,
        repRes,
        faqRes,
        legRes,
        ancRes,
        frdRes,
        setRes,
        hltRes,
      ] = await Promise.all([
        authFetch('/api/admin/kpis').then((r) => r.json()),
        authFetch('/api/admin/users').then((r) => r.json()),
        authFetch('/api/contracts').then((r) => r.json()),
        authFetch('/api/disputes').then((r) => r.json()),
        authFetch('/api/admin/ledger').then((r) => r.json()),
        authFetch('/api/admin/withdrawals').then((r) => r.json()),
        authFetch('/api/admin/support-tickets').then((r) => r.json()),
        authFetch('/api/admin/audit-logs').then((r) => r.json()),
        authFetch('/api/admin/roles').then((r) => r.json()),
        authFetch('/api/admin/projects').then((r) => r.json()),
        authFetch('/api/admin/offers').then((r) => r.json()),
        authFetch('/api/admin/categories').then((r) => r.json()),
        authFetch('/api/admin/skills').then((r) => r.json()),
        authFetch('/api/admin/reported-messages').then((r) => r.json()),
        authFetch('/api/admin/faqs').then((r) => r.json()),
        authFetch('/api/admin/legal-docs').then((r) => r.json()),
        authFetch('/api/admin/announcements').then((r) => r.json()),
        authFetch('/api/admin/fraud-reports').then((r) => r.json()),
        authFetch('/api/admin/settings').then((r) => r.json()),
        authFetch('/api/admin/health').then((r) => r.json()),
      ]);

      if (kpiRes.kpis) setKpis(kpiRes.kpis);
      if (usrRes.users) setUsers(usrRes.users);
      if (ctrRes.contracts) setContracts(ctrRes.contracts);
      if (dspRes.disputes) setDisputes(dspRes.disputes);
      if (ledRes.ledger) setLedger(ledRes.ledger);
      if (wthRes.withdrawals) setWithdrawals(wthRes.withdrawals);
      if (tktRes.tickets) setSupportTickets(tktRes.tickets);
      if (logRes.logs) setAuditLogs(logRes.logs);
      if (stfRes.adminStaff) setAdminStaff(stfRes.adminStaff);
      if (prjRes.projects) setProjects(prjRes.projects);
      if (ofrRes.offers) setOffers(ofrRes.offers);
      if (catRes.categories) setCategories(catRes.categories);
      if (sklRes.skills) setSkills(sklRes.skills);
      if (repRes.reportedMessages) setReportedMessages(repRes.reportedMessages);
      if (faqRes.faqs) setFaqs(faqRes.faqs);
      if (legRes.legalDocuments) {
        setLegalDocs(legRes.legalDocuments);
        if (legRes.legalDocuments.length > 0 && !selectedDoc) {
          setSelectedDoc(legRes.legalDocuments[0]);
          setDocContent(legRes.legalDocuments[0].content);
        }
      }
      if (ancRes.announcements) setAnnouncements(ancRes.announcements);
      if (frdRes.fraudReports) setFraudReports(frdRes.fraudReports);
      if (setRes.settings) setSettings(setRes.settings);
      if (hltRes.health) setHealth(hltRes.health);
    } catch (e) {
      console.error('Failed to fetch admin data', e);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Handlers
  const handleUserStatus = async (userId: string, status: User['status']) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminId: currentUser.id }),
      });
      const data = await res.json();
      if (data.user) {
        success('User Status Updated', `Account status set to ${status}. Logged to audit trail.`);
        fetchAdminData();
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleVerifyKYC = async (userId: string) => {
    try {
      const res = await authFetch('/api/auth/verify-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: 'VERIFIED' }),
      });
      const data = await res.json();
      if (data.user) {
        success('User Verified', 'Identity credentials confirmed.');
        fetchAdminData();
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleProjectStatus = async (id: string, status: Project['status']) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        success('Project Moderated', `Project status changed to ${status}.`);
        fetchAdminData();
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleOfferStatus = async (id: string, status: Offer['status']) => {
    try {
      const res = await fetch(`/api/admin/offers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        success('Offer Moderated', `Offer status changed to ${status}.`);
        fetchAdminData();
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  // Project Edit & Delete State & Handlers
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjTitle, setEditProjTitle] = useState('');
  const [editProjDesc, setEditProjDesc] = useState('');
  const [editProjCategory, setEditProjCategory] = useState('');
  const [editProjBudget, setEditProjBudget] = useState(0);
  const [editProjStatus, setEditProjStatus] = useState<Project['status']>('PUBLISHED');

  const handleOpenEditProject = (p: Project) => {
    setEditingProject(p);
    setEditProjTitle(p.title);
    setEditProjDesc(p.description);
    setEditProjCategory(p.category);
    setEditProjBudget(p.budget);
    setEditProjStatus(p.status);
    setShowProjectModal(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      const res = await fetch(`/api/admin/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': currentUser.id,
        },
        body: JSON.stringify({
          title: editProjTitle,
          description: editProjDesc,
          category: editProjCategory,
          budget: Number(editProjBudget),
          status: editProjStatus,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Project Updated', `Project "${editProjTitle}" updated successfully.`);
        setShowProjectModal(false);
        fetchAdminData();
      } else {
        error('Error', data.error || 'Failed to update project.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleDeleteProject = async (projectId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete project "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'x-admin-id': currentUser.id },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Project Deleted', `Project "${title}" deleted.`);
        fetchAdminData();
      } else {
        error('Error', data.error || 'Failed to delete project.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  // Offer Edit & Delete State & Handlers
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editOfferTitle, setEditOfferTitle] = useState('');
  const [editOfferDesc, setEditOfferDesc] = useState('');
  const [editOfferCategory, setEditOfferCategory] = useState('');
  const [editOfferPrice, setEditOfferPrice] = useState(0);
  const [editOfferStatus, setEditOfferStatus] = useState<Offer['status']>('ACTIVE');
  const [editOfferFeatured, setEditOfferFeatured] = useState(false);

  const handleOpenEditOffer = (o: Offer) => {
    setEditingOffer(o);
    setEditOfferTitle(o.title);
    setEditOfferDesc(o.description);
    setEditOfferCategory(o.category);
    setEditOfferPrice(o.price || o.packages?.basic?.price || 75);
    setEditOfferStatus(o.status);
    setEditOfferFeatured(Boolean(o.featured));
    setShowOfferModal(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;
    try {
      const res = await fetch(`/api/admin/offers/${editingOffer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': currentUser.id,
        },
        body: JSON.stringify({
          title: editOfferTitle,
          description: editOfferDesc,
          category: editOfferCategory,
          price: Number(editOfferPrice),
          status: editOfferStatus,
          featured: editOfferFeatured,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Offer Updated', `Service offer/gig "${editOfferTitle}" updated successfully.`);
        setShowOfferModal(false);
        fetchAdminData();
      } else {
        error('Error', data.error || 'Failed to update offer.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleDeleteOffer = async (offerId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete service offer/gig "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/offers/${offerId}`, {
        method: 'DELETE',
        headers: { 'x-admin-id': currentUser.id },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success('Offer Deleted', `Service offer/gig "${title}" deleted.`);
        fetchAdminData();
      } else {
        error('Error', data.error || 'Failed to delete offer.');
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleArbitrateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;

    setIsArbitrating(true);
    try {
      const res = await fetch(`/api/disputes/${selectedDispute.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: currentUser.id,
          resolution: resolutionType,
          notes: resolutionNotes,
          clientRefundAmount: Number(clientRefundAmount),
          freelancerReleaseAmount: Number(freelancerReleaseAmount),
        }),
      });

      const data = await res.json();
      if (data.dispute) {
        await refreshWallet();
        success(
          'Dispute Resolved & Settled',
          `Ruling executed on double-entry ledger. Resolution: ${resolutionType}.`
        );
        setSelectedDispute(null);
        fetchAdminData();
      } else {
        error('Arbitration Error', data.error || 'Failed to resolve dispute');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsArbitrating(false);
    }
  };

  const handleApproveWithdrawal = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: currentUser.id }),
      });
      const data = await res.json();
      if (data.withdrawal) {
        success('Withdrawal Approved', 'Payout sent to banking network and ledger reconciled.');
        fetchAdminData();
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      const res = await fetch(`/api/admin/support-tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminName: currentUser.name,
          content: replyMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.ticket) {
        success('Reply Sent', 'Ticket updated and notification delivered to user.');
        setReplyMessage('');
        fetchAdminData();
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ || !newFaqA) return;
    try {
      const res = await authFetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newFaqQ, answer: newFaqA, category: newFaqCat }),
      });
      if (res.ok) {
        success('FAQ Published', 'Added new FAQ item.');
        setNewFaqQ('');
        setNewFaqA('');
        fetchAdminData();
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
      success('FAQ Removed', 'Item deleted.');
      fetchAdminData();
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleSaveLegalDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;
    try {
      const res = await fetch(`/api/admin/legal-docs/${selectedDoc.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: docContent }),
      });
      if (res.ok) {
        success('Legal Document Saved', `${selectedDoc.title} updated successfully.`);
        fetchAdminData();
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancTitle || !ancMsg) return;
    try {
      const res = await authFetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: ancTitle, message: ancMsg, type: ancType, targetAudience: 'ALL' }),
      });
      if (res.ok) {
        success('Announcement Broadcasted', 'Notification banner published platform-wide.');
        setAncTitle('');
        setAncMsg('');
        fetchAdminData();
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      const res = await authFetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillName: newSkillName.trim(), categoryId: categories[0]?.id }),
      });
      if (res.ok) {
        success('Skill Added', `Added "${newSkillName}" to skills directory.`);
        setNewSkillName('');
        fetchAdminData();
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        success('Settings Saved', 'Marketplace & Escrow configuration updated.');
        fetchAdminData();
      }
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleResetDemo = async () => {
    if (confirm('Reset database to initial pristine seed dataset?')) {
      await authFetch('/api/admin/reset-demo-data', { method: 'POST' });
      await refreshWallet();
      await fetchAdminData();
      success('Database Reset', 'Initialized pristine demonstration data.');
    }
  };

  const handleExportCSV = (filename: string, rows: object[]) => {
    if (!rows || rows.length === 0) return;
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows
        .map((row: any) =>
          keys
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? '' : row[k];
              if (typeof cell === 'object') cell = JSON.stringify(cell);
              cell = cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
              return cell;
            })
            .join(separator)
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Export Complete', `Downloaded ${filename}.csv`);
  };

  // Nav Groups Definition
  const sidebarGroups: {
    title: string;
    items: {
      id: typeof activeTab;
      label: string;
      icon: React.FC<{ className?: string }>;
      count?: number;
    }[];
  }[] = [
    {
      title: 'Overview & Roles',
      items: [
        { id: 'KPI', label: 'Dashboard & Health', icon: Activity },
        { id: 'ADMIN_ROLES', label: 'Admin Roles & Staff', icon: Shield, count: adminStaff.length },
      ],
    },
    {
      title: 'User & Security Management',
      items: [
        { id: 'USERS', label: 'User Directory & KYC', icon: Users, count: users.length },
        { id: 'FRAUD', label: 'Fraud & Risk Sentinel', icon: ShieldAlert, count: fraudReports.length },
      ],
    },
    {
      title: 'Marketplace Content',
      items: [
        { id: 'PROJECTS', label: 'Projects & Requests', icon: Briefcase, count: projects.length },
        { id: 'OFFERS', label: 'Services & Offers', icon: Sparkles, count: offers.length },
        { id: 'TAXONOMY', label: 'Categories & Skills', icon: Layers, count: categories.length },
      ],
    },
    {
      title: 'Contracts & Escrow',
      items: [
        { id: 'CONTRACTS', label: 'Contracts & Timeline', icon: FileText, count: contracts.length },
        { id: 'DISPUTES', label: 'Dispute Arbitration', icon: Scale, count: disputes.length },
      ],
    },
    {
      title: 'Financial Ledger & Payouts',
      items: [
        { id: 'LEDGER', label: 'Double-Entry Ledger', icon: DollarSign, count: ledger.length },
        { id: 'WITHDRAWALS', label: 'Payout Requests', icon: CreditCard, count: withdrawals.length },
      ],
    },
    {
      title: 'Support & Content',
      items: [
        { id: 'SUPPORT', label: 'Support Tickets', icon: HelpCircle, count: supportTickets.length },
        { id: 'MODERATION', label: 'Reported Content', icon: Flag, count: reportedMessages.length },
        { id: 'CONTENT', label: 'Legal Pages & Banners', icon: Edit3, count: legalDocs.length },
        { id: 'NOTIFICATIONS', label: 'Notification System', icon: Bell },
      ],
    },
    {
      title: 'System & Analytics',
      items: [
        { id: 'REPORTS', label: 'Marketplace Reports', icon: BarChart3 },
        { id: 'SETTINGS', label: 'Platform Settings', icon: Settings },
        { id: 'AUDIT', label: 'Audit Trail Logs', icon: Terminal, count: auditLogs.length },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 -mt-6 -mx-4 sm:-mx-6 lg:-mx-8 p-4 sm:p-6 lg:p-8">
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[880px]">
        {/* Mobile Top Header */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white leading-tight">Admin Console</h2>
              <span className="text-[10px] text-emerald-400 font-mono">{activeAdminRole}</span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`
            fixed md:relative top-0 left-0 z-50 md:z-auto h-full w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out shrink-0
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Sidebar Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-sm">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-white tracking-wide">WorkSphere</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">ENTERPRISE ADMIN</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Admin Role Selector */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-950/50 space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
              Active Admin Role:
            </label>
            <select
              value={activeAdminRole}
              onChange={(e) => setActiveAdminRole(e.target.value as AdminRoleType)}
              className="w-full bg-slate-800 text-emerald-400 text-xs font-mono font-bold py-1.5 px-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="SUPER_ADMIN">👑 SUPER_ADMIN</option>
              <option value="FINANCE_ADMIN">💰 FINANCE_ADMIN</option>
              <option value="DISPUTE_ADMIN">⚖️ DISPUTE_ADMIN</option>
              <option value="SUPPORT_ADMIN">🎧 SUPPORT_ADMIN</option>
              <option value="MODERATOR">🛡️ MODERATOR</option>
              <option value="CONTENT_ADMIN">📝 CONTENT_ADMIN</option>
              <option value="SECURITY_ADMIN">🔒 SECURITY_ADMIN</option>
            </select>
          </div>

          {/* Navigation Groups */}
          <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
            {sidebarGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {group.title}
                </div>
                {group.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl transition flex items-center justify-between text-xs font-medium ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {tab.count !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                            isActive
                              ? 'bg-slate-950 text-emerald-400'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
            <button
              onClick={handleResetDemo}
              className="w-full px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <Database className="w-3.5 h-3.5 text-slate-400" /> Reset Demo DB
            </button>
            <div className="text-[10px] text-slate-500 text-center font-mono">
              WorkSphere Admin v3.2 · {activeAdminRole}
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 bg-slate-50/50 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {/* Top Admin Header Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold border border-emerald-300">
                  {activeAdminRole} PRIVILEGES
                </span>
                <span className="text-xs text-slate-500 font-medium">Arbiter: {currentUser.name}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                WorkSphere Master Administration
              </h1>
            </div>

            {/* Global Search & Export Controls */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Global Admin Search..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium w-48 sm:w-64 focus:outline-none focus:border-slate-400"
                />
              </div>

              <button
                onClick={() => handleExportCSV('admin_data_export', users)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" /> Export CSV
              </button>
            </div>
          </div>

          {/* TAB 1: KPI & SYSTEM HEALTH */}
          {activeTab === 'KPI' && kpis && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Gross Payment Volume (GMV)
                  </span>
                  <div className="text-3xl font-black text-slate-900">${kpis.grossMerchandiseValue.toLocaleString()}</div>
                  <span className="text-xs text-emerald-700 font-semibold block mt-1">
                    Platform Revenue: ${kpis.platformRevenue.toFixed(2)}
                  </span>
                </div>

                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    In 14-Day Protection Hold
                  </span>
                  <div className="text-3xl font-black text-amber-950">${kpis.escrowInProtectionPeriod.toLocaleString()}</div>
                  <span className="text-xs text-amber-800 font-medium block mt-1">
                    Total Escrow Locked: ${kpis.escrowLockedTotal.toLocaleString()}
                  </span>
                </div>

                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Active Contracts
                  </span>
                  <div className="text-3xl font-black text-slate-900">{kpis.activeContracts}</div>
                  <span className="text-xs text-slate-500 block mt-1">
                    Active Projects: {kpis.activeProjects} · Offers: {kpis.activeOffers}
                  </span>
                </div>

                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Open Disputes & Payouts
                  </span>
                  <div className="text-3xl font-black text-rose-600">{kpis.openDisputesCount} Disputes</div>
                  <span className="text-xs text-slate-500 block mt-1">
                    {kpis.pendingWithdrawalsCount} pending bank withdrawals
                  </span>
                </div>
              </div>

              {/* System Health Monitoring */}
              {health && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-emerald-600" />
                      <h2 className="text-base font-bold text-slate-900">Realtime System Health & Background Services</h2>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      {health.apiStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">DB Latency</span>
                      <strong className="text-slate-900 text-base">{health.dbLatencyMs} ms</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">CPU Load</span>
                      <strong className="text-slate-900 text-base">{health.cpuUsagePct}%</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">Memory Usage</span>
                      <strong className="text-slate-900 text-base">{health.memoryUsagePct}%</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">Active WebSockets</span>
                      <strong className="text-slate-900 text-base">{health.activeSockets}</strong>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Background Workers & Automated Sentinels
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {health.bgWorkers.map((worker, i) => (
                        <div
                          key={i}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <strong className="text-slate-900 block">{worker.name}</strong>
                            <span className="text-[10px] text-slate-400">Last heartbeat: {new Date(worker.lastRun).toLocaleTimeString()}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                            {worker.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADMIN ROLES & STAFF */}
          {activeTab === 'ADMIN_ROLES' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Admin Staff & Role Management</h2>
                  <p className="text-xs text-slate-500">Configure role privileges, MFA mandates, and access control</p>
                </div>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-bold">
                  {adminStaff.length} Admin Accounts
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="p-4">Staff Member</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4">MFA Status</th>
                      <th className="p-4">Permissions Scopes</th>
                      <th className="p-4 text-right">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminStaff.map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 flex items-center gap-3">
                          <img src={staff.avatar} alt={staff.name} className="w-8 h-8 rounded-xl object-cover" />
                          <div>
                            <strong className="text-slate-900 block font-bold">{staff.name}</strong>
                            <span className="text-slate-400 font-mono text-[11px]">{staff.email}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold">
                          <span className="px-2 py-0.5 bg-slate-900 text-emerald-400 rounded text-[10px]">
                            {staff.role}
                          </span>
                        </td>
                        <td className="p-4">
                          {staff.mfaEnabled ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> MFA Enabled
                            </span>
                          ) : (
                            <span className="text-amber-700 font-bold">MFA Required</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-600">
                          {staff.permissions.map((p, i) => (
                            <span key={i} className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono mr-1">
                              {p}
                            </span>
                          ))}
                        </td>
                        <td className="p-4 text-right text-slate-400 font-mono text-[11px]">
                          {new Date(staff.lastActive).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: USER DIRECTORY & KYC */}
          {activeTab === 'USERS' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Unified User Directory & KYC Moderation</h2>
                  <p className="text-xs text-slate-500">Identity verification, suspension controls, and financial activity oversight</p>
                </div>
                <span className="text-xs text-slate-500 font-medium">{users.length} Total Users</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="p-4">User</th>
                      <th className="p-4">Role & Title</th>
                      <th className="p-4">Account Status</th>
                      <th className="p-4">KYC Verification</th>
                      <th className="p-4 text-right">Financial Totals</th>
                      <th className="p-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users
                      .filter((u) =>
                        globalSearch
                          ? u.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
                            u.email.toLowerCase().includes(globalSearch.toLowerCase())
                          : true
                      )
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 flex items-center gap-3">
                            <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover" />
                            <div>
                              <strong className="text-slate-900 text-sm block font-bold">{u.name}</strong>
                              <span className="text-slate-500 font-mono text-[11px]">{u.email}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-700 block">{u.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{u.country}</span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.status === 'ACTIVE'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {u.verificationStatus === 'VERIFIED' ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                              </span>
                            ) : (
                              <button
                                onClick={() => handleVerifyKYC(u.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                              >
                                Approve KYC
                              </button>
                            )}
                          </td>
                          <td className="p-4 text-right font-mono">
                            <div>Earned: <strong>${u.totalEarned.toLocaleString()}</strong></div>
                            <div className="text-slate-400">Spent: ${u.totalSpent.toLocaleString()}</div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => impersonateUser(u.id)}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold flex items-center gap-1 shadow-2xs transition"
                                title="Act as real profile or user"
                              >
                                <ShieldAlert className="w-3 h-3" /> Act as User
                              </button>
                              {u.status === 'ACTIVE' ? (
                                <button
                                  onClick={() => handleUserStatus(u.id, 'SUSPENDED')}
                                  className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded font-semibold hover:bg-rose-100"
                                >
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserStatus(u.id, 'ACTIVE')}
                                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold hover:bg-emerald-100"
                                >
                                  Reactivate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: FRAUD & RISK SENTINEL */}
          {activeTab === 'FRAUD' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Fraud Detection & Anomaly Sentinel</h2>
                  <p className="text-xs text-slate-500">Automated risk scoring, velocity checks, and transaction auditing</p>
                </div>
                <span className="text-xs font-mono text-rose-700 bg-rose-50 px-2.5 py-1 rounded font-bold">
                  {fraudReports.length} Active Security Flags
                </span>
              </div>

              <div className="p-6 space-y-4">
                {fraudReports.map((report) => (
                  <div key={report.id} className="p-4 bg-rose-50/50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-rose-600 text-white font-mono text-[10px] font-black rounded">
                          RISK SCORE: {report.riskScore}/100
                        </span>
                        <strong className="text-slate-900 text-sm">{report.userName}</strong>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{report.flagReason}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">Detected: {new Date(report.detectedAt).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUserStatus(report.userId, 'SUSPENDED')}
                        className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700"
                      >
                        Suspend User
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROJECTS MODERATION */}
          {activeTab === 'PROJECTS' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Buyer Projects & Job Request Moderation</h2>
                  <p className="text-xs text-slate-500">Review project listings, budget allocations, and compliance</p>
                </div>
                <span className="text-xs font-mono text-slate-600">{projects.length} Projects</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="p-4">Project Title</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Budget</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <strong className="text-slate-900 text-sm block">{p.title}</strong>
                          <span className="text-[10px] font-mono text-slate-400">ID: {p.id}</span>
                        </td>
                        <td className="p-4 font-semibold text-slate-800">{p.client.name}</td>
                        <td className="p-4 text-slate-600">{p.category}</td>
                        <td className="p-4 text-right font-mono font-bold text-slate-900">${p.budget}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px]">
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditProject(p)}
                              className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded text-[11px] font-bold flex items-center gap-1 transition"
                              title="Edit Project"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            {p.status === 'PUBLISHED' ? (
                              <button
                                onClick={() => handleProjectStatus(p.id, 'ARCHIVED')}
                                className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[11px] font-bold"
                              >
                                Archive
                              </button>
                            ) : (
                              <button
                                onClick={() => handleProjectStatus(p.id, 'PUBLISHED')}
                                className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-bold"
                              >
                                Publish
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteProject(p.id, p.title)}
                              className="p-1 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded text-[11px] font-bold transition"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: OFFERS MODERATION */}
          {activeTab === 'OFFERS' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Service Offers & Gig Moderation</h2>
                  <p className="text-xs text-slate-500">Audit published service offerings and add-ons</p>
                </div>
                <span className="text-xs font-mono text-slate-600">{offers.length} Published Offers</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="p-4">Service Offer</th>
                      <th className="p-4">Freelancer</th>
                      <th className="p-4 text-right">Base Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {offers.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <strong className="text-slate-900 text-sm block">{o.title}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">Category: {o.category}</span>
                        </td>
                        <td className="p-4 font-semibold text-slate-800">{o.freelancer.name}</td>
                        <td className="p-4 text-right font-mono font-bold text-slate-900">
                          ${o.price || o.packages?.basic?.price || 75}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditOffer(o)}
                              className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded text-[11px] font-bold flex items-center gap-1 transition"
                              title="Edit Service / Gig"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleOfferStatus(o.id, o.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-[11px]"
                            >
                              Toggle Status
                            </button>
                            <button
                              onClick={() => handleDeleteOffer(o.id, o.title)}
                              className="p-1 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded text-[11px] font-bold transition"
                              title="Delete Service / Gig"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: TAXONOMY & SKILLS */}
          {activeTab === 'TAXONOMY' && (
            <div className="space-y-6">
              {/* Categories & Subcategories Dashboard */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-600" />
                      Categories & Subcategories Management
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Create, edit, delete, toggle ON/OFF categories and subcategories with bulk management capabilities.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenAddCategory}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Plus className="w-4 h-4" /> Add Category
                    </button>
                  </div>
                </div>

                {/* Bulk Actions Bar for Categories */}
                {selectedCategoryIds.length > 0 && (
                  <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold">
                        {selectedCategoryIds.length} Selected
                      </span>
                      <span className="text-xs text-indigo-900 font-medium">Bulk Actions:</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleBulkCategoryStatus(true)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Power className="w-3.5 h-3.5" /> Bulk Turn ON
                      </button>
                      <button
                        onClick={() => handleBulkCategoryStatus(false)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Power className="w-3.5 h-3.5" /> Bulk Turn OFF
                      </button>
                      <button
                        onClick={handleBulkDeleteCategories}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Bulk Delete
                      </button>
                      <button
                        onClick={() => setSelectedCategoryIds([])}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                )}

                {/* Category Selection Header Bar */}
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={categories.length > 0 && selectedCategoryIds.length === categories.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategoryIds(categories.map((c) => c.id));
                        } else {
                          setSelectedCategoryIds([]);
                        }
                      }}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Select All Categories ({categories.length})</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    Active: {categories.filter((c) => c.isActive !== false).length} / Inactive:{' '}
                    {categories.filter((c) => c.isActive === false).length}
                  </span>
                </div>

                {/* Categories List */}
                <div className="space-y-4">
                  {categories.map((cat) => {
                    const isSelected = selectedCategoryIds.includes(cat.id);
                    const isExpanded = expandedCatIds[cat.id] ?? true;
                    const subList = cat.subcategories || [];
                    const selSubs = selectedSubcategoryIds[cat.id] || [];

                    return (
                      <div
                        key={cat.id}
                        className={`border rounded-2xl transition overflow-hidden bg-white shadow-xs ${
                          cat.isActive === false ? 'border-slate-200 bg-slate-50/50' : 'border-slate-200'
                        }`}
                      >
                        {/* Category Header Row */}
                        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex items-start md:items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCategoryIds((prev) => [...prev, cat.id]);
                                } else {
                                  setSelectedCategoryIds((prev) => prev.filter((id) => id !== cat.id));
                                }
                              }}
                              className="mt-1 md:mt-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                            />

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                                <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                                  {cat.slug}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                    cat.isActive !== false
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-slate-200 text-slate-600 border border-slate-300'
                                  }`}
                                >
                                  {cat.isActive !== false ? '● ON (Active)' : '○ OFF (Inactive)'}
                                </span>
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md border border-indigo-200">
                                  {subList.length} Subcategories
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-1">{cat.description}</p>
                              {cat.popularSkills && cat.popularSkills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {cat.popularSkills.map((s: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-600 text-[10px] rounded font-medium"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 self-end md:self-center">
                            {/* Toggle ON/OFF Switch */}
                            <button
                              onClick={() => handleToggleCategoryStatus(cat.id, cat.isActive !== false)}
                              title={cat.isActive !== false ? 'Turn OFF Category' : 'Turn ON Category'}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                                cat.isActive !== false
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              }`}
                            >
                              <Power className="w-3.5 h-3.5" />
                              {cat.isActive !== false ? 'ON' : 'OFF'}
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                              title="Edit Category"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>

                            {/* Add Subcategory */}
                            <button
                              onClick={() => handleOpenAddSubcategory(cat.id)}
                              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1"
                              title="Add Subcategory under this category"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">+ Subcategory</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Expand / Collapse Toggle */}
                            <button
                              onClick={() =>
                                setExpandedCatIds((prev) => ({
                                  ...prev,
                                  [cat.id]: !isExpanded,
                                }))
                              }
                              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600"
                              title={isExpanded ? 'Collapse Subcategories' : 'Expand Subcategories'}
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Subcategories Accordion Content */}
                        {isExpanded && (
                          <div className="p-4 bg-white border-t border-slate-100 space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                Subcategories ({subList.length})
                              </span>

                              {/* Subcategory Bulk Action Bar */}
                              {selSubs.length > 0 ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                    {selSubs.length} Selected
                                  </span>
                                  <button
                                    onClick={() => handleBulkSubcategoryStatus(cat.id, true)}
                                    className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                                  >
                                    Bulk ON
                                  </button>
                                  <button
                                    onClick={() => handleBulkSubcategoryStatus(cat.id, false)}
                                    className="px-2 py-1 bg-slate-700 text-white rounded text-[10px] font-bold"
                                  >
                                    Bulk OFF
                                  </button>
                                  <button
                                    onClick={() => handleBulkDeleteSubcategories(cat.id)}
                                    className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold"
                                  >
                                    Bulk Delete
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleOpenAddSubcategory(cat.id)}
                                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Subcategory
                                </button>
                              )}
                            </div>

                            {subList.length === 0 ? (
                              <p className="text-xs text-slate-400 italic py-2">
                                No subcategories added yet. Click "+ Subcategory" to add one.
                              </p>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                      <th className="p-2.5 w-8">
                                        <input
                                          type="checkbox"
                                          checked={subList.length > 0 && selSubs.length === subList.length}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedSubcategoryIds((prev) => ({
                                                ...prev,
                                                [cat.id]: subList.map((s: any) => s.id),
                                              }));
                                            } else {
                                              setSelectedSubcategoryIds((prev) => ({
                                                ...prev,
                                                [cat.id]: [],
                                              }));
                                            }
                                          }}
                                          className="rounded border-slate-300 text-indigo-600 w-3.5 h-3.5 cursor-pointer"
                                        />
                                      </th>
                                      <th className="p-2.5">Subcategory Name</th>
                                      <th className="p-2.5">Slug</th>
                                      <th className="p-2.5 text-center">Jobs / Offers</th>
                                      <th className="p-2.5">Status</th>
                                      <th className="p-2.5 text-right">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {subList.map((sub: any) => {
                                      const isSubSel = selSubs.includes(sub.id);

                                      return (
                                        <tr
                                          key={sub.id}
                                          className={`hover:bg-slate-50 transition ${
                                            sub.isActive === false ? 'opacity-60 bg-slate-50/50' : ''
                                          }`}
                                        >
                                          <td className="p-2.5">
                                            <input
                                              type="checkbox"
                                              checked={isSubSel}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setSelectedSubcategoryIds((prev) => ({
                                                    ...prev,
                                                    [cat.id]: [...(prev[cat.id] || []), sub.id],
                                                  }));
                                                } else {
                                                  setSelectedSubcategoryIds((prev) => ({
                                                    ...prev,
                                                    [cat.id]: (prev[cat.id] || []).filter((id) => id !== sub.id),
                                                  }));
                                                }
                                              }}
                                              className="rounded border-slate-300 text-indigo-600 w-3.5 h-3.5 cursor-pointer"
                                            />
                                          </td>
                                          <td className="p-2.5 font-bold text-slate-800">{sub.name}</td>
                                          <td className="p-2.5 font-mono text-slate-500 text-[11px]">{sub.slug}</td>
                                          <td className="p-2.5 text-center font-mono font-semibold text-slate-700">
                                            {sub.jobCount || 0}
                                          </td>
                                          <td className="p-2.5">
                                            <span
                                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                                sub.isActive !== false
                                                  ? 'bg-emerald-100 text-emerald-800'
                                                  : 'bg-slate-200 text-slate-600'
                                              }`}
                                            >
                                              {sub.isActive !== false ? 'ON' : 'OFF'}
                                            </span>
                                          </td>
                                          <td className="p-2.5 text-right space-x-1">
                                            {/* Subcategory Status Toggle */}
                                            <button
                                              onClick={() =>
                                                handleToggleSubcategoryStatus(cat.id, sub.id, sub.isActive !== false)
                                              }
                                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                                sub.isActive !== false
                                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                  : 'bg-slate-200 text-slate-700'
                                              }`}
                                            >
                                              {sub.isActive !== false ? 'Turn OFF' : 'Turn ON'}
                                            </button>

                                            {/* Subcategory Edit */}
                                            <button
                                              onClick={() => handleOpenEditSubcategory(cat.id, sub)}
                                              className="px-2 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded text-[10px] font-bold"
                                            >
                                              Edit
                                            </button>

                                            {/* Subcategory Delete */}
                                            <button
                                              onClick={() => handleDeleteSubcategory(cat.id, sub.id, sub.name)}
                                              className="px-2 py-1 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded text-[10px] font-bold"
                                            >
                                              Delete
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills Directory Manager */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-lg font-bold text-slate-900">Skills Directory ({skills.length})</h2>
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Enter new skill name (e.g. Gemini Live API)..."
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Skill
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 pt-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY MODAL (ADD / EDIT) */}
          {showCategoryModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </h3>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-medium">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Category Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AI & Machine Learning"
                      value={catName}
                      onChange={(e) => {
                        setCatName(e.target.value);
                        if (!editingCategory) {
                          setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                        }
                      }}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">URL Slug</label>
                    <input
                      type="text"
                      placeholder="ai-machine-learning"
                      value={catSlug}
                      onChange={(e) => setCatSlug(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Brief overview of services in this category..."
                      value={catDesc}
                      onChange={(e) => setCatDesc(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Icon Keyword</label>
                      <select
                        value={catIcon}
                        onChange={(e) => setCatIcon(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Code">Code (Dev)</option>
                        <option value="Cpu">Cpu (AI / Tech)</option>
                        <option value="Palette">Palette (Design)</option>
                        <option value="BookOpen">BookOpen (Writing)</option>
                        <option value="TrendingUp">TrendingUp (Marketing)</option>
                        <option value="Video">Video (Media)</option>
                        <option value="Headphones">Headphones (Audio)</option>
                        <option value="Briefcase">Briefcase (Business)</option>
                        <option value="Compass">Compass (Consulting)</option>
                        <option value="Database">Database (Data)</option>
                        <option value="Camera">Camera (Photography)</option>
                        <option value="Shield">Shield (Security)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Status (ON/OFF)</label>
                      <button
                        type="button"
                        onClick={() => setCatIsActive(!catIsActive)}
                        className={`w-full p-2.5 rounded-xl font-bold border transition flex items-center justify-center gap-2 ${
                          catIsActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                        {catIsActive ? 'ON (Active)' : 'OFF (Inactive)'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Popular Skills (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, Python, PyTorch..."
                      value={catSkills}
                      onChange={(e) => setCatSkills(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(false)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm"
                    >
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* SUBCATEGORY MODAL (ADD / EDIT) */}
          {showSubcategoryModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Category:{' '}
                      <strong>{categories.find((c) => c.id === targetCatForSub)?.name || targetCatForSub}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSubcategoryModal(false)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveSubcategory} className="space-y-4 text-xs font-medium">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Subcategory Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LLM Applications & RAG"
                      value={subName}
                      onChange={(e) => {
                        setSubName(e.target.value);
                        if (!editingSubcategory) {
                          setSubSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                        }
                      }}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">URL Slug</label>
                    <input
                      type="text"
                      placeholder="llm-rag"
                      value={subSlug}
                      onChange={(e) => setSubSlug(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Jobs / Offers Count</label>
                      <input
                        type="number"
                        value={subJobCount}
                        onChange={(e) => setSubJobCount(Number(e.target.value))}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Status (ON/OFF)</label>
                      <button
                        type="button"
                        onClick={() => setSubIsActive(!subIsActive)}
                        className={`w-full p-2.5 rounded-xl font-bold border transition flex items-center justify-center gap-2 ${
                          subIsActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                        {subIsActive ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowSubcategoryModal(false)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm"
                    >
                      {editingSubcategory ? 'Update Subcategory' : 'Add Subcategory'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 8: CONTRACTS & ESCROW */}
          {activeTab === 'CONTRACTS' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Platform Contracts & Escrow Accounts</h2>
                  <p className="text-xs text-slate-500">Audit milestone timelines, escrow releases, and 14-day clearance holds</p>
                </div>
                <span className="text-xs text-slate-500 font-medium">{contracts.length} Active Contracts</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="p-4">Contract ID & Title</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Freelancer</th>
                      <th className="p-4">Escrow State</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-right">Protection Clearance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contracts.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <span className="font-mono text-slate-400 font-bold block">#{c.id}</span>
                          <strong className="text-slate-900 text-sm">{c.title}</strong>
                        </td>
                        <td className="p-4 font-bold text-slate-800">{c.client.name}</td>
                        <td className="p-4 font-bold text-slate-800">{c.freelancer.name}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.status === 'PROTECTION_PERIOD'
                                ? 'bg-amber-100 text-amber-900'
                                : c.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-right font-black text-slate-900 text-sm font-mono">
                          ${c.totalAmount.toFixed(2)}
                        </td>
                        <td className="p-4 text-right text-slate-500">
                          {c.protectionEndsAt
                            ? new Date(c.protectionEndsAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: DISPUTE ARBITRATION CENTER */}
          {activeTab === 'DISPUTES' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Pending Disputes ({disputes.length})
                  </h2>

                  {disputes.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        setSelectedDispute(d);
                        setClientRefundAmount(d.amountDisputed * 0.5);
                        setFreelancerReleaseAmount(d.amountDisputed * 0.5 * 0.9);
                      }}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition ${
                        selectedDispute?.id === d.id
                          ? 'border-rose-600 bg-rose-50/40'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-xs text-slate-500 font-bold">#{d.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
                          {d.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{d.contractTitle}</h3>
                      <p className="text-xs text-slate-600 mt-1">{d.reason}</p>
                      <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                        <span>Disputed: <strong className="text-slate-900">${d.amountDisputed}</strong></span>
                        <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Arbitration Panel */}
                {selectedDispute ? (
                  <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-mono text-slate-400">Arbitration Room #{selectedDispute.id}</span>
                        <h2 className="text-xl font-bold text-slate-900">{selectedDispute.contractTitle}</h2>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-rose-600">${selectedDispute.amountDisputed}</div>
                        <span className="text-xs text-slate-500">Held in Escrow</span>
                      </div>
                    </div>

                    {/* Evidence Threads */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Counterparty Statements & Evidence
                      </h3>
                      {selectedDispute.evidences.map((ev) => (
                        <div key={ev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                          <div className="font-bold text-slate-900 mb-1">
                            {ev.submittedByName} ({ev.role})
                          </div>
                          <p className="text-slate-700">{ev.message}</p>
                        </div>
                      ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleArbitrateDispute} className="space-y-4 pt-4 border-t border-slate-200 text-xs">
                      <h3 className="text-sm font-bold text-slate-900">Issue Authoritative Binding Ruling</h3>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Ruling Decision</label>
                        <select
                          value={resolutionType}
                          onChange={(e) => setResolutionType(e.target.value as any)}
                          className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                        >
                          <option value="FULL_RELEASE_TO_FREELANCER">Full Release to Freelancer (100% Payout)</option>
                          <option value="FULL_REFUND_TO_CLIENT">Full Refund to Client (100% Refund)</option>
                          <option value="PARTIAL_SPLIT">Partial Split Settlement</option>
                        </select>
                      </div>

                      {resolutionType === 'PARTIAL_SPLIT' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Client Refund ($)</label>
                            <input
                              type="number"
                              value={clientRefundAmount}
                              onChange={(e) => setClientRefundAmount(Number(e.target.value))}
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Freelancer Net Release ($)</label>
                            <input
                              type="number"
                              value={freelancerReleaseAmount}
                              onChange={(e) => setFreelancerReleaseAmount(Number(e.target.value))}
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Arbitration Judgment Findings</label>
                        <textarea
                          required
                          rows={3}
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          placeholder="Specify findings, contract terms review, and reason for financial allocation..."
                          className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isArbitrating}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition"
                      >
                        {isArbitrating ? 'Executing Settlement...' : 'Execute Binding Arbitration Settlement'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
                    Select a dispute from the left to arbitrate and inspect evidence.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 10: DOUBLE-ENTRY LEDGER */}
          {activeTab === 'LEDGER' && (
            <div className="space-y-4">
              {/* Financial Governance Compliance Banner */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block text-amber-950">Strict Financial Immutability Policy</strong>
                  Historical financial ledger records cannot be edited, deleted, or directly modified by any administrator.
                  Any required financial correction or balance adjustment must be issued as a <strong>traceable compensating transaction</strong> linked to the original transaction reference ID and logged in the system audit trail.
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Master Platform Double-Entry Ledger</h2>
                    <p className="text-xs text-slate-500">Immutable financial ledger entries with full audit trail</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg font-bold">
                      {ledger.length} Entries
                    </span>
                    {(activeAdminRole === 'SUPER_ADMIN' || activeAdminRole === 'FINANCE_ADMIN') && (
                      <button
                        onClick={() => setShowCompensatingModal(true)}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs"
                      >
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        Issue Compensating Adjustment
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 font-sans">
                        <th className="p-4">Tx ID & Key</th>
                        <th className="p-4">User ID</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-right">Amount</th>
                        <th className="p-4 text-right">Balance After</th>
                        <th className="p-4 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ledger.map((entry) => (
                        <tr key={entry.id} className="hover:bg-slate-50 transition">
                          <td className="p-4">
                            <strong className="text-slate-900 block">{entry.id}</strong>
                            <span className="text-[10px] text-slate-400">{entry.idempotentKey}</span>
                            {entry.metadata?.originalTxId && (
                              <span className="block text-[10px] text-indigo-600 font-bold mt-0.5">
                                Ref: {entry.metadata.originalTxId}
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-bold text-slate-700">{entry.userId}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                entry.type === 'COMPENSATING_ADJUSTMENT'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {entry.type}
                            </span>
                          </td>
                          <td className="p-4 font-sans text-slate-700 max-w-xs">{entry.description}</td>
                          <td className="p-4 text-right font-black">
                            <span className={entry.amount > 0 ? 'text-emerald-700' : 'text-slate-900'}>
                              {entry.amount > 0 ? `+$${entry.amount.toFixed(2)}` : `-$${Math.abs(entry.amount).toFixed(2)}`}
                            </span>
                          </td>
                          <td className="p-4 text-right font-black text-slate-900">
                            ${entry.balanceAfter.toFixed(2)}
                          </td>
                          <td className="p-4 text-right text-slate-400 font-sans text-[11px]">
                            {new Date(entry.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Compensating Transaction Modal */}
              {showCompensatingModal && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
                    <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">
                          Traceable Financial Correction
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 mt-1">Issue Compensating Adjustment</h3>
                      </div>
                      <button
                        onClick={() => setShowCompensatingModal(false)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleIssueCompensatingTx} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Target User ID *</label>
                        <select
                          required
                          value={compTargetUserId}
                          onChange={(e) => setCompTargetUserId(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs"
                        >
                          <option value="">-- Select Target User --</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.email || u.id}) - Status: {u.status}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Original Tx Reference ID *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. led-101 or TX-882"
                            value={compOriginalTxId}
                            onChange={(e) => setCompOriginalTxId(e.target.value)}
                            className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Adjustment Type *</label>
                          <select
                            value={compAdjustmentType}
                            onChange={(e) => setCompAdjustmentType(e.target.value as any)}
                            className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                          >
                            <option value="CREDIT">CREDIT (+ Credit User)</option>
                            <option value="DEBIT">DEBIT (- Charge User)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Adjustment Amount ($) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          placeholder="0.00"
                          value={compAmount || ''}
                          onChange={(e) => setCompAmount(Number(e.target.value))}
                          className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Mandatory Audit Justification *</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Provide detailed reason for this compensating adjustment for audit compliance..."
                          value={compReason}
                          onChange={(e) => setCompReason(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowCompensatingModal(false)}
                          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingComp}
                          className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                        >
                          {isSubmittingComp ? 'Recording Entry...' : 'Record Compensating Entry'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 11: WITHDRAWALS */}
          {activeTab === 'WITHDRAWALS' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Pending Banking & UPI Payouts</h2>
                <span className="text-xs text-slate-500 font-medium">{withdrawals.length} Requests</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="p-4">ID & User</th>
                      <th className="p-4">Method & Destination</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <strong className="text-slate-900 block">{w.userName}</strong>
                          <span className="text-slate-400 font-mono text-[10px]">{w.userEmail}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-800 block">{w.method}</span>
                          <span className="text-slate-500 text-[11px]">
                            {w.destinationDetails.accountHolder} ({w.destinationDetails.accountNumber || w.destinationDetails.upiId || w.destinationDetails.paypalEmail})
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono font-black text-slate-900 text-sm">
                          ${w.amount.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              w.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {w.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {w.status === 'PROCESSING' || w.status === 'REQUESTED' ? (
                            <button
                              onClick={() => handleApproveWithdrawal(w.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                            >
                              Confirm Transfer
                            </button>
                          ) : (
                            <span className="text-slate-400 font-mono text-[11px]">Ref #{w.transactionRef}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 12: SUPPORT DESK & FAQS */}
          {activeTab === 'SUPPORT' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Support Inquiries ({supportTickets.length})
                  </h2>
                  {supportTickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        selectedTicket?.id === t.id
                          ? 'border-emerald-600 bg-emerald-50/40'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1 text-xs">
                        <span className="font-bold text-slate-900">{t.userName}</span>
                        <span className="font-mono text-[10px] text-slate-400">{t.category}</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-xs mb-1">{t.subject}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{t.message}</p>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  {selectedTicket ? (
                    <div className="space-y-4 text-xs">
                      <div className="pb-3 border-b border-slate-100">
                        <h3 className="text-base font-bold text-slate-900">{selectedTicket.subject}</h3>
                        <span className="text-slate-500">From: {selectedTicket.userName} ({selectedTicket.userEmail})</span>
                      </div>

                      <div className="space-y-3">
                        {selectedTicket.messages.map((m) => (
                          <div
                            key={m.id}
                            className={`p-3 rounded-xl ${
                              m.senderRole === 'ADMIN'
                                ? 'bg-slate-900 text-white ml-6'
                                : 'bg-slate-100 text-slate-800 mr-6'
                            }`}
                          >
                            <div className="font-bold text-[11px] mb-1">{m.senderName} ({m.senderRole})</div>
                            <p>{m.content}</p>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleReplyTicket} className="pt-4 border-t border-slate-100 space-y-3">
                        <textarea
                          rows={3}
                          required
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Write official response to user..."
                          className="w-full p-2.5 border border-slate-300 rounded-xl"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg"
                        >
                          Send Reply
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-xs text-slate-400">
                      Select a support ticket to respond.
                    </div>
                  )}
                </div>
              </div>

              {/* FAQ Manager */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Platform FAQ Management ({faqs.length})</h2>

                <form onSubmit={handleAddFaq} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Question..."
                      value={newFaqQ}
                      onChange={(e) => setNewFaqQ(e.target.value)}
                      className="p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Category (e.g. Escrow & Payments)..."
                      value={newFaqCat}
                      onChange={(e) => setNewFaqCat(e.target.value)}
                      className="p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <textarea
                    required
                    rows={2}
                    placeholder="Answer explanation..."
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                  <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">
                    Publish FAQ
                  </button>
                </form>

                <div className="space-y-2">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-start text-xs">
                      <div>
                        <strong className="text-slate-900 block font-bold">{faq.question}</strong>
                        <p className="text-slate-600 mt-0.5">{faq.answer}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">Category: {faq.category}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: REPORTED CONTENT MODERATION */}
          {activeTab === 'MODERATION' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Reported Messages & Flagged Conduct</h2>
                  <p className="text-xs text-slate-500">Off-platform contact attempts and harassment moderation</p>
                </div>
                <span className="text-xs font-mono text-rose-700 bg-rose-50 px-2.5 py-1 rounded font-bold">
                  {reportedMessages.length} Reports
                </span>
              </div>

              <div className="p-6 space-y-4">
                {reportedMessages.map((msg) => (
                  <div key={msg.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-900 font-bold">Reported Sender: {msg.senderName}</strong>
                      <span className="text-[10px] font-mono text-rose-700 bg-rose-100 px-2 py-0.5 rounded font-bold">
                        {msg.reason}
                      </span>
                    </div>
                    <p className="p-3 bg-white border border-slate-200 rounded-xl font-mono text-slate-800">
                      "{msg.content}"
                    </p>
                    <div className="flex justify-between items-center text-slate-400 text-[10px]">
                      <span>Reporter: {msg.reporterName}</span>
                      <span>Reported at: {new Date(msg.reportedAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 14: LEGAL PAGES & ANNOUNCEMENTS */}
          {activeTab === 'CONTENT' && (
            <div className="space-y-6">
              {/* Announcements Broadcaster */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Platform Announcement Broadcaster</h2>

                <form onSubmit={handlePostAnnouncement} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Announcement Banner Title..."
                      value={ancTitle}
                      onChange={(e) => setAncTitle(e.target.value)}
                      className="p-2.5 bg-white border border-slate-300 rounded-xl"
                    />
                    <select
                      value={ancType}
                      onChange={(e) => setAncType(e.target.value as any)}
                      className="p-2.5 bg-white border border-slate-300 rounded-xl font-semibold"
                    >
                      <option value="INFO">ℹ️ INFO Banner</option>
                      <option value="SUCCESS">✅ SUCCESS Banner</option>
                      <option value="WARNING">⚠️ WARNING Banner</option>
                      <option value="CRITICAL">🚨 CRITICAL Banner</option>
                    </select>
                  </div>
                  <textarea
                    required
                    rows={2}
                    placeholder="Broadcast message body..."
                    value={ancMsg}
                    onChange={(e) => setAncMsg(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                  />
                  <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-1.5">
                    <Megaphone className="w-4 h-4" /> Broadcast Announcement
                  </button>
                </form>

                <div className="space-y-2">
                  {announcements.map((anc) => (
                    <div key={anc.id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <strong className="text-emerald-950 block font-bold">{anc.title}</strong>
                        <p className="text-emerald-800">{anc.message}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded">
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Pages Editor */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Legal Documents Editor</h2>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {legalDocs.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoc(doc);
                        setDocContent(doc.content);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                        selectedDoc?.id === doc.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {doc.title}
                    </button>
                  ))}
                </div>

                {selectedDoc && (
                  <form onSubmit={handleSaveLegalDoc} className="space-y-3 text-xs">
                    <div className="flex justify-between items-center font-mono text-[11px] text-slate-500">
                      <span>Slug: /{selectedDoc.slug} · Version: {selectedDoc.version}</span>
                      <span>Last updated: {new Date(selectedDoc.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    <textarea
                      rows={8}
                      value={docContent}
                      onChange={(e) => setDocContent(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                    />
                    <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">
                      Save Legal Text
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 15: NOTIFICATION TEMPLATES */}
          {activeTab === 'NOTIFICATIONS' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Notification Templates & Delivery System</h2>
              <p className="text-xs text-slate-500">In-app and email alert notification rules</p>

              <div className="space-y-3">
                {templates.map((tmpl) => (
                  <div key={tmpl.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-900 font-bold">{tmpl.title}</strong>
                      <span className="font-mono text-[10px] px-2 py-0.5 bg-slate-900 text-emerald-400 rounded">
                        CODE: {tmpl.code}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-semibold">Subject Template:</span>
                      <p className="p-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-800">{tmpl.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 16: MARKETPLACE REPORTS */}
          {activeTab === 'REPORTS' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Marketplace Financial & Operational Reports</h2>
                <p className="text-xs text-slate-500">Comprehensive transaction summaries, fee breakdowns, and audit reports</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="font-bold text-slate-900 block font-sans">Financial Summary Report</span>
                  <p className="text-slate-600 font-sans">GMV: ${kpis?.grossMerchandiseValue.toLocaleString()}</p>
                  <p className="text-slate-600 font-sans">Net Platform Fees: ${kpis?.platformRevenue.toFixed(2)}</p>
                  <button
                    onClick={() => handleExportCSV('financial_report', ledger)}
                    className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg font-sans text-xs"
                  >
                    Export Financial Report CSV
                  </button>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="font-bold text-slate-900 block font-sans">Escrow & Protection Report</span>
                  <p className="text-slate-600 font-sans">Active Escrow Locked: ${kpis?.escrowLockedTotal.toLocaleString()}</p>
                  <p className="text-slate-600 font-sans">In 14-Day Protection: ${kpis?.escrowInProtectionPeriod.toLocaleString()}</p>
                  <button
                    onClick={() => handleExportCSV('escrow_report', contracts)}
                    className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg font-sans text-xs"
                  >
                    Export Escrow Report CSV
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 17: MARKETPLACE SETTINGS */}
          {activeTab === 'SETTINGS' && settings && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Global Marketplace & Escrow Settings</h2>
                <p className="text-xs text-slate-500">Configure fee percentages, protection period lengths, and system parameters</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Marketplace Platform Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Support Email Contact</label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Client Service Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.clientFeePercent}
                      onChange={(e) => setSettings({ ...settings, clientFeePercent: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Freelancer Service Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.freelancerFeePercent}
                      onChange={(e) => setSettings({ ...settings, freelancerFeePercent: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Escrow Protection Hold Window (Days)</label>
                    <input
                      type="number"
                      value={settings.escrowHoldDays}
                      onChange={(e) => setSettings({ ...settings, escrowHoldDays: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-xs">
                    Save Global Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 18: AUDIT TRAIL LOGS */}
          {activeTab === 'AUDIT' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Immutable Administrative Audit Logs</h2>
                <span className="text-xs text-slate-500 font-mono">Real-time trace logs</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 font-sans">
                      <th className="p-4">Admin</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Target Entity</th>
                      <th className="p-4">IP Address</th>
                      <th className="p-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-bold text-slate-900 font-sans">{log.adminName}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600">{log.targetEntity}: {log.targetId}</td>
                        <td className="p-4 text-slate-400">{log.ipAddress}</td>
                        <td className="p-4 text-right text-slate-500 font-sans text-[11px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Project Modal */}
      {showProjectModal && editingProject && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Admin Edit Project</h3>
                <p className="text-xs text-slate-500">Modify project details or status as Super/Content Admin</p>
              </div>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={editProjTitle}
                  onChange={(e) => setEditProjTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={editProjDesc}
                  onChange={(e) => setEditProjDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editProjCategory}
                    onChange={(e) => setEditProjCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Budget ($)</label>
                  <input
                    type="number"
                    required
                    value={editProjBudget}
                    onChange={(e) => setEditProjBudget(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={editProjStatus}
                    onChange={(e) => setEditProjStatus(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Project Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Offer / Gig Modal */}
      {showOfferModal && editingOffer && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Admin Edit Service / Gig</h3>
                <p className="text-xs text-slate-500">Modify service offer details, price, or promotion status</p>
              </div>
              <button
                onClick={() => setShowOfferModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Service Offer Title</label>
                <input
                  type="text"
                  required
                  value={editOfferTitle}
                  onChange={(e) => setEditOfferTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={editOfferDesc}
                  onChange={(e) => setEditOfferDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editOfferCategory}
                    onChange={(e) => setEditOfferCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    required
                    value={editOfferPrice}
                    onChange={(e) => setEditOfferPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={editOfferStatus}
                    onChange={(e) => setEditOfferStatus(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PAUSED">PAUSED</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={editOfferFeatured}
                  onChange={(e) => setEditOfferFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="featuredCheck" className="text-slate-800 font-bold cursor-pointer">
                  Featured / Promoted Service Offer on Homepage
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Service Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
