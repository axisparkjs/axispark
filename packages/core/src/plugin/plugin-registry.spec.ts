import { DecoratorNotIncludedError } from '@axisparkjs/di';
import { Plugin } from '../decorators';
import { PluginOptions, Pluggable, PluginLifecycle } from './pluggable';
import { PluginRegistry } from './plugin-registry';
import { AxiSparkContext } from '../axispark';
import { PluginAlreadyRegisteredError } from './plugin-already-registered-error';
import { PluginConfigMismatchError } from './plugin-config-mismatch-error';

const onRegisterMock = jest.fn();
const onStartMock = jest.fn();
const onStopMock = jest.fn();

@Plugin()
class MockPlugin extends Pluggable {
    async onRegister() {
        onRegisterMock();
    }
    async onStart() {
        onStartMock();
    }
    async onStop() {
        onStopMock();
    }
}
@Plugin()
class ErrorPlugin extends Pluggable {
    async onRegister() {
        throw new Error('Error in onRegister');
    }
    async onStart() {
        throw new Error('Error in onStart');
    }
    async onStop() {
        throw new Error('Error in onStop');
    }
}
@Plugin()
class TestPlugin extends Pluggable {}
class BrokenPlugin extends Pluggable {
    async onRegister() {
        onRegisterMock();
    }
}

describe('PluginRegistry', () => {
    let registry: PluginRegistry;
    let context: jest.Mocked<AxiSparkContext>;
    const mockOptions: PluginOptions = { plugin: MockPlugin };
    const testOptions: PluginOptions = { plugin: TestPlugin };

    beforeEach(() => {
        context = {
            logger: {
                info: jest.fn().mockResolvedValue(undefined),
                fatal: jest.fn().mockResolvedValue(undefined)
            },
            plugins: {
                init: jest.fn(),
                run: jest.fn(),
                destroy: jest.fn(),
                register: jest.fn()
            },
            container: {
                resolve: jest.fn(),
                bind: jest.fn()
            }
        } as unknown as jest.Mocked<AxiSparkContext>;
        registry = new PluginRegistry();
    });

    describe('register', () => {
        it('should register a decorated plugin', () => {
            registry.register(TestPlugin, testOptions);

            expect(registry.getAll()).toEqual([{ type: TestPlugin, options: testOptions }]);
        });

        it('should register multiple decorated plugins', () => {
            registry.register(TestPlugin, testOptions);
            registry.register(MockPlugin, mockOptions);

            expect(registry.getAll()).toEqual([
                { type: TestPlugin, options: testOptions },
                { type: MockPlugin, options: mockOptions }
            ]);
        });

        it('should throw if the class is not decorated with @Plugin', () => {
            expect(() => registry.register(BrokenPlugin, testOptions)).toThrow(DecoratorNotIncludedError);
        });

        it('should throw if the plugin is already registered', () => {
            registry.register(TestPlugin, testOptions);

            expect(() => registry.register(TestPlugin, testOptions)).toThrow(PluginAlreadyRegisteredError);
        });

        it('should throw if the plugin does not match the provided options', () => {
            const mismatchedOptions: PluginOptions = { plugin: MockPlugin };
            expect(() => registry.register(TestPlugin, mismatchedOptions)).toThrow(PluginConfigMismatchError);
        });
    });

    describe('getAll', () => {
        it('should return an empty array when no plugins are registered', () => {
            expect(registry.getAll()).toEqual([]);
        });

        it('should return all registered plugins in registration order', () => {
            registry.register(TestPlugin, testOptions);
            registry.register(MockPlugin, mockOptions);

            expect(registry.getAll()).toEqual([
                { type: TestPlugin, options: testOptions, instance: undefined },
                { type: MockPlugin, options: mockOptions, instance: undefined }
            ]);
        });
    });

    describe('lifecycle methods', () => {
        it('should call onRegister, onStart, and onStop in order', async () => {
            const mockPluginInstance = new MockPlugin();
            const testPluginInstance = new TestPlugin();
            registry.register(MockPlugin, mockOptions);
            registry.register(TestPlugin, testOptions);
            context.container.resolve = jest.fn().mockImplementation((type) => {
                if (type === MockPlugin) return mockPluginInstance;
                if (type === TestPlugin) return testPluginInstance;
                throw new Error(`Unknown type: ${type}`);
            });

            await registry.init(context);
            expect(onRegisterMock).toHaveBeenCalledTimes(1);
            expect(mockPluginInstance.getState()).toBe(PluginLifecycle.Registered);

            await registry.run(context);
            expect(onStartMock).toHaveBeenCalledTimes(1);
            expect(mockPluginInstance.getState()).toBe(PluginLifecycle.Started);

            await registry.destroy(context);
            expect(onStopMock).toHaveBeenCalledTimes(1);
            expect(mockPluginInstance.getState()).toBe(PluginLifecycle.Stopped);
        });

        it('should handle errors in lifecycle methods gracefully', async () => {
            const errorPluginInstance = new ErrorPlugin();
            registry.register(ErrorPlugin, { plugin: ErrorPlugin });
            context.container.resolve = jest.fn().mockImplementation((type) => {
                if (type === ErrorPlugin) return errorPluginInstance;
                throw new Error(`Unknown type: ${type}`);
            });

            await expect(registry.init(context)).resolves.not.toThrow();
            expect(context.logger.fatal).toHaveBeenCalled();
            expect(errorPluginInstance.getState()).toBe(PluginLifecycle.Error);

            (context.logger.fatal as jest.Mock).mockClear();
            await expect(registry.run(context)).resolves.not.toThrow();
            expect(context.logger.fatal).not.toHaveBeenCalled();
            expect(errorPluginInstance.getState()).toBe(PluginLifecycle.Error);

            await expect(registry.destroy(context)).resolves.not.toThrow();
            expect(context.logger.fatal).not.toHaveBeenCalled();
            expect(errorPluginInstance.getState()).toBe(PluginLifecycle.Error);
        });
    });
});
