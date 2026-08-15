import { HttpMethod } from '../types/http-method';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { RouteMetadata } from '../metadata/route-metadata';

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

export const Delete = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Delete, value);
export const Get = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Get, value);
export const Head = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Head, value);
export const Options = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Options, value);
export const Patch = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Patch, value);
export const Post = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Post, value);
export const Put = (value?: string | Pick<RouteMetadata, 'path' | 'version'>) => Method(HttpMethod.Put, value);
