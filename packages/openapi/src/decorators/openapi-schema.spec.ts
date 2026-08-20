import { Metadata, MetadataKeys } from '@axisparkjs/common';

import { OpenApiSchema } from './openapi-schema';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        normalizeTarget: jest.fn(),
        define: jest.fn()
    },
    MetadataKeys: {
        OPENAPI_SCHEMA: 'OPENAPI_SCHEMA'
    }
}));

describe('OpenApiSchema', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a class decorator', () => {
        const decorator = OpenApiSchema();

        expect(decorator).toEqual(expect.any(Function));
    });

    it('should define metadata when no metadata is provided', () => {
        class TestClass {}

        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(TestClass);

        const decorator = OpenApiSchema();

        decorator(TestClass);

        expect(Metadata.normalizeTarget).toHaveBeenCalledWith(TestClass);

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.OPENAPI_SCHEMA,
            {
                target: TestClass,
                type: TestClass
            },
            TestClass
        );
    });

    it('should define metadata with the provided metadata', () => {
        class TestClass {}

        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(TestClass);

        const metadata = {
            name: 'TestSchema',
            description: 'Test schema'
        };

        const decorator = OpenApiSchema(metadata);

        decorator(TestClass);

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.OPENAPI_SCHEMA,
            {
                target: TestClass,
                type: TestClass,
                name: 'TestSchema',
                description: 'Test schema'
            },
            TestClass
        );
    });

    it('should use the normalized target', () => {
        class TestClass {}

        const normalizedTarget = {};

        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(normalizedTarget);

        const decorator = OpenApiSchema();

        decorator(TestClass);

        expect(Metadata.normalizeTarget).toHaveBeenCalledWith(TestClass);

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.OPENAPI_SCHEMA,
            {
                target: normalizedTarget,
                type: TestClass
            },
            TestClass
        );
    });

    it('should allow metadata to override the default type', () => {
        class TestClass {}

        const customType = {};

        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(TestClass);

        const decorator = OpenApiSchema({
            type: customType
        } as any);

        decorator(TestClass);

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.OPENAPI_SCHEMA,
            {
                target: TestClass,
                type: customType
            },
            TestClass
        );
    });
});
