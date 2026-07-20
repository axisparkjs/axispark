import { HttpMethod } from '../types/http-method';
import { Metadata, MetadataKeys } from '@axisparkjs/common/src';
import { RouteMetadata } from '../metadata/route-metadata';

export function createMethodDecorator(method: HttpMethod) {
    return (path = ''): MethodDecorator => {
        return (target, propertyKey) => {
            const routes = Metadata.get<RouteMetadata[]>(MetadataKeys.ROUTE, target.constructor) ?? [];

            routes.push({
                method,
                path,
                propertyKey
            });

            Metadata.define(MetadataKeys.ROUTE, routes, target.constructor);
        };
    };
}

export const Delete = createMethodDecorator(HttpMethod.DELETE);
export const Get = createMethodDecorator(HttpMethod.GET);
export const Head = createMethodDecorator(HttpMethod.HEAD);
export const Options = createMethodDecorator(HttpMethod.OPTIONS);
export const Patch = createMethodDecorator(HttpMethod.PATCH);
export const Post = createMethodDecorator(HttpMethod.POST);
export const Put = createMethodDecorator(HttpMethod.PUT);
