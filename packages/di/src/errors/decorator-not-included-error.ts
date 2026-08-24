/**
 * Represents an error that occurs when a required decorator is not included on a class.
 */
export class DecoratorNotIncludedError extends Error {
    constructor(className: string, decoratorName: string) {
        super(`${className} is not decorated with @${decoratorName}. Please decorate it before binding.`);
        this.name = 'DecoratorNotIncludedError';
    }
}
