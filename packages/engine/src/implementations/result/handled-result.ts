import { ResultDefinition } from '../../result';

/**
 * A result type that represents a handled operation with no return value.
 */
export class HandledResult extends ResultDefinition<void> {
    public constructor() {
        super(undefined, -1);
    }

    public async process(): Promise<void> {
        /* empty */
    }
}
