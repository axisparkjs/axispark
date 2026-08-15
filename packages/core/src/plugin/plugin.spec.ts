import { Plugin, PluginLifecycle, PluginOptions } from './plugin';
import { AxiSparkContext } from '../axispark';

class TestPlugin extends Plugin {
    public onRegister = jest.fn();
    public onStart = jest.fn();
    public onStop = jest.fn();
}

describe('Plugin', () => {
    let plugin: TestPlugin;

    beforeEach(() => {
        plugin = new TestPlugin();
    });

    describe('state', () => {
        it('should initialize with Created state', () => {
            expect(plugin.getState()).toBe(PluginLifecycle.Created);
        });

        it('should update state with setState()', () => {
            plugin.setState(PluginLifecycle.Registered);

            expect(plugin.getState()).toBe(PluginLifecycle.Registered);
        });

        it('should change state multiple times', () => {
            plugin.setState(PluginLifecycle.Registered);
            plugin.setState(PluginLifecycle.Started);
            plugin.setState(PluginLifecycle.Stopped);

            expect(plugin.getState()).toBe(PluginLifecycle.Stopped);
        });

        it('should set and get state error', () => {
            const error = new Error('Test error');
            plugin.setStateError(error);

            expect(plugin.getState()).toBe(PluginLifecycle.Error);
            expect(plugin.getStateError()).toBe(error);
        });
    });

    describe('lifecycle hooks', () => {
        const context = {} as AxiSparkContext;
        const options = {} as PluginOptions;

        it('should execute onRegister()', async () => {
            await plugin.onRegister(context, options);

            expect(plugin.onRegister).toHaveBeenCalledWith(context, options);
            expect(plugin.onRegister).toHaveBeenCalledTimes(1);
        });

        it('should execute onStart()', async () => {
            await plugin.onStart(context, options);

            expect(plugin.onStart).toHaveBeenCalledWith(context, options);
            expect(plugin.onStart).toHaveBeenCalledTimes(1);
        });

        it('should execute onStop()', async () => {
            await plugin.onStop(context, options);

            expect(plugin.onStop).toHaveBeenCalledWith(context, options);
            expect(plugin.onStop).toHaveBeenCalledTimes(1);
        });
    });
});
