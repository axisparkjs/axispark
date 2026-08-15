import { ClassType, MetadataFromMethod } from '@axisparkjs/common';
import { StepType, StepScope } from '../step';

export interface StepMethodMetadataBase extends MetadataFromMethod {
    type: StepType;
}
export interface HandleMetadata extends StepMethodMetadataBase {
    type: StepType.Middleware;
}
export interface CheckMetadata extends StepMethodMetadataBase {
    type: StepType.Guard;
}
export interface BeforeMetadata extends StepMethodMetadataBase {
    type: StepType.Interceptor;
    scope: StepScope.Before;
}
export interface AfterMetadata extends StepMethodMetadataBase {
    type: StepType.Interceptor;
    scope: StepScope.After;
}
export interface CatchMetadata extends StepMethodMetadataBase {
    type: StepType.Filter;
    acceptedErrors: ClassType<Error>[];
}

export type StepMethodMetadata = StepMethodMetadataBase & (HandleMetadata | CheckMetadata | BeforeMetadata | AfterMetadata | CatchMetadata);
