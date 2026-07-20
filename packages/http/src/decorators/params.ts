import { RouteParameter } from '../types/route-parameter';
import { Metadata, MetadataKeys } from '@axisparkjs/common/src';
import { RouteParameterMetadata } from '../metadata/route-parameter-metadata';

export function createRouteParameterDecorator(parameter: RouteParameter) {
    return (name?: string): ParameterDecorator => {
        return (target, propertyKey, parameterIndex) => {
            const key = propertyKey as string | symbol;
            const parameters = Metadata.getMethod<RouteParameterMetadata[]>(MetadataKeys.ROUTE_PARAMETER, target.constructor, key) ?? [];

            parameters.push({
                parameter,
                index: parameterIndex,
                name
            });

            Metadata.defineMethod(MetadataKeys.ROUTE_PARAMETER, parameters, target.constructor, key);
        };
    };
}

export const Request = createRouteParameterDecorator(RouteParameter.REQUEST);
export const Response = createRouteParameterDecorator(RouteParameter.RESPONSE);
export const Body = createRouteParameterDecorator(RouteParameter.BODY);
export const Param = createRouteParameterDecorator(RouteParameter.PARAM);
export const Query = createRouteParameterDecorator(RouteParameter.QUERY);
export const Header = createRouteParameterDecorator(RouteParameter.HEADER);
