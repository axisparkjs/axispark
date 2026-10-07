import { InjectionToken } from '@axisparkjs/di';

/** Injection token used to inject the effective {@link SecurityPluginOptions}. */
export const SECURITY_OPTIONS = new InjectionToken('SECURITY_OPTIONS');
/** Injection token used to inject the child logger owned by {@link SecurityPlugin}. */
export const SECURITY_LOGGER = new InjectionToken('SECURITY_LOGGER');
