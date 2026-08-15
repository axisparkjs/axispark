import { ExecutionContext } from './execution-context';
import { CatchStepDefinition, AfterStepDefinition, BeforeStepDefinition, CheckStepDefinition, HandleStepDefinition } from '../step';
import { TimeoutDefinition } from '../timeout';

export interface ExecutionPlan {
    before: (HandleStepDefinition | CheckStepDefinition | BeforeStepDefinition)[];
    context: ExecutionContext;
    after: AfterStepDefinition[];
    catch: CatchStepDefinition[];
    timeout: TimeoutDefinition | undefined;
}
