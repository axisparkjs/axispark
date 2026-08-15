import { MetadataFromMethod } from '@axisparkjs/common';
import { HttpStatusCode } from '../types/http-status-code';

export interface HttpCodeMetadata extends MetadataFromMethod {
    statusCode: HttpStatusCode;
}
