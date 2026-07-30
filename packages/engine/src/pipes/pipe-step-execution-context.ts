import { ExecutionContext } from '../execution/execution-context';

export interface PipeStepExecutionContext extends ExecutionContext {
    parameter: string | symbol;
    index: number;
    originalValue: unknown;
}
