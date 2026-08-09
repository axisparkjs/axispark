import { AxiSparkContext, PluginNotConfiguredError, Plugin, Pluggable } from '@axisparkjs/core';
import { HttpPluginOptions } from './http-plugin-options';
import { HTTP_ADAPTER, HTTP_LOGGER, HTTP_OPTIONS } from '../di/tokens';
import { HttpAdapter } from '../adapter/http-adapter';
import { RouteGenerator } from '../routes/route-generator';
import { Logger } from '@axisparkjs/logger';
import { ClassRegistry, Constructor, InjectableScope } from '@axisparkjs/di';
import { LogHttpRequestInterceptor, LogHttpResponseInterceptor } from '../interceptors';
import { LogHttpErrorFilter, LogErrorFilter } from '../filters';
import { HealthController } from '../controllers';
import { Route } from '../routes/route';

@Plugin()
export class HttpPlugin extends Pluggable {
    private logger!: Logger;
    protected options!: HttpPluginOptions;
    private adapter!: HttpAdapter;

    async onRegister(context: AxiSparkContext, options?: HttpPluginOptions): Promise<void> {
        if (!options) throw new PluginNotConfiguredError(HttpPlugin.name);
        this.logger = (await context.container.resolve(Logger)).child('HttpPlugin');
        this.options = options;

        this.registerContainerBindings(context);
        this.configureComponents(context);
        const routes = await this.generateRoutes(context);

        this.adapter = await context.container.resolve<HttpAdapter>(HTTP_ADAPTER);
        await this.adapter.initialize?.();
        await this.adapter.registerRoutes(routes);
        await this.logger.info(`Plugin registered`);
    }

    private registerContainerBindings(context: AxiSparkContext): void {
        context.container.bind({ token: HTTP_OPTIONS, useValue: this.options });
        context.container.bind({ token: HTTP_ADAPTER, useClass: this.options.adapter, scope: InjectableScope.Singleton });
        context.container.bind({ token: HTTP_LOGGER, useValue: this.logger });
    }

    private async generateRoutes(context: AxiSparkContext): Promise<Route[]> {
        const routeSets = RouteGenerator.generate(this.options, context);
        const totalRoutes: Route[] = [];
        for (const { controller, routes } of routeSets) {
            totalRoutes.push(...routes);
            for (const route of routes) {
                await this.logger.debug(`Registered route ${route.method.toLocaleUpperCase()} ${route.path} for controller ${controller.name}`);
            }
            await this.logger.info(`Registered controller ${controller.name}`);
        }
        return totalRoutes;
    }

    private configureComponents(context: AxiSparkContext): void {
        const items: [boolean, Constructor][] = [
            [this.options.healthChecks ?? false, HealthController],
            [this.options.logHttpRequests ?? false, LogHttpRequestInterceptor],
            [this.options.logHttpResponses ?? false, LogHttpResponseInterceptor],
            [this.options.logHttpErrors ?? false, LogHttpErrorFilter],
            [this.options.logErrors ?? false, LogErrorFilter]
        ];

        for (const [enabled, target] of items) {
            this.disableComponentIf(context, enabled, target);
        }
    }

    private disableComponentIf(context: AxiSparkContext, enabled: boolean, target: Constructor): void {
        if (enabled) return;

        ClassRegistry.remove(target);
        context.container.unbind(target);
    }

    async onStart(): Promise<void> {
        await this.adapter.start();
        await this.logger.info(`Plugin started. Listening on port ${this.options.port}`);
    }

    async onStop(): Promise<void> {
        await this.adapter.stop();
        await this.logger.info(`Plugin stopped`);
    }
}
