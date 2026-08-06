import { MetadataKey } from './metadata-key';

export const MetadataKeys = {
    /* Common */
    DESIGN_PARAM_TYPES: new MetadataKey('design:paramtypes'),
    DESIGN_RETURN_TYPE: new MetadataKey('design:returntype'),
    DESIGN_TYPE: new MetadataKey('design:type'),

    /* Di */
    CONSTRUCTABLE: new MetadataKey('constructable'),
    INJECTABLE: new MetadataKey('injectable'),
    INJECTABLE_TOKEN: new MetadataKey('injectable-token'),
    INJECT: new MetadataKey('inject'),

    /* Core */
    PLUGIN: new MetadataKey('plugin'),

    /* Engine */
    PARAMETER: new MetadataKey('parameter'),
    PIPE: new MetadataKey('pipe'),
    EXECUTION_STEP_USE: new MetadataKey('execution-step-use'),
    EXECUTION_STEP_TARGET: new MetadataKey('execution-step-target'),
    EXECUTION_STEP_METHOD: new MetadataKey('execution-step-method'),

    /* Http */
    CONTROLLER: new MetadataKey('controller'),
    ROUTE: new MetadataKey('route'),
    HTTP_CODE: new MetadataKey('http-code'),

    /* Schedule */
    SCHEDULER: new MetadataKey('scheduler'),
    JOB: new MetadataKey('job'),

    /* OpenApi (in progress) */
    OPENAPI_RESPONSE: new MetadataKey('openapi-response'),
    OPENAPI_SCHEMA: new MetadataKey('openapi-schema'),
    OPENAPI_PROPERTY: new MetadataKey('openapi-property')
} as const;
