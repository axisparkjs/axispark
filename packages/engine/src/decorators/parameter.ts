import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { ParameterMetadata } from '../metadata/parameter-metadata';

export function Parameter(parameter: string, field?: string): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        propertyKey = propertyKey as string | symbol;
        const parameters = Metadata.get<ParameterMetadata[]>(MetadataKeys.PARAMETER, target, propertyKey) ?? [];

        parameters.push({
            target: Metadata.normalizeTarget(target),
            parameter,
            parameterIndex,
            field,
            propertyKey
        });

        Metadata.define(MetadataKeys.PARAMETER, parameters, target, propertyKey);
    };
}
