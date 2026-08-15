import { Processable } from '@axisparkjs/common';
import { Injectable } from '@axisparkjs/di';
import { ExecutionContext, ExecutionTransport } from '../execution';
import { TimeoutResolver } from './timeout-resolver';
import { TimeoutDefinition } from './timeout-definition';

@Injectable()
export class TimeoutProcessor implements Processable {
    private static readonly resolvers = new Map<ExecutionTransport, TimeoutResolver>();

    static registerTimeout(transport: ExecutionTransport, resolver: TimeoutResolver): void {
        this.resolvers.set(transport, resolver);
    }

    async process(timeout: TimeoutDefinition, context: ExecutionContext): Promise<void> {
        const resolver = TimeoutProcessor.resolvers.get(context.transport);
        if (!resolver) {
            return;
        }

        await resolver.resolve(timeout);
    }
}
