import { Parameter } from '../../decorators';
import { ExecutionContext } from '../../execution';
import { ParameterResolver, ParameterGenerator } from '../../parameter';

export const ContextName = 'context';
/**
 * A decorator for injecting the execution context into a method parameter. It uses the `Parameter` decorator to define the parameter with the name 'context'. This allows the decorated method to receive the current execution context as an argument, enabling access to properties such as error, transport, and scopedContainer within the method.
 * @returns A parameter decorator that injects the execution context.
 */
export const Context = () => Parameter(ContextName);

export class ContextResolver implements ParameterResolver<ExecutionContext> {
    resolve(executionContext: ExecutionContext) {
        return executionContext;
    }
}

ParameterGenerator.registerParameter(ContextName, new ContextResolver());
