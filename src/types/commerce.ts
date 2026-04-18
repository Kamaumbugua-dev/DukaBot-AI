export enum ProductCategory {
  ELECTRONICS = 'electronics',
  PHONES = 'phones',
  TVS = 'tvs',
  AUDIO = 'audio',
  ACCESSORIES = 'accessories',
  COMPUTERS = 'computers',
  APPLIANCES = 'appliances',
  OTHER = 'other',
}

export enum OrderStatus {
  PENDING = 'pending',
  PAYMENT_INITIATED = 'payment_initiated',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  PAYMENT_FAILED = 'payment_failed',
  RETURNED = 'returned',
}

export type CartState =
  | { status: 'empty' }
  | { status: 'active'; items: CartItem[]; lastUpdated: Date }
  | { status: 'checkout'; items: CartItem[]; paymentRef: string }
  | { status: 'completed'; orderId: string }
  | { status: 'expired' };

export type CartItem = {
  productId: string;
  name: string;
  priceKES: number;
  quantity: number;
  imageUrl?: string;
};

export type Product = {
  id: string;
  merchantId: string;
  name: string;
  priceKES: number;
  category: ProductCategory;
  description?: string;
  imageUrl?: string;
  stock: number;
  active: boolean;
  createdAt: Date;
};

export type Merchant = {
  id: string;
  businessName: string;
  phone: string;
  waPhoneId: string;
  mpesaShortcode?: string;
  location?: string;
  settings: MerchantSettings;
  plan: 'free' | 'starter' | 'pro';
  createdAt: Date;
};

export type MerchantSettings = {
  businessHours?: string;
  categories?: string[];
  deliveryInfo?: string;
  offHoursMessage?: string;
  deliveryZones?: string[];
  deliveryFee?: number;
};

export type Customer = {
  id: string;
  phone: string;
  name?: string;
  preferences?: Record<string, unknown>;
  createdAt: Date;
};

export type Order = {
  id: string;
  customerId: string;
  merchantId: string;
  items: CartItem[];
  totalKES: number;
  status: OrderStatus;
  mpesaRef?: string;
  mpesaReceipt?: string;
  createdAt: Date;
};

export type Discount = {
  type: 'percentage' | 'fixed';
  value: number;
  code?: string;
};
