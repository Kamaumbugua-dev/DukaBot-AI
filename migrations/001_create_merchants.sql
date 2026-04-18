CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(200) NOT NULL,
  phone VARCHAR(15) NOT NULL UNIQUE,
  wa_phone_id VARCHAR(50),
  mpesa_shortcode VARCHAR(20),
  location VARCHAR(200),
  settings JSONB DEFAULT '{}',
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_merchants_phone ON merchants(phone);
