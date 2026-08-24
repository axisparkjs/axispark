import { ResultDefinition, ResultResolver } from '@axisparkjs/engine';
import { BodyHttpResult } from './http-result';
import { HttpContext } from '../../types/http-context';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { defaultStatusCode } from '../../types';
import { RouteMetadata, HttpCodeMetadata } from '../../metadata';
import { Injectable } from '@axisparkjs/di';

/**
 * A resolver for creating HTTP results from unknown values.
 */
@Injectable()
export class HttpResultResolver implements ResultResolver {
    /**
     * Resolves an unknown value into an HTTP result.
     * @param result The unknown value to resolve.
     * @param context The HTTP context.
     * @returns The resolved HTTP result.
     */
    public resolve(result: unknown, context: HttpContext): ResultDefinition {
        const route = Metadata.get<RouteMetadata>(MetadataKeys.ROUTE, context.target, context.propertyKey) as RouteMetadata;
        const statusCode =
            Metadata.get<HttpCodeMetadata>(MetadataKeys.HTTP_CODE, context.target, context.propertyKey)?.statusCode ??
            defaultStatusCode(route.method as string);

        return new BodyHttpResult(result, statusCode);
    }
}
