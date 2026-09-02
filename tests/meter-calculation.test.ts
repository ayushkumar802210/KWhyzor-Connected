import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateMeterConsumption } from '../lib/electricity/normalization/meter-calculation';

test('calculates consumption from actual readings', () => {
  assert.deepEqual(calculateMeterConsumption(100, 180), { consumption: 80, status: 'calculated' });
});

test('applies an explicitly supplied multiplier', () => {
  assert.deepEqual(calculateMeterConsumption(100, 180, 1.5), { consumption: 120, status: 'calculated' });
});

test('does not invent consumption when a reading is missing', () => {
  assert.deepEqual(calculateMeterConsumption(undefined, 180), { consumption: null, status: 'insufficient_data' });
});

test('rejects negative consumption', () => {
  assert.deepEqual(calculateMeterConsumption(180, 100), { consumption: null, status: 'invalid' });
});

test('rejects a non-positive multiplier', () => {
  assert.deepEqual(calculateMeterConsumption(100, 180, 0), { consumption: null, status: 'invalid' });
});
