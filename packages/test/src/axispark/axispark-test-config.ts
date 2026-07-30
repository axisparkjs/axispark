import { AxiSparkCore } from '@axisparkjs/core';
import { Constructor, Provider } from '@axisparkjs/di';

export interface AxiSparkTestConfig {
    providers?: (Provider | Constructor)[];
    app?: AxiSparkCore;
}
