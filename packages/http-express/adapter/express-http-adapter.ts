import { Inject, Injectable } from '@axisparkjs/common/src';
import { CatchEntry, HTTP_LOGGER, HTTP_OPTIONS, HttpAdapter, HttpContext, HttpError, HttpPluginOptions, RouteEntry } from '@axisparkjs/http';
import express, { NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import { ExpressHttpRequest } from '../types/express-http-request';
import { ExpressHttpResponse } from '../types/express-http-response';
import { HttpErrorHandler } from '@axisparkjs/http';
import { Logger } from '@axisparkjs/logger';

@Injectable()
export class ExpressHttpAdapter implements HttpAdapter {
    private readonly app = express();
    private server?: Server;
    private readonly routes: RouteEntry[] = [];
    private readonly catchs: CatchEntry[] = [];

    constructor(
        @Inject(HTTP_OPTIONS)
        private readonly options: HttpPluginOptions,
        @Inject(HTTP_LOGGER)
        private readonly logger: Logger
    ) {
        if (this.options.bodyParser) this.app.use(express.json(this.options.bodyParserOptions));
        if (this.options.urlEncoded) this.app.use(express.urlencoded(this.options.urlEncodedOptions));
        if (this.options.logHttpRequests) {
            this.app.use((req, _res, next) => {
                this.logger.info(`HTTP request: ${req.method} ${req.path}`);
                next();
            });
        }
        if (this.options.logHttpResponses) {
            this.app.use((req, res, next) => {
                res.on('finish', () => {
                    this.logger.info(`HTTP response: ${req.method} ${req.path} ${res.statusCode}`);
                });

                next();
            });
        }
    }

    registerRoutes(routes: readonly RouteEntry[]): void {
        this.routes.push(...routes);
    }

    registerCatchs(catchs: readonly CatchEntry[]): void {
        this.catchs.push(...catchs);
    }

    private createContext(request: Request, response: Response): HttpContext {
        const req = new ExpressHttpRequest(request);
        const res = new ExpressHttpResponse(response);
        return { request: req, response: res };
    }

    start(): void {
        for (const route of this.routes) {
            const { path, method } = route;
            this.app[method](path, async (req, res) => {
                const result = await route.handler(this.createContext(req, res));

                if (!res.headersSent) {
                    res.status(route.statusCode);
                    if (result !== undefined) {
                        res.send(result);
                    }
                }
            });
        }

        this.app.use((err: Error, _req: Request, _res: Response, _next: NextFunction) => {
            if (this.options.logHttpErrors && err instanceof HttpError) this.logger.error(`HTTP error: ${err.message}`, err);
            if (this.options.logUnknownErrors && !(err instanceof HttpError)) this.logger.error(`Unknown error: ${err}`);
        });

        for (const catchEntry of this.catchs) {
            const { error, handler } = catchEntry;
            this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
                if (err instanceof error) {
                    handler(err, this.createContext(req, res));
                } else {
                    next(err);
                }
            });
        }

        this.app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
            HttpErrorHandler.handle(err, this.createContext(req, res));
        });

        this.server = this.app.listen(this.options.port);
    }

    stop(): void {
        this.server?.close();
    }
}
