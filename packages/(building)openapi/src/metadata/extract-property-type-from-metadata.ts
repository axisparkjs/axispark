import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { ClassType } from '@axisparkjs/di';

type ExtractedType = typeof Object | typeof Array | typeof String | typeof Number | typeof Boolean | typeof Date;

export function extractTypeFromMetadata(
    target: object,
    propertyKey: string | symbol,
    param?: number
): 'string' | 'number' | 'integer' | 'boolean' | 'null' | 'array' | ClassType {
    const metaType = Metadata.getProperty<ExtractedType>(MetadataKeys.DESIGN_TYPE, target, propertyKey);
    const types = Metadata.getProperty<ExtractedType[]>(MetadataKeys.DESIGN_PARAM_TYPES, target, propertyKey) || [];

    let finalType: 'string' | 'number' | 'integer' | 'boolean' | 'null' | ClassType | 'array';
    const toSearchType = param !== undefined ? types[param] : metaType;
    switch (toSearchType) {
        case Array:
        case String:
            finalType = 'string';
            break;
        case Number:
            finalType = 'number';
            break;
        case Boolean:
            finalType = 'boolean';
            break;
        default:
            finalType = toSearchType as ClassType;
            break;
    }
    return finalType;
}
