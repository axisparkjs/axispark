import { Constructor, Container } from '@axisparkjs/di/src';
import { RouteEntry } from './route-entry';
import { ControllerMetadata } from '../metadata/controller-metadata';
import { Factory, Metadata, MetadataKeys } from '@axisparkjs/common/src';
import { RouteMetadata } from '../metadata/route-metadata';
import { RouteParameterMetadata } from '../metadata/route-parameter-metadata';
import { RouteParameterResolver } from './route-parameter-resolver';
import { Controller } from '../decorators';
import { DecoratorNotIncludedError } from '@axisparkjs/di/src';
import { defaultStatusCode, HttpStatus } from '../errors';

export class RouteEntryFactoryStatic implements Factory<RouteEntry[]> {
    create(controller: Constructor, container: Container): RouteEntry[] {
        const controllerMetadata = Metadata.get<ControllerMetadata>(MetadataKeys.CONTROLLER, controller);

        if (!controllerMetadata) throw new DecoratorNotIncludedError(controller.name, Controller.name);

        const routes = Metadata.get<RouteMetadata[]>(MetadataKeys.ROUTE, controller) ?? [];
        return routes.map((route) => {
            const parameters = Metadata.getMethod<RouteParameterMetadata[]>(MetadataKeys.ROUTE_PARAMETER, controller, route.propertyKey) ?? [];
            const statusCode = Metadata.getMethod<HttpStatus>(MetadataKeys.HTTP_CODE, controller, route.propertyKey) ?? defaultStatusCode(route.method);
            return {
                ...route,
                path: this.joinPath(controllerMetadata.prefix, route.path),
                controller,
                handler: async (context) => {
                    const instance = container.resolve<any>(controller);
                    return await instance[route.propertyKey](...RouteParameterResolver.resolve(parameters, context));
                },
                statusCode
            };
        });
    }

    private joinPath(prefix: string, path: string): string {
        return `${prefix}/${path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    }
}
export const RouteEntryFactory = new RouteEntryFactoryStatic();
