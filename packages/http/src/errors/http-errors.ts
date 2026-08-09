import { HttpStatusCode } from '../types/http-status-code';

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

export class BadRequestError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.BadRequest, options);
    }
}
export class UnauthorizedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.Unauthorized, options);
    }
}
export class PaymentRequiredError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.PaymentRequired, options);
    }
}
export class ForbiddenError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.Forbidden, options);
    }
}
export class NotFoundError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.NotFound, options);
    }
}
export class MethodNotAllowedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.MethodNotAllowed, options);
    }
}
export class NotAcceptableError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.NotAcceptable, options);
    }
}
export class ProxyAuthenticationRequiredError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.ProxyAuthenticationRequired, options);
    }
}
export class RequestTimeoutError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.RequestTimeout, options);
    }
}
export class ConflictError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.Conflict, options);
    }
}
export class GoneError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.Gone, options);
    }
}
export class LengthRequiredError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.LengthRequired, options);
    }
}
export class PreconditionFailedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.PreconditionFailed, options);
    }
}
export class PayloadTooLargeError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.PayloadTooLarge, options);
    }
}
export class UriTooLongError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.UriTooLong, options);
    }
}
export class UnsupportedMediaTypeError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.UnsupportedMediaType, options);
    }
}
export class RequestedRangeNotSatisfiableError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.RequestedRangeNotSatisfiable, options);
    }
}
export class ExpectationFailedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.ExpectationFailed, options);
    }
}
export class IAmATeapotError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.IAmATeapot, options);
    }
}
export class MisdirectedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.Misdirected, options);
    }
}
export class UnprocessableEntityError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.UnprocessableEntity, options);
    }
}
export class LockedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.Locked, options);
    }
}
export class FailedDependencyError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.FailedDependency, options);
    }
}
export class PreconditionRequiredError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.PreconditionRequired, options);
    }
}
export class TooManyRequestsError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.TooManyRequests, options);
    }
}
export class UnrecoverableError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.UnrecoverableError, options);
    }
}
export class InternalServerError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.InternalServerError, options);
    }
}
export class NotImplementedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.NotImplemented, options);
    }
}
export class BadGatewayError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.BadGateway, options);
    }
}
export class ServiceUnavailableError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.ServiceUnavailable, options);
    }
}
export class GatewayTimeoutError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.GatewayTimeout, options);
    }
}
export class HttpVersionNotSupportedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.HttpVersionNotSupported, options);
    }
}
export class InsufficientStorageError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.InsufficientStorage, options);
    }
}
export class LoopDetectedError extends HttpError {
    constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, HttpStatusCode.LoopDetected, options);
    }
}
