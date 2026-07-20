import { PluginOptions } from '@axisparkjs/core';
import { Constructor } from '@axisparkjs/di';
import { HttpAdapterClass } from '../adapter/http-adapter';

export interface HttpParseOptions {
    inflate?: boolean;
    limit?: number | string;
    type?: string | string[] | ((req: any) => any);
    verify?(req: any, res: any, buf: Buffer, encoding: string): void;
}

export interface HttpPluginOptions extends PluginOptions {
    port: number;
    controllers: Constructor[];
    errorHandlers: Constructor[];
    adapter: HttpAdapterClass;
    bodyParser: boolean;
    bodyParserOptions?: HttpParseOptions & {
        reviver?(key: string, value: any): any;
        strict?: boolean;
    };
    urlEncoded?: boolean;
    urlEncodedOptions?: HttpParseOptions & {
        extended?: boolean;
        parameterLimit?: number;
    };
    logHttpRequests?: boolean;
    logHttpResponses?: boolean;
    logHttpErrors?: boolean;
    logUnknownErrors?: boolean;
}
