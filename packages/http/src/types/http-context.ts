import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';
import { HttpSession } from './http-session';
import { VersionDefinition } from '../version/version-definition';
import { ExecutionContext } from '@axisparkjs/engine';

export interface HttpContext extends ExecutionContext {
    request: HttpRequest;
    response: HttpResponse;
    session: HttpSession | undefined;
    version: VersionDefinition | undefined;
}
