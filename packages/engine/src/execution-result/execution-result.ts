import { ExecutionContext } from '../execution';

export abstract class ExecutionResult<T = unknown> {
    public constructor(
        public readonly value: T,
        public readonly rc: number
    ) {}

    abstract process(context: ExecutionContext): Promise<void>;
}
