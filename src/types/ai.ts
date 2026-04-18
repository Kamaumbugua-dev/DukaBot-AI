import type { Merchant, Customer, CartItem } from './commerce';

export type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ConversationContext = {
  merchant: Merchant;
  customer: Customer;
  history: ConversationMessage[];
  cartItems: CartItem[];
  cartId?: string;
  isComplaint: boolean;
  productComparisonCount: number;
  requiresAnalytics: boolean;
};

export type ToolName =
  | 'search_products'
  | 'get_product_details'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'initiate_payment'
  | 'check_order_status';

export type AgentResponse = {
  text: string;
  toolsUsed: ToolName[];
  modelUsed: string;
};
