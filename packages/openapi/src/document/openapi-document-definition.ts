import { stringify } from 'yaml';

export class OpenApiDocumentDefinition {
    private readonly document: object;

    constructor(document: object) {
        this.document = document;
    }

    public toObject(): object {
        return this.document;
    }

    public toJson(pretty = true): string {
        return JSON.stringify(this.document, null, pretty ? 4 : undefined);
    }

    public toYaml(indent = 2): string {
        return stringify(this.document, { indent });
    }
}
