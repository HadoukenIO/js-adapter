import { EventEmitter } from 'events';

export class EmitterMap {
    private storage: Map<string, EventEmitter>;

    constructor() {
        this.storage = new Map<string, EventEmitter>();
    }
    private hashKeys(keys: string[]) {
        const hashed = keys.map(normalizeString);
        return hashed.join('/');
    }

    public get(keys: EmitterAccessor) {
        const hash = this.hashKeys(keys);
        if (!this.storage.has(hash)) {
            this.storage.set(hash, new EventEmitter());
        }
        return this.storage.get(hash);
    }
    public has(keys: EmitterAccessor) {
        return this.storage.has(this.hashKeys(keys));
    }
    public delete(keys: EmitterAccessor) {
        const hash = this.hashKeys(keys);
        return this.storage.delete(hash);
    }

}

export const emitterMap = new EmitterMap();

function normalizeString(s: string): string {
    const b = new Buffer(s);
    return b.toString('base64');
}

export type SystemEmitterAccessor = ['system'];
export type ApplicationEmitterAccessor = ['application', string];
export type WindowEmitterAccessor = ['window', string, string];
export type HotkeyEmitterAccessor = ['global-hotkey'];

export type EmitterAccessor = SystemEmitterAccessor | ApplicationEmitterAccessor | WindowEmitterAccessor | HotkeyEmitterAccessor | string[];
