import { Parameter } from '../../decorators';
import { ExecutionContext } from '../../execution';
import { ParameterResolver, ParameterGenerator } from '../../parameter';

export const ContextName = 'context';
export const Context = () => Parameter(ContextName);

export class ContextResolver implements ParameterResolver<ExecutionContext> {
    resolve(executionContext: ExecutionContext) {
        return executionContext;
    }
}

ParameterGenerator.registerParameter(ContextName, new ContextResolver());
