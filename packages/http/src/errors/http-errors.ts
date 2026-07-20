import { HttpStatus } from './http-error-code';

export class HttpError extends Error {
    public constructor(
        public readonly response: string,
        public readonly status: number,
        public readonly options?: { cause?: unknown; description?: string }
    ) {
        super(response);
    }
}
export type ErrorClass<T extends Error = Error> = new (...args: any[]) => T;

export class BadRequestError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.BAD_REQUEST, options);
    }
}
export class UnauthorizedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.UNAUTHORIZED, options);
    }
}
export class PaymentRequiredError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.PAYMENT_REQUIRED, options);
    }
}
export class ForbiddenError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.FORBIDDEN, options);
    }
}
export class NotFoundError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.NOT_FOUND, options);
    }
}
export class MethodNotAllowedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.METHOD_NOT_ALLOWED, options);
    }
}
export class NotAcceptableError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.NOT_ACCEPTABLE, options);
    }
}
export class ProxyAuthenticationRequiredError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.PROXY_AUTHENTICATION_REQUIRED, options);
    }
}
export class RequestTimeoutError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.REQUEST_TIMEOUT, options);
    }
}
export class ConflictError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.CONFLICT, options);
    }
}
export class GoneError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.GONE, options);
    }
}
export class LengthRequiredError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.LENGTH_REQUIRED, options);
    }
}
export class PreconditionFailedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.PRECONDITION_FAILED, options);
    }
}
export class PayloadTooLargeError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.PAYLOAD_TOO_LARGE, options);
    }
}
export class UriTooLongError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.URI_TOO_LONG, options);
    }
}
export class UnsupportedMediaTypeError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.UNSUPPORTED_MEDIA_TYPE, options);
    }
}
export class RequestedRangeNotSatisfiableError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE, options);
    }
}
export class ExpectationFailedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.EXPECTATION_FAILED, options);
    }
}
export class IAmATeapotError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.I_AM_A_TEAPOT, options);
    }
}
export class MisdirectedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.MISDIRECTED, options);
    }
}
export class UnprocessableEntityError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.UNPROCESSABLE_ENTITY, options);
    }
}
export class LockedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.LOCKED, options);
    }
}
export class FailedDependencyError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.FAILED_DEPENDENCY, options);
    }
}
export class PreconditionRequiredError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.PRECONDITION_REQUIRED, options);
    }
}
export class TooManyRequestsError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.TOO_MANY_REQUESTS, options);
    }
}
export class UnrecoverableError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.UNRECOVERABLE_ERROR, options);
    }
}
export class InternalServerError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.INTERNAL_SERVER_ERROR, options);
    }
}
export class NotImplementedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.NOT_IMPLEMENTED, options);
    }
}
export class BadGatewayError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.BAD_GATEWAY, options);
    }
}
export class ServiceUnavailableError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.SERVICE_UNAVAILABLE, options);
    }
}
export class GatewayTimeoutError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.GATEWAY_TIMEOUT, options);
    }
}
export class HttpVersionNotSupportedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.HTTP_VERSION_NOT_SUPPORTED, options);
    }
}
export class InsufficientStorageError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.INSUFFICIENT_STORAGE, options);
    }
}
export class LoopDetectedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatus.LOOP_DETECTED, options);
    }
}
