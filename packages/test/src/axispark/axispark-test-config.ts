import { ClassType } from '@axisparkjs/common';
import { AxiSparkCore } from '@axisparkjs/core';
import { Provider } from '@axisparkjs/di';

export interface AxiSparkTestConfig {
    providers?: (Provider | ClassType)[];
    app?: AxiSparkCore;
}
