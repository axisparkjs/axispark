import { TimeoutResolver, TimeoutDefinition } from '@axisparkjs/engine';
import { RequestTimeoutError } from '../errors';
import { TimeoutOptions, HttpPluginOptions } from '../../plugin';
import { HTTP_OPTIONS } from '../../di';
import { Inject, Injectable } from '@axisparkjs/di';

@Injectable()
export class HttpTimeoutResolver implements TimeoutResolver {
    private readonly options: TimeoutOptions | undefined;
    constructor(@Inject(HTTP_OPTIONS) options: HttpPluginOptions) {
        this.options = options.timeoutOptions;
    }

    public async resolve(timeout: TimeoutDefinition): Promise<void> {
        throw new RequestTimeoutError(
            typeof this.options?.message === 'function'
                ? this.options.message(timeout.time)
                : this.options?.message || 'Request timed out after ' + timeout.time + 'ms'
        );
    }
}
