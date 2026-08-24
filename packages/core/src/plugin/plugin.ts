import { AxiSparkContext } from '../axispark';

/**
 * Represents the lifecycle states of a plugin.
 * 
 * The lifecycle states are:
 * - `Created`: The plugin has been created but not yet registered.
 * - `Registered`: The plugin has been registered and is ready to be started.
 * - `Started`: The plugin has been started and is currently running.
 * - `Stopped`: The plugin has been stopped and is no longer running.
 * - `Error`: The plugin has encountered an error during its lifecycle.
 */
export enum PluginLifecycle {
    Created = 'created',
    Registered = 'registered',
    Started = 'started',
    Stopped = 'stopped',
    Error = 'error'
}

/**
 * Represents a registered plugin with its type and options.
 */
export interface PluginType<T extends Plugin = Plugin> {
    new (...args: any[]): T;
    readonly dependencies?: readonly PluginType[];
}

/**
 * Represents the base class for all plugins.
 */
export abstract class Plugin {
    protected state: PluginLifecycle = PluginLifecycle.Created;
    protected stateError?: Error;
    protected options?: PluginOptions;
    static readonly dependencies?: PluginType[];

    /**
     * Sets the error state of the plugin.
     * @param error The error that caused the plugin to enter the error state.
     */
    public setStateError(error: Error): void {
        this.state = PluginLifecycle.Error;
        this.stateError = error;
    }

    /**
     * Retrieves the error state of the plugin, if any.
     * @returns The error that caused the plugin to enter the error state, or `undefined` if no error occurred.
     */
    public getStateError(): Error | undefined {
        return this.stateError;
    }

    /**
     * Sets the lifecycle state of the plugin.
     * @param state The new lifecycle state of the plugin.
     */
    public setState(state: PluginLifecycle): void {
        this.state = state;
    }

    /**
     * Retrieves the current lifecycle state of the plugin.
     * @returns The current lifecycle state of the plugin.
     */
    public getState(): PluginLifecycle {
        return this.state;
    }

    /**
     * Lifecycle method called when the plugin is registered.
     * @param context The AxiSparkContext to be passed to the plugin during registration.
     * @param options The options for the plugin.
     */
    onRegister?(context: AxiSparkContext, options?: PluginOptions): Promise<void> | void;
    /**
     * Lifecycle method called when the plugin is started.
     */
    onStart?(): Promise<void> | void;
    /**
     * Lifecycle method called when the plugin is stopped.
     */
    onStop?(): Promise<void> | void;
}

/**
 * Represents the options for a plugin, including the plugin type.
 * This interface is used to provide configuration options when registering a plugin.
 * The `plugin` property specifies the type of the plugin being registered.
 */
export interface PluginOptions {
    plugin: PluginType;
}
