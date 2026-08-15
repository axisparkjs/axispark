import { ClassRegistry, Injectable, Inject, ScopedContainerManager } from '@axisparkjs/di';
import { Generator, Metadata, MetadataKeys } from '@axisparkjs/common';
import { RouteDefinition } from './route-definition';
import { ControllerMetadata } from '../metadata/controller-metadata';
import { RouteMetadata } from '../metadata/route-metadata';
import { ExecutionTransport } from '@axisparkjs/engine';
import { HttpPluginOptions } from '../plugin/http-plugin-options';
import { HTTP_OPTIONS } from '../di';
import { HttpEngine } from '../engine/http-engine';
import { VersionType } from '../version';
import { HttpContext } from '../types';

@Injectable()
export class RouteGenerator implements Generator<RouteDefinition[]> {
    constructor(
        private readonly httpEngine: HttpEngine,
        private readonly scopedContainerManager: ScopedContainerManager,
        @Inject(HTTP_OPTIONS) private readonly httpPluginOptions: HttpPluginOptions,
    ) {}

    async generate(): Promise<RouteDefinition[]> {
        const routes: RouteDefinition[] = [];

        const controllers = ClassRegistry.getWithMetadata(MetadataKeys.CONTROLLER);
        for (const controller of controllers) {
            const controllerMetadata = Metadata.get<ControllerMetadata>(MetadataKeys.CONTROLLER, controller) as ControllerMetadata;
            const routesMetadata = Metadata.get<RouteMetadata[]>(MetadataKeys.ROUTE, controller) ?? [];

            for (const routeMetadata of routesMetadata) {
                const routeDefinition = new RouteDefinition(
                    routeMetadata.target,
                    routeMetadata.propertyKey,
                    routeMetadata.method,
                    this.pathCreator(this.httpPluginOptions.basePath, controllerMetadata.prefix, routeMetadata.path, this.httpPluginOptions.versionOptions?.type === VersionType.Uri),
                    async (context) => await this.httpEngine.execute(this.fillContext(context, routeMetadata))
                );
                routes.push(routeDefinition);
            }
        }
        return routes;
    }

    private fillContext(context: Pick<HttpContext, 'request' | 'response' | 'session'>, routeMetadata: RouteMetadata): HttpContext {
        return {
            ...context,
            target: routeMetadata.target,
            propertyKey: routeMetadata.propertyKey,
            scopedContainer: this.scopedContainerManager.create(),
            transport: ExecutionTransport.Http,
            version: undefined,
            error: undefined,
        };
    }

    private pathCreator(basePath = '', prefix: string, path: string, version: boolean): string {
        basePath = basePath.startsWith('/') ? basePath : `/${basePath}`;

        if (version) {
            basePath = `${basePath}/v:version`;
        }

        prefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
        path = path.startsWith('/') ? path : `/${path}`;
        return `${basePath}${prefix}${path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    }
}
