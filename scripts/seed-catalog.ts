/**
 * Seed script — populate database with sample merchants & products
 * Usage: npm run seed
 */
import 'dotenv/config';
import { db } from '../src/config/database';
import { logger } from '../src/shared/logger';

const merchants = [
  {
    business_name: 'TechHub Electronics',
    phone: '254700000001',
    wa_phone_id: 'WA_PHONE_001',
    mpesa_shortcode: '174379',
    location: 'Luthuli Avenue, Nairobi',
    settings: JSON.stringify({
      businessHours: 'Mon-Sat 8AM-6PM',
      categories: ['TVs', 'Phones', 'Accessories', 'Laptops'],
      deliveryInfo: 'Free delivery to CBD',
    }),
    plan: 'pro',
  },
  {
    business_name: 'SmartCity Gadgets',
    phone: '254700000002',
    wa_phone_id: 'WA_PHONE_002',
    mpesa_shortcode: '522522',
    location: 'Tom Mboya Street, Nairobi',
    settings: JSON.stringify({
      businessHours: 'Mon-Sun 9AM-7PM',
      categories: ['Phones', 'Accessories'],
      deliveryInfo: 'Same-day delivery available',
    }),
    plan: 'starter',
  },
];

const products = [
  // TVs
  { name: 'Hisense 43A6H Smart TV', price_kes: 38500, category: 'tvs', description: '43" 4K UHD Smart TV with Netflix & YouTube built-in', stock: 15 },
  { name: 'TCL 43S5400 Smart TV', price_kes: 35900, category: 'tvs', description: '43" FHD Android TV with Chromecast', stock: 8 },
  { name: 'LG 43LM6370 Smart TV', price_kes: 42000, category: 'tvs', description: '43" FHD Smart TV with ThinQ AI', stock: 5 },
  { name: 'Vitron 43" FHD TV', price_kes: 28500, category: 'tvs', description: '43" Full HD TV with USB media player', stock: 20 },
  { name: 'Hisense 55A6H Smart TV', price_kes: 52000, category: 'tvs', description: '55" 4K UHD Smart TV with Dolby Vision', stock: 6 },
  { name: 'LG 55UP7750 Smart TV', price_kes: 65000, category: 'tvs', description: '55" 4K NanoCell Smart TV', stock: 3 },
  { name: 'Sony Bravia 55X75K', price_kes: 85000, category: 'tvs', description: '55" 4K Google TV with X-Reality PRO', stock: 4 },
  { name: 'Samsung 65" Crystal UHD', price_kes: 120000, category: 'tvs', description: '65" 4K Smart TV with PurColor', stock: 2 },

  // Phones
  { name: 'Samsung Galaxy A34', price_kes: 32000, category: 'phones', description: '6.6" display, 128GB, 48MP camera', stock: 20 },
  { name: 'Samsung Galaxy A54', price_kes: 48000, category: 'phones', description: '6.4" Super AMOLED, 256GB, 50MP camera', stock: 12 },
  { name: 'iPhone 14', price_kes: 120000, category: 'phones', description: '6.1" Super Retina XDR, 128GB, A15 Bionic', stock: 5 },
  { name: 'iPhone 14 Pro Max', price_kes: 185000, category: 'phones', description: '6.7" ProMotion, 256GB, 48MP Pro camera', stock: 2 },
  { name: 'Infinix Hot 30', price_kes: 12500, category: 'phones', description: '6.78" display, 4GB RAM, 5000mAh battery', stock: 30 },
  { name: 'Tecno Spark 20', price_kes: 9500, category: 'phones', description: '6.56" display, 4GB RAM, 50MP camera', stock: 25 },
  { name: 'Redmi Note 13', price_kes: 22000, category: 'phones', description: '6.67" AMOLED, 128GB, 108MP camera', stock: 18 },
  { name: 'Redmi Note 13 Pro', price_kes: 35000, category: 'phones', description: '6.67" curved AMOLED, 256GB, 200MP camera', stock: 10 },

  // Audio
  { name: 'JBL Go 3 Bluetooth Speaker', price_kes: 4500, category: 'audio', description: 'Portable waterproof speaker, 5h playtime', stock: 40 },
  { name: 'JBL Charge 5', price_kes: 15000, category: 'audio', description: 'Powerful portable speaker, 20h playtime', stock: 15 },
  { name: 'Sony WH-1000XM5 Headphones', price_kes: 38000, category: 'audio', description: 'Industry-leading noise cancellation', stock: 6 },
  { name: 'Anker Soundcore P20i', price_kes: 3500, category: 'audio', description: 'True wireless earbuds, 10h playtime', stock: 50 },
  { name: 'Samsung Galaxy Buds2 Pro', price_kes: 18000, category: 'audio', description: '360 audio, ANC, IPX7 waterproof', stock: 8 },

  // Accessories
  { name: 'HDMI Cable 2m', price_kes: 800, category: 'accessories', description: 'High-speed HDMI 2.0 cable, 4K support', stock: 100 },
  { name: 'Universal TV Wall Mount', price_kes: 2500, category: 'accessories', description: 'Fits 32"-65" TVs, full-motion swivel', stock: 30 },
  { name: 'Phone Tempered Glass Screen Protector', price_kes: 500, category: 'accessories', description: '9H hardness, full coverage', stock: 200 },
  { name: 'Samsung 45W USB-C Charger', price_kes: 2800, category: 'accessories', description: 'Fast charge, compatible with Galaxy S/A series', stock: 45 },
  { name: 'Anker 20000mAh Power Bank', price_kes: 4500, category: 'accessories', description: 'Dual USB-A + USB-C, 20W fast charge', stock: 35 },
  { name: 'Logitech MX Master 3 Mouse', price_kes: 12000, category: 'accessories', description: 'Advanced wireless mouse, 8K DPI', stock: 12 },

  // Computers
  { name: 'HP 14 Laptop i5', price_kes: 65000, category: 'computers', description: '14" FHD, Intel i5-1235U, 8GB RAM, 512GB SSD', stock: 8 },
  { name: 'Lenovo IdeaPad 3 i5', price_kes: 72000, category: 'computers', description: '15.6" FHD, Intel i5, 16GB RAM, 512GB SSD', stock: 5 },
  { name: 'Dell Inspiron 15 i7', price_kes: 95000, category: 'computers', description: '15.6" FHD, Intel i7, 16GB RAM, 1TB SSD', stock: 3 },
];

