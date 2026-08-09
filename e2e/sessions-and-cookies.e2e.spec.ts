import { AxiSparkTestFactory } from '@axisparkjs/test';
import { AxiSparkCore } from '@axisparkjs/core';
import { HttpPlugin } from '@axisparkjs/http';
import { app as appExpress } from '@axisparkjs/samples/sessions-and-cookies/src/app-express';
import { app as appFasitfy } from '@axisparkjs/samples/sessions-and-cookies/src/app-fastify';
import { ExpressHttpAdapter } from '@axisparkjs/http-express';
import { FastifyHttpAdapter } from '@axisparkjs/http-fastify';

describe.each([
    { name: 'Express', app: appExpress },
    { name: 'Fastify', app: appFasitfy }
])('Sessions and Cookies App ($name)', ({ app, name }) => {
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

    it('should create the app with Sessions and Cookies plugin', async () => {
        const plugins = axiSparkCore.used();
        expect(plugins).toHaveLength(1);
        expect(plugins).toStrictEqual([
            {
                type: HttpPlugin,
                options: expect.objectContaining({
                    adapter: name === 'Express' ? ExpressHttpAdapter : FastifyHttpAdapter,
                    plugin: HttpPlugin,
                    port: 3000,
                    cookies: true,
                    session: true
                })
            }
        ]);
    });

    it('should handle GET requests to /sessions and sessionId to be defined', async () => {
        const response = await fetch('http://localhost:3000/sessions', {
            method: 'GET'
        });
        expect(response.status).toBe(200);
        expect(await response.text()).toBeDefined();
    });

    it('should handle 2 GET requests to /sessions and sessionId to be the same', async () => {
        const response1 = await fetch('http://localhost:3000/sessions', {
            method: 'GET'
        });
        expect(response1.status).toBe(200);
        const sessionId1 = await response1.text();
        expect(sessionId1).toBeDefined();

        const response2 = await fetch('http://localhost:3000/sessions', {
            method: 'GET',
            headers: {
                Cookie: response1.headers.get('set-cookie') ?? ''
            }
        });
        expect(response2.status).toBe(200);
        const sessionId2 = await response2.text();
        expect(sessionId2).toBeDefined();

        expect(sessionId1).toEqual(sessionId2);
    });

    it('should handle POST requests to /sessions/data and set session data', async () => {
        const response1 = await fetch('http://localhost:3000/sessions/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: 'test' })
        });
        expect(response1.status).toBe(201);
        const sessionData1 = await response1.json();
        expect(sessionData1).toEqual({ data: 'test' });

        const response2 = await fetch('http://localhost:3000/sessions/data', {
            method: 'GET',
            headers: {
                Cookie: response1.headers.get('set-cookie') ?? ''
            }
        });
        expect(response2.status).toBe(200);
        const sessionData2 = await response2.json();
        expect(sessionData2).toEqual({ data: 'test' });
    });

    it('should handle DELETE requests to /sessions/data and delete session data', async () => {
        const response1 = await fetch('http://localhost:3000/sessions/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: 'test' })
        });
        expect(response1.status).toBe(201);
        const sessionData1 = await response1.json();
        expect(sessionData1).toEqual({ data: 'test' });

        const response2 = await fetch('http://localhost:3000/sessions/data', {
            method: 'DELETE',
            headers: {
                Cookie: response1.headers.get('set-cookie') ?? ''
            }
        });
        expect(response2.status).toBe(204);
    });

    it('should handle GET requests to /sessions/data and return undefined if no session data', async () => {
        const response = await fetch('http://localhost:3000/sessions/data', {
            method: 'GET'
        });
        expect(response.status).toBe(200);
        const sessionData = await response.bytes();
        expect(sessionData.length).toBe(0);
    });

    it('should handle GET requests to /cookies and return cookies', async () => {
        const response = await fetch('http://localhost:3000/cookies', {
            method: 'GET'
        });
        expect(response.status).toBe(200);
        const cookies = await response.json();
        expect(cookies).toEqual({});
    });

    it('should handle POST requests to /cookies and set a cookie', async () => {
        const response1 = await fetch('http://localhost:3000/cookies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'testCookie', value: 'testValue' })
        });
        expect(response1.status).toBe(201);

        const response2 = await fetch('http://localhost:3000/cookies', {
            method: 'GET',
            headers: {
                Cookie: response1.headers.get('set-cookie') ?? ''
            }
        });
        expect(response2.status).toBe(200);
        const cookies = await response2.json();
        expect(cookies).toEqual(expect.objectContaining({ testCookie: 'testValue' }));
    });

    it('should handle DELETE requests to /cookies/:name and delete a cookie', async () => {
        const response1 = await fetch('http://localhost:3000/cookies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'testCookie', value: 'testValue' })
        });
        expect(response1.status).toBe(201);

        const response2 = await fetch('http://localhost:3000/cookies/testCookie', {
            method: 'DELETE',
            headers: {
                Cookie: response1.headers.get('set-cookie') ?? ''
            }
        });
        expect(response2.status).toBe(204);

        const response3 = await fetch('http://localhost:3000/cookies', {
            method: 'GET',
            headers: {
                Cookie: response2.headers.get('set-cookie') ?? ''
            }
        });
        expect(response3.status).toBe(200);
        const cookies: any = await response3.json();
        expect(cookies.testCookie).toBe('');
    });

    afterAll(async () => {
        await axiSparkCore.destroy();
    });
});
