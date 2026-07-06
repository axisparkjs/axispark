import { Metadata, MetadataKeys, Plugin, Pluggable, PluggableClass, PluginOptions, Lifecycle } from '@axisparkjs/common';
import { DecoratorNotIncludedError } from '@axisparkjs/di';
import { AxisparkContext } from '../axispark';
import { PluginAlreadyRegisteredError } from './plugin-already-registered-error';
import { PluginConfigMismatchError } from './plugin-config-mismatch-error';

interface RegisteredPlugin {
    readonly type: PluggableClass;
    readonly options?: PluginOptions;
    instance?: Pluggable;
}

export class PluginRegistry implements Lifecycle {
    private readonly plugins: RegisteredPlugin[] = [];

    register(context: AxisparkContext, plugin: PluggableClass, options?: PluginOptions): void {
        if (!Metadata.has(MetadataKeys.PLUGIN, plugin)) throw new DecoratorNotIncludedError(plugin.name, Plugin.name);
        if (this.plugins.some((p) => p.type === plugin)) throw new PluginAlreadyRegisteredError(plugin.name);
        if (options && plugin !== options.plugin) throw new PluginConfigMismatchError(plugin.name);

        context.container.bind(plugin);

        this.plugins.push({ type: plugin, options });
    }

    getAll(): readonly PluggableClass[] {
        return this.plugins.map((p) => p.type);
    }

    private instantiate(context: AxisparkContext): void {
        for (const plugin of this.plugins) {
            plugin.instance = context.container.resolve(plugin.type);
        }
    }

    async init(context: AxisparkContext): Promise<void> {
        this.instantiate(context);
        for (const plugin of this.plugins) await (plugin.instance as Pluggable).onRegister?.(context, plugin.options);
    }

    async run(context: AxisparkContext): Promise<void> {
        for (const plugin of this.plugins) await (plugin.instance as Pluggable).onStart?.(context, plugin.options);
    }

    async destroy(context: AxisparkContext): Promise<void> {
        for (const plugin of [...this.plugins].reverse()) await (plugin.instance as Pluggable).onStop?.(context, plugin.options);
    }
}
