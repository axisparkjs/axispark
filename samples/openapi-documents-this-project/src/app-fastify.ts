import { AxiSparkFactory } from '@axisparkjs/core';
import { HttpPlugin } from '@axisparkjs/http';
import { HttpPluginOptionsFactory } from '@axisparkjs/http-fastify';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';
import { OpenApiPlugin, OpenApiPluginOptionsFactory } from '@axisparkjs/openapi';

export const app = AxiSparkFactory.create({
    name: 'TODO Crud',
    basePath: __dirname,
    logTransports: [
        new ConsoleTransport({
            minLevel: LogLevel.Debug,
            formatter: new SimpleFormatter()
        })
    ]
});
app.use(
    OpenApiPlugin,
    OpenApiPluginOptionsFactory.create({
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
);
app.use(
    HttpPlugin,
    HttpPluginOptionsFactory.create({
        basePath: '/api'
    })
);
