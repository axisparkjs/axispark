import { ParameterResolver, ParametersResolver } from '@axisparkjs/engine';
import { HttpContext } from '../types/http-context';
import { HttpParameter } from '../types/http-parameter';
import { HttpRequest } from '../types/http-request';
import { HttpResponse } from '../types/http-response';
import { ParameterMetadata } from '@axisparkjs/engine';

export class RequestResolver implements ParameterResolver<HttpRequest> {
    resolve(httpContext: HttpContext) {
        return httpContext.request;
    }
}
export class ResponseResolver implements ParameterResolver<HttpResponse> {
    resolve(httpContext: HttpContext) {
        return httpContext.response;
    }
}
export class BodyResolver implements ParameterResolver<any> {
    resolve(httpContext: HttpContext) {
        return httpContext.request.body;
    }
}
export class ParamResolver implements ParameterResolver<string | string[]> {
    resolve(httpContext: HttpContext, parameterMetadata: ParameterMetadata) {
        return httpContext.request.params[parameterMetadata.name as string];
    }
}
export class QueryResolver implements ParameterResolver<string | string[]> {
    resolve(httpContext: HttpContext, parameterMetadata: ParameterMetadata) {
        return httpContext.request.query[parameterMetadata.name as string];
    }
}
export class HeaderResolver implements ParameterResolver<string | string[] | undefined> {
    resolve(httpContext: HttpContext, parameterMetadata: ParameterMetadata) {
        return httpContext.request.headers[parameterMetadata.name as string];
    }
}
export class IpResolver implements ParameterResolver<string | undefined> {
    resolve(httpContext: HttpContext) {
        return httpContext.request.ip;
    }
}
export class SessionResolver implements ParameterResolver<any> {
    resolve(httpContext: HttpContext) {
        return httpContext.session;
    }
}

ParametersResolver.register(HttpParameter.RESPONSE, new ResponseResolver());
ParametersResolver.register(HttpParameter.REQUEST, new RequestResolver());
ParametersResolver.register(HttpParameter.BODY, new BodyResolver());
ParametersResolver.register(HttpParameter.PARAM, new ParamResolver());
ParametersResolver.register(HttpParameter.QUERY, new QueryResolver());
ParametersResolver.register(HttpParameter.HEADER, new HeaderResolver());
ParametersResolver.register(HttpParameter.IP, new IpResolver());
ParametersResolver.register(HttpParameter.SESSION, new SessionResolver());
