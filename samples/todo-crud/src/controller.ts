import { Body, Controller, Delete, Get, NotFoundError, Param, Post, Put } from '@axisparkjs/http';
import { TodoService } from './service';
import { NotEmpty, ParseInt, Pipe } from '@axisparkjs/engine';

@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Get()
    getTodos() {
        return this.todoService.getTodos();
    }

    @Get(':index')
    getTodoByIndex(@Param('index') @Pipe(ParseInt(10)) index: number) {
        const todo = this.todoService.getTodoByIndex(index);
        if (todo === undefined) {
            throw new NotFoundError('Todo not found');
        }
        return todo;
    }

    @Post()
    addTodo(@Body() @Pipe(NotEmpty()) todo: { task: string }) {
        const createdTodo = this.todoService.addTodo(todo.task);
        return createdTodo;
    }

    @Put(':index')
    updateTodo(@Param('index') @Pipe(ParseInt(10)) index: number, @Body() @Pipe(NotEmpty()) updatedTodo: { task: string }) {
        const updated = this.todoService.updateTodo(index, updatedTodo.task);
        if (updated === undefined) {
            throw new NotFoundError('Todo not found');
        }
        return updated;
    }

    @Delete(':index')
    removeTodo(@Param('index') @Pipe(ParseInt(10)) index: number) {
        this.todoService.removeTodo(index);
        return;
    }
}
