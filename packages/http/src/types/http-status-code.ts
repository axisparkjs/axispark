/**
 * Enumeration of HTTP status codes used in responses.
 */
export enum HttpStatusCode {
    Continue = 100,
    SwitchingProtocols = 101,
    Processing = 102,
    EarlyHints = 103,
    Ok = 200,
    Created = 201,
    Accepted = 202,
    NonAuthoritativeInformation = 203,
    NoContent = 204,
    ResetContent = 205,
    PartialContent = 206,
    MultiStatus = 207,
    AlreadyReported = 208,
    ContentDifferent = 210,
    Ambiguous = 300,
    MovedPermanently = 301,
    Found = 302,
    SeeOther = 303,
    NotModified = 304,
    TemporaryRedirect = 307,
    PermanentRedirect = 308,
    BadRequest = 400,
    Unauthorized = 401,
    PaymentRequired = 402,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    ProxyAuthenticationRequired = 407,
    RequestTimeout = 408,
    Conflict = 409,
    Gone = 410,
    LengthRequired = 411,
    PreconditionFailed = 412,
    PayloadTooLarge = 413,
    UriTooLong = 414,
    UnsupportedMediaType = 415,
    RequestedRangeNotSatisfiable = 416,
    ExpectationFailed = 417,
    IAmATeapot = 418,
    Misdirected = 421,
    UnprocessableEntity = 422,
    Locked = 423,
    FailedDependency = 424,
    PreconditionRequired = 428,
    TooManyRequests = 429,
    UnrecoverableError = 456,
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
    HttpVersionNotSupported = 505,
    InsufficientStorage = 507,
    LoopDetected = 508
}

export const defaultStatusCode = (method: string): HttpStatusCode => {
    switch (method.toUpperCase()) {
        case 'GET':
            return HttpStatusCode.Ok;
        case 'POST':
            return HttpStatusCode.Created;
        case 'PUT':
            return HttpStatusCode.Ok;
        case 'DELETE':
            return HttpStatusCode.NoContent;
        case 'PATCH':
            return HttpStatusCode.Ok;
        default:
            return HttpStatusCode.Ok;
    }
};
