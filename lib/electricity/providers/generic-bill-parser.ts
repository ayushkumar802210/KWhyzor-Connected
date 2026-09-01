import type { BillProvider, ExtractedField, ProviderDetectionResult } from './provider-interface';

export class GenericBillParser implements BillProvider {
  providerName = 'Generic Provider';

  detect(rawText: string): ProviderDetectionResult {
    const normalized = rawText.toLowerCase();
    const reasons: string[] = [];

    if (normalized.includes('consumer number') || normalized.includes('ca number')) {
      reasons.push('Consumer reference fields are present.');
    }

    if (normalized.includes('meter') || normalized.includes('current reading')) {
      reasons.push('Meter reading terms are present.');
    }

    if (normalized.includes('total payable') || normalized.includes('amount payable')) {
      reasons.push('Billing total is present.');
    }

    return {
      providerName: this.providerName,
      confidence: reasons.length > 0 ? 'Low' : 'Low',
      reasons: reasons.length > 0 ? reasons : ['No provider-specific signature detected.']
    };
  }

  parse(rawText: string): Record<string, unknown> {
    const providerField: ExtractedField<string> = {
      value: 'Not detected',
      confidence: 'Low',
      source: 'OCR',
      evidence: 'No provider-specific format match was detected in the uploaded document.',
      status: 'Not available'
    };

    return {
      provider: providerField,
      rawTextLength: rawText.length,
      normalized: false,
      extractedFields: []
    };
  }
}
