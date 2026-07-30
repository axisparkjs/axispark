import { Resolver } from '@axisparkjs/common';
import { ParameterMetadata } from './metadata/parameter-metadata';
import { ExecutionContext } from '../execution/execution-context';

export interface ParameterResolver<T> extends Resolver<T> {
    resolve(executionContext: ExecutionContext, parameterMetada: ParameterMetadata): T;
}
