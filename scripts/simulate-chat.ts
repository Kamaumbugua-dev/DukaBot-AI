/**
 * CLI Chat Simulator — test DukaBot without WhatsApp
 * Usage: npm run simulate
 */
import 'dotenv/config';
import * as readline from 'readline';
import { runAgent } from '../src/ai/agent';
import type { ConversationContext } from '../src/types/ai';
import type { Merchant, Customer } from '../src/types/commerce';

const RESET = '\x1b[0m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';

const mockMerchant: Merchant = {
  id: '683e2f2d-8c0b-4a91-9cb9-11af7c534690',
  businessName: 'Axonlattice',
  phone: '254702569778',
  waPhoneId: 'placeholder',
  mpesaShortcode: '174379',
  location: 'Nairobi CBD',
  settings: {
    businessHours: 'Mon-Sat 8AM-6PM',
    categories: ['TVs', 'Fridges', 'Washing Machines', 'Home Appliances', 'Air Conditioners'],
    deliveryInfo: 'Free delivery within Nairobi CBD',
  },
  plan: 'free',
  createdAt: new Date(),
};

const mockCustomer: Customer = {
  id: 'cust-sim-001',
  phone: '254712345678',
  createdAt: new Date(),
};

// Mock tool handlers (no real DB/payment in simulator)
const mockCatalog = [
  { id: 'p1',  name: 'Samsung 43" 4K UHD Smart TV',           priceKES: 38500,  category: 'tvs',       stock: 10, description: '43 inch 4K UHD Smart TV with Netflix, YouTube & WiFi' },
  { id: 'p2',  name: 'LG 55" OLED Smart TV',                  priceKES: 89000,  category: 'tvs',       stock: 5,  description: '55 inch OLED 4K Smart TV with ThinQ AI' },
  { id: 'p3',  name: 'Hisense 32" HD LED TV',                  priceKES: 18500,  category: 'tvs',       stock: 15, description: '32 inch HD LED TV with built-in decoder' },
  { id: 'p4',  name: 'TCL 65" QLED 4K Smart TV',              priceKES: 115000, category: 'tvs',       stock: 3,  description: '65 inch QLED 4K Android TV with Dolby Vision' },
  { id: 'p5',  name: 'Samsung 320L Double Door Fridge',        priceKES: 52000,  category: 'appliances', stock: 8,  description: '320 litre double door refrigerator with frost free technology' },
  { id: 'p6',  name: 'LG 260L Single Door Fridge',             priceKES: 34000,  category: 'appliances', stock: 10, description: '260 litre single door refrigerator with smart inverter compressor' },
  { id: 'p7',  name: 'Hisense 450L Side-by-Side Fridge',       priceKES: 98000,  category: 'appliances', stock: 4,  description: '450 litre side by side refrigerator with water dispenser' },
  { id: 'p8',  name: 'Von Hotpoint 150L Bar Fridge',           priceKES: 19500,  category: 'appliances', stock: 12, description: '150 litre bar fridge ideal for small spaces' },
  { id: 'p9',  name: 'Samsung 7kg Front Load Washing Machine', priceKES: 58000,  category: 'appliances', stock: 6,  description: '7kg front load washer with eco bubble technology' },
  { id: 'p10', name: 'LG 8kg Top Load Washing Machine',        priceKES: 42000,  category: 'appliances', stock: 8,  description: '8kg top load washing machine with smart inverter motor' },
  { id: 'p11', name: 'Hisense 6kg Washing Machine',            priceKES: 29500,  category: 'appliances', stock: 10, description: '6kg fully automatic top load washing machine' },
  { id: 'p12', name: 'Ramtons 900W Microwave Oven',            priceKES: 8500,   category: 'appliances', stock: 20, description: '900W solo microwave oven with 23L capacity' },
  { id: 'p13', name: 'Samsung 32L Microwave with Grill',       priceKES: 16500,  category: 'appliances', stock: 12, description: '32 litre microwave with grill function and smart sensor' },
  { id: 'p14', name: 'Kenwood Hand Blender',                   priceKES: 3500,   category: 'appliances', stock: 25, description: '700W hand blender with stainless steel blade' },
  { id: 'p15', name: 'Philips Air Fryer 4.1L',                 priceKES: 12500,  category: 'appliances', stock: 15, description: '4.1 litre air fryer with rapid air technology, 1400W' },
  { id: 'p16', name: 'Bruhm 2-Slice Toaster',                  priceKES: 2200,   category: 'appliances', stock: 30, description: '2-slice toaster with 7 browning settings and crumb tray' },
  { id: 'p17', name: 'Ramtons 1.7L Electric Kettle',           priceKES: 1800,   category: 'appliances', stock: 30, description: '1.7 litre stainless steel electric kettle with auto shut-off' },
  { id: 'p18', name: 'Panasonic 1.8L Rice Cooker',             priceKES: 4500,   category: 'appliances', stock: 20, description: '1.8 litre automatic rice cooker and steamer' },
  { id: 'p19', name: 'LG 9000 BTU Split Air Conditioner',      priceKES: 52000,  category: 'appliances', stock: 5,  description: '9000 BTU inverter split AC with WiFi control' },
  { id: 'p20', name: 'Daikin 12000 BTU Split AC',              priceKES: 68000,  category: 'appliances', stock: 4,  description: '12000 BTU inverter split air conditioner with R32 refrigerant' },
];

