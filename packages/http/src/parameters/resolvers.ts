import { ParameterResolver, ParametersResolver, ParameterMetadata } from '@axisparkjs/engine';
import { HttpContext } from '../types/http-context';
import { HttpParameter } from '../types/http-parameter';
import { HttpRequest } from '../types/http-request';
import { HttpResponse } from '../types/http-response';

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
export class CookieResolver implements ParameterResolver<string | undefined> {
    resolve(httpContext: HttpContext, parameterMetadata: ParameterMetadata) {
        return httpContext.request.cookies[parameterMetadata.name as string];
    }
}

ParametersResolver.register(HttpParameter.Response, new ResponseResolver());
ParametersResolver.register(HttpParameter.Request, new RequestResolver());
ParametersResolver.register(HttpParameter.Body, new BodyResolver());
ParametersResolver.register(HttpParameter.Param, new ParamResolver());
ParametersResolver.register(HttpParameter.Query, new QueryResolver());
ParametersResolver.register(HttpParameter.Header, new HeaderResolver());
ParametersResolver.register(HttpParameter.Ip, new IpResolver());
ParametersResolver.register(HttpParameter.Session, new SessionResolver());
ParametersResolver.register(HttpParameter.Cookie, new CookieResolver());
