import { Metadata, MetadataKeys, Lifecycle } from '@axisparkjs/common';
import { DecoratorNotIncludedError } from '@axisparkjs/di';
import { AxiSparkContext } from '../axispark';
import { PluginAlreadyRegisteredError } from './plugin-already-registered-error';
import { PluginConfigMismatchError } from './plugin-config-mismatch-error';
import { Pluggable, PluggableClass, PluginOptions } from './pluggable';
import { Plugin } from '../decorators';

interface RegisteredPlugin {
    readonly type: PluggableClass;
    readonly options?: PluginOptions;
    instance?: Pluggable;
}

export class PluginRegistry implements Lifecycle {
    private readonly plugins: RegisteredPlugin[] = [];

    register(context: AxiSparkContext, plugin: PluggableClass, options?: PluginOptions): void {
        if (!Metadata.has(MetadataKeys.PLUGIN, plugin)) throw new DecoratorNotIncludedError(plugin.name, Plugin.name);
        if (this.plugins.some((p) => p.type === plugin)) throw new PluginAlreadyRegisteredError(plugin.name);
        if (options && plugin !== options.plugin) throw new PluginConfigMismatchError(plugin.name);

        context.container.bind(plugin);

        this.plugins.push({ type: plugin, options });
    }

    getAll(): readonly { type: PluggableClass; options?: PluginOptions }[] {
        return this.plugins.map((p) => ({ type: p.type, options: p.options }));
    }

    private instantiate(context: AxiSparkContext): void {
        for (const plugin of this.plugins) {
            plugin.instance = context.container.resolve(plugin.type);
        }
    }

    async init(context: AxiSparkContext): Promise<void> {
        this.instantiate(context);
        for (const plugin of this.plugins) await (plugin.instance as Pluggable).onRegister?.(context, plugin.options);
    }

    async run(context: AxiSparkContext): Promise<void> {
        for (const plugin of this.plugins) await (plugin.instance as Pluggable).onStart?.(context, plugin.options);
    }

    async destroy(context: AxiSparkContext): Promise<void> {
        for (const plugin of [...this.plugins].reverse()) await (plugin.instance as Pluggable).onStop?.(context, plugin.options);
    }
}
