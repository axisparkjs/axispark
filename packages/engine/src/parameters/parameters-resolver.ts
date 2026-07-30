import { Metadata, MetadataKeys, Resolver } from '@axisparkjs/common';
import { ParameterMetadata } from './metadata/parameter-metadata';
import { ExecutionContext, ExecutionHandler } from '../execution';
import { ParameterResolver } from './parameter-resolver';

class ParametersResolverStatic implements Resolver<any[]> {
    private readonly resolvers = new Map<string, ParameterResolver<any>>();

    register(parameter: string, resolver: ParameterResolver<any>): void {
        this.resolvers.set(parameter, resolver);
    }

    resolve(executionContext: ExecutionContext, executionHandler: ExecutionHandler): any[] {
        const parameters = Metadata.getMethod<ParameterMetadata[]>(MetadataKeys.PARAMETER, executionHandler.target, executionHandler.method) ?? [];
        const args = [];
        for (const parameter of parameters) {
            if (!this.resolvers.has(parameter.parameter)) continue;

            const resolver = this.resolvers.get(parameter.parameter) as ParameterResolver<any>;
            const value = resolver.resolve(executionContext, parameter);
            args[parameter.index] = value;
        }

        return args;
    }
}
export const ParametersResolver = new ParametersResolverStatic();
