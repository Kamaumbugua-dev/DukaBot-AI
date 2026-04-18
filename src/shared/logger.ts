import pino from 'pino';

// Redact PII from all logs
const REDACT_PATHS = [
  'phone',
  'customerPhone',
  'senderPhone',
  '*.phone',
  'req.headers.authorization',
  'req.headers["x-hub-signature-256"]',
];

const baseOptions = {
  level: process.env['NODE_ENV'] === 'production' ? 'info' : 'debug',
  redact: {
    paths: REDACT_PATHS,
    censor: '[REDACTED]',
  },
};

export const logger =
  process.env['NODE_ENV'] !== 'production'
    ? pino({ ...baseOptions, transport: { target: 'pino-pretty', options: { colorize: true } } })
    : pino(baseOptions);

export function createRequestLogger(requestId: string) {
  return logger.child({ requestId });
}
