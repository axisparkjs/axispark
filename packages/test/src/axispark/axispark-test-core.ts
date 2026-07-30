import { Lifecycle } from '@axisparkjs/common/src';
import { AxiSparkContext, PluggableClass, PluginOptions } from '@axisparkjs/core';

export class AxiSparkTestCore implements Lifecycle {
    public constructor(private readonly axisparkContext: AxiSparkContext) {}

    public async init() {
        await this.axisparkContext.plugins.init(this.axisparkContext);
    }

    public async run(): Promise<void> {
        await this.axisparkContext.plugins.run(this.axisparkContext);
    }

    public async destroy() {
        await this.axisparkContext.plugins.destroy(this.axisparkContext);
    }

    public use(plugin: PluggableClass, options?: PluginOptions): this {
        this.axisparkContext.plugins.register(this.axisparkContext, plugin, options);
        return this;
    }

    public used(): readonly { type: PluggableClass; options?: PluginOptions }[] {
        return this.axisparkContext.plugins.getAll();
    }
}
