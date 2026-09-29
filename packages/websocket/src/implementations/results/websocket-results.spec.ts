import { WebSocketResults } from './websocket-results';
import { OkWebSocketResult, ErrorWebSocketResult } from './websocket-result';
import { WebSocketError } from '../errors';

describe('WebSocketResults', () => {
    it('creates successful and error results', () => {
        expect(WebSocketResults.Ok('ok')).toBeInstanceOf(OkWebSocketResult);
        expect(WebSocketResults.Error(new WebSocketError('bad'))).toBeInstanceOf(ErrorWebSocketResult);
    });
});
