import { Metadata } from '@axisparkjs/common';
import { HttpResultProcessor } from './http-result-processor';
import { HttpResult, BodyHttpResult } from './http-result';
import { defaultStatusCode, HttpStatusCode, HttpMethod } from '../types';

jest.mock('@axisparkjs/common', () => {
    const originalModule = jest.requireActual('@axisparkjs/common');

    return {
        ...originalModule,
        Metadata: {
            ...originalModule.Metadata,
            define: jest.fn(),
            get: jest.fn().mockReturnValue(undefined),
            getMethod: jest.fn().mockReturnValue(undefined)
        }
    };
});

jest.mock('../types', () => {
    const originalModule = jest.requireActual('../types');

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

describe('HttpResultProcessor', () => {
    const context = {} as any;
    const handler = {
        target: {},
        method: 'index'
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should process an HttpResult directly', async () => {
        const result = {
            process: jest.fn()
        } as unknown as HttpResult;

        Object.setPrototypeOf(result, HttpResult.prototype);

        await HttpResultProcessor.process(context, handler, result);

        expect(result.process).toHaveBeenCalledWith(context);
        expect(Metadata.get).not.toHaveBeenCalled();
    });

    it('should use the HTTP_CODE metadata when present', async () => {
        const process = jest.fn();

        (Metadata.get as jest.Mock).mockReturnValue([{ method: HttpMethod.GET, propertyKey: 'index' }]);

        (Metadata.getMethod as jest.Mock).mockReturnValue(HttpStatusCode.Created);

        (BodyHttpResult as jest.Mock).mockImplementation(() => ({
            process
        }));

        await HttpResultProcessor.process(context, handler, { ok: true });

        expect(BodyHttpResult).toHaveBeenCalledWith({ ok: true }, HttpStatusCode.Created);

        expect(process).toHaveBeenCalledWith(context);
        expect(defaultStatusCode).not.toHaveBeenCalled();
    });

    it('should use the default status code when HTTP_CODE is not defined', async () => {
        const process = jest.fn();

        (Metadata.get as jest.Mock).mockReturnValue([{ method: HttpMethod.POST, propertyKey: 'index' }]);

        (Metadata.getMethod as jest.Mock).mockReturnValue(undefined);

        (defaultStatusCode as jest.Mock).mockReturnValue(HttpStatusCode.Created);

        (BodyHttpResult as jest.Mock).mockImplementation(() => ({
            process
        }));

        await HttpResultProcessor.process(context, handler, { ok: true });

        expect(defaultStatusCode).toHaveBeenCalledWith(HttpMethod.POST);

        expect(BodyHttpResult).toHaveBeenCalledWith({ ok: true }, HttpStatusCode.Created);

        expect(process).toHaveBeenCalledWith(context);
    });
});
