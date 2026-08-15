import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { HttpCode } from './http-code';
import { HttpStatusCode } from '../types/http-status-code';

jest.mock('@axisparkjs/common', () => {
    const originalModule = jest.requireActual('@axisparkjs/common');

    return {
        ...originalModule,
        Metadata: {
            ...originalModule.Metadata,
            define: jest.fn(),
            normalizeTarget: jest.fn()
        }
    };
});

describe('HttpCode', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (Metadata.normalizeTarget as jest.Mock).mockImplementation((target) => target);
    });

    it('should define the HTTP status code metadata on the method', () => {
        class TestController {
            test() {}
        }

        const descriptor = Object.getOwnPropertyDescriptor(TestController.prototype, 'test') as PropertyDescriptor;

        HttpCode(HttpStatusCode.Ok)(TestController.prototype, 'test', descriptor);

        expect(Metadata.define).toHaveBeenCalledTimes(1);
        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.HTTP_CODE,
            {
                target: TestController.prototype,
                propertyKey: 'test',
                statusCode: HttpStatusCode.Ok
            },
            TestController.prototype,
            'test'
        );
    });

    it('should use the normalized target in the metadata', () => {
        class TestController {
            test() {}
        }

        const normalizedTarget = {};

        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(normalizedTarget);

        const descriptor = Object.getOwnPropertyDescriptor(TestController.prototype, 'test') as PropertyDescriptor;

        HttpCode(HttpStatusCode.Ok)(TestController.prototype, 'test', descriptor);

        expect(Metadata.normalizeTarget).toHaveBeenCalledWith(TestController.prototype);

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.HTTP_CODE,
            {
                target: normalizedTarget,
                propertyKey: 'test',
                statusCode: HttpStatusCode.Ok
            },
            TestController.prototype,
            'test'
        );
    });
});
