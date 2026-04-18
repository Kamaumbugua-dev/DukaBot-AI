import { describe, it, expect } from 'vitest';
import {
  AppError,
  NotFoundError,
  ValidationError,
  WhatsAppError,
  MpesaError,
} from '../../../src/shared/errors';

describe('AppError', () => {
  it('has correct properties', () => {
    const err = new AppError('Something went wrong', 'TEST_ERROR', 400);
    expect(err.message).toBe('Something went wrong');
    expect(err.code).toBe('TEST_ERROR');
    expect(err.statusCode).toBe(400);
    expect(err.isOperational).toBe(true);
  });

  it('defaults to 500 status code', () => {
    const err = new AppError('Oops', 'ERR');
    expect(err.statusCode).toBe(500);
  });
});

describe('NotFoundError', () => {
  it('extends AppError with 404', () => {
    const err = new NotFoundError('Product not found');
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
  });
});

describe('ValidationError', () => {
  it('has 400 status code', () => {
    const err = new ValidationError('Invalid input');
    expect(err.statusCode).toBe(400);
  });
});

describe('WhatsAppError', () => {
  it('extends AppError', () => {
    const err = new WhatsAppError('Send failed');
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(502);
  });
});

describe('MpesaError', () => {
  it('is operational by default', () => {
    const err = new MpesaError('STK push failed');
    expect(err.isOperational).toBe(true);
  });
});
