import { FilteredError as ErrorParam, Filter, Catch, ExecutionTransport, ExecutionPriority } from '@axisparkjs/engine';
import { ErrorHttpResult } from '../execution-results';
import { HttpError } from '../errors';
import { HttpStatusCode } from '../types/http-status-code';
import { HttpResults } from '../execution-results/http-results';

@Filter({ global: true, transport: ExecutionTransport.Http, priority: ExecutionPriority.Base })
export class ReturnErrorFilter {
    @Catch(Error)
    public async error(@ErrorParam() error: Error): Promise<ErrorHttpResult> {
        if (!(error instanceof HttpError)) {
            error = new HttpError(error.message, HttpStatusCode.InternalServerError);
        }
        return HttpResults.Error(error as HttpError);
    }
}
