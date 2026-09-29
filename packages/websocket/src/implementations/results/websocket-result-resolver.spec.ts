import { WebSocketResultResolver } from './websocket-result-resolver';
import { OkWebSocketResult } from './websocket-result';

describe('WebSocketResultResolver', () => {
    it.each([undefined, null])('handles empty value %s', (value) => expect(new WebSocketResultResolver().resolve(value)).toBeDefined());
    it('wraps non-empty values', () => expect(new WebSocketResultResolver().resolve(0)).toBeInstanceOf(OkWebSocketResult));
});
