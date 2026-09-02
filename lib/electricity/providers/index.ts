export * from './provider-interface';
export * from './provider-registry';
export * from './generic-bill-parser';
export * from './provider-a';
export * from './provider-b';
export * from './provider-c';

import { ProviderA } from './provider-a';
import { ProviderB } from './provider-b';
import { ProviderC } from './provider-c';
import { GenericBillParser } from './generic-bill-parser';
import { ProviderRegistry } from './provider-registry';

let registry: ProviderRegistry | undefined;

export function getProviderRegistry(): ProviderRegistry {
  if (!registry) {
    registry = new ProviderRegistry();
    registry.register(new ProviderA());
    registry.register(new ProviderB());
    registry.register(new ProviderC());
    registry.register(new GenericBillParser());
  }
  return registry;
}

