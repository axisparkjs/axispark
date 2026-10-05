import { WebSocketEngine } from './websocket-engine';

describe('WebSocketEngine', () => {
    it('delegates execution to the shared execution engine', async () => {
        const execute = jest.fn();
        const context = {} as any;
        await new WebSocketEngine({ execute } as any).execute(context);
        expect(execute).toHaveBeenCalledWith(context);
    });
});
