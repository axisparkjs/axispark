import { FilteredError as ErrorParam, Filter, Catch, ExecutionTransport, StepPriority } from '@axisparkjs/engine';
import { HttpError } from '../errors';
import { HttpStatusCode } from '../../types/http-status-code';
import { ErrorHttpResult, HttpResults } from '../results';

@Filter({ global: true, transport: ExecutionTransport.Http, priority: StepPriority.Base })
export class ReturnErrorFilter {
    @Catch(Error)
    public async error(@ErrorParam() error: Error): Promise<ErrorHttpResult> {
        if (!(error instanceof HttpError)) {
            error = new HttpError(error.message, HttpStatusCode.InternalServerError);
        }
        return HttpResults.Error(error as HttpError);
    }
}
