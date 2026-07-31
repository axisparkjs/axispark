import { Injectable } from "@axisparkjs/di";
import { Todo } from "./todo";

@Injectable()
export class TodoService {
    private todos: Todo[] = [];

    public getTodos(): Todo[] {
        return this.todos;
    }

    public getTodoByIndex(index: number): Todo | undefined {
        if (index >= 0 && index < this.todos.length) {
            return this.todos[index];
        }
        return undefined;
    }

    public addTodo(todo: string): Todo {
        const newTodo: Todo = {
            index: this.todos.length,
            task: todo
        };
        this.todos.push(newTodo);
        return newTodo;
    }

    public updateTodo(index: number, updatedTodo: string): Todo | undefined {
        if (index >= 0 && index < this.todos.length) {
            this.todos[index] = { ...this.todos[index], task: updatedTodo };
            return this.todos[index];
        }
        return undefined;
    }

    public removeTodo(index: number): void {
        if (index >= 0 && index < this.todos.length) {
            this.todos.splice(index, 1);
        }
    }
}