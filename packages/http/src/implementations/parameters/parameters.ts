import { ParameterResolver, ParameterDefinition, Parameter } from '@axisparkjs/engine';
import { HttpParameter } from '../../types/http-parameter';
import { HttpContext } from '../../types/http-context';
import { HttpRequest } from '../../types/http-request';
import { HttpResponse } from '../../types/http-response';
import { Injectable } from '@axisparkjs/di';

/**
 * A parameter for injecting the HTTP request.
 */
export const Request = () => Parameter(HttpParameter.Request);
/**
 * A parameter for injecting the HTTP response.
 */
export const Response = () => Parameter(HttpParameter.Response);
/**
 * A parameter for injecting the HTTP request body.
 */
export const Body = () => Parameter(HttpParameter.Body);
/**
 * A parameter for injecting the HTTP request path.
 */
export const Path = (field: string) => Parameter(HttpParameter.Path, field);
/**
 * A parameter for injecting the HTTP request query.
 */
export const Query = (field: string) => Parameter(HttpParameter.Query, field);
/**
 * A parameter for injecting the HTTP request header.
 */
export const Header = (field: string) => Parameter(HttpParameter.Header, field);
/**
 * A parameter for injecting the HTTP request IP.
 */
export const Ip = () => Parameter(HttpParameter.Ip);
/**
 * A parameter for injecting the HTTP request session.
 */
export const Session = () => Parameter(HttpParameter.Session);
/**
 * A parameter for injecting the HTTP request cookie.
 */
export const Cookie = (field: string) => Parameter(HttpParameter.Cookie, field);

@Injectable()
export class RequestResolver implements ParameterResolver<HttpRequest> {
    resolve(httpContext: HttpContext) {
        return httpContext.request;
    }
}
@Injectable()
export class ResponseResolver implements ParameterResolver<HttpResponse> {
    resolve(httpContext: HttpContext) {
        return httpContext.response;
    }
}
@Injectable()
export class BodyResolver implements ParameterResolver<any> {
    resolve(httpContext: HttpContext) {
        return httpContext.request.body;
    }
}
@Injectable()
export class PathResolver implements ParameterResolver<string | string[]> {
    resolve(httpContext: HttpContext, parameter: ParameterDefinition) {
        return httpContext.request.params[parameter.field as string];
    }
}
@Injectable()
export class QueryResolver implements ParameterResolver<string | string[]> {
    resolve(httpContext: HttpContext, parameter: ParameterDefinition) {
        return httpContext.request.query[parameter.field as string];
    }
}
@Injectable()
export class HeaderResolver implements ParameterResolver<string | string[] | undefined> {
    resolve(httpContext: HttpContext, parameter: ParameterDefinition) {
        return httpContext.request.headers[parameter.field as string];
    }
}
@Injectable()
export class IpResolver implements ParameterResolver<string | undefined> {
    resolve(httpContext: HttpContext) {
        return httpContext.request.ip;
    }
}
@Injectable()
export class SessionResolver implements ParameterResolver<any> {
    resolve(httpContext: HttpContext) {
        return httpContext.session;
    }
}
@Injectable()
export class CookieResolver implements ParameterResolver<string | undefined> {
    resolve(httpContext: HttpContext, parameter: ParameterDefinition) {
        return httpContext.request.cookies[parameter.field as string];
    }
}
