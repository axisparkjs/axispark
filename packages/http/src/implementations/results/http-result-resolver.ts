import { ResultDefinition, ResultResolver } from '@axisparkjs/engine';
import { BodyHttpResult } from './http-result';
import { HttpContext } from '../../types/http-context';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { defaultStatusCode } from '../../types';
import { RouteMetadata, HttpCodeMetadata } from '../../metadata';
import { Injectable } from '@axisparkjs/di';

@Injectable()
export class HttpResultResolver implements ResultResolver {
    public resolve(result: unknown, context: HttpContext): ResultDefinition {
        const route = Metadata.get<RouteMetadata>(MetadataKeys.ROUTE, context.target, context.propertyKey) as RouteMetadata;
        const statusCode =
            Metadata.get<HttpCodeMetadata>(MetadataKeys.HTTP_CODE, context.target, context.propertyKey)?.statusCode ??
            defaultStatusCode(route.method as string);

        return new BodyHttpResult(result, statusCode);
    }
}
