import { MetadataFromClass } from "@axisparkjs/common";

export interface ControllerMetadata extends MetadataFromClass {
    prefix: string;
    version?: string | string[];
}
