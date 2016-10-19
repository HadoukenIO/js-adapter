import Base from "./base"
import { Identity } from "../identity"

// The window.Window name is taken
export default class _WindowModule extends Base {
    wrap(identity: Identity): _Window {
        return new _Window(this.wire, identity)
    }
}

export class _Window extends Base {
    constructor(wire, protected identity: Identity) {
        super(wire)
    }
    getBounds(): Promise<Bounds> {
        return new Promise((resolve, reject) => {
            return this.wire.sendAction("get-window-bounds", this.identity.toWireObject())
                .then(({ payload }) => resolve(payload.data as Bounds))
                .catch(reject)
        })
    }
    focus(): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.wire.sendAction("focus-window", this.identity.toWireObject())
                .then(resolve)
                .catch(reject)
        })
    }
}

export interface Bounds {
    height: number
    width: number
    top: number
    left: number
    right?: number
    bottom?: number
}