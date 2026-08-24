import { stringify } from 'yaml';

/**
 * A class for defining the structure of an OpenAPI document.
 */
export class OpenApiDocumentDefinition {
    private readonly document: object;

    constructor(document: object) {
        this.document = document;
    }

    /**
     * Returns the OpenAPI document as an object.
     * @returns The OpenAPI document.
     */
    public toObject(): object {
        return this.document;
    }

    /**
     * Returns the OpenAPI document as a JSON string.
     * @param pretty Whether to format the JSON string with indentation.
     * @returns The OpenAPI document as a JSON string.
     */
    public toJson(pretty = true): string {
        return JSON.stringify(this.document, null, pretty ? 4 : undefined);
    }

    /**
     * Returns the OpenAPI document as a YAML string.
     * @param indent The number of spaces to use for indentation.
     * @returns The OpenAPI document as a YAML string.
     */
    public toYaml(indent = 2): string {
        return stringify(this.document, { indent });
    }
}
