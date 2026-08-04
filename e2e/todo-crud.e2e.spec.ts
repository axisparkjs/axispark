import { AxiSparkTestFactory } from '@axisparkjs/test';
import { AxiSparkCore } from '@axisparkjs/core';
import { HttpPlugin } from '@axisparkjs/http';
import { app } from '@axisparkjs/samples/todo-crud/src/app';
import { ExpressHttpAdapter } from '@axisparkjs/http-express';

describe('TODO Crud App', () => {
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

    it('should create the app with TODO Crud plugin', async () => {
        const plugins = axiSparkCore.used();
        expect(plugins).toHaveLength(1);
        expect(plugins).toStrictEqual([
            {
                type: HttpPlugin,
                options: expect.objectContaining({
                    adapter: ExpressHttpAdapter,
                    bodyParser: true,
                    plugin: HttpPlugin,
                    port: 3000
                })
            }
        ]);
    });

    it('should handle GET requests to /todos', async () => {
        const response = await fetch('http://localhost:3000/api/todos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual([]);
    });

    it('should handle GET requests to /todos/:index when the index is not found', async () => {
        const response = await fetch('http://localhost:3000/api/todos/999', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        expect(response.status).toBe(404);
    });

    it('should handle POST requests to /todos', async () => {
        const newTodo = { task: 'Test Todo' };
        const response = await fetch('http://localhost:3000/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTodo)
        });
        expect(response.status).toBe(201);
        const createdTodo = await response.json();
        expect(createdTodo).toMatchObject(newTodo);
    });

    it('should handle PUT requests to /todos/:index', async () => {
        const updatedTodo = { task: 'Updated Test Todo' };
        const response = await fetch('http://localhost:3000/api/todos/0', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTodo)
        });
        expect(response.status).toBe(200);
        const updatedTodoResponse = await response.json();
        expect(updatedTodoResponse).toMatchObject(updatedTodo);
    });

    it('should handle GET requests to /todos/:index when the index is found', async () => {
        const response = await fetch('http://localhost:3000/api/todos/0', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        expect(response.status).toBe(200);
        const todo = await response.json();
        expect(todo).toMatchObject({ index: 0, task: 'Updated Test Todo' });
    });

    it('should handle DELETE requests to /todos/:index', async () => {
        const response = await fetch('http://localhost:3000/api/todos/0', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        expect(response.status).toBe(204);
    });

    afterAll(async () => {
        await axiSparkCore.destroy();
    });
});
