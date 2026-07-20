import { HttpContext } from '../types/http-context';

export type CatchHandler = (error: any, context: HttpContext) => void;
