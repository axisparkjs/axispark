import { ExecutionContext } from '../execution';

/**
 * An abstract class representing the definition of a result in the execution context.
 * It encapsulates the value and return code of the result.
 */
export abstract class ResultDefinition<T = unknown> {
    public constructor(
        public readonly value: T,
        public readonly rc: number
    ) {}

    /**
     * Processes the result using the provided execution context.
     * @param context The execution context containing relevant information for processing.
     * @returns A promise resolving when the result has been processed.
     */
    abstract process(context: ExecutionContext): Promise<void>;
}
