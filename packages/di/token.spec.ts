import { InjectionToken, TokenUtils } from './token';

class TestClass {}

const tokenText = 'test-token';
const token = new InjectionToken(tokenText);

describe('InjectionToken', () => {
    it('should store the description', () => {
        expect(token.description).toBe(tokenText);
    });

    it('should return the description in toString()', () => {
        expect(token.toString()).toBe(tokenText);
    });
});

describe('TokenUtils', () => {
    it('should return the description for an InjectionToken', () => {
        expect(TokenUtils.getName(token)).toBe(tokenText);
    });

    it('should return the constructor name for a class token', () => {
        expect(TokenUtils.getName(TestClass)).toBe('TestClass');
    });
});
