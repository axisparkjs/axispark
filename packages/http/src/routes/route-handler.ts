import { HttpContext } from '../types/http-context';

export type RouteHandler = (context: Omit<HttpContext, 'transport' | 'scope'>) => void | Promise<void>;
