import { DomainEvent } from './domain-event';
import { Entity } from './entity';
import { HasDomainEvents } from './has-domain-events';
import { Identifier } from './identifier';

export abstract class AggregateRoot<T extends Identifier> extends Entity<T> implements HasDomainEvents {
    private readonly _domainEvents: DomainEvent[] = [];

    public addDomainEvent(event: DomainEvent): void {
        this._domainEvents.push(event);
    }

    public pullDomainEvents(): DomainEvent[] {
        const events = [...this._domainEvents];
        this.clearDomainEvents();
        return events;
    }

    public clearDomainEvents(): void {
        this._domainEvents.length = 0;
    }
}
