import { Constructor, DecoratorNotIncludedError, ClassRegistry } from '@axisparkjs/di';
import { AxiSparkContext } from '@axisparkjs/core';
import { Generator, Metadata, MetadataKeys } from '@axisparkjs/common';
import { Route } from './route';
import { ControllerMetadata } from '../metadata/controller-metadata';
import { RouteMetadata } from '../metadata/route-metadata';
import { Controller } from '../decorators';
import { HttpResultProcessor } from '../execution-results/http-result-processor';
import { ExecutionTransport } from '@axisparkjs/engine';

class RouteGeneratorStatic implements Generator<{ controller: Constructor; routes: Route[] }[]> {
    generate(context: AxiSparkContext): { controller: Constructor; routes: Route[] }[] {
        const controllers = ClassRegistry.getWithMetadata(MetadataKeys.CONTROLLER);

        const routeSets: { controller: Constructor; routes: Route[] }[] = [];
        for (const controller of controllers) {
            const routes = this.generateRoutes(controller, context);
            routeSets.push({ controller, routes });
        }

        return routeSets;
    }

    private generateRoutes(controller: Constructor, context: AxiSparkContext): Route[] {
        const controllerMetadata = Metadata.get<ControllerMetadata>(MetadataKeys.CONTROLLER, controller);
        if (!controllerMetadata) throw new DecoratorNotIncludedError(controller.name, Controller.name);

        const routes = Metadata.get<RouteMetadata[]>(MetadataKeys.ROUTE, controller) ?? [];
        return routes.map((route) => {
            return {
                method: route.method,
                path: this.joinPath(controllerMetadata.prefix, route.path),
                controller,
                handler: async (httpContext) => {
                    await context.engine.execute(
                        { ...httpContext, transport: ExecutionTransport.Http },
                        { target: controller, method: route.propertyKey },
                        { container: context.container, processor: HttpResultProcessor }
                    );
                }
            };
        });
    }

    private joinPath(prefix: string, path: string): string {
        prefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
        return `${prefix}/${path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    }
}
export const RouteGenerator = new RouteGeneratorStatic();
