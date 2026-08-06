import { ExecutionResultProcessor, ExecutionHandler, ExecutionResult } from '@axisparkjs/engine';
import { BodyHttpResult } from './http-result';
import { HttpContext } from '../types/http-context';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { HttpStatusCode, defaultStatusCode } from '../types';
import { RouteMetadata } from '../metadata/route-metadata';

class HttpResultProcessorStatic implements ExecutionResultProcessor {
    public async process(context: HttpContext, handler: ExecutionHandler, result: unknown): Promise<void> {
        if (result instanceof ExecutionResult) {
            result.process(context);
            return;
        }
        const route = (Metadata.get<RouteMetadata[]>(MetadataKeys.ROUTE, handler.target) as RouteMetadata[]).find((r) => r.propertyKey === handler.method) as RouteMetadata;
        const statusCode = Metadata.get<HttpStatusCode>(MetadataKeys.HTTP_CODE, handler.target, handler.method) ?? defaultStatusCode(route.method as string);
        return new BodyHttpResult(result, statusCode).process(context);
    }
}
export const HttpResultProcessor = new HttpResultProcessorStatic();
