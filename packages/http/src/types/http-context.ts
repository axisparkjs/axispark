import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export interface HttpContext {
    request: HttpRequest;
    response: HttpResponse;
}
