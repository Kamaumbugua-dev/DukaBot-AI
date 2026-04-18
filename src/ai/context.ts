import type Anthropic from '@anthropic-ai/sdk';
import type { ConversationContext, ConversationMessage } from '../types/ai';
import { formatKES } from '../shared/utils';

const MAX_HISTORY_MESSAGES = 10;

export function buildMessages(
  context: ConversationContext,
  newUserMessage: string,
): Anthropic.MessageParam[] {
  // Keep only last N messages to manage context window
  const recentHistory = context.history.slice(-MAX_HISTORY_MESSAGES);

  const messages: Anthropic.MessageParam[] = recentHistory.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Append cart state as context if active
  let userContent = newUserMessage;
  if (context.cartItems.length > 0) {
    const cartSummary = context.cartItems
      .map((item) => `- ${item.name} x${item.quantity} = ${formatKES(item.priceKES * item.quantity)}`)
      .join('\n');
    const cartTotal = context.cartItems.reduce(
      (sum, item) => sum + item.priceKES * item.quantity,
      0,
    );
    userContent = `[Cart: ${context.cartItems.length} item(s), Total: ${formatKES(cartTotal)}]\n\n${newUserMessage}`;
  }

  messages.push({ role: 'user', content: userContent });
  return messages;
}

export function appendToHistory(
  history: ConversationMessage[],
  role: 'user' | 'assistant',
  content: string,
): ConversationMessage[] {
  const updated = [...history, { role, content }];
  // Keep rolling window
  return updated.slice(-MAX_HISTORY_MESSAGES * 2);
}

export function selectModel(context: ConversationContext): string {
  const chatModel = process.env['CLAUDE_MODEL'] ?? 'claude-sonnet-4-20250514';
  const complexModel = process.env['CLAUDE_MODEL_COMPLEX'] ?? 'claude-opus-4-6';

  if (context.isComplaint) return complexModel;
  if (context.productComparisonCount > 3) return complexModel;
  if (context.requiresAnalytics) return complexModel;
  return chatModel;
}
