import { AxiSparkContext } from '@axisparkjs/core';
import { AxiSparkTestCore } from './axispark-test-core';

describe('AxiSparkTestCore', () => {
    let context: jest.Mocked<AxiSparkContext>;
    let core: AxiSparkTestCore;

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

        core = new AxiSparkTestCore(context);
    });

    describe('init', () => {
        it('should init the application', async () => {
            await core.init();

            expect(context.plugins.init).toHaveBeenCalledTimes(1);
            expect(context.plugins.init).toHaveBeenCalledWith(context);
        });
    });

    describe('run', () => {
        it('should run the application', async () => {
            await core.run();

            expect(context.plugins.run).toHaveBeenCalledTimes(1);
            expect(context.plugins.run).toHaveBeenCalledWith(context);
        });
    });

    describe('destroy', () => {
        it('should destroy the application', async () => {
            await core.destroy();

            expect(context.plugins.destroy).toHaveBeenCalledTimes(1);
            expect(context.plugins.destroy).toHaveBeenCalledWith(context);
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
});
