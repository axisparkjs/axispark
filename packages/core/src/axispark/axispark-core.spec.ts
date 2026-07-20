import { AxiSparkCore } from './axispark-core';
import { AxiSparkContext } from './axispark-context';
import { InjectionToken } from '@axisparkjs/di';

describe('AxiSparkCore', () => {
    let context: jest.Mocked<AxiSparkContext>;
    let core: AxiSparkCore;

    beforeEach(() => {
        context = {
            logger: {
                info: jest.fn().mockResolvedValue(undefined)
            },
            plugins: {
                init: jest.fn(),
                run: jest.fn(),
                destroy: jest.fn(),
                register: jest.fn(),
                getAll: jest.fn()
            },
            container: {
                resolve: jest.fn()
            },
            config: {
                banner: true
            }
        } as unknown as jest.Mocked<AxiSparkContext>;

        core = new AxiSparkCore(context);
    });

    describe('init', () => {
        it('should init the application and log the initialization', async () => {
            await core.init();

            expect(context.plugins.init).toHaveBeenCalledTimes(1);
            expect(context.plugins.init).toHaveBeenCalledWith(context);
            expect(context.logger.info).toHaveBeenCalledTimes(2);
            expect(context.logger.info).toHaveBeenCalledWith('App initialized');
        });

        it('should init the application and not log the banner', async () => {
            context.config.banner = false;
            await core.init();

            expect(context.plugins.init).toHaveBeenCalledTimes(1);
            expect(context.plugins.init).toHaveBeenCalledWith(context);
            expect(context.logger.info).toHaveBeenCalledTimes(1);
            expect(context.logger.info).toHaveBeenCalledWith('App initialized');
        });
    });

    describe('run', () => {
        it('should run the application and log that it is running', async () => {
            core.run();

            await new Promise(process.nextTick);

            expect(context.plugins.run).toHaveBeenCalledTimes(1);
            expect(context.plugins.run).toHaveBeenCalledWith(context);
            expect(context.logger.info).toHaveBeenCalledTimes(1);
            expect(context.logger.info).toHaveBeenCalledWith('App running, waiting for termination signal...');
        });
    });

    describe('destroy', () => {
        it('should log that the application has been destroyed', async () => {
            await core.destroy();

            expect(context.plugins.destroy).toHaveBeenCalledTimes(1);
            expect(context.plugins.destroy).toHaveBeenCalledWith(context);
            expect(context.logger.info).toHaveBeenCalledTimes(1);
            expect(context.logger.info).toHaveBeenCalledWith('App destroyed');
        });
    });

    describe('use', () => {
        it('should register a plugin and return the axisparkCore instance', () => {
            const plugin = jest.fn();
            const config = { plugin };
            const result = core.use(plugin, config);

            expect(context.plugins.register).toHaveBeenCalledTimes(1);
            expect(context.plugins.register).toHaveBeenCalledWith(context, plugin, config);
            expect(result).toBe(core);
        });
    });

    describe('used', () => {
        it('should return the list of registered plugins', () => {
            const plugin1 = jest.fn();
            const plugin2 = jest.fn();
            const config1 = { plugin: plugin1 };
            context.plugins.getAll = jest.fn().mockReturnValue([
                { type: plugin1, options: config1 },
                { type: plugin2, options: undefined }
            ]);

            core.use(plugin1, config1);
            core.use(plugin2);

            const usedPlugins = core.used();

            expect(context.plugins.getAll).toHaveBeenCalledTimes(1);
            expect(usedPlugins).toEqual([
                { type: plugin1, options: config1 },
                { type: plugin2, options: undefined }
            ]);
        });
    });

    describe('get', () => {
        it('should resolve a dependency from the container', () => {
            const token = new InjectionToken('TestToken');
            const instance = { foo: 'bar' };
            context.container.resolve = jest.fn().mockReturnValue(instance);

            const result = core.get(token);

            expect(context.container.resolve).toHaveBeenCalledTimes(1);
            expect(context.container.resolve).toHaveBeenCalledWith(token);
            expect(result).toBe(instance);
        });
    });
});
