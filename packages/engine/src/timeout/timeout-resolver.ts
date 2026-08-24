import { Resolver } from '@axisparkjs/common';
import { TimeoutDefinition } from './timeout-definition';

/**
 * An interface representing a timeout resolver.
 * It defines the contract for resolving timeout definitions based on the execution transport.
 */
export interface TimeoutResolver extends Resolver<void> {
    /**
     * Resolves a timeout definition based on the execution transport.
     * @param timeout The timeout definition to resolve.
     * @returns A promise resolving when the timeout has been resolved or void if synchronous.
     */
    resolve(timeout: TimeoutDefinition): Promise<void> | void;
}
