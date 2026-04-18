import { db } from '../config/database';
import { logger } from '../shared/logger';
import { CatalogError, NotFoundError } from '../shared/errors';
import type { Product } from '../types/commerce';
import { ProductCategory } from '../types/commerce';

type Result<T> = { ok: true; data: T } | { ok: false; error: CatalogError | NotFoundError };

type DbProduct = {
  id: string;
  merchant_id: string;
  name: string;
  price_kes: string;
  category: string;
  description?: string;
  image_url?: string;
  stock: number;
  active: boolean;
  created_at: Date;
};

function mapProduct(row: DbProduct): Product {
  return {
    id: row.id,
    merchantId: row.merchant_id,
    name: row.name,
    priceKES: parseFloat(row.price_kes),
    category: row.category as ProductCategory,
    description: row.description,
    imageUrl: row.image_url,
    stock: row.stock,
    active: row.active,
    createdAt: row.created_at,
  };
}

export async function searchProducts(params: {
  merchantId: string;
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}): Promise<Result<Product[]>> {
  const { merchantId, query, category, minPrice, maxPrice, limit = 10 } = params;

  try {
    const conditions: string[] = [
      'merchant_id = $1',
      'active = TRUE',
      `(name ILIKE $2 OR description ILIKE $2)`,
    ];
    const values: (string | number)[] = [merchantId, `%${query}%`];
    let paramIdx = 3;

    if (category) {
      conditions.push(`category = $${paramIdx++}`);
      values.push(category);
    }
    if (minPrice !== undefined) {
      conditions.push(`price_kes >= $${paramIdx++}`);
      values.push(minPrice);
    }
    if (maxPrice !== undefined) {
      conditions.push(`price_kes <= $${paramIdx++}`);
      values.push(maxPrice);
    }

    const sql = `
      SELECT * FROM products
      WHERE ${conditions.join(' AND ')}
      ORDER BY
        CASE WHEN name ILIKE $2 THEN 0 ELSE 1 END,
        price_kes ASC
      LIMIT $${paramIdx}
    `;
    values.push(limit);

    const { rows } = await db.query<DbProduct>(sql, values);
    return { ok: true, data: rows.map(mapProduct) };
  } catch (err) {
    logger.error({ err }, 'Product search failed');
    return { ok: false, error: new CatalogError('Product search failed') };
  }
}

export async function getProductById(id: string): Promise<Result<Product>> {
  try {
    const { rows } = await db.query<DbProduct>(
      'SELECT * FROM products WHERE id = $1 AND active = TRUE',
      [id],
    );
    if (!rows[0]) return { ok: false, error: new NotFoundError('Product not found') };
    return { ok: true, data: mapProduct(rows[0]) };
  } catch (err) {
    logger.error({ err }, 'Get product failed');
    return { ok: false, error: new CatalogError('Failed to fetch product') };
  }
}

export async function createProduct(
  merchantId: string,
  data: Omit<Product, 'id' | 'merchantId' | 'createdAt' | 'active'>,
): Promise<Result<Product>> {
  try {
    const { rows } = await db.query<DbProduct>(
      `INSERT INTO products (merchant_id, name, price_kes, category, description, image_url, stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [merchantId, data.name, data.priceKES, data.category, data.description, data.imageUrl, data.stock],
    );
    const row = rows[0];
    if (!row) return { ok: false, error: new CatalogError('Create failed') };
    return { ok: true, data: mapProduct(row) };
  } catch (err) {
    logger.error({ err }, 'Create product failed');
    return { ok: false, error: new CatalogError('Failed to create product') };
  }
}
