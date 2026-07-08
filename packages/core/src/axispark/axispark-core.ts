import { Lifecycle } from '@axisparkjs/common/src';
import { PluggableClass, PluginOptions } from '../plugin';
import { AxisparkContext } from './axispark-context';

export class AxisparkCore implements Lifecycle {
    public constructor(private readonly axisparkContext: AxisparkContext) {}

    public async init() {
        // Banner logic here
        if (this.axisparkContext.config.banner) {
            await this.axisparkContext.logger.info(`
    ╔═════════════════════════════════════════════╗
    ║                                             ║
    ║                 AxiSpark.js                 ║
    ║                                             ║
    ║      Fast • Modular • TypeScript First      ║
    ║                                             ║
    ╚═════════════════════════════════════════════╝
            `);
        }

        // Initialization logic here
        await this.axisparkContext.plugins.init(this.axisparkContext);
        await this.axisparkContext.logger.info('App initialized');
    }

    public async run(): Promise<void> {
        await this.axisparkContext.plugins.run(this.axisparkContext);
        await this.axisparkContext.logger.info('App running, waiting for termination signal...');

        return new Promise((resolve) => {
            process.once('SIGINT', resolve);
            process.once('SIGTERM', resolve);
        });
    }

    public async destroy() {
        // Cleanup logic here
        await this.axisparkContext.plugins.destroy(this.axisparkContext);
        await this.axisparkContext.logger.info('App destroyed');
    }

    public use(plugin: PluggableClass, options?: PluginOptions): this {
        this.axisparkContext.plugins.register(this.axisparkContext, plugin, options);
        return this;
    }
}
