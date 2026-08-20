import { PluginOptions } from '@axisparkjs/core';

export interface OpenApiPluginOptions extends PluginOptions {
    info: {
        title: string;
        version: string;
        description?: string;
        termsOfService?: string;
        contact?: {
            name?: string;
            url?: string;
            email?: string;
        };
        license?: {
            name: string;
            url?: string;
            identifier?: string;
        };
        summary?: string;
        externalDocs?: {
            description?: string;
            url: string;
        };
        tags?: {
            name: string;
            description?: string;
        }[];
        servers?: {
            url: string;
            description?: string;
        }[];
    };
    globalPrefix?: boolean;
    docsUrl?: string;
    jsonDocumentUrl?: string;
    yamlDocumentUrl?: string;
    exposeJson?: boolean;
    exposeYaml?: boolean;
}
