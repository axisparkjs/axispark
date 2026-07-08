import { Factory } from '@axisparkjs/common';
import { AxisparkContext } from './axispark-context';
import { AxisparkCore } from './axispark-core';
import { AxisparkConfig } from '@axisparkjs/core/src/axispark/axispark-config';

export class AxisparkFactoryStatic implements Factory<AxisparkCore> {
    public create(config?: AxisparkConfig): AxisparkCore {
        // Perform any necessary setup or configuration here
        const context = new AxisparkContext(config);
        return new AxisparkCore(context);
    }
}

export const AxisparkFactory = new AxisparkFactoryStatic();
