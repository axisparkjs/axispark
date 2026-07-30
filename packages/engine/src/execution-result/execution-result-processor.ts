import { ExecutionContext } from '../execution/execution-context';
import { ExecutionHandler } from '../execution/execution-handler';

export interface ExecutionResultProcessor {
    process(context: ExecutionContext, handler: ExecutionHandler, result: unknown): Promise<void>;
}
