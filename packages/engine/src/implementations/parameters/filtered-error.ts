import { Parameter } from '../../decorators';
import { ExecutionContext } from '../../execution';
import { ParameterResolver, ParameterGenerator } from '../../parameter';

export const FilteredErrorName = 'filtered-error';
/**
 * A decorator for injecting the filtered error into a method parameter. It uses the `Parameter` decorator to define the parameter with the name 'filtered-error'. This allows the decorated method to receive the filtered error from the execution context as an argument, enabling access to the error object within the method.
 * @returns A parameter decorator that injects the filtered error.
 */
export const FilteredError = () => Parameter(FilteredErrorName);

export class FilteredErrorResolver implements ParameterResolver<Error> {
    resolve(executionContext: ExecutionContext) {
        return executionContext.error as Error;
    }
}

ParameterGenerator.registerParameter(FilteredErrorName, new FilteredErrorResolver());
