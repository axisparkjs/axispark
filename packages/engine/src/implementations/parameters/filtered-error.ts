import { Parameter } from '../../decorators';
import { ExecutionContext } from '../../execution';
import { ParameterResolver, ParameterGenerator } from '../../parameter';

export const FilteredErrorName = 'filtered-error';
export const FilteredError = () => Parameter(FilteredErrorName);

export class FilteredErrorResolver implements ParameterResolver<Error> {
    resolve(executionContext: ExecutionContext) {
        return executionContext.error as Error;
    }
}

ParameterGenerator.registerParameter(FilteredErrorName, new FilteredErrorResolver());
