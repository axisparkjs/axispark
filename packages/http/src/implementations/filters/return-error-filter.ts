import { FilteredError as ErrorParam, Filter, Catch, ExecutionTransport, StepPriority } from '@axisparkjs/engine';
import { HttpError } from '../errors';
import { HttpStatusCode } from '../../types/http-status-code';
import { ErrorHttpResult, HttpResults } from '../results';

/**
 * A global filter for returning errors as HTTP responses.
 */
@Filter({ global: true, transport: ExecutionTransport.Http, priority: StepPriority.Base })
export class ReturnErrorFilter {
    /**
     * Handles errors by returning them as HTTP responses.
     * @param error The error to handle.
     * @returns A promise resolving to an ErrorHttpResult.
     */
    @Catch(Error)
    public async error(@ErrorParam() error: Error): Promise<ErrorHttpResult> {
        if (!(error instanceof HttpError)) {
            error = new HttpError(error.message, HttpStatusCode.InternalServerError);
        }
        return HttpResults.Error(error as HttpError);
    }
}
