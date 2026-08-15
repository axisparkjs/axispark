import { Metadata, MetadataKeys, Generator } from '@axisparkjs/common';
import { ExecutionContext, ExecutionTransport } from '../execution';
import { TimeoutMetadata } from '../metadata';
import { TimeoutDefinition } from './timeout-definition';
import { Injectable } from '@axisparkjs/di';

@Injectable()
export class TimeoutGenerator implements Generator<TimeoutDefinition | undefined> {
    private static readonly defaultTimeout = 10000;
    private static readonly timeouts = new Map<ExecutionTransport, number>();

    public static registerTimeout(transport: ExecutionTransport, time?: number): void {
        this.timeouts.set(transport, time ?? this.defaultTimeout);
    }

    public generate(context: ExecutionContext): TimeoutDefinition | undefined {
        const classMetadata = Metadata.get<TimeoutMetadata>(MetadataKeys.TIMEOUT, context.target);
        const methodMetadata = Metadata.get<TimeoutMetadata>(MetadataKeys.TIMEOUT, context.target, context.propertyKey);
        const time = methodMetadata?.time ?? classMetadata?.time ?? TimeoutGenerator.timeouts.get(context.transport);

        return time !== undefined ? new TimeoutDefinition(time) : undefined;
    }
}
