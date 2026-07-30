import {
    HttpError,
    BadRequestError,
    UnauthorizedError,
    PaymentRequiredError,
    ForbiddenError,
    NotFoundError,
    MethodNotAllowedError,
    NotAcceptableError,
    ProxyAuthenticationRequiredError,
    RequestTimeoutError,
    ConflictError,
    GoneError,
    LengthRequiredError,
    PreconditionFailedError,
    PayloadTooLargeError,
    UriTooLongError,
    UnsupportedMediaTypeError,
    RequestedRangeNotSatisfiableError,
    ExpectationFailedError,
    IAmATeapotError,
    MisdirectedError,
    UnprocessableEntityError,
    LockedError,
    FailedDependencyError,
    PreconditionRequiredError,
    TooManyRequestsError,
    UnrecoverableError,
    InternalServerError,
    NotImplementedError,
    BadGatewayError,
    ServiceUnavailableError,
    GatewayTimeoutError,
    HttpVersionNotSupportedError,
    InsufficientStorageError,
    LoopDetectedError
} from './http-errors';
import { HttpStatusCode } from '../types/http-status-code';

describe('HttpError', () => {
    it('should create an HttpError', () => {
        const options = {
            cause: new Error('cause'),
            description: 'description'
        };

        const error = new HttpError('message', HttpStatusCode.BadRequest, options);

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HttpError);
        expect(error.message).toBe('message');
        expect(error.response).toBe('message');
        expect(error.status).toBe(HttpStatusCode.BadRequest);
        expect(error.options).toBe(options);
    });
});

describe('HTTP errors', () => {
    it.each([
        [BadRequestError, HttpStatusCode.BadRequest],
        [UnauthorizedError, HttpStatusCode.Unauthorized],
        [PaymentRequiredError, HttpStatusCode.PaymentRequired],
        [ForbiddenError, HttpStatusCode.Forbidden],
        [NotFoundError, HttpStatusCode.NotFound],
        [MethodNotAllowedError, HttpStatusCode.MethodNotAllowed],
        [NotAcceptableError, HttpStatusCode.NotAcceptable],
        [ProxyAuthenticationRequiredError, HttpStatusCode.ProxyAuthenticationRequired],
        [RequestTimeoutError, HttpStatusCode.RequestTimeout],
        [ConflictError, HttpStatusCode.Conflict],
        [GoneError, HttpStatusCode.Gone],
        [LengthRequiredError, HttpStatusCode.LengthRequired],
        [PreconditionFailedError, HttpStatusCode.PreconditionFailed],
        [PayloadTooLargeError, HttpStatusCode.PayloadTooLarge],
        [UriTooLongError, HttpStatusCode.UriTooLong],
        [UnsupportedMediaTypeError, HttpStatusCode.UnsupportedMediaType],
        [RequestedRangeNotSatisfiableError, HttpStatusCode.RequestedRangeNotSatisfiable],
        [ExpectationFailedError, HttpStatusCode.ExpectationFailed],
        [IAmATeapotError, HttpStatusCode.IAmATeapot],
        [MisdirectedError, HttpStatusCode.Misdirected],
        [UnprocessableEntityError, HttpStatusCode.UnprocessableEntity],
        [LockedError, HttpStatusCode.Locked],
        [FailedDependencyError, HttpStatusCode.FailedDependency],
        [PreconditionRequiredError, HttpStatusCode.PreconditionRequired],
        [TooManyRequestsError, HttpStatusCode.TooManyRequests],
        [UnrecoverableError, HttpStatusCode.UnrecoverableError],
        [InternalServerError, HttpStatusCode.InternalServerError],
        [NotImplementedError, HttpStatusCode.NotImplemented],
        [BadGatewayError, HttpStatusCode.BadGateway],
        [ServiceUnavailableError, HttpStatusCode.ServiceUnavailable],
        [GatewayTimeoutError, HttpStatusCode.GatewayTimeout],
        [HttpVersionNotSupportedError, HttpStatusCode.HttpVersionNotSupported],
        [InsufficientStorageError, HttpStatusCode.InsufficientStorage],
        [LoopDetectedError, HttpStatusCode.LoopDetected],
    ])('should create %p', (ErrorClass, status) => {
        const options = {
            cause: new Error(),
            description: 'description'
        };

        const error = new ErrorClass('message', options);

        expect(error).toBeInstanceOf(HttpError);
        expect(error.message).toBe('message');
        expect(error.response).toBe('message');
        expect(error.status).toBe(status);
        expect(error.options).toBe(options);
    });
});