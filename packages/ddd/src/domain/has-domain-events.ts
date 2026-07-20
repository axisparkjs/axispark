import { DomainEvent } from "./domain-event";

export interface HasDomainEvents {
    pullDomainEvents(): DomainEvent[];
}