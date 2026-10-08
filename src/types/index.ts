/**
 * Core Domain Models for WorkSphere Global Freelance Marketplace
 */

export type UserRole = 'CLIENT' | 'FREELANCER' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'PENDING_VERIFICATION';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  title: string;
  bio: string;
  hourlyRate: number; // in USD (or cents if integer)
  currency: string;
  country: string;
  city: string;
  joinedAt: string;
  skills: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  totalSpent: number;
  totalEarned: number;
  responseRate: number; // e.g. 98%
  responseTimeHours: number; // e.g. 2 hours
  status: AccountStatus;
  verificationStatus: VerificationStatus;
  isOnline: boolean;
  activeMode: 'CLIENT' | 'FREELANCER' | 'ADMIN'; // Current UI viewpoint of unified account
  adminRoles?: AdminRoleType[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  jobCount: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  subcategories: Subcategory[];
  popularSkills: string[];
}

export type AdminRoleType =
  | 'SUPER_ADMIN'
  | 'FINANCE_ADMIN'
  | 'DISPUTE_ADMIN'
  | 'SUPPORT_ADMIN'
  | 'MODERATOR'
  | 'CONTENT_ADMIN'
  | 'SECURITY_ADMIN';

export interface AdminUserRole {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: AdminRoleType;
  permissions: string[];
  status: 'ACTIVE' | 'INACTIVE';
  lastActive: string;
  mfaEnabled: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  order: number;
}

export interface LegalDocument {
  id: string;
  title: string;
  slug: 'terms' | 'privacy' | 'refund' | 'escrow' | 'dispute' | 'community';
  content: string;
  lastUpdated: string;
  updatedBy: string;
  version: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  targetAudience: 'ALL' | 'CLIENTS' | 'FREELANCERS';
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface NotificationTemplate {
  id: string;
  code: string;
  title: string;
  subject: string;
  emailBody: string;
  inAppBody: string;
  channel: 'EMAIL' | 'IN_APP' | 'BOTH';
  variables: string[];
}

export interface NotificationDeliveryLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  templateCode: string;
  channel: 'EMAIL' | 'IN_APP';
  status: 'DELIVERED' | 'FAILED' | 'PENDING';
  sentAt: string;
}

export interface ReportedMessage {
  id: string;
  messageId: string;
  conversationId: string;
  reporterId: string;
  reporterName: string;
  senderName: string;
  content: string;
  reason: string;
  status: 'PENDING' | 'ACTIONED' | 'DISMISSED';
  reportedAt: string;
}

export interface FraudRiskReport {
  id: string;
  userId: string;
  userName: string;
  riskScore: number; // 0-100
  flagReason: string;
  detectedAt: string;
  status: 'OPEN' | 'INVESTIGATING' | 'CLEARED' | 'SUSPENDED';
}

export interface SystemHealthStatus {
  apiStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  dbLatencyMs: number;
  cpuUsagePct: number;
  memoryUsagePct: number;
  activeSockets: number;
  uptimeSeconds: number;
  bgWorkers: { name: string; status: 'RUNNING' | 'IDLE' | 'FAILED'; lastRun: string }[];
}

export interface MarketplaceSettings {
  siteName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  clientFeePercent: number;
  freelancerFeePercent: number;
  escrowHoldDays: number;
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  autoApproveKyc: boolean;
  paymentGateways: { name: string; enabled: boolean }[];
}

export interface PortfolioItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  skills: string[];
  externalUrl?: string;
  completedDate: string;
}

export type PricingModel = 'FIXED' | 'MILESTONE' | 'HOURLY';
export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';

export interface Project {
  id: string;
  slug: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    country: string;
    rating: number;
    reviewCount: number;
    totalSpent: number;
    verificationStatus: VerificationStatus;
  };
  title: string;
  description: string;
  category: string;
  subcategory: string;
  skills: string[];
  budget: number;
  pricingModel: PricingModel;
  experienceLevel: 'ENTRY' | 'INTERMEDIATE' | 'EXPERT';
  duration: string;
  proposalsCount: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  featured?: boolean;
}

