import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';
import { logger } from '../shared/logger';
import { AIError } from '../shared/errors';
import { dukaTools } from './tools';
import { buildSystemPrompt } from './prompts';
import { buildMessages, selectModel } from './context';
import {
  checkInput,
  checkOutput,
  checkForEscalation,
  checkForOutOfScope,
  INJECTION_BLOCKED_REPLY,
  OUT_OF_SCOPE_REPLY,
  ESCALATION_REPLY,
} from './guardrails';
import type { ConversationContext, AgentResponse, ToolName } from '../types/ai';

const MAX_TOOL_CALLS = 10;
const TIMEOUT_MS = 30_000;

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

type ToolHandler = (input: Record<string, unknown>) => Promise<unknown>;

export async function runAgent(
  userMessage: string,
  context: ConversationContext,
  toolHandlers: Partial<Record<ToolName, ToolHandler>>,
): Promise<AgentResponse> {
  // Guardrail: check input
  const inputCheck = checkInput(userMessage);
  if (!inputCheck.safe) {
    return { text: INJECTION_BLOCKED_REPLY, toolsUsed: [], modelUsed: 'none' };
  }

  // Guardrail: escalation check
  if (checkForEscalation(userMessage)) {
    return { text: ESCALATION_REPLY, toolsUsed: [], modelUsed: 'none' };
  }

  // Guardrail: out of scope
  if (checkForOutOfScope(userMessage)) {
    return { text: OUT_OF_SCOPE_REPLY, toolsUsed: [], modelUsed: 'none' };
  }

  const model = selectModel(context);
  const systemPrompt = buildSystemPrompt(context.merchant);
  const messages = buildMessages(context, userMessage);
  const toolsUsed: ToolName[] = [];

  let toolCallCount = 0;
  const startTime = Date.now();

  let response = await withTimeout(
    anthropic.messages.create({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      tools: dukaTools,
      messages,
    }),
    TIMEOUT_MS,
  );

  // Agentic loop — execute tool calls until final text response
  while (response.stop_reason === 'tool_use') {
    if (toolCallCount >= MAX_TOOL_CALLS) {
      logger.warn({ toolCallCount }, 'Max tool calls reached');
      break;
    }

    if (Date.now() - startTime > TIMEOUT_MS) {
      logger.warn('Agent timeout');
      break;
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const block of response.content) {
      if (block.type !== 'tool_use') continue;

      const toolName = block.name as ToolName;
      const handler = toolHandlers[toolName];
      toolsUsed.push(toolName);
      toolCallCount++;

      let toolResult: unknown;
      if (handler) {
        try {
          toolResult = await handler(block.input as Record<string, unknown>);
        } catch (err) {
          toolResult = { error: 'Tool execution failed' };
          logger.error({ err, toolName }, 'Tool handler error');
        }
      } else {
        toolResult = { error: `Tool ${toolName} not implemented` };
      }

      toolResults.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: JSON.stringify(toolResult),
      });
    }

    response = await withTimeout(
      anthropic.messages.create({
        model,
        max_tokens: 1024,
        system: systemPrompt,
        tools: dukaTools,
        messages: [
          ...messages,
          { role: 'assistant', content: response.content },
          { role: 'user', content: toolResults },
        ],
      }),
      TIMEOUT_MS - (Date.now() - startTime),
    );
  }

  // Extract text from final response
  const textBlock = response.content.find((b) => b.type === 'text');
  const text = textBlock?.type === 'text' ? textBlock.text : 'Samahani, kuna tatizo kidogo.';

  // Guardrail: check output for PII leaks
  const outputCheck = checkOutput(text);
  if (!outputCheck.safe) {
    logger.warn({ reason: outputCheck.reason }, 'Output guardrail triggered');
    return {
      text: 'Samahani, kuna tatizo kidogo. Jaribu tena.',
      toolsUsed,
      modelUsed: model,
    };
  }

  return { text, toolsUsed, modelUsed: model };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new AIError('Agent timeout', 'AI_TIMEOUT')), ms),
    ),
  ]);
}
