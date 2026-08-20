import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { OpenApiDocumentGenerator } from '../document';
import { OpenApiProperty } from './openapi-property';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        get: jest.fn(),
        normalizeTarget: jest.fn(),
        define: jest.fn()
    },
    MetadataKeys: {
        OPENAPI_PROPERTY: 'OPENAPI_PROPERTY'
    }
}));

jest.mock('../document', () => ({
    OpenApiDocumentGenerator: {
        extractTypeFromMetadata: jest.fn()
    }
}));

describe('OpenApiProperty', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a property decorator', () => {
        const decorator = OpenApiProperty();

        expect(decorator).toEqual(expect.any(Function));
    });

    it('should define metadata when no previous metadata exists', () => {
        const target = {};
        const propertyKey = 'name';

        (Metadata.get as jest.Mock).mockReturnValue(undefined);
        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(target);
        (OpenApiDocumentGenerator.extractTypeFromMetadata as jest.Mock).mockReturnValue(String);

        const decorator = OpenApiProperty();

        decorator(target, propertyKey);

        expect(Metadata.get).toHaveBeenCalledWith(MetadataKeys.OPENAPI_PROPERTY, target);

        expect(Metadata.normalizeTarget).toHaveBeenCalledWith(target);

        expect(OpenApiDocumentGenerator.extractTypeFromMetadata).toHaveBeenCalledWith(target, propertyKey);

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.OPENAPI_PROPERTY,
            [
                {
                    target,
                    propertyKey,
                    type: String
                }
            ],
            target
        );
    });

    it('should append metadata to existing metadata', () => {
        const target = {};
        const propertyKey = 'name';

        const existingMetadata = [
            {
                target,
                propertyKey: 'id',
                type: Number
            }
        ];

        (Metadata.get as jest.Mock).mockReturnValue(existingMetadata);
        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(target);
        (OpenApiDocumentGenerator.extractTypeFromMetadata as jest.Mock).mockReturnValue(String);

        const decorator = OpenApiProperty();

        decorator(target, propertyKey);

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.OPENAPI_PROPERTY,
            [
                existingMetadata[0],
                {
                    target,
                    propertyKey,
                    type: String
                }
            ],
            target
        );
    });

    it('should use the normalized target in the generated metadata', () => {
        const target = {};
        const normalizedTarget = {};

        (Metadata.get as jest.Mock).mockReturnValue([]);
        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(normalizedTarget);
        (OpenApiDocumentGenerator.extractTypeFromMetadata as jest.Mock).mockReturnValue(Number);

        const decorator = OpenApiProperty();

        decorator(target, 'age');

        expect(Metadata.normalizeTarget).toHaveBeenCalledWith(target);

        expect(OpenApiDocumentGenerator.extractTypeFromMetadata).toHaveBeenCalledWith(normalizedTarget, 'age');

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.OPENAPI_PROPERTY,
            [
                {
                    target: normalizedTarget,
                    propertyKey: 'age',
                    type: Number
                }
            ],
            target
        );
    });

    it('should merge the provided metadata', () => {
        const target = {};
        const propertyKey = 'name';

        (Metadata.get as jest.Mock).mockReturnValue([]);
        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(target);
        (OpenApiDocumentGenerator.extractTypeFromMetadata as jest.Mock).mockReturnValue(String);

        const metadata: any = {
            description: 'The user name',
            required: true,
            type: 'string'
        };

        const decorator = OpenApiProperty(metadata);

        decorator(target, propertyKey);

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.OPENAPI_PROPERTY,
            [
                {
                    target,
                    propertyKey,
                    type: 'string',
                    description: 'The user name',
                    required: true
                }
            ],
            target
        );
    });

    it('should allow provided metadata to override the extracted type', () => {
        const target = {};
        const propertyKey = 'id';

        (Metadata.get as jest.Mock).mockReturnValue([]);
        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(target);
        (OpenApiDocumentGenerator.extractTypeFromMetadata as jest.Mock).mockReturnValue(String);

        const decorator = OpenApiProperty({
            type: Number
        });

        decorator(target, propertyKey);

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.OPENAPI_PROPERTY,
            [
                {
                    target,
                    propertyKey,
                    type: Number
                }
            ],
            target
        );
    });
});
