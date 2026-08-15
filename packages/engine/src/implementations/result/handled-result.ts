import { ResultDefinition } from '../../result';

export class HandledResult extends ResultDefinition<void> {
    public constructor() {
        super(undefined, -1);
    }

    public async process(): Promise<void> {
        /* empty */
    }
}
