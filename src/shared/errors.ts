export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class WhatsAppError extends AppError {
  constructor(message: string, code = 'WHATSAPP_ERROR') {
    super(message, code, 502);
  }
}

export class MpesaError extends AppError {
  constructor(message: string, code = 'MPESA_ERROR') {
    super(message, code, 502);
  }
}

export class CatalogError extends AppError {
  constructor(message: string, code = 'CATALOG_ERROR') {
    super(message, code, 500);
  }
}

export class AIError extends AppError {
  constructor(message: string, code = 'AI_ERROR') {
    super(message, code, 502);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 'RATE_LIMIT', 429);
  }
}
