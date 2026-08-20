import { Body, Controller, Cookie, Delete, Get, Header, NotFoundError, Path, Post, Put, Query } from '@axisparkjs/http';
import { TodoService } from './service';
import { Todo } from './todo';
import { NotEmpty, ParseInt, Pipe } from '@axisparkjs/engine';
import { OpenApiResponse } from '@axisparkjs/openapi';

@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Get()
    @OpenApiResponse({ statusCode: 200, type: 'array', items: [{ type: Todo }], description: 'Returns a list of todos' })
    getTodos() {
        return this.todoService.getTodos();
    }

    @Get(':index')
    @OpenApiResponse({ statusCode: 200, type: Todo, description: 'Returns a todo by index' })
    @OpenApiResponse({ statusCode: 404, description: 'Todo not found' })
    getTodoByIndex(@Path('index') @Pipe(ParseInt(10)) index: number, @Query('includeCompleted') _includeCompleted: boolean) {
        const todo = this.todoService.getTodoByIndex(index);
        if (todo === undefined) {
            throw new NotFoundError('Todo not found');
        }
        return todo;
    }

    @Post()
    @OpenApiResponse({ statusCode: 201, type: Todo, description: 'Creates a new todo' })
    @OpenApiResponse({ statusCode: 400, description: 'Bad request' })
    addTodo(@Body() @Pipe(NotEmpty()) todo: Todo, @Cookie('sessionId') _sessionId: string) {
        const createdTodo = this.todoService.addTodo(todo.task);
        return createdTodo;
    }

    @Put(':index')
    @OpenApiResponse({ statusCode: 200, type: Todo, description: 'Updates a todo by index' })
    @OpenApiResponse({ statusCode: 404, description: 'Todo not found' })
    @OpenApiResponse({ statusCode: 400, description: 'Bad request' })
    updateTodo(@Path('index') @Pipe(ParseInt(10)) index: number, @Body() @Pipe(NotEmpty()) updatedTodo: Todo) {
        const updated = this.todoService.updateTodo(index, updatedTodo.task);
        if (updated === undefined) {
            throw new NotFoundError('Todo not found');
        }
        return updated;
    }

    @Delete(':index')
    @OpenApiResponse({ statusCode: 204, description: 'Deletes a todo by index' })
    @OpenApiResponse({ statusCode: 404, description: 'Todo not found' })
    removeTodo(@Path('index') @Pipe(ParseInt(10)) index: number, @Header('Authorization') _authHeader: string) {
        this.todoService.removeTodo(index);
        return;
    }
}
