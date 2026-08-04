import { Inject } from '@axisparkjs/di';
import { FilteredError as ErrorParam, Filter, Catch, ExecutionTransport, ExecutionPriority } from '@axisparkjs/engine';
import { Logger } from '@axisparkjs/logger';
import { HTTP_LOGGER } from '../di/tokens';

@Filter({ global: true, transport: ExecutionTransport.Http, priority: ExecutionPriority.Low })
export class LogErrorFilter {
    constructor(@Inject(HTTP_LOGGER) private readonly logger: Logger) {}

    @Catch(Error)
    public async error(@ErrorParam() error: Error): Promise<void> {
        this.logger.info(`Error during execution: ${error.name} -> ${error.message}`);
    }
}
