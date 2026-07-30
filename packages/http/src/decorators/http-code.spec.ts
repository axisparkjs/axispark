import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { HttpCode } from './http-code';
import { HttpStatusCode } from '../types/http-status-code';

jest.mock('@axisparkjs/common', () => {
    const originalModule = jest.requireActual('@axisparkjs/common');

    return {
        ...originalModule,
        Metadata: {
            ...originalModule.Metadata,
            defineMethod: jest.fn()
        }
    };
});

describe('HttpCode', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should define the HTTP status code metadata on the method', () => {
        class TestController {
            test() {}
        }

        HttpCode(HttpStatusCode.Ok)(TestController.prototype, 'test', Object.getOwnPropertyDescriptor(TestController.prototype, 'test') as PropertyDescriptor);

        expect(Metadata.defineMethod).toHaveBeenCalledTimes(1);
        expect(Metadata.defineMethod).toHaveBeenCalledWith(MetadataKeys.HTTP_CODE, HttpStatusCode.Ok, TestController.prototype, 'test');
    });
});
