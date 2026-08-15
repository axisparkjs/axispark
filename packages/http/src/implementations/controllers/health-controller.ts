import { Controller, Get, HttpCode } from '../../decorators';
import { HealthEngine, HealthStatus } from '@axisparkjs/core';
import { ServiceUnavailableError } from '../errors';
import { HttpResponse } from '../../types';
import { Response } from '../parameters';
import { HandledResult } from '@axisparkjs/engine';

@Controller('/health')
export class HealthController {
    constructor(private readonly healthEngine: HealthEngine) {}

    @Get()
    public async getHealth(@Response() response: HttpResponse) {
        const checks = this.healthEngine.checkAll();
        const appHealth = checks[0];
        const data = {
            status: appHealth.status,
            timestamp: new Date().toISOString(),
            checks
        };

        response.status(checks.every((check) => check.status === HealthStatus.Healthy) ? 200 : 503).json(data);

        return new HandledResult();
    }

    @Get('/liveness')
    @HttpCode(200)
    public async getLiveness() {
        const appHealth = this.healthEngine.checkApp();
        return { status: appHealth.status, timestamp: new Date().toISOString() };
    }

    @Get('/readiness')
    @HttpCode(200)
    public async getReadiness() {
        const cheks = this.healthEngine.checkAll();
        const notHealthy = cheks.filter((check) => check.status !== HealthStatus.Healthy);
        if (notHealthy.length > 0)
            throw new ServiceUnavailableError(`Some components are not healthy: ${notHealthy.map((check) => check.component).join(', ')}`);
        return { status: HealthStatus.Healthy, timestamp: new Date().toISOString() };
    }
}
