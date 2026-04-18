// Prompt injection patterns to detect in customer messages
const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|above)\s+instructions?/i,
  /you\s+are\s+now\s+/i,
  /act\s+as\s+(?!a\s+sales)/i,
  /forget\s+(everything|all|your|previous)/i,
  /system\s*prompt/i,
  /reveal\s+(your|the)\s+(prompt|instructions|system)/i,
  /jailbreak/i,
  /DAN\s*mode/i,
];

// Escalation triggers — route to human support
const COMPLAINT_PATTERNS = [
  /defect|broken|damage|refund|return|compensation/i,
  /very\s+disappointed|very\s+angry|terrible\s+service|worst/i,
  /sue|legal\s+action|report\s+you/i,
  /speak\s+to\s+(a\s+)?human|talk\s+to\s+someone/i,
];

// Medical/legal advice triggers
const OUT_OF_SCOPE_PATTERNS = [
  /medical\s+advice|doctor|diagnos|symptom|medication/i,
  /legal\s+advice|lawyer|attorney|lawsuit/i,
];

// PII patterns that should not appear in AI output
const PII_OUTPUT_PATTERNS = [
  /\b254\d{9}\b/, // Kenyan phone numbers
  /mpesa\s*pin/i,
  /api.?key/i,
  /password/i,
];

export type GuardrailResult =
  | { safe: true }
  | { safe: false; reason: 'injection' | 'out_of_scope' | 'pii_leak' | 'complaint' };

export function checkInput(message: string): GuardrailResult {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(message)) {
      return { safe: false, reason: 'injection' };
    }
  }
  return { safe: true };
}

export function checkForEscalation(message: string): boolean {
  return COMPLAINT_PATTERNS.some((p) => p.test(message));
}

export function checkForOutOfScope(message: string): boolean {
  return OUT_OF_SCOPE_PATTERNS.some((p) => p.test(message));
}

export function checkOutput(output: string): GuardrailResult {
  for (const pattern of PII_OUTPUT_PATTERNS) {
    if (pattern.test(output)) {
      return { safe: false, reason: 'pii_leak' };
    }
  }
  return { safe: true };
}

export const INJECTION_BLOCKED_REPLY =
  'Samahani, siwezi kukusaidia na hiyo. Je, ungependa kuangalia bidhaa zetu? 😊';

export const OUT_OF_SCOPE_REPLY =
  'Samahani, hiyo siwezi kusaidia na. Wacha nikuconnect na support team yetu.';

export const ESCALATION_REPLY = [
  'Pole sana kwa hiyo inconvenience! 😔',
  'Naelewa frustration yako na hiyo si experience tungetaka.',
  '',
  'Wacha nikuconnect na support team yetu directly — watakusaidia na replacement ama refund.',
  '📞 Wasiliana nasi: 0700-000-000',
].join('\n');
