import { Factory } from '@axisparkjs/common';
import { AxiSparkContext } from './axispark-context';
import { AxiSparkCore } from './axispark-core';
import { AxiSparkConfig } from './axispark-config';

class AxiSparkFactoryStatic implements Factory<AxiSparkCore> {
    public create(config?: AxiSparkConfig): AxiSparkCore {
        // Perform any necessary setup or configuration here
        const context = new AxiSparkContext(config);
        return new AxiSparkCore(context);
    }
}

export const AxiSparkFactory = new AxiSparkFactoryStatic();
