import { HealthEngine } from './health-engine';
import { HealthStatus } from './health-status';
import { PluginLifecycle } from '../plugin/pluggable';

describe('HealthEngine', () => {
    const createPlugin = (name: string, state?: PluginLifecycle, error?: Error) => ({
        type: { name },
        instance: {
            getState: jest.fn().mockReturnValue(state),
            getStateError: jest.fn().mockReturnValue(error)
        }
    });

    const createEngine = (plugins: any[]) => {
        const config = {
            name: 'AxisApp',
            version: '1.0.0'
        };

        const registry = {
            getAll: jest.fn().mockReturnValue(plugins)
        };

        return {
            engine: new HealthEngine(config as any, registry as any),
            registry
        };
    };

    describe('checkAll', () => {
        it('should return only app health when there are no plugins', () => {
            const { engine } = createEngine([]);

            const result = engine.checkAll();

            expect(result).toHaveLength(1);

            expect(result[0]).toEqual(
                expect.objectContaining({
                    component: 'AxisApp',
                    status: HealthStatus.Healthy,
                    details: expect.objectContaining({
                        plugins: []
                    }),
                    timestamp: expect.any(String)
                })
            );
        });

        it('should return healthy when all plugins are healthy', () => {
            const { engine } = createEngine([createPlugin('PluginA', PluginLifecycle.Started), createPlugin('PluginB', PluginLifecycle.Started)]);

            const result = engine.checkAll();

            expect(result[0].status).toBe(HealthStatus.Healthy);

            expect(result[1].status).toBe(HealthStatus.Healthy);
            expect(result[2].status).toBe(HealthStatus.Healthy);
        });

        it('should return unhealthy when any plugin is unhealthy', () => {
            const { engine } = createEngine([createPlugin('PluginA', PluginLifecycle.Started), createPlugin('PluginB', PluginLifecycle.Error)]);

            const result = engine.checkAll();

            expect(result[0].status).toBe(HealthStatus.Unhealthy);
            expect(result[2].status).toBe(HealthStatus.Unhealthy);
        });

        it('should include plugin error', () => {
            const error = new Error('Connection failed');

            const { engine } = createEngine([createPlugin('DatabasePlugin', PluginLifecycle.Error, error)]);

            const result = engine.checkAll();

            expect(result[1]).toEqual(
                expect.objectContaining({
                    component: 'DatabasePlugin',
                    status: HealthStatus.Unhealthy,
                    details: {
                        plugin: 'DatabasePlugin',
                        error: 'Connection failed'
                    }
                })
            );
        });

        it.each([
            [PluginLifecycle.Created, HealthStatus.Unknown],
            [PluginLifecycle.Registered, HealthStatus.Unknown],
            [PluginLifecycle.Started, HealthStatus.Healthy],
            [PluginLifecycle.Stopped, HealthStatus.Unknown],
            [PluginLifecycle.Error, HealthStatus.Unhealthy],
            [undefined, HealthStatus.Unhealthy]
        ])('should map %s to %s', (pluginState, expectedStatus) => {
            const { engine } = createEngine([createPlugin('Plugin', pluginState as any)]);

            const result = engine.checkAll();

            expect(result[1].status).toBe(expectedStatus);
        });
    });

    describe('checkApp', () => {
        it('should return the application health', () => {
            const { engine } = createEngine([createPlugin('PluginA', PluginLifecycle.Started)]);

            const app = engine.checkApp();

            expect(app.component).toBe('AxisApp');
            expect(app.status).toBe(HealthStatus.Healthy);
        });

        it('should report plugin summary', () => {
            const { engine } = createEngine([createPlugin('PluginA', PluginLifecycle.Started), createPlugin('PluginB', PluginLifecycle.Error)]);

            const app = engine.checkApp();

            expect(app.details?.plugins).toEqual([
                expect.objectContaining({
                    component: 'PluginA',
                    status: HealthStatus.Healthy
                }),
                expect.objectContaining({
                    component: 'PluginB',
                    status: HealthStatus.Unhealthy
                })
            ]);
        });
    });
});
