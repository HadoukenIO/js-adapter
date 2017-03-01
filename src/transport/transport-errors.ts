export class UnexpectedAction extends Error {}
export class DuplicateCorrelation extends Error {}
export class NoAck extends Error {}
export class NoCorrelation extends Error {}
export class ListenerNotRegistered extends Error {}
export class RuntimeError extends Error {
    constructor(payload: any) {
        const { reason, err } = payload;
        super(reason);
        this.name = "RuntimeError";

        if (err && err.stack) {
            this.stack = err.stack;
        }
    }
}
