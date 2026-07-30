import { ExecutionResult } from './execution-result';

export class HandledResult extends ExecutionResult<void> {
    public constructor() {
        super(undefined, -1);
    }

    public async process(): Promise<void> {
        /* empty */
    }
}
