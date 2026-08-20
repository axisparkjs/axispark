import { Factory } from '@axisparkjs/common';
import { OpenApiPluginOptions } from './openapi-plugin-options';
import { OpenApiPlugin } from './openapi-plugin';

class OpenApiPluginOptionsFactoryStatic implements Factory<OpenApiPluginOptions> {
    create(options: Omit<OpenApiPluginOptions, 'plugin'>): OpenApiPluginOptions {
        return {
            plugin: OpenApiPlugin,
            docsUrl: '',
            exposeJson: true,
            exposeYaml: true,
            jsonDocumentUrl: 'openapi.json',
            yamlDocumentUrl: 'openapi.yaml',
            globalPrefix: true,
            ...options
        };
    }
}

export const OpenApiPluginOptionsFactory = new OpenApiPluginOptionsFactoryStatic();
