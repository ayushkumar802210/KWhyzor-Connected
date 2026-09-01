export type BillStatus =
  | 'ACTUAL_FROM_BILL'
  | 'USER_VERIFIED'
  | 'CALCULATED'
  | 'ESTIMATED'
  | 'NOT_AVAILABLE';

export type Confidence = 'High' | 'Medium' | 'Low';

export interface BillField<T = string | number | null> {
  value: T;
  status: BillStatus;
  confidence: Confidence;
  source: string;
  evidence: string;
}

export interface MeterInformation {
  meterNumber?: BillField<string>;
  meterId?: BillField<string>;
  meterType?: BillField<string>;
  previousReading?: BillField<number>;
  currentReading?: BillField<number>;
  readingType?: BillField<string>;
  readingStatus?: BillField<string>;
  multiplier?: BillField<number>;
  connectedLoad?: BillField<string>;
  contractDemand?: BillField<string>;
}

export interface BillingPeriod {
  billingDate?: BillField<string>;
  billingPeriod?: BillField<string>;
  dueDate?: BillField<string>;
  billNumber?: BillField<string>;
}

export interface ConsumerInformation {
  provider?: BillField<string>;
  customerReference?: BillField<string>;
  referenceType?: BillField<string>;
  customerName?: BillField<string>;
  address?: BillField<string>;
}

export interface ChargeBreakdown {
  energyCharges?: BillField<number>;
  fixedCharges?: BillField<number>;
  demandCharges?: BillField<number>;
  taxes?: BillField<number>;
  electricityDuty?: BillField<number>;
  fuelAdjustment?: BillField<number>;
  subsidy?: BillField<number>;
  rebate?: BillField<number>;
  arrears?: BillField<number>;
  totalPayable?: BillField<number>;
}

export interface NormalizedBill {
  provider: string;
  consumerReference: string | null;
  referenceType: string | null;
  meterInformation: MeterInformation;
  customerInformation: ConsumerInformation;
  billingPeriod: BillingPeriod;
  readings: {
    previousReading?: BillField<number>;
    currentReading?: BillField<number>;
    unitsBilled?: BillField<number>;
    readingDifference?: BillField<number>;
  };
  tariff: Record<string, BillField<string | number>>;
  charges: ChargeBreakdown;
  payment: {
    totalPayable?: BillField<number>;
    dueDate?: BillField<string>;
  };
  metadata: {
    rawOcrData?: string;
    verifiedBillData?: string;
    confidence: string;
    isDuplicate?: boolean;
  };
}

export const emptyField = <T = string | number | null>(
  value: T,
  status: BillStatus = 'NOT_AVAILABLE',
  source = 'Uploaded bill',
  evidence = 'This information is not available on the uploaded bill.'
): BillField<T> => ({
  value,
  status,
  confidence: 'Low',
  source,
  evidence
});
