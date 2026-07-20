import { AxiSparkContext } from '../axispark';

export interface Pluggable {
    onRegister?(context: AxiSparkContext, options?: PluginOptions): Promise<void> | void;
    onStart?(context: AxiSparkContext, options?: PluginOptions): Promise<void> | void;
    onStop?(context: AxiSparkContext, options?: PluginOptions): Promise<void> | void;
}
export type PluggableClass<T extends Pluggable = Pluggable> = new (...args: any[]) => T;

export interface PluginOptions {
    plugin: PluggableClass;
}
