import { AxiSparkContext, Plugin } from '@axisparkjs/core';
import { Logger } from '@axisparkjs/logger';
import { SecurityPluginOptions } from './security-plugin-options';
import { SECURITY_LOGGER, SECURITY_OPTIONS } from '../di';
import { PluginNotConfiguredError } from '@axisparkjs/core';
import { Injectable } from '@axisparkjs/di';

/**
 * A plugin for integrating Security into the application.
 */
@Injectable()
export class SecurityPlugin extends Plugin {
    private context: AxiSparkContext;
    protected options: SecurityPluginOptions;

    constructor(private logger: Logger) {
        super();
    }

    async onRegister(context: AxiSparkContext, options?: SecurityPluginOptions): Promise<void> {
        if (!options) throw new PluginNotConfiguredError(SecurityPlugin.name);
        this.context = context;
        this.options = options;
        this.logger = this.logger.child('SecurityPlugin');

        this.registerContainerBindings();

        await this.logger.info(`Plugin registered`);
    }

    private registerContainerBindings(): void {
        this.context.container.bind({ token: SECURITY_OPTIONS, useValue: this.options });
        this.context.container.bind({ token: SECURITY_LOGGER, useValue: this.logger });
    }

    async onStart(): Promise<void> {
        await this.logger.info(`Plugin started`);
    }

    async onStop(): Promise<void> {
        await this.logger.info(`Plugin stopped`);
    }
}
