import { AggregateRoot } from './aggregate-root';
import { DomainEvent } from './domain-event';
import { Identifier } from './identifier';

class TestIdentifier extends Identifier {
    validate(value: string): void {
        if (!value || value.trim() === '') throw new Error('Identifier cannot be empty');
    }
}

class TestAggregateRoot extends AggregateRoot<TestIdentifier> {}

class TestDomainEvent extends DomainEvent {}

describe('AggregateRoot', () => {
    let aggregate: TestAggregateRoot;

    beforeEach(() => {
        aggregate = new TestAggregateRoot(new TestIdentifier('1'));
    });

    it('should add a domain event', () => {
        const event = new TestDomainEvent();

        aggregate.addDomainEvent(event);

        expect(aggregate.pullDomainEvents()).toEqual([event]);
    });

    it('should return all domain events when pulling them', () => {
        const event1 = new TestDomainEvent();
        const event2 = new TestDomainEvent();

        aggregate.addDomainEvent(event1);
        aggregate.addDomainEvent(event2);

        const events = aggregate.pullDomainEvents();

        expect(events).toEqual([event1, event2]);
    });

    it('should clear domain events after pullDomainEvents', () => {
        aggregate.addDomainEvent(new TestDomainEvent());

        aggregate.pullDomainEvents();

        expect(aggregate.pullDomainEvents()).toEqual([]);
    });

    it('should clear domain events when clearDomainEvents is called', () => {
        aggregate.addDomainEvent(new TestDomainEvent());
        aggregate.addDomainEvent(new TestDomainEvent());

        aggregate.clearDomainEvents();

        expect(aggregate.pullDomainEvents()).toEqual([]);
    });

    it('should return a copy of the events array', () => {
        const event = new TestDomainEvent();

        aggregate.addDomainEvent(event);

        const events = aggregate.pullDomainEvents();

        events.push(new TestDomainEvent());

        expect(events).toHaveLength(2);
        expect(aggregate.pullDomainEvents()).toEqual([]);
    });

    it('should return an empty array when there are no domain events', () => {
        expect(aggregate.pullDomainEvents()).toEqual([]);
    });
});
