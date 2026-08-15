import { Processable } from '@axisparkjs/common';
import { Injectable } from '@axisparkjs/di';
import { ExecutionContext, ExecutionTransport } from '../execution';
import { ResultResolver } from './result-resolver';
import { ResultDefinition } from './result-definition';

@Injectable()
export class ResultProcessor implements Processable {
    private static readonly resolvers = new Map<ExecutionTransport, ResultResolver>();

    static registerResult(transport: ExecutionTransport, resolver: ResultResolver): void {
        this.resolvers.set(transport, resolver);
    }

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
