import { HttpMethod } from '../types/http-method';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { RouteMetadata } from '../metadata/route-metadata';

function Method(method: HttpMethod) {
    return (path = ''): MethodDecorator => {
        return (target, propertyKey) => {
            const routes = Metadata.get<RouteMetadata[]>(MetadataKeys.ROUTE, target) ?? [];

            routes.push({
                method,
                path,
                propertyKey
            });

            Metadata.define(MetadataKeys.ROUTE, routes, target);
        };
    };
}

export const Delete = Method(HttpMethod.DELETE);
export const Get = Method(HttpMethod.GET);
export const Head = Method(HttpMethod.HEAD);
export const Options = Method(HttpMethod.OPTIONS);
export const Patch = Method(HttpMethod.PATCH);
export const Post = Method(HttpMethod.POST);
export const Put = Method(HttpMethod.PUT);
