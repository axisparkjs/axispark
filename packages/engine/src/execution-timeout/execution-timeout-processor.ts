import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { ExecutionContext } from '../execution/execution-context';
import { ExecutionHandler } from '../execution/execution-handler';

export abstract class ExecutionTimeoutProcessor {
    constructor(
        protected readonly context: ExecutionContext,
        protected readonly handler: ExecutionHandler,
        protected readonly baseTime?: number
    ) {}

    public get time(): number {
        const classMetadata = Metadata.get<number>(MetadataKeys.EXECUTION_TIMEOUT, this.handler.target);
        const methodMetadata = Metadata.get<number>(MetadataKeys.EXECUTION_TIMEOUT, this.handler.target, this.handler.method);
        return methodMetadata ?? classMetadata ?? this.baseTime ?? 5000;
    }

    abstract process(): Promise<unknown> | unknown;
}
