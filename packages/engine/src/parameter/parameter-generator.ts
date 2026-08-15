import { Metadata, MetadataKeys, Generator } from '@axisparkjs/common';
import { ParameterMetadata } from '../metadata/parameter-metadata';
import { ExecutionContext, ExecutionHandler } from '../execution';
import { ParameterResolver } from './parameter-resolver';
import { ParameterDefinition } from './parameter-definition';
import { Injectable } from '@axisparkjs/di';

@Injectable()
export class ParameterGenerator implements Generator<ParameterDefinition[]> {
    private static readonly resolvers = new Map<string, ParameterResolver<any>>();

    static registerParameter(parameter: string, resolver: ParameterResolver<any>): void {
        this.resolvers.set(parameter, resolver);
    }

    generate(executionContext: ExecutionContext, executionHandler: ExecutionHandler): ParameterDefinition[] {
        const parametersMetadata = Metadata.get<ParameterMetadata[]>(MetadataKeys.PARAMETER, executionHandler.target, executionHandler.propertyKey) ?? [];
        const args: ParameterDefinition[] = [];
        for (const parameterMetadata of parametersMetadata) {
            if (!ParameterGenerator.resolvers.has(parameterMetadata.parameter)) continue;

            const resolver = ParameterGenerator.resolvers.get(parameterMetadata.parameter) as ParameterResolver<any>;
            const parameter = ParameterDefinition.fromMetadata(parameterMetadata);
            const resolvedValue = resolver.resolve(executionContext, parameter);
            parameter.setValue(resolvedValue);
            args[parameterMetadata.parameterIndex] = parameter;
        }

        return args;
    }
}
