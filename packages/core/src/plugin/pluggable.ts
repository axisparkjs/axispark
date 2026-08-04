import { AxiSparkContext } from '../axispark';

export enum PluginLifecycle {
    Created = 'created',
    Registered = 'registered',
    Started = 'started',
    Stopped = 'stopped',
    Error = 'error'
}

export abstract class Pluggable {
    protected state: PluginLifecycle = PluginLifecycle.Created;
    protected stateError?: Error;
    protected options?: PluginOptions;

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
export type PluggableClass<T extends Pluggable = Pluggable> = new (...args: any[]) => T;

export interface PluginOptions {
    plugin: PluggableClass;
}
