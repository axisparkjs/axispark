import { RouteParameterMetadata } from '../metadata/route-parameter-metadata';
import { HttpContext } from '../types';
import { RouteParameter } from '../types/route-parameter';

export class RouteParameterResolverStatic {
    resolve(metadata: RouteParameterMetadata[], httpContext: HttpContext): any[] {
        const args = [];
        const { request, response } = httpContext;
        for (const parameter of metadata) {
            switch (parameter.parameter) {
                case RouteParameter.REQUEST:
                    args[parameter.index] = request;
                    break;

                case RouteParameter.RESPONSE:
                    args[parameter.index] = response;
                    break;

                case RouteParameter.BODY:
                    args[parameter.index] = request.body;
                    break;

                case RouteParameter.PARAM:
                    if (!parameter.name) args[parameter.index] = undefined;
                    else args[parameter.index] = request.params[parameter.name];
                    break;

                case RouteParameter.QUERY:
                    if (!parameter.name) args[parameter.index] = undefined;
                    else args[parameter.index] = request.query[parameter.name];
                    break;

                case RouteParameter.HEADER:
                    if (!parameter.name) args[parameter.index] = undefined;
                    else args[parameter.index] = request.getHeader(parameter.name);
                    break;
            }
        }

        return args;
    }
}
export const RouteParameterResolver = new RouteParameterResolverStatic();
