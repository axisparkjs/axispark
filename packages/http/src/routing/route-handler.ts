import { HttpContext } from '../types/http-context';

export type RouteHandler = (context: HttpContext) => unknown | Promise<unknown>;
