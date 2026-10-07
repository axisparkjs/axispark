import { PluginOptions } from '@axisparkjs/core';
import { AuthenticatorType } from '../types/authenticator';
import { ExecutionTransport } from '@axisparkjs/engine';

/**
 * Interface representing the options for configuring the Security plugin.
 */
export interface SecurityPluginOptions extends PluginOptions {
    /**
     * The authenticator configuration for the Security plugin.
     * It defines the strategy for selecting authenticators and the list of selected authenticators if applicable.
     * - `strategy`: Determines how authenticators are selected. It can be either 'selected' (only the specified authenticators will be used) or 'all' (all available authenticators will be used).
     * - `selected`: An optional array of authenticator types to be used when the strategy is set to 'selected'.
     *
     * Default is 'all', which means all available authenticators will be used.
     */
    authenticator?: {
        /**
         * The transports that the authenticator engine supports. Default is ExecutionTransport.All, which means it can be used with any transport. If you want to restrict the authenticator engine to specific transports, you can specify them in this array.
         */
        transports?: readonly ExecutionTransport[];
        /**
         * The strategy for selecting authenticators. Default is 'all'
         * - 'selected': Only the specified authenticators in the `selected` array will be used.
         * - 'all': All available authenticators will be used.
         */
        strategy: 'selected' | 'all';
        /**
         * An optional array of authenticator types to be used when the strategy is set to 'selected'.
         */
        selected?: AuthenticatorType[];
    };
}
