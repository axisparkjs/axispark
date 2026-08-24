/**
 * DomainException is an abstract class that represents a domain-specific exception in a domain-driven design context. It extends the built-in Error class and provides a base for creating custom exceptions that are specific to the domain logic of an application. Subclasses of DomainException can be created to represent specific error conditions within the domain, allowing for more meaningful error handling and communication of issues that arise during the execution of domain logic.
 */
export abstract class DomainException extends Error {
    /**
     * Initializes a new instance of the DomainException class.
     * @param message The error message for the exception.
     */
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
