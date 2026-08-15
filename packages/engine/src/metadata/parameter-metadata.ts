import { MetadataFromParameter } from '@axisparkjs/common';

export interface ParameterMetadata extends MetadataFromParameter {
    parameter: string;
    field?: string;
}