export interface OfferAddon {
  id: string;
  title: string;
  description?: string;
  price: number;
  extraDays?: number;
}

export interface OfferPackage {
  name: string;
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number; // -1 for unlimited
  features: string[];
}

export interface Offer {
  id: string;
  slug: string;
  freelancerId: string;
  freelancer: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    title: string;
    country: string;
    rating: number;
    reviewCount: number;
    responseTimeHours: number;
    verificationStatus: VerificationStatus;
  };
  title: string;
  description: string;
  category: string;
  subcategory: string;
  skills: string[];
  price?: number;
  deliveryDays?: number;
  revisions?: number;
  features?: string[];
  addons?: OfferAddon[];
  packages?: {
    basic: OfferPackage;
    standard?: OfferPackage;
    premium?: OfferPackage;
  };
  images: string[];
  rating: number;
  reviewCount: number;
  ordersInQueue: number;
  salesCount: number;
  faqs: { question: string; answer: string }[];
  status: 'ACTIVE' | 'PAUSED' | 'UNDER_REVIEW';
  createdAt: string;
  featured?: boolean;
  featuredUntil?: string;
}

export type ProposalStatus =
  | 'SUBMITTED'
  | 'SHORTLISTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface ProposalMilestone {
  title: string;
  amount: number;
  dueDate: string;
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  freelancer: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    title: string;
    country: string;
    rating: number;
    hourlyRate: number;
  };
  coverLetter: string;
  bidAmount: number;
  deliveryDays: number;
  milestones: ProposalMilestone[];
  status: ProposalStatus;
  createdAt: string;
}

export type ContractStatus =
  | 'DRAFT'
  | 'PAYMENT_PENDING'
  | 'FUNDED'
  | 'ACTIVE'
  | 'WORK_SUBMITTED'
  | 'CLIENT_REVIEW'
  | 'ACCEPTED'
  | 'PROTECTION_PERIOD' // 14-day escrow protection period
  | 'RELEASED' // Funds released to freelancer wallet
  | 'COMPLETED'
  | 'DISPUTED'
  | 'REFUNDED'
  | 'CANCELLED';

export type MilestoneStatus =
  | 'CREATED'
  | 'FUNDED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'CLIENT_REVIEW'
  | 'REVISION_REQUESTED'
  | 'ACCEPTED'
  | 'PROTECTION_PERIOD'
  | 'RELEASED'
  | 'REFUNDED'
  | 'DISPUTED';

export interface Milestone {
  id: string;
  contractId: string;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  dueDate: string;
  fundedAt?: string;
  submittedAt?: string;
  acceptedAt?: string;
  protectionStartsAt?: string;
  protectionEndsAt?: string; // exactly 14 days after acceptance
  releasedAt?: string;
  deliverables: Deliverable[];
}

export interface Deliverable {
  id: string;
  milestoneId: string;
  submittedBy: string;
  version: number;
  notes: string;
  files: { name: string; size: string; url: string }[];
  submittedAt: string;
  clientFeedback?: string;
  status: 'PENDING_REVIEW' | 'ACCEPTED' | 'REVISION_REQUESTED';
}

export interface Contract {
  id: string;
  title: string;
  clientId: string;
  freelancerId: string;
  client: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    country: string;
  };
  freelancer: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    title: string;
    country: string;
  };
  projectId?: string;
  offerId?: string;
  offerPackageTier?: 'basic' | 'standard' | 'premium';
  type: 'FIXED' | 'MILESTONE' | 'OFFER';
  totalAmount: number;
  platformFeeAmount: number; // e.g., 10%
  clientFeeAmount: number; // e.g., 3%
  status: ContractStatus;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
  fundedAt?: string;
  protectionEndsAt?: string;
  disputeId?: string;
}

