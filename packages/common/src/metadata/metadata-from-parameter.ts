import { MetadataFromMethod } from './metadata-from-method';

export interface MetadataFromParameter extends MetadataFromMethod {
    parameterIndex: number;
}
