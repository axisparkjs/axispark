import { AxiSparkContext, PluginNotConfiguredError } from '@axisparkjs/core';
import { HttpPluginOptions } from './http-plugin-options';
import { HTTP_ADAPTER, HTTP_LOGGER, HTTP_OPTIONS } from '../di/tokens';
import { HttpAdapter } from '../adapter/http-adapter';
import { RouteRegistry } from '../routing/route-registry';
import { RouteEntryFactory } from '../routing/route-entry-factory';
import { Logger } from '@axisparkjs/logger';
import { Plugin, Pluggable } from '@axisparkjs/core';
import { CatchEntryFactory, CatchRegistry } from '../errors';

@Plugin()
export class HttpPlugin implements Pluggable {
    private readonly routeRegistry = new RouteRegistry();
    private readonly catchRegistry = new CatchRegistry();
    private logger: Logger;

    async onRegister(context: AxiSparkContext, options?: HttpPluginOptions): Promise<void> {
        if (!options) throw new PluginNotConfiguredError(HttpPlugin.name);
        this.logger = context.container.resolve(Logger).child('HttpPlugin');

        context.container.bind({ token: HTTP_OPTIONS, useValue: options });
        context.container.bind({ token: HTTP_ADAPTER, useClass: options.adapter });
        context.container.bind({ token: HTTP_LOGGER, useValue: this.logger });

        for (const controller of options.controllers) {
            context.container.bind(controller);
            const routes = RouteEntryFactory.create(controller, context.container);
            this.routeRegistry.registerRoutes(routes);
            for (const route of routes) {
                await this.logger.debug(`Registered route ${route.method.toLocaleUpperCase()} ${route.path} for controller ${controller.name}`);
            }
            await this.logger.info(`Registered routes for controller ${controller.name}`);
        }

        for (const errorHandler of options.errorHandlers) {
            context.container.bind(errorHandler);
            const catchs = CatchEntryFactory.create(errorHandler, context.container);
            this.catchRegistry.registerCatchs(catchs);
            for (const catchEntry of catchs) {
                await this.logger.debug(`Registered error handler for ${catchEntry.error.name} in handler ${errorHandler.name}`);
            }
            await this.logger.info(`Registered error handlers for handler ${errorHandler.name}`);
        }

        const adapter = context.container.resolve<HttpAdapter>(HTTP_ADAPTER);
        await adapter.registerRoutes(this.routeRegistry.getRoutes());
        await adapter.registerCatchs(this.catchRegistry.getCatchs());
        await this.logger.info(`Plugin registered`);
    }

    async onStart(context: AxiSparkContext): Promise<void> {
        const adapter = context.container.resolve<HttpAdapter>(HTTP_ADAPTER);
        await adapter.start();
        await this.logger.info(`Plugin started`);
    }

    async onStop(context: AxiSparkContext): Promise<void> {
        const adapter = context.container.resolve<HttpAdapter>(HTTP_ADAPTER);
        await adapter.stop();
        await this.logger.info(`Plugin stopped`);
    }
}
