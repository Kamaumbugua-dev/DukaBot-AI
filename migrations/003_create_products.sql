CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  price_kes NUMERIC(12, 2) NOT NULL CHECK (price_kes >= 0),
  category VARCHAR(50) NOT NULL DEFAULT 'other',
  description TEXT,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_merchant ON products(merchant_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_products_fts ON products
  USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
