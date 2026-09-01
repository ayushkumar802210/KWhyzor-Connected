export type ValidationResult =
  | 'Looks Consistent'
  | 'Needs Verification'
  | 'Information Missing'
  | 'Unable to Determine';

export interface BillValidationSummary {
  readingConsistency: ValidationResult;
  arithmeticConsistency: ValidationResult;
  billingPeriod: ValidationResult;
  consumptionCalculation: ValidationResult;
  previousBillComparison: ValidationResult;
  chargeBreakdown: ValidationResult;
  estimatedReadingDetection: ValidationResult;
  meterMultiplier: ValidationResult;
  duplicateBill: ValidationResult;
  unusualConsumption: ValidationResult;
}

export function validateBillFields(input: {
  previousReading?: number;
  currentReading?: number;
  billedUnits?: number;
  multiplier?: number;
  billPeriod?: string;
  billAmount?: number;
  hasDuplicate?: boolean;
}): BillValidationSummary {
  const readingDifference = typeof input.previousReading === 'number' && typeof input.currentReading === 'number'
    ? input.currentReading - input.previousReading
    : undefined;

  const computedMatchesBilled = typeof readingDifference === 'number' && typeof input.billedUnits === 'number'
    ? readingDifference === input.billedUnits
    : undefined;

  const multiplierPresent = typeof input.multiplier === 'number' && input.multiplier > 0;

  return {
    readingConsistency: computedMatchesBilled === undefined ? 'Information Missing' : computedMatchesBilled ? 'Looks Consistent' : 'Needs Verification',
    arithmeticConsistency: typeof input.billAmount === 'number' ? 'Looks Consistent' : 'Information Missing',
    billingPeriod: input.billPeriod ? 'Looks Consistent' : 'Information Missing',
    consumptionCalculation: typeof input.billedUnits === 'number' ? 'Looks Consistent' : 'Information Missing',
    previousBillComparison: 'Unable to Determine',
    chargeBreakdown: typeof input.billAmount === 'number' ? 'Looks Consistent' : 'Information Missing',
    estimatedReadingDetection: 'Unable to Determine',
    meterMultiplier: multiplierPresent ? 'Looks Consistent' : 'Information Missing',
    duplicateBill: input.hasDuplicate ? 'Needs Verification' : 'Unable to Determine',
    unusualConsumption: typeof readingDifference === 'number' && readingDifference > 0 ? 'Needs Verification' : 'Information Missing'
  };
}

export function detectEstimatedReading(readingType?: string): boolean {
  if (!readingType) {
    return false;
  }

  return /estimated|provisional/i.test(readingType);
}

export function explainMismatch(previousReading: number, currentReading: number, billedUnits: number, multiplier?: number): string {
  const difference = currentReading - previousReading;
  const adjustedDifference = multiplier && multiplier > 0 ? difference * multiplier : difference;

  if (adjustedDifference === billedUnits) {
    return 'Meter reading difference and billed consumption align.';
  }

  return 'Meter reading difference and billed consumption do not directly match. This may relate to meter multiplier, billing methodology, adjustments, estimated readings, or provider-specific calculations. Please verify the bill.';
}
