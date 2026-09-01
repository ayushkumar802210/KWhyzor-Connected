import type { BillProvider, ProviderDetectionResult } from '../provider-interface';

export class ProviderBParser implements BillProvider {
  providerName = 'Provider B';

  detect(rawText: string): ProviderDetectionResult {
    const lower = rawText.toLowerCase();
    const matches = ['service number', 'mfd', 'current reading'];
    const reasons = matches.filter((term) => lower.includes(term));

    return {
      providerName: this.providerName,
      confidence: reasons.length >= 2 ? 'Medium' : 'Low',
      reasons: reasons.length > 0 ? reasons : ['No provider B signature detected.']
    };
  }

  parse(rawText: string): Record<string, unknown> {
    return {
      provider: this.providerName,
      rawText,
      parser: 'provider-b',
      notes: 'Provider-specific parser shell for future adapter implementation.'
    };
  }
}
