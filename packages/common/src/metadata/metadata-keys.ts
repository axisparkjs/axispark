import { MetadataKey } from './metadata-key';

export const MetadataKeys = {
    DESIGN_PARAM_TYPES: new MetadataKey('design:paramtypes'),
    CONSTRUCTABLE: new MetadataKey('constructable'),
    INJECTABLE: new MetadataKey('injectable'),
    INJECT: new MetadataKey('inject'),
    PLUGIN: new MetadataKey('plugin'),
    PARAMETER: new MetadataKey('parameter'),
    PIPE: new MetadataKey('pipe'),
    EXECUTION_STEP_USE: new MetadataKey('execution-step-use'),
    EXECUTION_STEP_TARGET: new MetadataKey('execution-step-target'),
    EXECUTION_STEP_METHOD: new MetadataKey('execution-step-method'),

    CONTROLLER: new MetadataKey('controller'),
    ROUTE: new MetadataKey('route'),
    HTTP_CODE: new MetadataKey('http-code'),

    SCHEDULER: new MetadataKey('scheduler'),
    JOB: new MetadataKey('job')
} as const;
