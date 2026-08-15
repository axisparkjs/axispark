import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';
import { Scheduler } from './scheduler';

jest.mock('@axisparkjs/di', () => ({
    Constructable: jest.fn()
}));

describe('Scheduler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should apply the Constructable decorator', () => {
        const constructableDecorator = jest.fn();
        (Constructable as jest.Mock).mockReturnValue(constructableDecorator);

        class TestScheduler {}

        @Scheduler()
        class DecoratedScheduler extends TestScheduler {}

        expect(Constructable).toHaveBeenCalledWith(MetadataKeys.INJECTABLE);
        expect(constructableDecorator).toHaveBeenCalledWith(DecoratedScheduler);
    });

    it('should define scheduler metadata', () => {
        const constructableDecorator = jest.fn();
        (Constructable as jest.Mock).mockReturnValue(constructableDecorator);

        const defineSpy = jest.spyOn(Metadata, 'define').mockImplementation();

        @Scheduler()
        class TestScheduler {}

        expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.SCHEDULER, { target: TestScheduler }, TestScheduler);
    });
});