export type LedgerTransactionType =
  | 'DEPOSIT' // Client funds wallet
  | 'ESCROW_FUND' // Client locks funds into Escrow for Contract
  | 'ESCROW_RELEASE' // Escrow funds credited to Freelancer available balance
  | 'PLATFORM_FEE' // Platform takes commission fee
  | 'CLIENT_PROCESSING_FEE' // Payment gateway processing fee
  | 'WITHDRAWAL_REQUEST' // Freelancer requests withdrawal
  | 'WITHDRAWAL_COMPLETED' // Bank payout confirmed
  | 'WITHDRAWAL_FAILED' // Payout reversed
  | 'REFUND' // Full or partial refund to Client
  | 'DISPUTE_PAYOUT_SPLIT' // Arbitrated split settlement
  | 'ADMIN_ADJUSTMENT' // Traceable administrative reconciliation
  | 'COMPENSATING_ADJUSTMENT';

export interface LedgerEntry {
  id: string;
  idempotentKey: string;
  userId: string;
  contractId?: string;
  milestoneId?: string;
  type: LedgerTransactionType;
  description: string;
  amount: number; // In cents or formatted USD (positive for credit, negative for debit)
  currency: string;
  balanceAfter: number;
  createdAt: string;
  referenceId: string;
  metadata?: Record<string, any>;
}

export interface Wallet {
  userId: string;
  availableBalance: number; // Ready for withdrawal or new contracts
  escrowLockedBalance: number; // In active contracts waiting for completion
  protectionPeriodBalance: number; // In 14-day protection period before final release
  withdrawnTotal: number;
  lifetimeEarnings: number;
  lifetimeSpent: number;
  currency: string;
  lastReconciledAt: string;
}

export type DisputeStatus =
  | 'OPEN'
  | 'UNDER_REVIEW'
  | 'WAITING_FOR_CLIENT'
  | 'WAITING_FOR_FREELANCER'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED';

export type DisputeResolution =
  | 'FULL_RELEASE_TO_FREELANCER'
  | 'FULL_REFUND_TO_CLIENT'
  | 'PARTIAL_SPLIT'
  | 'DISMISSED';

export interface DisputeEvidence {
  id: string;
  submittedBy: string;
  submittedByName: string;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  message: string;
  attachments: { name: string; url: string }[];
  createdAt: string;
}

export interface Dispute {
  id: string;
  contractId: string;
  contractTitle: string;
  milestoneId?: string;
  claimantId: string;
  claimantName: string;
  claimantRole: 'CLIENT' | 'FREELANCER';
  respondentId: string;
  respondentName: string;
  amountDisputed: number;
  reason: string;
  description: string;
  status: DisputeStatus;
  evidences: DisputeEvidence[];
  assignedAdminId?: string;
  assignedAdminName?: string;
  resolution?: DisputeResolution;
  resolutionNotes?: string;
  clientRefundAmount?: number;
  freelancerReleaseAmount?: number;
  resolvedAt?: string;
  createdAt: string;
}

export type WithdrawalStatus = 'REQUESTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REJECTED';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  fee: number;
  netAmount: number;
  method: 'BANK_TRANSFER' | 'UPI' | 'PAYPAL' | 'STRIPE_DIRECT';
  destinationDetails: {
    accountNumber?: string;
    routingNumber?: string;
    bankName?: string;
    upiId?: string;
    paypalEmail?: string;
    accountHolder: string;
  };
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  transactionRef?: string;
  failureReason?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isOnline: boolean;
  }[];
  contractId?: string;
  projectId?: string;
  lastMessage?: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  attachments?: { name: string; size: string; url: string }[];
  createdAt: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | 'PROPOSAL'
    | 'CONTRACT'
    | 'PAYMENT'
    | 'ESCROW_PROTECTION'
    | 'ESCROW_RELEASE'
    | 'DELIVERABLE'
    | 'DISPUTE'
    | 'MESSAGE'
    | 'SYSTEM';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  contractId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  reviewedUserId: string;
  role: 'CLIENT' | 'FREELANCER';
  rating: number; // 1 to 5
  feedback: string;
  communicationRating: number;
  qualityRating: number;
  deadlineRating: number;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'PAYMENTS' | 'CONTRACT' | 'DISPUTE' | 'ACCOUNT' | 'OTHER';
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedAdmin?: string;
  createdAt: string;
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: 'USER' | 'ADMIN';
    content: string;
    createdAt: string;
  }[];
}

