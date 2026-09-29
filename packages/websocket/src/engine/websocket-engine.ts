import { Executable } from '@axisparkjs/common';
import { WebSocketContext } from '../types';
import { Injectable } from '@axisparkjs/di';
import { ExecutionEngine } from '@axisparkjs/engine';

/**
 * A class for handling WebSocket engine operations.
 */
@Injectable()
export class WebSocketEngine implements Executable {
    constructor(private readonly executionEngine: ExecutionEngine) {}

    /**
     * Executes the WebSocket engine with the provided context.
     * @param context The WebSocket context for execution.
     */
    public async execute(context: WebSocketContext): Promise<void> {
        await this.executionEngine.execute(context);
    }
}
