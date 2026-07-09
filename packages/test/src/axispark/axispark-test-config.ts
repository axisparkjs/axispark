import { AxisparkCore } from '@axisparkjs/core';
import { Constructor, Provider } from '@axisparkjs/di';

export interface AxisparkTestConfig {
    providers?: (Provider | Constructor)[];
    app?: AxisparkCore;
}
