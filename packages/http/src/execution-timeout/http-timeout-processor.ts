import { ExecutionTimeoutProcessor, ExecutionHandler, ExecutionContext } from '@axisparkjs/engine';
import { RequestTimeoutError } from '../errors';

export class HttpTimeoutProcessor extends ExecutionTimeoutProcessor {
    constructor(context: ExecutionContext, handler: ExecutionHandler, baseTime?: number, private readonly message?: string | ((time: number) => string)) {
        super(context, handler, baseTime);
    }

    public async process(): Promise<void> {
        throw new RequestTimeoutError(typeof this.message === 'function' ? this.message(this.time) : this.message || "Request timed out after " + this.time + "ms");
    }
}
