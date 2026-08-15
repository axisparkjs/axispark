import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { HttpResultResolver } from './http-result-resolver';
import { BodyHttpResult } from './http-result';
import {
    defaultStatusCode,
    HttpStatusCode,
    HttpMethod
} from '../../types';
import { HttpContext } from '../../types/http-context';
import { RouteMetadata } from '../../metadata/route-metadata';

jest.mock('@axisparkjs/common', () => {
    const originalModule = jest.requireActual('@axisparkjs/common');

    return {
        ...originalModule,
        Metadata: {
            ...originalModule.Metadata,
            get: jest.fn(),
            normalizeTarget: jest.fn((target) => target),
            define: jest.fn()
        }
    };
});

jest.mock('../../types', () => {
    const originalModule = jest.requireActual('../../types');

    return {
        ...originalModule,
        defaultStatusCode: jest.fn()
    };
});

jest.mock('./http-result', () => {
    const originalModule = jest.requireActual('./http-result');

    return {
        ...originalModule,
        BodyHttpResult: jest.fn()
    };
});

describe('HttpResultResolver', () => {
    let resolver: HttpResultResolver;

    beforeEach(() => {
        jest.clearAllMocks();

        resolver = new HttpResultResolver();
    });

    it('should use the HTTP_CODE metadata when present', async () => {
        const result = { ok: true };
        const route = {
            target: {},
            propertyKey: 'index',
            method: HttpMethod.Get,
            path: '/users',
            version: undefined
        } as RouteMetadata;

        const context = {
            target: route.target,
            propertyKey: route.propertyKey
        } as HttpContext;

        (Metadata.get as jest.Mock)
            .mockReturnValueOnce(route)
            .mockReturnValueOnce({statusCode: HttpStatusCode.Created});

        const bodyResult = {} as BodyHttpResult;

        (BodyHttpResult as jest.Mock).mockReturnValue(bodyResult);

        const resolved = resolver.resolve(result, context);

        expect(Metadata.get).toHaveBeenNthCalledWith(
            1,
            MetadataKeys.ROUTE,
            context.target,
            context.propertyKey
        );

        expect(Metadata.get).toHaveBeenNthCalledWith(
            2,
            MetadataKeys.HTTP_CODE,
            context.target,
            context.propertyKey
        );

        expect(defaultStatusCode).not.toHaveBeenCalled();

        expect(BodyHttpResult).toHaveBeenCalledWith(
            result,
            HttpStatusCode.Created
        );

        expect(resolved).toBe(bodyResult);
    });

    it('should use the default status code when HTTP_CODE is not defined', async () => {
        const result = { ok: true };
        const route = {
            target: {},
            propertyKey: 'index',
            method: HttpMethod.Post,
            path: '/users',
            version: undefined
        } as RouteMetadata;

        const context = {
            target: route.target,
            propertyKey: route.propertyKey
        } as HttpContext;

        (Metadata.get as jest.Mock)
            .mockReturnValueOnce(route)
            .mockReturnValueOnce(undefined);

        (defaultStatusCode as jest.Mock).mockReturnValue(
            HttpStatusCode.Created
        );

        const bodyResult = {} as BodyHttpResult;

        (BodyHttpResult as jest.Mock).mockReturnValue(bodyResult);

        const resolved = resolver.resolve(result, context);

        expect(Metadata.get).toHaveBeenNthCalledWith(
            1,
            MetadataKeys.ROUTE,
            context.target,
            context.propertyKey
        );

        expect(Metadata.get).toHaveBeenNthCalledWith(
            2,
            MetadataKeys.HTTP_CODE,
            context.target,
            context.propertyKey
        );

        expect(defaultStatusCode).toHaveBeenCalledWith(
            HttpMethod.Post
        );

        expect(BodyHttpResult).toHaveBeenCalledWith(
            result,
            HttpStatusCode.Created
        );

        expect(resolved).toBe(bodyResult);
    });

    it('should resolve the result using the route method', async () => {
        const result = 'hello';

        const route = {
            target: {},
            propertyKey: 'index',
            method: HttpMethod.Get,
            path: '/users',
            version: undefined
        } as RouteMetadata;

        const context = {
            target: route.target,
            propertyKey: route.propertyKey
        } as HttpContext;

        (Metadata.get as jest.Mock)
            .mockReturnValueOnce(route)
            .mockReturnValueOnce(undefined);

        (defaultStatusCode as jest.Mock).mockReturnValue(
            HttpStatusCode.Ok
        );

        const bodyResult = {} as BodyHttpResult;

        (BodyHttpResult as jest.Mock).mockReturnValue(bodyResult);

        expect(
            resolver.resolve(result, context)
        ).toBe(bodyResult);

        expect(BodyHttpResult).toHaveBeenCalledWith(
            result,
            HttpStatusCode.Ok
        );
    });
});