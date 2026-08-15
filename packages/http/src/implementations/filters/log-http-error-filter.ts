import { Inject } from '@axisparkjs/di';
import { FilteredError, Filter, Catch, ExecutionTransport, StepPriority } from '@axisparkjs/engine';
import { Logger } from '@axisparkjs/logger';
import { HTTP_LOGGER } from '../../di/tokens';
import { HttpError } from '../errors';

@Filter({ global: true, transport: ExecutionTransport.Http, priority: StepPriority.Normal })
export class LogHttpErrorFilter {
    constructor(@Inject(HTTP_LOGGER) private readonly logger: Logger) {}

    @Catch(HttpError)
    public async httpError(@FilteredError() error: HttpError): Promise<void> {
        this.logger.info(`HTTP Error: ${error.status} ${error.response}`);
    }
}
