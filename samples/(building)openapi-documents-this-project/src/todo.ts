import { OpenApiProperty, OpenApiSchema } from '@axisparkjs/openapi';

@OpenApiSchema({ description: 'Extra information for the Todo item', example: { description: 'This is a sample task', completed: false } })
export class TodoExtra {
    @OpenApiProperty({ name: 'Description', type: 'string', default: 'No description', description: 'The description of the task', maxLength: 200, minLength: 1, pattern: '^[a-zA-Z0-9 ]+$' })
    description: string;

    @OpenApiProperty({ name: 'Completed', type: 'boolean', default: false, description: 'Whether the task is completed or not' })
    completed: boolean;
}

@OpenApiSchema()
export class Todo {
    @OpenApiProperty()
    index: number;

    @OpenApiProperty({ name: 'Task', type: 'string', default: 'New Task', description: 'The task to be done', maxLength: 100, minLength: 1, pattern: '^[a-zA-Z0-9 ]+$' })
    task: string;

    @OpenApiProperty()
    todo?: TodoExtra;
}
