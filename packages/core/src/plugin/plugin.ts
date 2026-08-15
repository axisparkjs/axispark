import { AxiSparkContext } from '../axispark';

export enum PluginLifecycle {
    Created = 'created',
    Registered = 'registered',
    Started = 'started',
    Stopped = 'stopped',
    Error = 'error'
}

export interface PluginType<T extends Plugin = Plugin> {
    new (...args: any[]): T;
    readonly dependencies?: readonly PluginType[];
}

export abstract class Plugin {
    protected state: PluginLifecycle = PluginLifecycle.Created;
    protected stateError?: Error;
    protected options?: PluginOptions;
    static readonly dependencies?: PluginType[];

    public setStateError(error: Error): void {
        this.state = PluginLifecycle.Error;
        this.stateError = error;
    }

    public getStateError(): Error | undefined {
        return this.stateError;
    }

    public setState(state: PluginLifecycle): void {
        this.state = state;
    }

    public getState(): PluginLifecycle {
        return this.state;
    }

    onRegister?(context: AxiSparkContext, options?: PluginOptions): Promise<void> | void;
    onStart?(): Promise<void> | void;
    onStop?(): Promise<void> | void;
}

export interface PluginOptions {
    plugin: PluginType;
}
