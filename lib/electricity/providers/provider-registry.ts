import type { BillProvider } from './provider-interface';

export class ProviderRegistry {
  private providers = new Map<string, BillProvider>();

  register(provider: BillProvider): void {
    this.providers.set(provider.providerName.toLowerCase(), provider);
  }

  get(providerName: string): BillProvider | undefined {
    return this.providers.get(providerName.toLowerCase());
  }

  list(): BillProvider[] {
    return Array.from(this.providers.values());
  }
}
