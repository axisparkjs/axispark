import { AxisparkContext } from '../axispark';

export interface Pluggable {
    onRegister?(context: AxisparkContext, options?: PluginOptions): Promise<void> | void;
    onStart?(context: AxisparkContext, options?: PluginOptions): Promise<void> | void;
    onStop?(context: AxisparkContext, options?: PluginOptions): Promise<void> | void;
}
export type PluggableClass<T extends Pluggable = Pluggable> = new (...args: any[]) => T;

export interface PluginOptions {
    plugin: PluggableClass;
}
