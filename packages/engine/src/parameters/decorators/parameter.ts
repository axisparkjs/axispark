import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { ParameterMetadata } from '../metadata/parameter-metadata';

export function Parameter(parameter: string) {
    return (name?: string): ParameterDecorator => {
        return (target, propertyKey, parameterIndex) => {
            const key = propertyKey as string | symbol;
            const parameters = Metadata.get<ParameterMetadata[]>(MetadataKeys.PARAMETER, target, key) ?? [];

            parameters.push({
                parameter,
                index: parameterIndex,
                name,
                propertyKey: key,
                target
            });

            Metadata.define(MetadataKeys.PARAMETER, parameters, target, key);
        };
    };
}
