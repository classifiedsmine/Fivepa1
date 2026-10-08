/**
 * Production Relational Database Schema Definitions, Constraints, and Types.
 */

export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id STRING PRIMARY KEY,
  email STRING UNIQUE,
  username STRING UNIQUE,
  name STRING,
  avatar STRING,
  title STRING,
  bio STRING,
  country STRING,
  hourly_rate INT,
  rating NUMBER,
  review_count INT,
  total_earned_cents INT,
  total_spent_cents INT,
  active_mode STRING,
  role STRING,
  status STRING,
  verification_status STRING,
  created_at STRING,
  updated_at STRING,
  deleted_at STRING
);

CREATE TABLE IF NOT EXISTS user_skills (
  user_id STRING,
  skill STRING,
  PRIMARY KEY (user_id, skill)
);

CREATE TABLE IF NOT EXISTS wallets (
  id STRING PRIMARY KEY,
  user_id STRING UNIQUE,
  currency STRING,
  available_cents INT,
  escrow_cents INT,
  protection_period_cents INT,
  pending_withdrawal_cents INT,
  withdrawn_total_cents INT,
  lifetime_earnings_cents INT,
  lifetime_spent_cents INT,
  last_reconciled_at STRING,
  created_at STRING,
  updated_at STRING
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id STRING PRIMARY KEY,
  idempotency_key STRING UNIQUE,
  wallet_id STRING,
  user_id STRING,
  type STRING,
  entry_type STRING,
  amount_cents INT,
  balance_after_cents INT,
  currency STRING,
  description STRING,
  reference_type STRING,
  reference_id STRING,
  created_at STRING
);

CREATE TABLE IF NOT EXISTS projects (
  id STRING PRIMARY KEY,
  slug STRING UNIQUE,
  client_id STRING,
  title STRING,
  description STRING,
  category STRING,
  subcategory STRING,
  budget_cents INT,
  currency STRING,
  pricing_model STRING,
  experience_level STRING,
  duration STRING,
  proposals_count INT,
  status STRING,
  created_at STRING,
  updated_at STRING,
  deleted_at STRING
);

CREATE TABLE IF NOT EXISTS project_skills (
  project_id STRING,
  skill STRING,
  PRIMARY KEY (project_id, skill)
);

CREATE TABLE IF NOT EXISTS offers (
  id STRING PRIMARY KEY,
  slug STRING UNIQUE,
  freelancer_id STRING,
  title STRING,
  description STRING,
  category STRING,
  subcategory STRING,
  starting_price_cents INT,
  currency STRING,
  orders_in_queue INT,
  rating NUMBER,
  review_count INT,
  status STRING,
  featured INT,
  created_at STRING,
  updated_at STRING,
  deleted_at STRING
);

CREATE TABLE IF NOT EXISTS offer_skills (
  offer_id STRING,
  skill STRING,
  PRIMARY KEY (offer_id, skill)
);

CREATE TABLE IF NOT EXISTS proposals (
  id STRING PRIMARY KEY,
  project_id STRING,
  freelancer_id STRING,
  cover_letter STRING,
  proposed_price_cents INT,
  currency STRING,
  delivery_days INT,
  status STRING,
  created_at STRING,
  updated_at STRING
);

CREATE TABLE IF NOT EXISTS contracts (
  id STRING PRIMARY KEY,
  title STRING,
  project_id STRING,
  proposal_id STRING,
  client_id STRING,
  freelancer_id STRING,
  total_amount_cents INT,
  currency STRING,
  escrow_amount_cents INT,
  status STRING,
  start_date STRING,
  end_date STRING,
  protection_expires_at STRING,
  auto_released INT,
  created_at STRING,
  updated_at STRING
);

CREATE TABLE IF NOT EXISTS contract_milestones (
  id STRING PRIMARY KEY,
  contract_id STRING,
  title STRING,
  description STRING,
  amount_cents INT,
  currency STRING,
  due_date STRING,
  status STRING,
  created_at STRING,
  updated_at STRING
);

