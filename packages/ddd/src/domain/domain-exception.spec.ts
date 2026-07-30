import { DomainException } from './domain-exception';

class TestDomainException extends DomainException {
    constructor(message = 'Test exception') {
        super(message);
    }
}

describe('DomainException', () => {
    it('should extend Error', () => {
        const exception = new TestDomainException();

        expect(exception).toBeInstanceOf(Error);
    });

    it('should set the message', () => {
        const exception = new TestDomainException('Something went wrong');

        expect(exception.message).toBe('Something went wrong');
    });

    it('should set the name to the subclass name', () => {
        const exception = new TestDomainException();

        expect(exception.name).toBe('TestDomainException');
    });

    it('should preserve the prototype chain', () => {
        const exception = new TestDomainException();

        expect(exception).toBeInstanceOf(TestDomainException);
        expect(exception).toBeInstanceOf(DomainException);
        expect(exception).toBeInstanceOf(Error);
    });
});
