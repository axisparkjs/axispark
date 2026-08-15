import { ExecutionContext } from '../execution';

export abstract class ResultDefinition<T = unknown> {
    public constructor(
        public readonly value: T,
        public readonly rc: number
    ) {}

    abstract process(context: ExecutionContext): Promise<void>;
}
