import { Resolver } from '@axisparkjs/common';
import { ParameterDefinition } from './parameter-definition';
import { ExecutionContext } from '../execution/execution-context';

export interface ParameterResolver<T> extends Resolver<T> {
    resolve(executionContext: ExecutionContext, parameter: ParameterDefinition): T;
}
