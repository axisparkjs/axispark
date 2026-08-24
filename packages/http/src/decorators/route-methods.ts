import { HttpMethod } from '../types/http-method';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { RouteMetadata } from '../metadata/route-metadata';

/**
 * A decorator for defining a route method.
 * @param method The HTTP method for the route.
 * @param value The path or route metadata.
 * @returns A method decorator.
 */
function Method(method: HttpMethod, value: string | Pick<RouteMetadata, 'path' | 'version'> = ''): MethodDecorator {
    return (target, propertyKey) => {
        const routes = Metadata.get<RouteMetadata[]>(MetadataKeys.ROUTE, target) ?? [];

        const metadata: RouteMetadata = {
            target: Metadata.normalizeTarget(target),
            propertyKey,
            method,
            path: typeof value === 'string' ? value : value.path,
            version: typeof value === 'string' ? undefined : value.version
        };
        routes.push(metadata);

        Metadata.define(MetadataKeys.ROUTE, routes, target);
        Metadata.define(MetadataKeys.ROUTE, metadata, target, propertyKey);
    };
}

/**
 * A decorator for defining a DELETE route.
 * @param value The path or route metadata.
 * @returns A method decorator.
 */
export const Delete = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Delete, value);
/**
 * A decorator for defining a GET route.
 * @param value The path or route metadata.
 * @returns A method decorator.
 */
export const Get = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Get, value);
/**
 * A decorator for defining a HEAD route.
 * @param value The path or route metadata.
 * @returns A method decorator.
 */
export const Head = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Head, value);
/**
 * A decorator for defining an OPTIONS route.
 * @param value The path or route metadata.
 * @returns A method decorator.
 */
export const Options = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Options, value);
/**
 * A decorator for defining a PATCH route.
 * @param value The path or route metadata.
 * @returns A method decorator.
 */
export const Patch = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Patch, value);
/**
 * A decorator for defining a POST route.
 * @param value The path or route metadata.
 * @returns A method decorator.
 */
export const Post = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Post, value);
/**
 * A decorator for defining a PUT route.
 * @param value The path or route metadata.
 * @returns A method decorator.
 */
export const Put = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Put, value);
