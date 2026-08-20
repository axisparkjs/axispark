import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { OpenApiDefaultResponse, OpenApiResponse } from './openapi-response';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        get: jest.fn(),
        normalizeTarget: jest.fn(),
        define: jest.fn()
    },
    MetadataKeys: {
        OPENAPI_RESPONSE: 'OPENAPI_RESPONSE'
    }
}));

describe('OpenApiResponse', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (Metadata.get as jest.Mock).mockReturnValue(undefined);
        (Metadata.normalizeTarget as jest.Mock).mockImplementation((target) => target);
    });

    describe('decorator factory', () => {
        it('should return a method decorator', () => {
            const decorator = OpenApiResponse(200);

            expect(decorator).toEqual(expect.any(Function));
        });

        it.each([100, 200, 201, 204, 400, 401, 403, 404, 500])('should accept numeric status code %s', (statusCode) => {
            const target = {};
            const propertyKey = 'getUsers';

            const decorator = OpenApiResponse(statusCode);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.OPENAPI_RESPONSE,
                [
                    {
                        target,
                        propertyKey,
                        statusCode
                    }
                ],
                target,
                propertyKey
            );
        });

        it('should accept the default status code', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const decorator = OpenApiResponse('default');

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.OPENAPI_RESPONSE,
                [
                    {
                        target,
                        propertyKey,
                        statusCode: 'default'
                    }
                ],
                target,
                propertyKey
            );
        });
    });

    describe('decorator execution', () => {
        it('should retrieve metadata using target and propertyKey', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const decorator = OpenApiResponse(200);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(Metadata.get).toHaveBeenCalledTimes(1);
            expect(Metadata.get).toHaveBeenCalledWith(MetadataKeys.OPENAPI_RESPONSE, target, propertyKey);
        });

        it('should normalize the target', () => {
            const target = {};
            const normalizedTarget = {};

            (Metadata.normalizeTarget as jest.Mock).mockReturnValue(normalizedTarget);

            const decorator = OpenApiResponse(200);

            decorator(target, 'getUsers', {} as PropertyDescriptor);

            expect(Metadata.normalizeTarget).toHaveBeenCalledTimes(1);
            expect(Metadata.normalizeTarget).toHaveBeenCalledWith(target);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.OPENAPI_RESPONSE,
                [
                    {
                        target: normalizedTarget,
                        propertyKey: 'getUsers',
                        statusCode: 200
                    }
                ],
                target,
                'getUsers'
            );
        });

        it('should use the original target when normalizeTarget returns the same target', () => {
            const target = {};

            (Metadata.normalizeTarget as jest.Mock).mockReturnValue(target);

            const decorator = OpenApiResponse(200);

            decorator(target, 'getUsers', {} as PropertyDescriptor);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.OPENAPI_RESPONSE,
                [
                    {
                        target,
                        propertyKey: 'getUsers',
                        statusCode: 200
                    }
                ],
                target,
                'getUsers'
            );
        });

        it('should define metadata on the original target and propertyKey', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const decorator = OpenApiResponse(200);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(Metadata.define).toHaveBeenCalledTimes(1);
            expect(Metadata.define).toHaveBeenCalledWith(MetadataKeys.OPENAPI_RESPONSE, expect.any(Array), target, propertyKey);
        });

        it('should support symbol property keys', () => {
            const target = {};
            const propertyKey = Symbol('getUsers');

            const decorator = OpenApiResponse(200);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(Metadata.get).toHaveBeenCalledWith(MetadataKeys.OPENAPI_RESPONSE, target, propertyKey);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.OPENAPI_RESPONSE,
                [
                    {
                        target,
                        propertyKey,
                        statusCode: 200
                    }
                ],
                target,
                propertyKey
            );
        });
    });

    describe('numeric status code', () => {
        it('should create metadata with only the status code', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const decorator = OpenApiResponse(200);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.OPENAPI_RESPONSE,
                [
                    {
                        target,
                        propertyKey,
                        statusCode: 200
                    }
                ],
                target,
                propertyKey
            );
        });

        it('should not spread the numeric metadata into the final metadata', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const decorator = OpenApiResponse(201);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            const [, metadata] = (Metadata.define as jest.Mock).mock.calls[0];

            expect(metadata).toEqual([
                {
                    target,
                    propertyKey,
                    statusCode: 201
                }
            ]);

            expect(metadata).not.toEqual(
                expect.objectContaining({
                    0: expect.anything()
                })
            );
        });
    });

    describe('default status code', () => {
        it('should create metadata with default status code', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const decorator = OpenApiResponse('default');

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.OPENAPI_RESPONSE,
                [
                    {
                        target,
                        propertyKey,
                        statusCode: 'default'
                    }
                ],
                target,
                propertyKey
            );
        });

        it('should not spread the string default into the metadata', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const decorator = OpenApiResponse('default');

            decorator(target, propertyKey, {} as PropertyDescriptor);

            const [, metadata] = (Metadata.define as jest.Mock).mock.calls[0];

            expect(metadata).toEqual([
                {
                    target,
                    propertyKey,
                    statusCode: 'default'
                }
            ]);
        });
    });

    describe('object metadata', () => {
        it('should preserve all provided metadata properties', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const metadata = {
                statusCode: 200,
                description: 'Successful response',
                headers: {
                    Location: {
                        description: 'Created resource location'
                    }
                },
                content: {
                    'application/json': {
                        schema: {
                            type: 'object'
                        }
                    }
                },
                type: 'string',
                example: 'example',
                default: 'default value',
                minItems: 1,
                maxItems: 10,
                uniqueItems: true,
                items: [
                    {
                        type: 'string'
                    }
                ]
            };

            const decorator = OpenApiResponse(metadata as any);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.OPENAPI_RESPONSE,
                [
                    {
                        target,
                        propertyKey,
                        ...metadata
                    }
                ],
                target,
                propertyKey
            );
        });

        it('should use the statusCode from object metadata', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const metadata = {
                statusCode: 201,
                description: 'Created'
            };

            const decorator = OpenApiResponse(metadata);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            const [, result] = (Metadata.define as jest.Mock).mock.calls[0];

            expect(result[0].statusCode).toBe(201);
        });

        it('should support default status code inside object metadata', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const metadata = {
                statusCode: 'default',
                description: 'Default response'
            } as any;

            const decorator = OpenApiResponse(metadata);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.OPENAPI_RESPONSE,
                [
                    {
                        target,
                        propertyKey,
                        description: 'Default response',
                        statusCode: 'default'
                    }
                ],
                target,
                propertyKey
            );
        });

        it('should preserve an empty object as metadata', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const decorator = OpenApiResponse({} as any);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.OPENAPI_RESPONSE,
                [
                    {
                        target,
                        propertyKey,
                        statusCode: undefined
                    }
                ],
                target,
                propertyKey
            );
        });
    });

    describe('existing metadata', () => {
        it('should create a new array when no metadata exists', () => {
            const target = {};
            const propertyKey = 'getUsers';

            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            const decorator = OpenApiResponse(200);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            const [, metadata] = (Metadata.define as jest.Mock).mock.calls[0];

            expect(metadata).toEqual([
                {
                    target,
                    propertyKey,
                    statusCode: 200
                }
            ]);
        });

        it('should create a new array when Metadata.get returns null', () => {
            const target = {};
            const propertyKey = 'getUsers';

            (Metadata.get as jest.Mock).mockReturnValue(null);

            const decorator = OpenApiResponse(200);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.OPENAPI_RESPONSE,
                [
                    {
                        target,
                        propertyKey,
                        statusCode: 200
                    }
                ],
                target,
                propertyKey
            );
        });

        it('should append metadata to an existing array', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const existingMetadata = [
                {
                    target,
                    propertyKey,
                    statusCode: 401,
                    description: 'Unauthorized'
                }
            ];

            (Metadata.get as jest.Mock).mockReturnValue(existingMetadata);

            const decorator = OpenApiResponse(200);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(existingMetadata).toEqual([
                {
                    target,
                    propertyKey,
                    statusCode: 401,
                    description: 'Unauthorized'
                },
                {
                    target,
                    propertyKey,
                    statusCode: 200
                }
            ]);
        });

        it('should pass the same existing array to Metadata.define', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const existingMetadata = [
                {
                    target,
                    propertyKey,
                    statusCode: 401
                }
            ];

            (Metadata.get as jest.Mock).mockReturnValue(existingMetadata);

            const decorator = OpenApiResponse(200);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            const [, metadata] = (Metadata.define as jest.Mock).mock.calls[0];

            expect(metadata).toBe(existingMetadata);
        });

        it('should preserve all existing responses when appending', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const existingMetadata = [
                {
                    target,
                    propertyKey,
                    statusCode: 200,
                    description: 'OK'
                },
                {
                    target,
                    propertyKey,
                    statusCode: 404,
                    description: 'Not found'
                }
            ];

            (Metadata.get as jest.Mock).mockReturnValue(existingMetadata);

            const decorator = OpenApiResponse({
                statusCode: 500,
                description: 'Internal server error'
            });

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.OPENAPI_RESPONSE,
                [
                    {
                        target,
                        propertyKey,
                        statusCode: 200,
                        description: 'OK'
                    },
                    {
                        target,
                        propertyKey,
                        statusCode: 404,
                        description: 'Not found'
                    },
                    {
                        target,
                        propertyKey,
                        statusCode: 500,
                        description: 'Internal server error'
                    }
                ],
                target,
                propertyKey
            );
        });

        it('should allow multiple decorators on the same method', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const firstDecorator = OpenApiResponse(200);
            const secondDecorator = OpenApiResponse(404);
            const thirdDecorator = OpenApiResponse('default');

            firstDecorator(target, propertyKey, {} as PropertyDescriptor);

            const firstMetadata = (Metadata.define as jest.Mock).mock.calls[0][1];

            (Metadata.get as jest.Mock).mockReturnValue(firstMetadata);

            secondDecorator(target, propertyKey, {} as PropertyDescriptor);

            const secondMetadata = (Metadata.define as jest.Mock).mock.calls[1][1];

            (Metadata.get as jest.Mock).mockReturnValue(secondMetadata);

            thirdDecorator(target, propertyKey, {} as PropertyDescriptor);

            const thirdMetadata = (Metadata.define as jest.Mock).mock.calls[2][1];

            expect(thirdMetadata).toEqual([
                {
                    target,
                    propertyKey,
                    statusCode: 200
                },
                {
                    target,
                    propertyKey,
                    statusCode: 404
                },
                {
                    target,
                    propertyKey,
                    statusCode: 'default'
                }
            ]);
        });
    });

    describe('Metadata interactions', () => {
        it('should call Metadata.get before Metadata.normalizeTarget', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const calls: string[] = [];

            (Metadata.get as jest.Mock).mockImplementation(() => {
                calls.push('get');
                return undefined;
            });

            (Metadata.normalizeTarget as jest.Mock).mockImplementation(() => {
                calls.push('normalize');
                return target;
            });

            const decorator = OpenApiResponse(200);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(calls).toEqual(['get', 'normalize']);
        });

        it('should call Metadata.define after building the metadata', () => {
            const target = {};
            const propertyKey = 'getUsers';

            const calls: string[] = [];

            (Metadata.get as jest.Mock).mockImplementation(() => {
                calls.push('get');
                return undefined;
            });

            (Metadata.normalizeTarget as jest.Mock).mockImplementation(() => {
                calls.push('normalize');
                return target;
            });

            (Metadata.define as jest.Mock).mockImplementation(() => {
                calls.push('define');
            });

            const decorator = OpenApiResponse(200);

            decorator(target, propertyKey, {} as PropertyDescriptor);

            expect(calls).toEqual(['get', 'normalize', 'define']);
        });
    });
});

