import { OpenApiDocumentDefinition } from './openapi-document-definition';

describe('OpenApiDocumentDefinition', () => {
    const document = {
        openapi: '3.0.0',
        info: {
            title: 'Test API',
            version: '1.0.0'
        },
        paths: {
            '/users': {
                get: {
                    responses: {
                        '200': {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    };

    describe('toObject', () => {
        it('should return the original document', () => {
            const definition = new OpenApiDocumentDefinition(document);

            expect(definition.toObject()).toBe(document);
        });
    });

    describe('toJson', () => {
        it('should return pretty JSON by default', () => {
            const definition = new OpenApiDocumentDefinition(document);

            expect(definition.toJson()).toBe(JSON.stringify(document, null, 4));
        });

        it('should return pretty JSON when pretty is true', () => {
            const definition = new OpenApiDocumentDefinition(document);

            expect(definition.toJson(true)).toBe(JSON.stringify(document, null, 4));
        });

        it('should return compact JSON when pretty is false', () => {
            const definition = new OpenApiDocumentDefinition(document);

            expect(definition.toJson(false)).toBe(JSON.stringify(document, null, undefined));
        });
    });

    describe('toYaml', () => {
        it('should return YAML with the default indentation', () => {
            const definition = new OpenApiDocumentDefinition(document);

            expect(definition.toYaml()).toBe(
                `openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      responses:
        "200":
          description: Success
`
            );
        });

        it('should use the provided indentation', () => {
            const definition = new OpenApiDocumentDefinition(document);

            expect(definition.toYaml(4)).toBe(
                `openapi: 3.0.0
info:
    title: Test API
    version: 1.0.0
paths:
    /users:
        get:
            responses:
                "200":
                    description: Success
`
            );
        });
    });
});