CREATE TABLE IF NOT EXISTS contract_deliverables (
  id STRING PRIMARY KEY,
  milestone_id STRING,
  contract_id STRING,
  freelancer_id STRING,
  description STRING,
  file_url STRING,
  submitted_at STRING,
  revision_requested INT,
  revision_notes STRING
);

CREATE TABLE IF NOT EXISTS disputes (
  id STRING PRIMARY KEY,
  contract_id STRING UNIQUE,
  disputed_by STRING,
  reason STRING,
  disputed_amount_cents INT,
  currency STRING,
  status STRING,
  assignee_admin_id STRING,
  resolution_notes STRING,
  created_at STRING,
  resolved_at STRING
);

CREATE TABLE IF NOT EXISTS dispute_evidence (
  id STRING PRIMARY KEY,
  dispute_id STRING,
  submitted_by STRING,
  description STRING,
  attachment_url STRING,
  created_at STRING
);

CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id STRING PRIMARY KEY,
  idempotency_key STRING UNIQUE,
  user_id STRING,
  amount_cents INT,
  currency STRING,
  payment_method STRING,
  account_details STRING,
  status STRING,
  rejection_reason STRING,
  created_at STRING,
  processed_at STRING
);

CREATE TABLE IF NOT EXISTS conversations (
  id STRING PRIMARY KEY,
  participant1_id STRING,
  participant2_id STRING,
  project_id STRING,
  last_message STRING,
  last_message_at STRING,
  created_at STRING
);

CREATE TABLE IF NOT EXISTS messages (
  id STRING PRIMARY KEY,
  conversation_id STRING,
  sender_id STRING,
  receiver_id STRING,
  text STRING,
  read INT,
  flagged INT,
  created_at STRING
);

CREATE TABLE IF NOT EXISTS reviews (
  id STRING PRIMARY KEY,
  contract_id STRING,
  author_id STRING,
  target_id STRING,
  rating NUMBER,
  comment STRING,
  status STRING,
  created_at STRING
);

CREATE TABLE IF NOT EXISTS notifications (
  id STRING PRIMARY KEY,
  user_id STRING,
  title STRING,
  message STRING,
  type STRING,
  link STRING,
  read INT,
  created_at STRING
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id STRING PRIMARY KEY,
  user_id STRING,
  subject STRING,
  category STRING,
  priority STRING,
  status STRING,
  created_at STRING,
  updated_at STRING
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id STRING PRIMARY KEY,
  actor_id STRING,
  actor_name STRING,
  actor_role STRING,
  action STRING,
  category STRING,
  entity_type STRING,
  entity_id STRING,
  previous_state STRING,
  new_state STRING,
  reason STRING,
  ip_address STRING,
  user_agent STRING,
  created_at STRING
);

CREATE TABLE IF NOT EXISTS categories (
  id STRING PRIMARY KEY,
  name STRING,
  slug STRING UNIQUE,
  description STRING,
  icon STRING,
  active INT,
  created_at STRING
);

CREATE TABLE IF NOT EXISTS subcategories (
  id STRING PRIMARY KEY,
  category_id STRING,
  name STRING,
  slug STRING,
  job_count INT,
  active INT
);

CREATE TABLE IF NOT EXISTS legal_documents (
  id STRING PRIMARY KEY,
  type STRING UNIQUE,
  title STRING,
  content STRING,
  version STRING,
  updated_at STRING
);

CREATE TABLE IF NOT EXISTS marketplace_settings (
  [key] STRING PRIMARY KEY,
  [value] STRING
);

CREATE TABLE IF NOT EXISTS webhook_event_logs (
  id STRING PRIMARY KEY,
  provider STRING,
  event_id STRING UNIQUE,
  event_type STRING,
  payload STRING,
  status STRING,
  processed_at STRING
);

CREATE TABLE IF NOT EXISTS background_jobs (
  id STRING PRIMARY KEY,
  name STRING,
  status STRING,
  attempts INT,
  max_attempts INT,
  payload STRING,
  error_message STRING,
  scheduled_at STRING,
  locked_until STRING,
  created_at STRING
);
`;
