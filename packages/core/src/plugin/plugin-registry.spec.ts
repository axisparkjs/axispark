import { DecoratorNotIncludedError } from '@axisparkjs/di';
import { Plugin } from '../decorators';
import { PluginOptions } from './pluggable';
import { PluginRegistry } from './plugin-registry';
import { AxiSparkContext } from '../axispark';
import { PluginAlreadyRegisteredError } from './plugin-already-registered-error';
import { PluginConfigMismatchError } from './plugin-config-mismatch-error';

const onRegisterMock = jest.fn();
const onStartMock = jest.fn();
const onStopMock = jest.fn();

@Plugin()
class MockPlugin {
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
class TestPlugin {}
class BrokenPlugin {
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
                info: jest.fn().mockResolvedValue(undefined)
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
            registry.register(context, TestPlugin, testOptions);

            expect(registry.getAll()).toEqual([{ type: TestPlugin, options: testOptions }]);
        });

        it('should register multiple decorated plugins', () => {
            registry.register(context, TestPlugin, testOptions);
            registry.register(context, MockPlugin, mockOptions);

            expect(registry.getAll()).toEqual([
                { type: TestPlugin, options: testOptions },
                { type: MockPlugin, options: mockOptions }
            ]);
        });

        it('should throw if the class is not decorated with @Plugin', () => {
            expect(() => registry.register(context, BrokenPlugin, testOptions)).toThrow(DecoratorNotIncludedError);
        });

        it('should throw if the plugin is already registered', () => {
            registry.register(context, TestPlugin, testOptions);

            expect(() => registry.register(context, TestPlugin, testOptions)).toThrow(PluginAlreadyRegisteredError);
        });

        it('should throw if the plugin does not match the provided options', () => {
            const mismatchedOptions: PluginOptions = { plugin: MockPlugin };
            expect(() => registry.register(context, TestPlugin, mismatchedOptions)).toThrow(PluginConfigMismatchError);
        });
    });

    describe('getAll', () => {
        it('should return an empty array when no plugins are registered', () => {
            expect(registry.getAll()).toEqual([]);
        });

        it('should return all registered plugins in registration order', () => {
            registry.register(context, TestPlugin, testOptions);
            registry.register(context, MockPlugin, mockOptions);

            expect(registry.getAll()).toEqual([
                { type: TestPlugin, options: testOptions },
                { type: MockPlugin, options: mockOptions }
            ]);
        });
    });

    describe('lifecycle methods', () => {
        it('should call onRegister, onStart, and onStop in order', async () => {
            registry.register(context, MockPlugin, mockOptions);
            registry.register(context, TestPlugin, testOptions);
            context.container.resolve = jest.fn().mockImplementation((type) => {
                if (type === MockPlugin) return new MockPlugin();
                if (type === TestPlugin) return new TestPlugin();
                throw new Error(`Unknown type: ${type}`);
            });

            await registry.init(context);
            expect(onRegisterMock).toHaveBeenCalledTimes(1);

            await registry.run(context);
            expect(onStartMock).toHaveBeenCalledTimes(1);

            await registry.destroy(context);
            expect(onStopMock).toHaveBeenCalledTimes(1);
        });
    });
});
