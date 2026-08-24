import { ClassType } from '@axisparkjs/common';
import { AxiSparkCore } from '@axisparkjs/core';
import { Provider } from '@axisparkjs/di';

/**
 * Configuration options for creating a test instance of AxiSparkCore.
 */
export interface AxiSparkTestConfig {
    /**
     * An array of providers or class types to be used in the test context. These can be mock implementations or real implementations of your application's dependencies.
     */
    providers?: (Provider | ClassType)[];

    /**
     * An optional instance of AxiSparkCore to be used as the application context.
     */
    app?: AxiSparkCore;
}
