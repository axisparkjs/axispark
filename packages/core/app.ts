import 'reflect-metadata';
import { axisparkFactory } from '@axispark/core';
import { HttpPlugin, UnauthorizedError, Catch, Controller, ErrorHandler, HttpContext, Get, HttpResponse, Response, HttpCode } from '@axispark/http';
import { HttpPluginOptionsFactory } from '@axispark/http-express';
import { ErrorHandler } from '@axispark/http/types/error-handler';

@ErrorHandler()
@Controller()
class HelloController implements ErrorHandler {
    @Catch(UnauthorizedError)
    hello(error: UnauthorizedError, context: HttpContext) {
        console.log(`Caught error: ${error.message} in controller ${HelloController.name}`);
        console.log(`Request path: ${context.request.path}`);
        context.response.status(200).send(`Caught error: ${error.message}`);
    }

    @Get('/hello')
    @HttpCode(204)
    posthello(@Response() response: HttpResponse) {
        response.status(200).send('Hello, world!');
    }
}

async function main() {
    const app = axisparkFactory.create();
    await app.use(
        HttpPlugin,
        HttpPluginOptionsFactory.create({
            port: 3000,
            controllers: [HelloController],
            errorHandlers: [HelloController]
        })
    );
    await app.init();
    await app.run();
    await app.destroy();
}

main().catch((error) => {
    console.error('Error during application execution:', error);
    process.exit(1);
});
