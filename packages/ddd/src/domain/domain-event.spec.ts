import { DomainEvent } from './domain-event';

class TestDomainEvent extends DomainEvent {}

describe('DomainEvent', () => {
    it('should set occurredOn when the event is created', () => {
        const before = new Date();

        const event = new TestDomainEvent();

        const after = new Date();

        expect(event.occurredOn).toBeInstanceOf(Date);
        expect(event.occurredOn.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(event.occurredOn.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should return a copy of occurredOn', () => {
        const event = new TestDomainEvent();

        const occurredOn = event.occurredOn;
        const originalTime = occurredOn.getTime();

        occurredOn.setFullYear(2000);

        expect(event.occurredOn.getTime()).toBe(originalTime);
        expect(event.occurredOn.getFullYear()).not.toBe(2000);
    });

    it('should return a new Date instance on every access', () => {
        const event = new TestDomainEvent();

        const first = event.occurredOn;
        const second = event.occurredOn;

        expect(first).not.toBe(second);
        expect(first.getTime()).toBe(second.getTime());
    });
});
