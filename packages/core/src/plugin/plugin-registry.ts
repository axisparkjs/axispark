import { Metadata, MetadataKeys, Lifecycle } from '@axisparkjs/common';
import { DecoratorNotIncludedError } from '@axisparkjs/di';
import { AxiSparkContext } from '../axispark';
import { PluginAlreadyRegisteredError } from './plugin-already-registered-error';
import { PluginConfigMismatchError } from './plugin-config-mismatch-error';
import { Pluggable, PluginLifecycle, PluggableClass, PluginOptions } from './pluggable';
import { Plugin } from '../decorators';

interface RegisteredPlugin {
    readonly type: PluggableClass;
    readonly options?: PluginOptions;
    instance?: Pluggable;
}

export class PluginRegistry implements Lifecycle {
    private readonly plugins: RegisteredPlugin[] = [];

    register(plugin: PluggableClass, options?: PluginOptions): void {
        if (!Metadata.has(MetadataKeys.PLUGIN, plugin)) throw new DecoratorNotIncludedError(plugin.name, Plugin.name);
        if (this.plugins.some((p) => p.type === plugin)) throw new PluginAlreadyRegisteredError(plugin.name);
        if (options && plugin !== options.plugin) throw new PluginConfigMismatchError(plugin.name);

        this.plugins.push({ type: plugin, options });
    }

    getAll(): readonly { type: PluggableClass; options?: PluginOptions; instance?: Pluggable }[] {
        return this.plugins.map((p) => ({ type: p.type, options: p.options, instance: p.instance }));
    }

    private instantiate(context: AxiSparkContext): void {
        for (const plugin of this.plugins) {
            plugin.instance = context.container.resolve(plugin.type);
        }
    }

    async init(context: AxiSparkContext): Promise<void> {
        this.instantiate(context);
        await this.executeLifecycleMethod(context, 'onRegister', PluginLifecycle.Registered);
    }

    async run(context: AxiSparkContext): Promise<void> {
        await this.executeLifecycleMethod(context, 'onStart', PluginLifecycle.Started);
    }

    async destroy(context: AxiSparkContext): Promise<void> {
        await this.executeLifecycleMethod(context, 'onStop', PluginLifecycle.Stopped);
    }

    private async executeLifecycleMethod(context: AxiSparkContext, methodName: 'onRegister' | 'onStart' | 'onStop', lifecycleState: PluginLifecycle): Promise<void> {
        await Promise.all(
            this.plugins.map(async ({ instance, type, options }) => {
                try {
                    if ((instance as Pluggable).getState() === PluginLifecycle.Error) return;

                    await (instance as Pluggable)[methodName]?.(context, options);
                    (instance as Pluggable).setState(lifecycleState);
                } catch (error) {
                    (instance as Pluggable).setStateError(error as Error);
                    context.logger.fatal(`Error executing ${methodName} for plugin ${type.name}: ${error}`, error as Error);
                }
            })
        );
    }
}
