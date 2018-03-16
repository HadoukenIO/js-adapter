import { READY_STATE } from './wire';

export class DisconnectedError extends Error {
    constructor(readyState: number) {
        super('Expected websocket state OPEN but found ' + READY_STATE[readyState]);
        this.readyState = readyState;
    }
    public readyState: number;
}

export class UnexpectedActionError extends Error { }

export class DuplicateCorrelationError extends Error { }

export class NoAckError extends Error { }

export class NotImplementedError extends Error { }

export class RuntimeError extends Error {
    constructor(payload: any) {
        const { reason, err } = payload;
        super(reason);
        this.name = 'RuntimeError';

        if (err && err.stack) {
            this.stack = err.stack;
        }
    }
}
