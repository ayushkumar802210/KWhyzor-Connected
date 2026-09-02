export type MeterCalculation = {
  consumption: number | null;
  status: 'calculated' | 'insufficient_data' | 'invalid';
};

export function calculateMeterConsumption(previousReading?: number, currentReading?: number, multiplier?: number): MeterCalculation {
  if (previousReading === undefined || currentReading === undefined) return { consumption: null, status: 'insufficient_data' };
  if (currentReading < previousReading || (multiplier !== undefined && multiplier <= 0)) return { consumption: null, status: 'invalid' };
  return { consumption: (currentReading - previousReading) * (multiplier ?? 1), status: 'calculated' };
}
