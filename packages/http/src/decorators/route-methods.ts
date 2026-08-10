import { HttpMethod } from '../types/http-method';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { RouteMetadata } from '../metadata/route-metadata';

function Method(method: HttpMethod) {
    return (path: string | Pick<RouteMetadata, 'path' | 'version'> = ''): MethodDecorator => {
        return (target, propertyKey) => {
            const routes = Metadata.get<RouteMetadata[]>(MetadataKeys.ROUTE, target) ?? [];

            const metadata: RouteMetadata = typeof path === 'string' ? { method, path, propertyKey } : { method, ...path, propertyKey };
            routes.push(metadata);

            Metadata.define(MetadataKeys.ROUTE, routes, target);
        };
    };
}

export const Delete = Method(HttpMethod.Delete);
export const Get = Method(HttpMethod.Get);
export const Head = Method(HttpMethod.Head);
export const Options = Method(HttpMethod.Options);
export const Patch = Method(HttpMethod.Patch);
export const Post = Method(HttpMethod.Post);
export const Put = Method(HttpMethod.Put);