export type AdminPermission =
  | 'users.view'
  | 'users.edit'
  | 'users.suspend'
  | 'users.ban'
  | 'users.verify'
  | 'projects.view'
  | 'projects.moderate'
  | 'offers.view'
  | 'offers.moderate'
  | 'contracts.view'
  | 'payments.view'
  | 'payments.refund'
  | 'escrow.view'
  | 'escrow.release'
  | 'escrow.refund'
  | 'escrow.partial_release'
  | 'withdrawals.view'
  | 'withdrawals.approve'
  | 'withdrawals.reject'
  | 'withdrawals.process'
  | 'disputes.view'
  | 'disputes.assign'
  | 'disputes.resolve'
  | 'reviews.view'
  | 'reviews.moderate'
  | 'settings.view'
  | 'settings.edit'
  | 'audit_logs.view'
  | 'reports.view'
  | 'reports.resolve'
  | 'privacy.view_sensitive'
  | 'webhooks.view'
  | 'webhooks.retry';

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetEntity: string;
  targetId: string;
  previousState?: any;
  newState?: any;
  reason?: string;
  relatedTransactionId?: string;
  relatedContractId?: string;
  relatedDisputeId?: string;
  ipAddress: string;
  timestamp: string;
}

export interface WebhookEventLog {
  id: string;
  provider: 'STRIPE' | 'RAZORPAY' | 'PAYPAL' | 'UPI';
  eventId: string;
  paymentId: string;
  eventType: string;
  receivedAt: string;
  providerTimestamp: string;
  processingStatus: 'SUCCESS' | 'FAILED' | 'PENDING_RETRY';
  retryCount: number;
  lastRetryAt?: string;
  failureReason?: string;
  relatedUserId?: string;
  relatedContractId?: string;
  payload?: any;
}

export interface PaymentReconciliationItem {
  id: string;
  transactionRef: string;
  provider: string;
  internalAmount: number;
  providerAmount: number;
  currency: string;
  statusMatch: boolean;
  amountMatch: boolean;
  discrepancyReason?: string;
  reconciledAt: string;
  isResolved: boolean;
}

export interface EntityReport {
  id: string;
  reportType: 'USER' | 'PROJECT' | 'OFFER' | 'MESSAGE' | 'REVIEW' | 'FRAUD' | 'ABUSE' | 'SPAM' | 'SECURITY';
  reporterId: string;
  reporterName: string;
  targetEntityId: string;
  targetEntityName: string;
  reason: string;
  evidence: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  assignedAdminId?: string;
  assignedAdminName?: string;
  internalNotes?: string[];
  resolutionAction?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface SystemKPIs {
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  activeProjects: number;
  activeOffers: number;
  activeContracts: number;
  grossMerchandiseValue: number; // GMV
  platformRevenue: number;
  escrowLockedTotal: number;
  escrowInProtectionPeriod: number;
  openDisputesCount: number;
  pendingWithdrawalsCount: number;
  pendingVerificationsCount: number;
  failedWebhooksCount: number;
  activeReportsCount: number;
  maintenanceMode: boolean;
}

export interface BackupHealthStatus {
  lastBackupAt: string;
  backupStatus: 'SUCCESS' | 'PENDING' | 'FAILED';
  retentionDays: number;
  totalSnapshots: number;
  backupSizeMb: number;
  pointInTimeRecoveryEnabled: boolean;
}
