import type { BillProvider, ProviderDetectionResult } from './provider-interface';

export class ProviderC implements BillProvider {
  providerName = 'MSEB';

  detect(rawText: string): ProviderDetectionResult {
    const normalized = rawText.toLowerCase();
    const reasons: string[] = [];

    if (normalized.includes('mseb') || normalized.includes('maharashtra state electricity')) {
      reasons.push('MSEB signature detected.');
    }
    if (normalized.includes('maharashtra') || normalized.includes('pune') || normalized.includes('nagpur')) {
      reasons.push('Maharashtra region reference detected.');
    }

    return {
      providerName: this.providerName,
      confidence: reasons.length > 0 ? 'Medium' : 'Low',
      reasons: reasons.length > 0 ? reasons : ['No MSEB-specific signature detected.']
    };
  }

  parse(rawText: string): Record<string, unknown> {
    return { provider: this.providerName, rawLength: rawText.length };
  }
}
