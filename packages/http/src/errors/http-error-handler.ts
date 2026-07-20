import { HttpContext } from '../types';
import { HttpError } from './http-errors';

export class HttpErrorHandlerStatic {
    handle(error: unknown, context: HttpContext) {
        if (error instanceof HttpError) context.response.status(error.status).json({ status: error.status, message: error.message });
        else if (error instanceof Error) context.response.status(500).send({ status: 500, message: 'Internal Server Error' });
        else context.response.status(500).send({ status: 500, message: 'An unknown error occurred' });
    }
}
export const HttpErrorHandler = new HttpErrorHandlerStatic();
