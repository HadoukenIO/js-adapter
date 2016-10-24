import { Base, Base_with_Identity } from "../base"
import { Identity } from "../../identity"
import Bounds from "./bounds"

// The window.Window name is taken
export default class _WindowModule extends Base {
    wrap(identity: Identity): _Window {
        return new _Window(this.wire, identity)
    }
}

export class _Window extends Base_with_Identity {
    constructor(wire, protected identity: Identity) {
        super(wire)
    }
    getBounds(): Promise<Bounds> {
        return this.wire.sendAction("get-window-bounds", this.identity.toWireObject())
            .then(({ payload }) => payload.data as Bounds)
    }
    focus(): Promise<void> {
        return this.wire.sendAction("focus-window", this.identity.toWireObject())
    }
    blur(): Promise<void> {
        return this.wire.sendAction("blur-window", this.identity.toWireObject())
    }
}
export interface _Window {
    addEventListener(type: "focused", listener: Function) 
}