-- NetSpace Policy Hub - Database Setup Script

-- 1. Policies Table
CREATE TABLE IF NOT EXISTS policies (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  content      TEXT NOT NULL,
  excerpt      TEXT,
  category     TEXT NOT NULL,
  icon         TEXT DEFAULT 'description',
  published    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name   TEXT NOT NULL,
  employee_email  TEXT NOT NULL,
  question        TEXT NOT NULL,
  answer          TEXT,
  status          TEXT NOT NULL DEFAULT 'open',  -- 'open' | 'answered' | 'closed'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  answered_at     TIMESTAMPTZ
);

-- 3. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  category    TEXT NOT NULL,
  order_index INT DEFAULT 0,
  published   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Search Logs Table
CREATE TABLE IF NOT EXISTS search_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query       TEXT NOT NULL,
  result_count INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Helper: Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS tr_policies_updated_at ON policies;
CREATE TRIGGER tr_policies_updated_at
BEFORE UPDATE ON policies
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tr_faqs_updated_at ON faqs;
CREATE TRIGGER tr_faqs_updated_at
BEFORE UPDATE ON faqs
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
