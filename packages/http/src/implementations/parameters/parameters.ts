import { ParameterResolver, ParameterDefinition, Parameter } from '@axisparkjs/engine';
import { HttpParameter } from '../../types/http-parameter';
import { HttpContext } from '../../types/http-context';
import { HttpRequest } from '../../types/http-request';
import { HttpResponse } from '../../types/http-response';
import { Injectable } from '@axisparkjs/di';

export const Request = () => Parameter(HttpParameter.Request);
export const Response = () => Parameter(HttpParameter.Response);
export const Body = () => Parameter(HttpParameter.Body);
export const Param = (field: string) => Parameter(HttpParameter.Param, field);
export const Query = (field: string) => Parameter(HttpParameter.Query, field);
export const Header = (field: string) => Parameter(HttpParameter.Header, field);
export const Ip = () => Parameter(HttpParameter.Ip);
export const Session = () => Parameter(HttpParameter.Session);
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
export class ParamResolver implements ParameterResolver<string | string[]> {
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