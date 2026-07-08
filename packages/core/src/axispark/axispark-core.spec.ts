import { AxisparkCore } from './axispark-core';
import { AxisparkContext } from './axispark-context';

describe('axisparkCore', () => {
    let context: jest.Mocked<AxisparkContext>;
    let core: AxisparkCore;

    beforeEach(() => {
        context = {
            logger: {
                info: jest.fn().mockResolvedValue(undefined)
            },
            plugins: {
                init: jest.fn(),
                run: jest.fn(),
                destroy: jest.fn(),
                register: jest.fn()
            },
            container: {
                resolve: jest.fn()
            },
            config: {
                banner: true
            }
        } as unknown as jest.Mocked<AxisparkContext>;

        core = new AxisparkCore(context);
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
});
