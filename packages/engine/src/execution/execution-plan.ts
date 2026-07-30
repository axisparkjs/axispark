import { ExecutionHandler } from './execution-handler';
import { ErrorClass } from '../execution-steps/types';

export interface ExecutionPlan {
    before: ExecutionHandler[];
    handler: ExecutionHandler;
    after: ExecutionHandler[];
    filters: { executionHandler: ExecutionHandler; acceptedErrors: ErrorClass[] }[];
}
