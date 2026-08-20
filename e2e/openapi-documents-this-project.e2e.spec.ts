import { AxiSparkTestFactory } from '@axisparkjs/test';
import { AxiSparkCore } from '@axisparkjs/core';
import { HttpPlugin } from '@axisparkjs/http';
import { OpenApiPlugin } from '@axisparkjs/openapi';
import { app as appExpress } from '@axisparkjs/samples/openapi-documents-this-project/src/app-express';
import { app as appFasitfy } from '@axisparkjs/samples/openapi-documents-this-project/src/app-fastify';
import { ExpressHttpAdapter } from '@axisparkjs/http-express';
import { FastifyHttpAdapter } from '@axisparkjs/http-fastify';

describe.each([
    { name: 'Express', app: appExpress },
    { name: 'Fastify', app: appFasitfy }
])('OpenApi Documents This Project ($name)', ({ app, name }) => {
    let axiSparkCore: AxiSparkCore;

    beforeAll(async () => {
        axiSparkCore = AxiSparkTestFactory.create({
            app
        });
        await axiSparkCore.init();
        await axiSparkCore.run();
    });

    it('should create an instance of AxiSparkTestCore', () => {
        expect(axiSparkCore).toBeInstanceOf(AxiSparkCore);
    });

    it('should create the app with OpenApi plugin', async () => {
        const plugins = axiSparkCore.used();
        expect(plugins).toHaveLength(2);
        expect(plugins).toStrictEqual([
            {
                type: OpenApiPlugin,
                options: expect.objectContaining({
                    info: {
                        title: 'OpenApi Documents This Project',
                        version: '1.0.0',
                        description: 'This project demonstrates how to use the OpenApiPlugin to generate OpenAPI documents for your API.',
                        servers: [
                            {
                                url: 'http://pepe:3000/api',
                                description: 'Local server'
                            }
                        ],
                        contact: {
                            name: 'Pablo',
                            email: 'pablogalvez31@gmail.com'
                        },
                        license: {
                            name: 'MIT',
                            url: 'https://opensource.org/licenses/MIT'
                        },
                        tags: [
                            {
                                name: 'todos',
                                description: 'Operations related to todos'
                            }
                        ],
                        summary: 'This project demonstrates how to use the OpenApiPlugin to generate OpenAPI documents for your API.',
                        termsOfService: 'https://example.com/terms',
                        externalDocs: {
                            description: 'Find more info here',
                            url: 'https://example.com'
                        }
                    }
                })
            },
            {
                type: HttpPlugin,
                options: expect.objectContaining({
                    basePath: '/api',
                    adapter: name === 'Express' ? ExpressHttpAdapter : FastifyHttpAdapter,
                    plugin: HttpPlugin,
                    port: 3000
                })
            }
        ]);
    });

    it('should handle GET requests to /api/openapi.json', async () => {
        const response = await fetch('http://localhost:3000/api/openapi.json', {
            method: 'GET'
        });
        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json).toEqual(
            expect.objectContaining({
                openapi: '3.1.0',
                info: expect.objectContaining({
                    title: 'OpenApi Documents This Project',
                    version: '1.0.0'
                })
            })
        );
    });

    it('should handle GET requests to /api/openapi.json and have all the routes defined', async () => {
        const response = await fetch('http://localhost:3000/api/openapi.json', {
            method: 'GET'
        });
        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json).toEqual(
            expect.objectContaining({
                paths: expect.objectContaining({
                    '/api/todos': { get: expect.any(Object), post: expect.any(Object) },
                    '/api/todos/{index}': { get: expect.any(Object), put: expect.any(Object), delete: expect.any(Object) }
                })
            })
        );
    });

    it('should handle GET requests to /api/openapi.json and have defined all schemas', async () => {
        const response = await fetch('http://localhost:3000/api/openapi.json', {
            method: 'GET'
        });
        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json).toEqual(
            expect.objectContaining({
                components: expect.objectContaining({
                    schemas: expect.objectContaining({
                        Todo: expect.any(Object),
                        TodoExtra: expect.any(Object)
                    })
                })
            })
        );
    });

    it('should handle GET requests to /api/openapi.yaml', async () => {
        const response = await fetch('http://localhost:3000/api/openapi.yaml', {
            method: 'GET'
        });
        expect(response.status).toBe(200);
        const text = await response.text();
        expect(text).toContain('openapi: 3.1.0');
        expect(text).toContain('title: OpenApi Documents This Project');
        expect(text).toContain('version: 1.0.0');
    });

    it('should handle GET requests to /api/openapi.yaml and have all the routes defined', async () => {
        const response = await fetch('http://localhost:3000/api/openapi.yaml', {
            method: 'GET'
        });
        expect(response.status).toBe(200);
        const text = await response.text();
        expect(text).toContain('/api/todos:');
        expect(text).toContain('/api/todos/{index}:');
    });

    it('should handle GET requests to /api/openapi.yaml and have defined all schemas', async () => {
        const response = await fetch('http://localhost:3000/api/openapi.yaml', {
            method: 'GET'
        });
        expect(response.status).toBe(200);
        const text = await response.text();
        expect(text).toContain('Todo:');
        expect(text).toContain('TodoExtra:');
    });

    afterAll(async () => {
        await axiSparkCore.destroy();
    });
});