async function seed() {
  logger.info('Starting seed...');

  // Insert merchants
  const merchantIds: string[] = [];
  for (const merchant of merchants) {
    const { rows } = await db.query<{ id: string }>(
      `INSERT INTO merchants (business_name, phone, wa_phone_id, mpesa_shortcode, location, settings, plan)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (phone) DO UPDATE SET business_name = EXCLUDED.business_name
       RETURNING id`,
      [merchant.business_name, merchant.phone, merchant.wa_phone_id, merchant.mpesa_shortcode, merchant.location, merchant.settings, merchant.plan],
    );
    const row = rows[0];
    if (row) {
      merchantIds.push(row.id);
      logger.info({ merchant: merchant.business_name }, 'Merchant seeded');
    }
  }

  // Insert products for first merchant
  const firstMerchantId = merchantIds[0];
  if (!firstMerchantId) {
    logger.error('No merchant ID available');
    return;
  }

  for (const product of products) {
    await db.query(
      `INSERT INTO products (merchant_id, name, price_kes, category, description, stock)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      [firstMerchantId, product.name, product.price_kes, product.category, product.description, product.stock],
    );
  }

  logger.info({ count: products.length }, 'Products seeded');
  logger.info('Seed complete!');
  await db.end();
}

seed().catch((err) => {
  logger.error({ err }, 'Seed failed');
  process.exit(1);
});
