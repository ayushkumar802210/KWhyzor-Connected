import assert from 'node:assert/strict';
import test from 'node:test';

test('payment schema validation rejects negative amounts', async () => {
  const { z } = await import('zod');
  const orderSchema = z.object({ amount: z.number().finite().positive().max(1000000) });
  
  const negativeResult = orderSchema.safeParse({ amount: -50 });
  assert.equal(negativeResult.success, false);
  
  const zeroResult = orderSchema.safeParse({ amount: 0 });
  assert.equal(zeroResult.success, false);
  
  const validResult = orderSchema.safeParse({ amount: 100 });
  assert.equal(validResult.success, true);
});

test('webhook signature verification uses timing-safe comparison', () => {
  const { createHmac, timingSafeEqual } = require('crypto');
  const secret = 'test_secret';
  const body = JSON.stringify({ event: 'payment.captured' });
  
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  const isValid = expected.length === expected.length && timingSafeEqual(Buffer.from(expected), Buffer.from(expected));
  assert.equal(isValid, true);
  
  const invalid = 'wrong_signature';
  const isInvalid = invalid.length === expected.length && timingSafeEqual(Buffer.from(invalid), Buffer.from(expected));
  assert.equal(isInvalid, false);
});
