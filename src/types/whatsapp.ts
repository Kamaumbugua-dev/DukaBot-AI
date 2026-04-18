export type WhatsAppTextMessage = {
  type: 'text';
  from: string;
  id: string;
  timestamp: Date;
  text: { body: string };
};

export type WhatsAppImageMessage = {
  type: 'image';
  from: string;
  id: string;
  timestamp: Date;
  image: { id: string; mime_type: string; caption?: string };
};

export type WhatsAppInteractiveReply = {
  type: 'interactive';
  from: string;
  id: string;
  timestamp: Date;
  interactive:
    | { type: 'button_reply'; button_reply: { id: string; title: string } }
    | { type: 'list_reply'; list_reply: { id: string; title: string; description?: string } };
};

export type WhatsAppOrderMessage = {
  type: 'order';
  from: string;
  id: string;
  timestamp: Date;
  order: {
    catalog_id: string;
    product_items: Array<{ product_retailer_id: string; quantity: number; item_price: number }>;
  };
};

export type WhatsAppMessage =
  | WhatsAppTextMessage
  | WhatsAppImageMessage
  | WhatsAppInteractiveReply
  | WhatsAppOrderMessage;

export type WhatsAppStatusUpdate = {
  type: 'status';
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  recipientId: string;
};

export type IncomingWebhookEvent = WhatsAppMessage | WhatsAppStatusUpdate;

export type MessageId = { messageId: string };
