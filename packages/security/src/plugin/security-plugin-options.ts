import { PluginOptions } from '@axisparkjs/core';
import { Authenticator, AuthenticatorType } from '../types/authenticator';
import { ExecutionTransport } from '@axisparkjs/engine';

/**
 * Configuration accepted by {@link SecurityPlugin}.
 *
 * The plugin supplies a framework-neutral security pipeline. It does not
 * prescribe credential formats, identity storage, policy syntax, or protocol
 * error responses; applications provide authenticators and policies.
 */
export interface SecurityPluginOptions extends PluginOptions {
    /**
     * The authenticator configuration for the Security plugin.
     * Controls when authentication runs and which authenticator classes are
     * considered. If omitted by {@link SecurityPluginOptionsFactory}, the
     * strategy defaults to `all`.
     *
     * Default is 'all', which means all available authenticators will be used.
     */
    authenticator?: {
        /**
         * Transports on which the authentication engine runs. This is a
         * pipeline-level switch; individual authenticator classes can further
         * restrict themselves with their static `transports` property. Defaults
         * to all transports. Include every transport with secured handlers:
         * this engine also discovers `@Secured()` metadata for the guards, so
         * disabling it for a transport prevents those guards from recognizing
         * secured targets on that transport.
         */
        transports?: readonly ExecutionTransport[];
        /**
         * Selection mode. `selected` runs only the classes in `selected` and is
         * useful for deterministic application configuration. `all` discovers
         * every injectable class registered in the application that extends
         * {@link Authenticator}; use it only when every registered
         * authenticator should participate.
         */
        strategy: 'selected' | 'all';
        /**
         * Authenticator classes to run when `strategy` is `selected`. The
         * injector must be able to construct each class and its dependencies.
         */
        selected?: AuthenticatorType[];
    };
}
