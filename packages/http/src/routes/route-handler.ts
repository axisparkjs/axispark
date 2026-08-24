import { HttpContext } from '../types/http-context';

/**
 * A type representing a route handler function.
 * @param context The HTTP context containing request, response, and session information.
 * @returns A promise that resolves when the route handling is complete.
 */
export type RouteHandler = (context: Pick<HttpContext, 'request' | 'response' | 'session'>) => void | Promise<void>;
