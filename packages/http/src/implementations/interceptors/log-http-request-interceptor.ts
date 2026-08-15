import { Inject } from '@axisparkjs/di';
import { Context, Interceptor, Before, ExecutionTransport } from '@axisparkjs/engine';
import { Logger } from '@axisparkjs/logger';
import { HTTP_LOGGER } from '../../di/tokens';
import { HttpContext } from '../../types';

@Interceptor({ global: true, transport: ExecutionTransport.Http })
export class LogHttpRequestInterceptor {
    constructor(@Inject(HTTP_LOGGER) private readonly logger: Logger) {}

    @Before()
    public async log(@Context() context: HttpContext): Promise<void> {
        this.logger.info(`HTTP Request: ${context.request.method} ${context.request.path}`);
    }
}
