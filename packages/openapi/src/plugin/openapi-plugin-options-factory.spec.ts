import { OpenApiPlugin } from './openapi-plugin';
import { OpenApiPluginOptionsFactory } from './openapi-plugin-options-factory';

describe('OpenApiPluginOptionsFactory', () => {
    describe('create', () => {
        it('should create options with default values', () => {
            const result = OpenApiPluginOptionsFactory.create({
                info: {
                    title: 'Test API',
                    version: '1.0.0'
                }
            });

            expect(result).toEqual({
                plugin: OpenApiPlugin,
                docsUrl: '',
                exposeJson: true,
                exposeYaml: true,
                jsonDocumentUrl: 'openapi.json',
                yamlDocumentUrl: 'openapi.yaml',
                globalPrefix: true,
                info: {
                    title: 'Test API',
                    version: '1.0.0'
                }
            });
        });

        it('should override default values with provided options', () => {
            const result = OpenApiPluginOptionsFactory.create({
                info: {
                    title: 'Custom API',
                    version: '2.0.0'
                },
                docsUrl: '/docs',
                exposeJson: false,
                exposeYaml: false,
                jsonDocumentUrl: '/custom.json',
                yamlDocumentUrl: '/custom.yaml',
                globalPrefix: false
            });

            expect(result).toEqual({
                plugin: OpenApiPlugin,
                docsUrl: '/docs',
                exposeJson: false,
                exposeYaml: false,
                jsonDocumentUrl: '/custom.json',
                yamlDocumentUrl: '/custom.yaml',
                globalPrefix: false,
                info: {
                    title: 'Custom API',
                    version: '2.0.0'
                }
            });
        });

        it('should always set the OpenApiPlugin as plugin', () => {
            const result = OpenApiPluginOptionsFactory.create({
                info: {
                    title: 'Test API',
                    version: '1.0.0'
                }
            });

            expect(result.plugin).toBe(OpenApiPlugin);
        });
    });
});
