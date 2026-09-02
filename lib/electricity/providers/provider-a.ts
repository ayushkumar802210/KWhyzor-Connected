import type { BillProvider, ProviderDetectionResult } from './provider-interface';

export class ProviderA implements BillProvider {
  providerName = 'BSES Rajdhani';

  detect(rawText: string): ProviderDetectionResult {
    const normalized = rawText.toLowerCase();
    const reasons: string[] = [];

    if (normalized.includes('bses') || normalized.includes('rajdhani')) {
      reasons.push('BSES Rajdhani signature detected.');
    }
    if (normalized.includes('delhi')) {
      reasons.push('Delhi region reference detected.');
    }

    return {
      providerName: this.providerName,
      confidence: reasons.length > 0 ? 'High' : 'Low',
      reasons: reasons.length > 0 ? reasons : ['No BSES-specific signature detected.']
    };
  }

  parse(rawText: string): Record<string, unknown> {
    return { provider: this.providerName, rawLength: rawText.length };
  }
}