const cart: Array<{ id: string; name: string; priceKES: number; quantity: number }> = [];

const toolHandlers = {
  search_products: async (input: Record<string, unknown>) => {
    const query = String(input['query'] ?? '').toLowerCase();
    const maxPrice = input['max_price'] as number | undefined;
    const category = input['category'] as string | undefined;

    let results = mockCatalog.filter(
      (p) =>
        (p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || query === '') &&
        (!maxPrice || p.priceKES <= maxPrice) &&
        (!category || p.category === category),
    );

    return results.slice(0, 10).map((p) => ({
      id: p.id,
      name: p.name,
      priceKES: p.priceKES,
      inStock: p.stock > 0,
      category: p.category,
    }));
  },

  get_product_details: async (input: Record<string, unknown>) => {
    const product = mockCatalog.find((p) => p.id === input['product_id']);
    if (!product) return { error: 'Product not found' };
    return product;
  },

  add_to_cart: async (input: Record<string, unknown>) => {
    const product = mockCatalog.find((p) => p.id === input['product_id']);
    if (!product) return { error: 'Product not found' };
    const qty = (input['quantity'] as number) ?? 1;
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ id: product.id, name: product.name, priceKES: product.priceKES, quantity: qty });
    }
    return { success: true, cart, cartId: 'cart-sim-001' };
  },

  remove_from_cart: async (input: Record<string, unknown>) => {
    const idx = cart.findIndex((i) => i.id === input['product_id']);
    if (idx >= 0) cart.splice(idx, 1);
    return { success: true, cart };
  },

  view_cart: async () => {
    const total = cart.reduce((s, i) => s + i.priceKES * i.quantity, 0);
    return { items: cart, total, cartId: 'cart-sim-001' };
  },

  set_delivery_instructions: async (input: Record<string, unknown>) => {
    return {
      success: true,
      deliveryAddress: input['delivery_address'],
      deliveryNotes: input['delivery_notes'] ?? null,
      requiresInstallation: input['requires_installation'] ?? false,
      installationFee: input['requires_installation'] ? 1000 : 0,
      message: 'Delivery instructions saved',
    };
  },

  initiate_payment: async () => {
    const total = cart.reduce((s, i) => s + i.priceKES * i.quantity, 0);
    return {
      success: true,
      message: 'STK push sent to customer phone (SIMULATOR — no real payment)',
      amount: total,
      checkoutRequestId: 'SIM_CHK_001',
    };
  },

  check_order_status: async () => ({
    orderId: 'ORD-SIM-001',
    status: 'shipped',
    estimatedDelivery: 'Tomorrow',
  }),
};

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const context: ConversationContext = {
    merchant: mockMerchant,
    customer: mockCustomer,
    history: [],
    cartItems: [],
    isComplaint: false,
    productComparisonCount: 0,
    requiresAnalytics: false,
  };

  console.log(`\n${CYAN}╔══════════════════════════════════════════╗${RESET}`);
  console.log(`${CYAN}║        DukaBot AI — Chat Simulator       ║${RESET}`);
  console.log(`${CYAN}║  Store: ${mockMerchant.businessName.padEnd(33)}║${RESET}`);
  console.log(`${CYAN}╚══════════════════════════════════════════╝${RESET}`);
  console.log(`${DIM}Type your message. Ctrl+C to exit.${RESET}\n`);

  const ask = () => {
    rl.question(`${GREEN}You: ${RESET}`, async (input) => {
      if (!input.trim()) {
        ask();
        return;
      }

      try {
        const response = await runAgent(input, context, toolHandlers as never);

        // Update history
        context.history.push({ role: 'user', content: input });
        context.history.push({ role: 'assistant', content: response.text });

        // Sync cart
        context.cartItems = cart.map((i) => ({
          productId: i.id,
          name: i.name,
          priceKES: i.priceKES,
          quantity: i.quantity,
        }));

        console.log(`\n${YELLOW}DukaBot: ${RESET}${response.text}`);
        if (response.toolsUsed.length > 0) {
          console.log(`${DIM}[Tools: ${response.toolsUsed.join(', ')}]${RESET}`);
        }
        console.log();
      } catch (err) {
        console.error('Error:', err);
      }

      ask();
    });
  };

  ask();
}

main();
