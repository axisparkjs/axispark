import { Inject } from '@axisparkjs/di';
import { Context, Interceptor, ExecutionTransport } from '@axisparkjs/engine';
import { Logger } from '@axisparkjs/logger';
import { HTTP_LOGGER } from '../di/tokens';
import { HttpContext } from '../types';
import { After } from '@axisparkjs/engine';

@Interceptor({ global: true, transport: ExecutionTransport.Http })
export class LogHttpResponseInterceptor {
    constructor(@Inject(HTTP_LOGGER) private readonly logger: Logger) {}

    @After()
    public async log(@Context() context: HttpContext): Promise<void> {
        this.logger.info(`HTTP Response: ${context.response.status} ${context.request.path}`);
    }
}
