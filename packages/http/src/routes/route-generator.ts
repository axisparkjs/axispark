import { Constructor, DecoratorNotIncludedError, ClassRegistry } from '@axisparkjs/di';
import { AxiSparkContext } from '@axisparkjs/core';
import { Generator, Metadata, MetadataKeys } from '@axisparkjs/common';
import { Route } from './route';
import { ControllerMetadata } from '../metadata/controller-metadata';
import { RouteMetadata } from '../metadata/route-metadata';
import { Controller } from '../decorators';
import { HttpResultProcessor } from '../execution-results/http-result-processor';
import { ExecutionTransport } from '@axisparkjs/engine';
import { HttpPluginOptions } from '../plugin/http-plugin-options';
import { HttpTimeoutProcessor } from '../execution-timeout';
import { VersioningUtils, VersioningType } from '../versioning';
import { VersionGuard } from '../guards/version-guard';

class RouteGeneratorStatic implements Generator<{ controller: Constructor; routes: Route[] }[]> {
    generate(options: HttpPluginOptions, context: AxiSparkContext): { controller: Constructor; routes: Route[] }[] {
        const controllers = ClassRegistry.getWithMetadata(MetadataKeys.CONTROLLER);

        const routeSets: { controller: Constructor; routes: Route[] }[] = [];
        for (const controller of controllers) {
            const routes = this.generateRoutes(controller, options, context);
            routeSets.push({ controller, routes });
        }

        return routeSets;
    }

    private generateRoutes(controller: Constructor, options: HttpPluginOptions, context: AxiSparkContext): Route[] {
        const controllerMetadata = Metadata.get<ControllerMetadata>(MetadataKeys.CONTROLLER, controller);
        if (!controllerMetadata) throw new DecoratorNotIncludedError(controller.name, Controller.name);

        const routes = Metadata.get<RouteMetadata[]>(MetadataKeys.ROUTE, controller) ?? [];
        return routes.map((route) => {
            const handler = { target: controller, method: route.propertyKey };
            return {
                method: route.method,
                path: this.joinPath(options, controllerMetadata.prefix, route.path, options.basePath),
                controller,
                propertyKey: route.propertyKey,
                handler: async (httpContext) => {
                    const version = VersioningUtils.isVersionValid(httpContext.request, options.versioning, controllerMetadata, route);
                    const executionContext = { transport: ExecutionTransport.Http, scope: context.container.createScopedContainer(), version, ...httpContext };
                    const finalHandler = !version ? { target: VersionGuard, method: 'failedCheckVersion' } : handler;
                    await context.engine.execute(executionContext, finalHandler, {
                        container: context.container,
                        resultProcessor: HttpResultProcessor,
                        timeoutProcessor: options.timeout
                            ? new HttpTimeoutProcessor(executionContext, finalHandler, options.timeoutOptions?.time, options.timeoutOptions?.message)
                            : undefined
                    });
                }
            };
        });
    }

    private joinPath(options: HttpPluginOptions, prefix: string, path: string, basePath = ''): string {
        basePath = basePath.startsWith('/') ? basePath : `/${basePath}`;

        if (options.versioning && options.versioning.type === VersioningType.Uri) {
            basePath = `${basePath}/v:version`;
        }

        prefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
        path = path.startsWith('/') ? path : `/${path}`;
        return `${basePath}${prefix}${path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    }
}
export const RouteGenerator = new RouteGeneratorStatic();
