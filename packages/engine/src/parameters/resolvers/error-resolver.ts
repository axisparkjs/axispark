import { ExecutionContext } from '../../execution/execution-context';
import { ErrorName } from '../decorators/error';
import { ParameterResolver } from '../parameter-resolver';
import { ParametersResolver } from '../parameters-resolver';

export class ErrorResolver implements ParameterResolver<Error> {
    resolve(executionContext: ExecutionContext) {
        return executionContext.error as Error;
    }
}
ParametersResolver.register(ErrorName, new ErrorResolver());
