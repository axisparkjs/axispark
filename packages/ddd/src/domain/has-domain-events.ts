import { DomainEvent } from './domain-event';

/**
 * HasDomainEvents is an interface that defines the contract for classes that can have domain events associated with them. It provides a method for pulling domain events, allowing implementing classes to manage and retrieve their domain events in a consistent manner. This interface is typically implemented by aggregate roots or other domain entities that need to track and handle domain events within a domain-driven design context.
 */
export interface HasDomainEvents {
    /**
     * Pulls all domain events from the implementing class and clears the list of domain events. This method allows the implementing class to retrieve its domain events and reset its state.
     * @returns An array of domain events that were associated with the implementing class.
     */
    pullDomainEvents(): DomainEvent[];
}
