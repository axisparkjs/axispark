import { ExecutionContext } from '../execution/execution-context';

export interface PipeExecutionContext extends ExecutionContext {
    args: any[];
}
