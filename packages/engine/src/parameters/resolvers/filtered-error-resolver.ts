import { ExecutionContext } from '../../execution/execution-context';
import { FilteredErrorName } from '../decorators/filtered-error';
import { ParameterResolver } from '../parameter-resolver';
import { ParametersResolver } from '../parameters-resolver';

export class FilteredErrorResolver implements ParameterResolver<Error> {
    resolve(executionContext: ExecutionContext) {
        return executionContext.error as Error;
    }
}
ParametersResolver.register(FilteredErrorName, new FilteredErrorResolver());
