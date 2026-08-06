import { Inject, Injectable } from '@axisparkjs/di';
import { HTTP_OPTIONS, HttpAdapter, HttpContext, Route } from '@axisparkjs/http';
import express, { Request, Response } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { Server } from 'node:http';
import { ExpressHttpRequest } from '../types/express-http-request';
import { ExpressHttpResponse } from '../types/express-http-response';
import { ExpressHttpPluginOptions } from '../plugin/express-http-plugin-options';
import { ExpressHttpSession } from '../types/express-http-session';

@Injectable()
export class ExpressHttpAdapter implements HttpAdapter {
    private readonly app = express();
    private server?: Server;
    private readonly registeredRoutes: Route[] = [];

    constructor(
        @Inject(HTTP_OPTIONS)
        private readonly options: ExpressHttpPluginOptions
    ) {
        if (this.options.bodyParser) this.app.use(express.json(this.options.bodyParserOptions));
        if (this.options.urlEncoded) this.app.use(express.urlencoded(this.options.urlEncodedOptions));
        if (this.options.session) this.app.use(session(this.options.sessionOptions));
        if (this.options.cookies) this.app.use(cookieParser(this.options.cookiesOptions?.secret, this.options.cookiesOptions?.options));
        if (this.options.compression) this.app.use(compression(this.options.compressionOptions));
        if (this.options.cors) this.app.use(cors(this.options.corsOptions));
    }

    getRegisteredRoutes(): readonly Route[] {
        return this.registeredRoutes;
    }

    registerRoutes(routes: readonly Route[]): void {
        this.registeredRoutes.push(...routes);
        for (const route of routes) {
            const { path, method } = route;
            this.app[method](path, async (req, res) => {
                await route.handler(this.createContext(req, res));
            });
        }
    }

    private createContext(request: Request, response: Response): Omit<HttpContext, 'transport'> {
        const req = new ExpressHttpRequest(request);
        const res = new ExpressHttpResponse(response);
        const ses = request.session ? new ExpressHttpSession(request.session) : undefined;
        return { request: req, response: res, session: ses };
    }

    start(): void {
        this.server = this.app.listen(this.options.port);
    }

    stop(): void {
        this.server?.close();
    }
}
