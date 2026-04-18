import type Anthropic from '@anthropic-ai/sdk';

export const dukaTools: Anthropic.Tool[] = [
  {
    name: 'search_products',
    description:
      'Search the store product catalog. Use when customer asks about products, ' +
      'mentions a category (TVs, phones, etc.), gives a budget, or wants recommendations. ' +
      'Returns up to 10 matching products with name, price, and availability.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search term: product name, type, or description keywords',
        },
        category: {
          type: 'string',
          description: 'Filter by category: electronics, phones, tvs, audio, accessories',
        },
        min_price: {
          type: 'number',
          description: 'Minimum price in KES',
        },
        max_price: {
          type: 'number',
          description: 'Maximum price in KES. Use when customer mentions budget.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_product_details',
    description:
      'Get full details for a specific product including description, specs, stock level, ' +
      'and images. Use when customer asks "tell me more about..." or wants specs.',
    input_schema: {
      type: 'object' as const,
      properties: {
        product_id: {
          type: 'string',
          description: 'The unique product ID from search results',
        },
      },
      required: ['product_id'],
    },
  },
  {
    name: 'add_to_cart',
    description:
      "Add a product to the customer's shopping cart. Always confirm with the customer " +
      'before calling this. Returns the updated cart summary.',
    input_schema: {
      type: 'object' as const,
      properties: {
        product_id: {
          type: 'string',
          description: 'The product ID to add',
        },
        quantity: {
          type: 'number',
          description: 'Number of units to add. Default 1.',
        },
      },
      required: ['product_id'],
    },
  },
  {
    name: 'remove_from_cart',
    description: "Remove a product from the customer's cart.",
    input_schema: {
      type: 'object' as const,
      properties: {
        product_id: {
          type: 'string',
          description: 'The product ID to remove',
        },
      },
      required: ['product_id'],
    },
  },
  {
    name: 'view_cart',
    description:
      "Show the current contents of the customer's cart with items, quantities, and total. " +
      'Use when customer asks to review cart or before initiating payment.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'initiate_payment',
    description:
      'Start M-Pesa STK push payment. IMPORTANT: Always confirm the total with the customer ' +
      'before calling this. The customer will receive a payment prompt on their phone.',
    input_schema: {
      type: 'object' as const,
      properties: {
        cart_id: {
          type: 'string',
          description: 'The cart ID to checkout',
        },
      },
      required: ['cart_id'],
    },
  },
  {
    name: 'set_delivery_instructions',
    description:
      'Save delivery address, notes, and installation preference for the current order. ' +
      'Call this after the customer confirms their cart and before initiating payment. ' +
      'Ask for delivery address, any special instructions, and whether they need installation.',
    input_schema: {
      type: 'object' as const,
      properties: {
        delivery_address: {
          type: 'string',
          description: 'Delivery address e.g. "Apartment 4B, Ngong Road, Nairobi"',
        },
        delivery_notes: {
          type: 'string',
          description: 'Special instructions e.g. "Call before delivery", "Leave at gate"',
        },
        requires_installation: {
          type: 'boolean',
          description: 'Whether the customer needs installation service (e.g. for ACs, washing machines, TVs)',
        },
      },
      required: ['delivery_address'],
    },
  },
  {
    name: 'check_order_status',
    description:
      'Check the status of a previous order. Use when customer asks about delivery or order status.',
    input_schema: {
      type: 'object' as const,
      properties: {
        order_id: {
          type: 'string',
          description: 'The order ID or reference number',
        },
      },
      required: ['order_id'],
    },
  },
];
