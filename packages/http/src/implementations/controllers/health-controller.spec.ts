import { HealthController } from './health-controller';
import { HealthEngine, HealthStatus } from '@axisparkjs/core';
import { HandledResult } from '@axisparkjs/engine';
import { ServiceUnavailableError } from '../errors';

describe('HealthController', () => {
    let controller: HealthController;
    let healthEngine: jest.Mocked<HealthEngine>;

    beforeEach(() => {
        healthEngine = {
            checkAll: jest.fn(),
            checkApp: jest.fn()
        } as unknown as jest.Mocked<HealthEngine>;

        controller = new HealthController(healthEngine);
    });

    describe('getHealth', () => {
        let response: any;

        beforeEach(() => {
            response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };
        });

        it('should return 200 when all checks are healthy', async () => {
            const checks = [
                {
                    component: 'app',
                    status: HealthStatus.Healthy,
                    timestamp: new Date().toISOString()
                },
                {
                    component: 'db',
                    status: HealthStatus.Healthy,
                    timestamp: new Date().toISOString()
                }
            ];

            healthEngine.checkAll.mockReturnValue(checks);

            const result = await controller.getHealth(response);

            expect(healthEngine.checkAll).toHaveBeenCalled();

            expect(response.status).toHaveBeenCalledWith(200);

            expect(response.json).toHaveBeenCalledWith({
                status: HealthStatus.Healthy,
                timestamp: expect.any(String),
                checks
            });

            expect(result).toBeInstanceOf(HandledResult);
        });

        it('should return 503 when any check is not healthy', async () => {
            const checks = [
                {
                    component: 'app',
                    status: HealthStatus.Healthy,
                    timestamp: new Date().toISOString()
                },
                {
                    component: 'db',
                    status: HealthStatus.Unhealthy,
                    timestamp: new Date().toISOString()
                }
            ];

            healthEngine.checkAll.mockReturnValue(checks);

            await controller.getHealth(response);

            expect(response.status).toHaveBeenCalledWith(503);

            expect(response.json).toHaveBeenCalledWith({
                status: HealthStatus.Healthy,
                timestamp: expect.any(String),
                checks
            });
        });
    });

    describe('getLiveness', () => {
        it('should return app health', async () => {
            healthEngine.checkApp.mockReturnValue({
                component: 'app',
                status: HealthStatus.Healthy,
                timestamp: new Date().toISOString()
            });

            const result = await controller.getLiveness();

            expect(healthEngine.checkApp).toHaveBeenCalled();

            expect(result).toEqual({
                status: HealthStatus.Healthy,
                timestamp: expect.any(String)
            });
        });
    });

    describe('getReadiness', () => {
        it('should return healthy when all checks are healthy', async () => {
            healthEngine.checkAll.mockReturnValue([
                {
                    component: 'app',
                    status: HealthStatus.Healthy,
                    timestamp: new Date().toISOString()
                },
                {
                    component: 'db',
                    status: HealthStatus.Healthy,
                    timestamp: new Date().toISOString()
                }
            ]);

            const result = await controller.getReadiness();

            expect(result).toEqual({
                status: HealthStatus.Healthy,
                timestamp: expect.any(String)
            });
        });

        it('should throw ServiceUnavailableError when some components are not healthy', async () => {
            healthEngine.checkAll.mockReturnValue([
                {
                    component: 'app',
                    status: HealthStatus.Healthy,
                    timestamp: new Date().toISOString()
                },
                {
                    component: 'db',
                    status: HealthStatus.Unhealthy,
                    timestamp: new Date().toISOString()
                },
                {
                    component: 'redis',
                    status: HealthStatus.Unknown,
                    timestamp: new Date().toISOString()
                }
            ]);

            await expect(controller.getReadiness()).rejects.toThrow(new ServiceUnavailableError('Some components are not healthy: db, redis'));
        });
    });
});
