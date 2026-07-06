export class DecoratorNotIncludedError extends Error {
    constructor(className: string, decoratorName: string) {
        super(`${className} is not decorated with @${decoratorName}. Please decorate it before binding.`);
        this.name = 'DecoratorNotIncludedError';
    }
}
