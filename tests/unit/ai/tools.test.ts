import { describe, it, expect } from 'vitest';
import { dukaTools } from '../../../src/ai/tools';

describe('dukaTools', () => {
  it('has no duplicate tool names', () => {
    const names = dukaTools.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('all tool schemas are valid objects', () => {
    for (const tool of dukaTools) {
      expect(tool.input_schema.type).toBe('object');
      expect(tool.description.length).toBeGreaterThan(10);
    }
  });

  it('search_products has required query field', () => {
    const tool = dukaTools.find((t) => t.name === 'search_products');
    expect(tool?.input_schema.required).toContain('query');
  });

  it('add_to_cart has required product_id', () => {
    const tool = dukaTools.find((t) => t.name === 'add_to_cart');
    expect(tool?.input_schema.required).toContain('product_id');
  });

  it('initiate_payment has required cart_id', () => {
    const tool = dukaTools.find((t) => t.name === 'initiate_payment');
    expect(tool?.input_schema.required).toContain('cart_id');
  });

  it('all 7 tools are defined', () => {
    const expected = [
      'search_products',
      'get_product_details',
      'add_to_cart',
      'remove_from_cart',
      'view_cart',
      'initiate_payment',
      'check_order_status',
    ];
    for (const name of expected) {
      expect(dukaTools.find((t) => t.name === name)).toBeDefined();
    }
  });
});
