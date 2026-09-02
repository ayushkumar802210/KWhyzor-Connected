import assert from 'node:assert/strict';
import test from 'node:test';

test('bill validation detects consistent readings', async () => {
  const { validateBillFields } = await import('../lib/electricity/validation/bill-validation');
  const result = validateBillFields({
    previousReading: 100,
    currentReading: 200,
    billedUnits: 100,
    multiplier: 1,
    billPeriod: 'January 2024',
    billAmount: 500
  });
  assert.equal(result.readingConsistency, 'Looks Consistent');
  assert.equal(result.consumptionCalculation, 'Looks Consistent');
});

test('bill validation detects inconsistent readings', async () => {
  const { validateBillFields } = await import('../lib/electricity/validation/bill-validation');
  const result = validateBillFields({
    previousReading: 100,
    currentReading: 200,
    billedUnits: 150,
    multiplier: 1
  });
  assert.equal(result.readingConsistency, 'Needs Verification');
});

test('estimated reading detection works', async () => {
  const { detectEstimatedReading } = await import('../lib/electricity/validation/bill-validation');
  assert.equal(detectEstimatedReading('Estimated'), true);
  assert.equal(detectEstimatedReading('Actual'), false);
  assert.equal(detectEstimatedReading(undefined), false);
});

test('mismatch explanation identifies aligned readings', async () => {
  const { explainMismatch } = await import('../lib/electricity/validation/bill-validation');
  const explanation = explainMismatch(100, 200, 100);
  assert.ok(explanation.includes('align'));
});

test('mismatch explanation identifies misaligned readings', async () => {
  const { explainMismatch } = await import('../lib/electricity/validation/bill-validation');
  const explanation = explainMismatch(100, 200, 150);
  assert.ok(explanation.includes('do not directly match'));
});
