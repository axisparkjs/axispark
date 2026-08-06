import { Metadata, MetadataKeys, Lifecycle } from '@axisparkjs/common';
import { DecoratorNotIncludedError } from '@axisparkjs/di';
import { AxiSparkContext } from '../axispark';
import { PluginAlreadyRegisteredError } from './plugin-already-registered-error';
import { PluginConfigMismatchError } from './plugin-config-mismatch-error';
import { PluginCircularDependencyError } from './plugin-circular-dependency-error';
import { PluginDependencyNotIncludedError } from './plugin-dependency-not-included-error';
import { Pluggable, PluginLifecycle, PluggableClass, PluginOptions } from './pluggable';
import { Plugin } from '../decorators';

interface RegisteredPlugin {
    readonly type: PluggableClass;
    readonly options?: PluginOptions;
}

export class PluginRegistry implements Lifecycle {
    private readonly plugins: RegisteredPlugin[] = [];
    private readonly executionOrder: RegisteredPlugin[] = [];
    private readonly instances = new Map<PluggableClass, Pluggable>();

    register(plugin: PluggableClass, options?: PluginOptions): void {
        if (!Metadata.has(MetadataKeys.PLUGIN, plugin)) throw new DecoratorNotIncludedError(plugin.name, Plugin.name);
        if (this.plugins.some((p) => p.type === plugin)) throw new PluginAlreadyRegisteredError(plugin.name);
        if (options && plugin !== options.plugin) throw new PluginConfigMismatchError(plugin.name);

        this.plugins.push({ type: plugin, options });
    }

    getAll(): readonly { type: PluggableClass; options?: PluginOptions; instance?: Pluggable }[] {
        return this.plugins.map((p) => ({ type: p.type, options: p.options, instance: this.instances.get(p.type) }));
    }

    private instantiate(context: AxiSparkContext): void {
        for (const plugin of this.plugins) {
            this.instances.set(plugin.type, context.container.resolve(plugin.type));
        }
    }

    /* Kahn's algorithm */
    private resolveExecutionOrder(): void {
        this.executionOrder.length = 0;
        const plugins = new Map(this.plugins.map((plugin) => [plugin.type, plugin]));
        const inDegree = new Map<PluggableClass, number>();
        const graph = new Map<PluggableClass, PluggableClass[]>();

        for (const plugin of this.plugins) {
            inDegree.set(plugin.type, 0);
            graph.set(plugin.type, []);
        }

        for (const plugin of this.plugins) {
            const dependencies = plugin.type.dependencies || [];
            for (const dependency of dependencies) {
                if (!graph.has(dependency)) throw new PluginDependencyNotIncludedError(dependency.name);
                (graph.get(dependency) as PluggableClass[]).push(plugin.type);
                inDegree.set(plugin.type, (inDegree.get(plugin.type) || 0) + 1);
            }
        }

        const queue: PluggableClass[] = [];
        for (const [plugin, degree] of inDegree.entries()) {
            if (degree === 0) queue.push(plugin);
        }

        while (queue.length > 0) {
            const current = queue.shift() as PluggableClass;
            const currentPlugin = plugins.get(current) as RegisteredPlugin;
            this.executionOrder.push(currentPlugin);

            for (const neighbor of graph.get(current) as PluggableClass[]) {
                inDegree.set(neighbor, (inDegree.get(neighbor) as number) - 1);
                if (inDegree.get(neighbor) === 0) queue.push(neighbor);
            }
        }

        if (this.executionOrder.length !== this.plugins.length) {
            throw new PluginCircularDependencyError();
        }
    }

    async init(context: AxiSparkContext): Promise<void> {
        this.instantiate(context);
        this.resolveExecutionOrder();
        await this.executeLifecycleMethod(context, 'onRegister', PluginLifecycle.Registered);
    }

    async run(context: AxiSparkContext): Promise<void> {
        await this.executeLifecycleMethod(context, 'onStart', PluginLifecycle.Started);
    }

    async destroy(context: AxiSparkContext): Promise<void> {
        await this.executeLifecycleMethod(context, 'onStop', PluginLifecycle.Stopped, true);
    }

    private async executeLifecycleMethod(context: AxiSparkContext, methodName: 'onRegister' | 'onStart' | 'onStop', lifecycleState: PluginLifecycle, reversed = false): Promise<void> {
        const plugins = reversed ? this.executionOrder.toReversed() : this.executionOrder;
        for (const { type, options } of plugins) {
            const instance = this.instances.get(type) as Pluggable;
            try {
                if (instance.getState() === PluginLifecycle.Error) return;

                await instance[methodName]?.(context, options);
                instance.setState(lifecycleState);
            } catch (error) {
                instance.setStateError(error as Error);
                context.logger.fatal(`Error executing ${methodName} for plugin ${type.name}: ${error}`, error as Error);
            }
        }
    }
}