describe('OpenApiDefaultResponse', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (Metadata.get as jest.Mock).mockReturnValue(undefined);
        (Metadata.normalizeTarget as jest.Mock).mockImplementation((target) => target);
    });

    it('should return a method decorator', () => {
        const decorator = OpenApiDefaultResponse({
            description: 'Default response'
        } as any);

        expect(decorator).toEqual(expect.any(Function));
    });

    it('should create a response with default status code', () => {
        const target = {};
        const propertyKey = 'getUsers';

        const decorator = OpenApiDefaultResponse({
            description: 'Default response'
        } as any);

        decorator(target, propertyKey, {} as PropertyDescriptor);

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.OPENAPI_RESPONSE,
            [
                {
                    target,
                    propertyKey,
                    description: 'Default response',
                    statusCode: 'default'
                }
            ],
            target,
            propertyKey
        );
    });

    it('should preserve all provided data', () => {
        const target = {};
        const propertyKey = 'getUsers';

        const data = {
            description: 'Default response',
            type: 'string',
            example: 'example',
            headers: {
                'X-Test': {
                    description: 'Test header'
                }
            },
            content: {
                'application/json': {
                    schema: {
                        type: 'string'
                    }
                }
            }
        };

        const decorator = OpenApiDefaultResponse(data as any);

        decorator(target, propertyKey, {} as PropertyDescriptor);

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.OPENAPI_RESPONSE,
            [
                {
                    target,
                    propertyKey,
                    ...data,
                    statusCode: 'default'
                }
            ],
            target,
            propertyKey
        );
    });

    it('should force the status code to default', () => {
        const target = {};
        const propertyKey = 'getUsers';

        const data = {
            description: 'Default response',
            statusCode: 200
        };

        const decorator = OpenApiDefaultResponse(data as any);

        decorator(target, propertyKey, {} as PropertyDescriptor);

        const [, metadata] = (Metadata.define as jest.Mock).mock.calls[0];

        expect(metadata).toEqual([
            {
                target,
                propertyKey,
                description: 'Default response',
                statusCode: 'default'
            }
        ]);
    });

    it('should work with an empty data object', () => {
        const target = {};
        const propertyKey = 'getUsers';

        const decorator = OpenApiDefaultResponse({} as any);

        decorator(target, propertyKey, {} as PropertyDescriptor);

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.OPENAPI_RESPONSE,
            [
                {
                    target,
                    propertyKey,
                    statusCode: 'default'
                }
            ],
            target,
            propertyKey
        );
    });

    it('should preserve the normalized target', () => {
        const target = {};
        const normalizedTarget = {};

        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(normalizedTarget);

        const decorator = OpenApiDefaultResponse({
            description: 'Default response'
        } as any);

        decorator(target, 'getUsers', {} as PropertyDescriptor);

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.OPENAPI_RESPONSE,
            [
                {
                    target: normalizedTarget,
                    propertyKey: 'getUsers',
                    description: 'Default response',
                    statusCode: 'default'
                }
            ],
            target,
            'getUsers'
        );
    });
});
