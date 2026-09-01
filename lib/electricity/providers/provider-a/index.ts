import type { BillProvider, ProviderDetectionResult } from '../provider-interface';

export class ProviderAParser implements BillProvider {
  providerName = 'Provider A';

  detect(rawText: string): ProviderDetectionResult {
    const lower = rawText.toLowerCase();
    const matches = ['consumer number', 'meter number', 'total payable'];
    const reasons = matches.filter((term) => lower.includes(term));

    return {
      providerName: this.providerName,
      confidence: reasons.length >= 2 ? 'Medium' : 'Low',
      reasons: reasons.length > 0 ? reasons : ['No provider A signature detected.']
    };
  }

  parse(rawText: string): Record<string, unknown> {
    return {
      provider: this.providerName,
      rawText,
      parser: 'provider-a',
      notes: 'Provider-specific parser shell for future adapter implementation.'
    };
  }
}
