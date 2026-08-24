import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';
import { HttpSession } from './http-session';
import { VersionDefinition } from '../version/version-definition';
import { ExecutionContext } from '@axisparkjs/engine';

/**
 * Represents the context of an HTTP request, including request, response, session, and version information. Extends the ExecutionContext from the engine module.
 */
export interface HttpContext extends ExecutionContext {
    request: HttpRequest;
    response: HttpResponse;
    session: HttpSession | undefined;
    version: VersionDefinition | undefined;
}
