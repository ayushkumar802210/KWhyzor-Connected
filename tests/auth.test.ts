import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateMeterConsumption } from '../lib/electricity/normalization/meter-calculation';

test('Supabase environment schema validates correctly', () => {
  const { env } = require('../lib/env');
  assert.ok(typeof env === 'object');
  assert.ok('NEXT_PUBLIC_SUPABASE_URL' in env);
  assert.ok('NEXT_PUBLIC_SUPABASE_ANON_KEY' in env);
});

test('isSupabaseConfigured returns false when env is empty', () => {
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Re-import to get fresh module
  delete require.cache[require.resolve('../lib/env')];
  const { isSupabaseConfigured } = require('../lib/env');
  assert.equal(isSupabaseConfigured(), false);
  
  if (originalUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
  if (originalKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
});

test('meter calculation is deterministic and correct', () => {
  const result = calculateMeterConsumption(100, 200);
  assert.equal(result.consumption, 100);
  assert.equal(result.status, 'calculated');
});

test('meter calculation handles multiplier', () => {
  const result = calculateMeterConsumption(100, 200, 2);
  assert.equal(result.consumption, 200);
  assert.equal(result.status, 'calculated');
});

test('meter calculation rejects invalid readings', () => {
  const result = calculateMeterConsumption(200, 100);
  assert.equal(result.status, 'invalid');
});

test('meter calculation returns insufficient data when readings missing', () => {
  const result = calculateMeterConsumption(undefined, 100);
  assert.equal(result.status, 'insufficient_data');
});

test('provider detection works for generic parser', async () => {
  const { GenericBillParser } = await import('../lib/electricity/providers/generic-bill-parser');
  const parser = new GenericBillParser();
  const detection = parser.detect('This is a test document without specific provider');
  assert.equal(detection.providerName, 'Generic Provider');
  assert.ok(['Low', 'Medium', 'High'].includes(detection.confidence));
});
