CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  items JSONB NOT NULL DEFAULT '[]',
  total_kes NUMERIC(12, 2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'payment_initiated', 'paid', 'shipped', 'delivered', 'cancelled', 'payment_failed', 'returned')),
  mpesa_ref VARCHAR(100),
  mpesa_receipt VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_merchant ON orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_mpesa_ref ON orders(mpesa_ref);
