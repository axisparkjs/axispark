import { Resolver } from '@axisparkjs/common';
import { ExecutionContext } from '../execution';
import { ResultDefinition } from './result-definition';

/**
 * An abstract class representing a resolver for converting unknown values into result definitions.
 */
export abstract class ResultResolver implements Resolver<ResultDefinition> {
    /**
     * Resolves an unknown result into a `ResultDefinition` based on the provided execution context.
     * @param result The unknown result to be resolved.
     * @param context The execution context containing relevant information for resolution.
     * @returns A promise resolving to a `ResultDefinition` or a `ResultDefinition` directly.
     */
    abstract resolve(result: unknown, context: ExecutionContext): Promise<ResultDefinition> | ResultDefinition;
}