import { HttpContext } from '../types/http-context';

export type RouteHandler = (context: Pick<HttpContext, 'request' | 'response' | 'session'>) => void | Promise<void>;
