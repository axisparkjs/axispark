import { HttpPluginOptions } from '@axisparkjs/http';
import { SessionOptions } from 'express-session';
import { OptionsJson, OptionsUrlencoded } from 'body-parser';

export interface ExpressHttpPluginOptions extends HttpPluginOptions {
    bodyParserOptions?: OptionsJson;
    urlEncodedOptions?: OptionsUrlencoded;
    sessionOptions?: SessionOptions;
}
