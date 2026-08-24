import { Processable } from '@axisparkjs/common';
import { Injectable } from '@axisparkjs/di';
import { ExecutionContext, ExecutionTransport } from '../execution';
import { ResultResolver } from './result-resolver';
import { ResultDefinition } from './result-definition';

/**
 * A processor for handling results in the execution context.
 * It processes results based on their type and the associated execution transport.
 */
@Injectable()
export class ResultProcessor implements Processable {
    private static readonly resolvers = new Map<ExecutionTransport, ResultResolver>();

    /**
     * Registers a result resolver for a specific execution transport.
     * @param transport The execution transport for which to register the resolver.
     * @param resolver The result resolver to register.
     */
    static registerResult(transport: ExecutionTransport, resolver: ResultResolver): void {
        this.resolvers.set(transport, resolver);
    }

    /**
     * Processes a result based on its type and the provided execution context.
     * If the result is an instance of `ResultDefinition`, it directly processes it.
     * Otherwise, it resolves the result using the registered resolver for the specified transport and then processes it.
     * @param result The result to be processed, which can be of any type or an instance of `ResultDefinition`.
     * @param context The execution context containing relevant information for processing.
     * @returns A promise resolving when the result has been processed.
     */
    async process(result: unknown | ResultDefinition, context: ExecutionContext): Promise<void> {
        let resultToProcess: ResultDefinition;
        if (result instanceof ResultDefinition) resultToProcess = result;
        else {
            const resolver = ResultProcessor.resolvers.get(context.transport);
            if (!resolver) return;
            resultToProcess = await resolver.resolve(result, context);
        }

        await resultToProcess.process(context);
    }
}
