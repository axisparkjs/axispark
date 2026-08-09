import { Inject, Injectable } from '@axisparkjs/di';
import { HTTP_OPTIONS, HttpAdapter, Route } from '@axisparkjs/http';
import { AxiSparkConfig, AXISPARK_CONFIG } from '@axisparkjs/core';
import { FastifyHttpRequest } from '../types/fastify-http-request';
import { FastifyHttpResponse } from '../types/fastify-http-response';
import { FastifyHttpPluginOptions } from '../plugin/fastify-http-plugin-options';
import { FastifyHttpSession } from '../types/fastify-http-session';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cookie from '@fastify/cookie';
import session from '@fastify/session';
import compress from '@fastify/compress';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import path from 'node:path';

@Injectable()
export class FastifyHttpAdapter implements HttpAdapter {
    private readonly app = fastify();
    private readonly registeredRoutes: Route[] = [];

    constructor(
        @Inject(HTTP_OPTIONS)
        private readonly options: FastifyHttpPluginOptions,
        @Inject(AXISPARK_CONFIG)
        private readonly axisparkConfig: AxiSparkConfig
    ) {}

    async initialize(): Promise<void> {
        await this.app.register(fastifyStatic, {
            root: path.join(this.axisparkConfig.basePath || process.cwd(), 'public')
        });
        if (this.options.cookies) await this.app.register(cookie, this.options.cookiesOptions ?? {});
        if (this.options.session) await this.app.register(session, this.options.sessionOptions);
        if (this.options.compression) await this.app.register(compress, this.options.compressionOptions ?? {});
        if (this.options.cors) await this.app.register(cors, this.options.corsOptions ?? {});
        if (this.options.urlEncoded) await this.app.register(formbody, this.options.urlEncodedOptions ?? {});
    }

    getRegisteredRoutes(): readonly Route[] {
        return this.registeredRoutes;
    }

    registerRoutes(routes: readonly Route[]): void {
        this.registeredRoutes.push(...routes);
        for (const route of routes) {
            const { path, method } = route;
            this.app.route({
                method: method.toUpperCase(),
                url: path,
                handler: async (request, reply) => {
                    await route.handler(this.createContext(request, reply));
                }
            });
        }
    }

    private createContext(request: FastifyRequest, reply: FastifyReply) {
        const req = new FastifyHttpRequest(request);
        const res = new FastifyHttpResponse(reply);
        const ses = request.session ? new FastifyHttpSession(request.session) : undefined;
        return { request: req, response: res, session: ses };
    }

    async start(): Promise<void> {
        await this.app.listen({
            port: this.options.port
        });
    }

    async stop(): Promise<void> {
        await this.app.close();
    }
}
