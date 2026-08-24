import { Resolver } from '@axisparkjs/common';
import { ParameterDefinition } from './parameter-definition';
import { ExecutionContext } from '../execution/execution-context';

/**
 * An interface for resolving parameter values based on the execution context.
 */
export interface ParameterResolver<T> extends Resolver<T> {
    /**
     * Resolves the value of a parameter based on the provided execution context and parameter definition.
     * @param executionContext The execution context containing relevant information for parameter resolution.
     * @param parameter The parameter definition that provides metadata and context for resolution.
     * @returns The resolved value of the parameter.
     */
    resolve(executionContext: ExecutionContext, parameter: ParameterDefinition): T;
}