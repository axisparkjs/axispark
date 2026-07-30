import { ExecutionContext } from '../../execution/execution-context';
import { ContextName } from '../decorators/context';
import { ParameterResolver } from '../parameter-resolver';
import { ParametersResolver } from '../parameters-resolver';

export class ContextResolver implements ParameterResolver<ExecutionContext> {
    resolve(executionContext: ExecutionContext) {
        return executionContext;
    }
}
ParametersResolver.register(ContextName, new ContextResolver());
