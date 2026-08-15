import { AxiSparkTestFactory } from '@axisparkjs/test';
import { AxiSparkCore } from '@axisparkjs/core';
import { HttpPlugin } from '@axisparkjs/http';
import { app as appExpress } from '@axisparkjs/samples/versioning-with-headers/src/app-express';
import { app as appFasitfy } from '@axisparkjs/samples/versioning-with-headers/src/app-fastify';
import { ExpressHttpAdapter } from '@axisparkjs/http-express';
import { FastifyHttpAdapter } from '@axisparkjs/http-fastify';

describe.each([
    { name: 'Express', app: appExpress },
    { name: 'Fastify', app: appFasitfy }
])('Versioning and Timeouts App ($name)', ({ app, name }) => {
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

    it('should create the app', async () => {
        const plugins = axiSparkCore.used();
        expect(plugins).toHaveLength(1);
        expect(plugins).toStrictEqual([
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

    it('should handle GET requests to /versions with v1', async () => {
        const response = await fetch('http://localhost:3000/api/versions', {
            method: 'GET',
            headers: { 'X-API-Version': '1' }
        });
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ message: 'All versions are supported for this GET request example' });
    });

    it('should handle GET requests to /versions with v2', async () => {
        const response = await fetch('http://localhost:3000/api/versions', {
            method: 'GET',
            headers: { 'X-API-Version': '2' }
        });
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ message: 'This is a GET request example for version 2' });
    });

    it('should handle GET requests to /versions with v3', async () => {
        const response = await fetch('http://localhost:3000/api/versions', {
            method: 'GET',
            headers: { 'X-API-Version': '3' }
        });
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ message: 'This is a GET request example for version 3' });
    });

    it('should handle GET requests to /versions with v324', async () => {
        const response = await fetch('http://localhost:3000/api/versions', {
            method: 'GET',
            headers: { 'X-API-Version': '324' }
        });
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ message: 'All versions are supported for this GET request example' });
    });

    it('should handle GET requests to /versions/especial with v2', async () => {
        const response = await fetch('http://localhost:3000/api/versions/especial', {
            method: 'GET',
            headers: { 'X-API-Version': '2' }
        });
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ message: 'This is a GET request example for version 3 and 2 especial' });
    });

    it('should handle GET requests to /versions/especial with v3', async () => {
        const response = await fetch('http://localhost:3000/api/versions/especial', {
            method: 'GET',
            headers: { 'X-API-Version': '3' }
        });
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ message: 'This is a GET request example for version 3 and 2 especial' });
    });

    it('should fail GET requests to /versions/especial with v4', async () => {
        const response = await fetch('http://localhost:3000/api/versions/especial', {
            method: 'GET',
            headers: { 'X-API-Version': '4' }
        });
        expect(response.status).toBe(400);
        expect(await response.json()).toEqual(expect.objectContaining({ error: 'Invalid version requested for GET /api/versions/especial' }));
    });

    afterAll(async () => {
        await axiSparkCore.destroy();
    });
});
