import { Controller, Get } from '@axisparkjs/http';

@Controller('example')
export class ExampleController {
    @Get()
    get() {
        return { message: 'Hello, world!' };
    }
}
