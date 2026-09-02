import type { BillProvider, ProviderDetectionResult } from './provider-interface';

export class ProviderB implements BillProvider {
  providerName = 'Tata Power Mumbai';

  detect(rawText: string): ProviderDetectionResult {
    const normalized = rawText.toLowerCase();
    const reasons: string[] = [];

    if (normalized.includes('tata power')) {
      reasons.push('Tata Power signature detected.');
    }
    if (normalized.includes('mumbai')) {
      reasons.push('Mumbai region reference detected.');
    }

    return {
      providerName: this.providerName,
      confidence: reasons.length > 0 ? 'High' : 'Low',
      reasons: reasons.length > 0 ? reasons : ['No Tata Power-specific signature detected.']
    };
  }

  parse(rawText: string): Record<string, unknown> {
    return { provider: this.providerName, rawLength: rawText.length };
  }
}
