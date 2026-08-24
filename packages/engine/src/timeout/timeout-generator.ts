import { Metadata, MetadataKeys, Generator } from '@axisparkjs/common';
import { ExecutionContext, ExecutionTransport } from '../execution';
import { TimeoutMetadata } from '../metadata';
import { TimeoutDefinition } from './timeout-definition';
import { Injectable } from '@axisparkjs/di';

/**
 * A generator for creating timeout definitions based on metadata.
 * It retrieves timeout metadata from the execution context and generates a corresponding `TimeoutDefinition`.
 * If no specific timeout is defined, it falls back to a default timeout value or a registered timeout for the transport.
 */
@Injectable()
export class TimeoutGenerator implements Generator<TimeoutDefinition | undefined> {
    private static readonly defaultTimeout = 10000;
    private static readonly timeouts = new Map<ExecutionTransport, number>();

    public static registerTimeout(transport: ExecutionTransport, time?: number): void {
        this.timeouts.set(transport, time ?? this.defaultTimeout);
    }

    /**
     * Generates a timeout definition based on the provided execution context.
     * @param context The execution context containing relevant information for timeout generation.
     * @returns A generated timeout definition or undefined if no specific timeout is defined.
     */
    public generate(context: ExecutionContext): TimeoutDefinition | undefined {
        const classMetadata = Metadata.get<TimeoutMetadata>(MetadataKeys.TIMEOUT, context.target);
        const methodMetadata = Metadata.get<TimeoutMetadata>(MetadataKeys.TIMEOUT, context.target, context.propertyKey);
        const time = methodMetadata?.time ?? classMetadata?.time ?? TimeoutGenerator.timeouts.get(context.transport);

        return time !== undefined ? new TimeoutDefinition(time) : undefined;
    }
}
