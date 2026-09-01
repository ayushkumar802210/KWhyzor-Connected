import type { BillProvider, ProviderDetectionResult } from '../provider-interface';

export class ProviderCParser implements BillProvider {
  providerName = 'Provider C';

  detect(rawText: string): ProviderDetectionResult {
    const lower = rawText.toLowerCase();
    const matches = ['account number', 'bill period', 'tariff'];
    const reasons = matches.filter((term) => lower.includes(term));

    return {
      providerName: this.providerName,
      confidence: reasons.length >= 2 ? 'Medium' : 'Low',
      reasons: reasons.length > 0 ? reasons : ['No provider C signature detected.']
    };
  }

  parse(rawText: string): Record<string, unknown> {
    return {
      provider: this.providerName,
      rawText,
      parser: 'provider-c',
      notes: 'Provider-specific parser shell for future adapter implementation.'
    };
  }
}
