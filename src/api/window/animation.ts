import { Identity } from '../../identity';
import Transport from '../../transport/transport';
const DEFAULT_DURATION = 1000;

export default class Animation {
    protected payload: any;

    constructor(protected wire: Transport, protected identity: Identity, interrupt: boolean) {
        this.payload = { options: { interrupt }};
    }

    public size(width?: number, height?: number, duration: number = DEFAULT_DURATION) {
        Object.assign(this.payload, { size: { width, height, duration }});
    }

    public position(left?: number, top?: number, duration: number = DEFAULT_DURATION) {
        Object.assign(this.payload, { position: { left, top, duration }});
    }

    public opacity(opacity: number, duration: number = DEFAULT_DURATION) {
        Object.assign(this.payload, { opacity: { opacity, duration }});
    }

    public animate(): Promise<void> {
        return this.wire.sendAction('animate-window', Object.assign({}, this.identity, this.payload)).then(() => undefined);
    }
}
