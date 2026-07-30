import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Get, Post, Delete, Put, Patch, Head, Options } from './route-methods';
import { HttpMethod } from '../types/http-method';

jest.mock('@axisparkjs/common', () => {
    const originalModule = jest.requireActual('@axisparkjs/common');

    return {
        ...originalModule,
        Metadata: {
            ...originalModule.Metadata,
            get: jest.fn(),
            define: jest.fn()
        }
    };
});

describe('Method decorators', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should define a new GET route when no routes exist', () => {
        (Metadata.get as jest.Mock).mockReturnValue(undefined);

        class TestController {
            index() {}
        }

        Get('/users')(
            TestController.prototype,
            'index',
            Object.getOwnPropertyDescriptor(TestController.prototype, 'index') as PropertyDescriptor
        );

        expect(Metadata.get).toHaveBeenCalledWith(
            MetadataKeys.ROUTE,
            TestController.prototype
        );

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.ROUTE,
            [
                {
                    method: HttpMethod.GET,
                    path: '/users',
                    propertyKey: 'index'
                }
            ],
            TestController.prototype
        );
    });

    it('should append a route to the existing routes', () => {
        const routes = [
            {
                method: HttpMethod.POST,
                path: '/users',
                propertyKey: 'create'
            }
        ];

        (Metadata.get as jest.Mock).mockReturnValue(routes);

        class TestController {
            update() {}
        }

        Put('/:id')(
            TestController.prototype,
            'update',
            Object.getOwnPropertyDescriptor(TestController.prototype, 'update') as PropertyDescriptor
        );

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.ROUTE,
            [
                {
                    method: HttpMethod.POST,
                    path: '/users',
                    propertyKey: 'create'
                },
                {
                    method: HttpMethod.PUT,
                    path: '/:id',
                    propertyKey: 'update'
                }
            ],
            TestController.prototype
        );
    });

    it.each([
        [Delete, HttpMethod.DELETE],
        [Get, HttpMethod.GET],
        [Head, HttpMethod.HEAD],
        [Options, HttpMethod.OPTIONS],
        [Patch, HttpMethod.PATCH],
        [Post, HttpMethod.POST],
        [Put, HttpMethod.PUT]
    ])('should create a %s route', (decorator, method) => {
        (Metadata.get as jest.Mock).mockReturnValue(undefined);

        class TestController {
            handler() {}
        }

        decorator()(
            TestController.prototype,
            'handler',
            Object.getOwnPropertyDescriptor(TestController.prototype, 'handler') as PropertyDescriptor
        );

        expect(Metadata.define).toHaveBeenLastCalledWith(
            MetadataKeys.ROUTE,
            [
                {
                    method,
                    path: '',
                    propertyKey: 'handler'
                }
            ],
            TestController.prototype
        );
    });
});