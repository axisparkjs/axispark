import { Metadata, MetadataKeys } from '@axisparkjs/common';
import {
    Get,
    Post,
    Delete,
    Put,
    Patch,
    Head,
    Options
} from './route-methods';
import { HttpMethod } from '../types/http-method';

jest.mock('@axisparkjs/common', () => {
    const originalModule = jest.requireActual('@axisparkjs/common');

    return {
        ...originalModule,
        Metadata: {
            ...originalModule.Metadata,
            get: jest.fn(),
            define: jest.fn(),
            normalizeTarget: jest.fn()
        }
    };
});

describe('Method decorators', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (Metadata.normalizeTarget as jest.Mock).mockImplementation(
            (target) => target
        );
    });

    it('should define a new GET route when no routes exist', () => {
        (Metadata.get as jest.Mock).mockReturnValue(undefined);

        class TestController {
            index() {}
        }

        Get('/users')(
            TestController.prototype,
            'index',
            Object.getOwnPropertyDescriptor(
                TestController.prototype,
                'index'
            ) as PropertyDescriptor
        );

        const expectedRoute = {
            target: TestController.prototype,
            method: HttpMethod.Get,
            path: '/users',
            propertyKey: 'index',
            version: undefined
        };

        expect(Metadata.get).toHaveBeenCalledWith(
            MetadataKeys.ROUTE,
            TestController.prototype
        );

        expect(Metadata.define).toHaveBeenNthCalledWith(
            1,
            MetadataKeys.ROUTE,
            [expectedRoute],
            TestController.prototype
        );

        expect(Metadata.define).toHaveBeenNthCalledWith(
            2,
            MetadataKeys.ROUTE,
            expectedRoute,
            TestController.prototype,
            'index'
        );

        expect(Metadata.define).toHaveBeenCalledTimes(2);
    });

    it('should append a route to the existing routes', () => {
        const existingRoute = {
            target: {} as any,
            method: HttpMethod.Post,
            path: '/users',
            propertyKey: 'create',
            version: undefined
        };

        (Metadata.get as jest.Mock).mockReturnValue([existingRoute]);

        class TestController {
            create() {}
            update() {}
        }

        Put('/:id')(
            TestController.prototype,
            'update',
            Object.getOwnPropertyDescriptor(
                TestController.prototype,
                'update'
            ) as PropertyDescriptor
        );

        const expectedRoute = {
            target: TestController.prototype,
            method: HttpMethod.Put,
            path: '/:id',
            propertyKey: 'update',
            version: undefined
        };

        expect(Metadata.define).toHaveBeenNthCalledWith(
            1,
            MetadataKeys.ROUTE,
            [
                existingRoute,
                expectedRoute
            ],
            TestController.prototype
        );

        expect(Metadata.define).toHaveBeenNthCalledWith(
            2,
            MetadataKeys.ROUTE,
            expectedRoute,
            TestController.prototype,
            'update'
        );

        expect(Metadata.define).toHaveBeenCalledTimes(2);
    });

    it.each([
        [Delete, HttpMethod.Delete],
        [Get, HttpMethod.Get],
        [Head, HttpMethod.Head],
        [Options, HttpMethod.Options],
        [Patch, HttpMethod.Patch],
        [Post, HttpMethod.Post],
        [Put, HttpMethod.Put]
    ])('should create a %s route', (decorator, method) => {
        (Metadata.get as jest.Mock).mockReturnValue(undefined);

        class TestController {
            handler() {}
        }

        decorator()(
            TestController.prototype,
            'handler',
            Object.getOwnPropertyDescriptor(
                TestController.prototype,
                'handler'
            ) as PropertyDescriptor
        );

        const expectedRoute = {
            target: TestController.prototype,
            method,
            path: '',
            propertyKey: 'handler',
            version: undefined
        };

        expect(Metadata.define).toHaveBeenNthCalledWith(
            1,
            MetadataKeys.ROUTE,
            [expectedRoute],
            TestController.prototype
        );

        expect(Metadata.define).toHaveBeenNthCalledWith(
            2,
            MetadataKeys.ROUTE,
            expectedRoute,
            TestController.prototype,
            'handler'
        );
    });

    it('should define the route with a version', () => {
        (Metadata.get as jest.Mock).mockReturnValue(undefined);

        class TestController {
            index() {}
        }

        Get({
            path: '/users',
            version: '1'
        })(
            TestController.prototype,
            'index',
            Object.getOwnPropertyDescriptor(
                TestController.prototype,
                'index'
            ) as PropertyDescriptor
        );

        const expectedRoute = {
            target: TestController.prototype,
            method: HttpMethod.Get,
            path: '/users',
            propertyKey: 'index',
            version: '1'
        };

        expect(Metadata.define).toHaveBeenNthCalledWith(
            1,
            MetadataKeys.ROUTE,
            [expectedRoute],
            TestController.prototype
        );

        expect(Metadata.define).toHaveBeenNthCalledWith(
            2,
            MetadataKeys.ROUTE,
            expectedRoute,
            TestController.prototype,
            'index'
        );
    });

    it('should use the normalized target in the route metadata', () => {
        (Metadata.get as jest.Mock).mockReturnValue(undefined);

        const normalizedTarget = {};

        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(
            normalizedTarget
        );

        class TestController {
            index() {}
        }

        Get('/users')(
            TestController.prototype,
            'index',
            Object.getOwnPropertyDescriptor(
                TestController.prototype,
                'index'
            ) as PropertyDescriptor
        );

        const expectedRoute = {
            target: normalizedTarget,
            method: HttpMethod.Get,
            path: '/users',
            propertyKey: 'index',
            version: undefined
        };

        expect(Metadata.normalizeTarget).toHaveBeenCalledWith(
            TestController.prototype
        );

        expect(Metadata.define).toHaveBeenNthCalledWith(
            1,
            MetadataKeys.ROUTE,
            [expectedRoute],
            TestController.prototype
        );

        expect(Metadata.define).toHaveBeenNthCalledWith(
            2,
            MetadataKeys.ROUTE,
            expectedRoute,
            TestController.prototype,
            'index'
        );
    });
});