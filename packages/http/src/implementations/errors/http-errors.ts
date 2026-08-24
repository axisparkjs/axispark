import { HttpStatusCode } from '../../types/http-status-code';

/**
 * A base class for HTTP errors.
 */
export class HttpError extends Error {
    public constructor(
        public readonly response: string,
        public readonly status: number,
        public readonly options?: { cause?: unknown; description?: string }
    ) {
        super(response);
        this.name = this.constructor.name;
    }
}

/**
 * An error thrown when the client sends a malformed request.
 */
export class BadRequestError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.BadRequest, options);
    }
}
/**
 * An error thrown when the client is not authorized to access the requested resource.
 */
export class UnauthorizedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.Unauthorized, options);
    }
}
/**
 * An error thrown when the client is forbidden from accessing the requested resource.
 */
export class PaymentRequiredError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.PaymentRequired, options);
    }
}
/**
 * An error thrown when the requested resource is not found.
 */
export class ForbiddenError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.Forbidden, options);
    }
}
/**
 * An error thrown when the requested resource is not found.
 */
export class NotFoundError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.NotFound, options);
    }
}
/**
 * An error thrown when the requested method is not allowed for the requested resource.
 */
export class MethodNotAllowedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.MethodNotAllowed, options);
    }
}
/**
 * An error thrown when the requested resource is not acceptable according to the Accept headers sent in the request.
 */
export class NotAcceptableError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.NotAcceptable, options);
    }
}
/**
 * An error thrown when the client must authenticate itself to get the requested response.
 */
export class ProxyAuthenticationRequiredError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.ProxyAuthenticationRequired, options);
    }
}
/** 
 * An error thrown when the server timed out waiting for the request.
 */
export class RequestTimeoutError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.RequestTimeout, options);
    }
}
/**
 * An error thrown when the request conflicts with the current state of the server.
 */
export class ConflictError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.Conflict, options);
    }
}
/**
 * An error thrown when the requested resource is no longer available.
 */
export class GoneError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.Gone, options);
    }
}
/**
 * An error thrown when the server requires the client to specify the length of the request body.
 */
export class LengthRequiredError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.LengthRequired, options);
    }
}
/**
 * An error thrown when the server returns a 412 Precondition Failed response.
 */
export class PreconditionFailedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.PreconditionFailed, options);
    }
}
/**
 * An error thrown when the server returns a 413 Payload Too Large response.
 */
export class PayloadTooLargeError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.PayloadTooLarge, options);
    }
}
/**
 * An error thrown when the server returns a 414 Uri Too Long response.
 */
export class UriTooLongError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.UriTooLong, options);
    }
}
/**
 * An error thrown when the server returns a 415 Unsupported Media Type response.
 */
export class UnsupportedMediaTypeError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.UnsupportedMediaType, options);
    }
}
/**
 * An error thrown when the server returns a 416 Requested Range Not Satisfiable response.
 */
export class RequestedRangeNotSatisfiableError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.RequestedRangeNotSatisfiable, options);
    }
}
/**
 * An error thrown when the server returns a 417 Expectation Failed response.
 */
export class ExpectationFailedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.ExpectationFailed, options);
    }
}
/**
 * An error thrown when the server returns a 418 I Am A Teapot response.
 */
export class IAmATeapotError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.IAmATeapot, options);
    }
}
/**
 * An error thrown when the server returns a 421 Misdirected Request response.
 */
export class MisdirectedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.Misdirected, options);
    }
}
/** 
 * An error thrown when the server returns a 422 Unprocessable Entity response.
 */
export class UnprocessableEntityError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.UnprocessableEntity, options);
    }
}
/**
 * An error thrown when the server returns a 423 Locked response.
 */
export class LockedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.Locked, options);
    }
}
/**
 * An error thrown when the server returns a 424 Failed Dependency response.
 */
export class FailedDependencyError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.FailedDependency, options);
    }
}
/**
 * An error thrown when the server returns a 428 Precondition Required response.
 */
export class PreconditionRequiredError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.PreconditionRequired, options);
    }
}
/**
 * An error thrown when the server returns a 429 Too Many Requests response.
 */
export class TooManyRequestsError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.TooManyRequests, options);
    }
}
/**
 * An error thrown when the server returns a 456 Unrecoverable Error response.
 */
export class UnrecoverableError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.UnrecoverableError, options);
    }
}
/**
 * An error thrown when the server returns a 500 Internal Server Error response.
 */
export class InternalServerError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.InternalServerError, options);
    }
}
/**
 * An error thrown when the server returns a 501 Not Implemented response.
 */
export class NotImplementedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.NotImplemented, options);
    }
}
/**
 * An error thrown when the server returns a 502 Bad Gateway response.
 */
export class BadGatewayError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.BadGateway, options);
    }
}
/**
 * An error thrown when the server returns a 503 Service Unavailable response.
 */
export class ServiceUnavailableError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.ServiceUnavailable, options);
    }
}
/**
 * An error thrown when the server returns a 504 Gateway Timeout response.
 */
export class GatewayTimeoutError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.GatewayTimeout, options);
    }
}
/**
 * An error thrown when the server returns a 505 HTTP Version Not Supported response.
 */
export class HttpVersionNotSupportedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.HttpVersionNotSupported, options);
    }
}
/**
 * An error thrown when the server returns a 507 Insufficient Storage response.
 */
export class InsufficientStorageError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.InsufficientStorage, options);
    }
}
/**
 * An error thrown when the server returns a 508 Loop Detected response.
 */
export class LoopDetectedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.LoopDetected, options);
    }
}
