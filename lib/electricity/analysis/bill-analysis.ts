import type { BillField } from '../normalization/bill-schema';

export interface ComparisonResult {
  previousValue: number;
  currentValue: number;
  difference: number;
  percentageChange: number;
  direction: 'up' | 'down' | 'flat';
}

export function calculateConsumptionChange(previous: number, current: number): ComparisonResult {
  const difference = current - previous;
  const percentageChange = previous === 0 ? 0 : (difference / previous) * 100;

  return {
    previousValue: previous,
    currentValue: current,
    difference,
    percentageChange,
    direction: difference > 0 ? 'up' : difference < 0 ? 'down' : 'flat'
  };
}

export function calculateBillChange(previousBill: number, currentBill: number): ComparisonResult {
  return calculateConsumptionChange(previousBill, currentBill);
}

export function calculateDailyConsumption(totalUnits: number, billingDays: number): number {
  if (!billingDays || billingDays <= 0) {
    return 0;
  }

  return totalUnits / billingDays;
}

export function calculateEffectiveCost(totalBill: number, unitsConsumed: number): number {
  if (!unitsConsumed || unitsConsumed <= 0) {
    return 0;
  }

  return totalBill / unitsConsumed;
}

export function compareMeterReadings(previous: number, current: number, multiplier = 1): number {
  return (current - previous) * multiplier;
}

export function analyzeChargeChanges(previousCharges: Record<string, number>, currentCharges: Record<string, number>): Record<string, number> {
  const changes: Record<string, number> = {};
  const allKeys = new Set([...Object.keys(previousCharges), ...Object.keys(currentCharges)]);

  allKeys.forEach((key) => {
    changes[key] = (currentCharges[key] ?? 0) - (previousCharges[key] ?? 0);
  });

  return changes;
}

export function compareBills(previous: { units: number; billAmount: number; billingDays: number }, current: { units: number; billAmount: number; billingDays: number }) {
  const consumption = calculateConsumptionChange(previous.units, current.units);
  const bill = calculateBillChange(previous.billAmount, current.billAmount);
  const daily = {
    previous: calculateDailyConsumption(previous.units, previous.billingDays),
    current: calculateDailyConsumption(current.units, current.billingDays)
  };
  const effectiveCost = {
    previous: calculateEffectiveCost(previous.billAmount, previous.units),
    current: calculateEffectiveCost(current.billAmount, current.units)
  };

  return {
    consumption,
    bill,
    daily,
    effectiveCost,
    summary: {
      unitsDifference: consumption.difference,
      billDifference: bill.difference,
      percentageChange: consumption.percentageChange
    }
  };
}

export function createEvidenceField(label: string, value: number | string | null, status: 'ACTUAL_FROM_BILL' | 'USER_VERIFIED' | 'CALCULATED' | 'ESTIMATED' | 'NOT_AVAILABLE', source: string, evidence: string): BillField<number | string | null> {
  return {
    value,
    status,
    confidence: 'Medium',
    source,
    evidence: `${label}: ${evidence}`
  };
}
