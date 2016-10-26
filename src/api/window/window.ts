import { Bare, Base } from "../base"
import { WindowIdentity } from "../../identity"
import Bounds from "./bounds"
import BoundsChangedReply from "./bounds-changed"

export default class _WindowModule extends Bare {
    wrap(identity: WindowIdentity): _Window {
        return new _Window(this.wire, identity)
    }
}

// The window.Window name is taken
export class _Window extends Base {
    constructor(wire, protected identity: WindowIdentity) {
        super(wire)
    }
    getBounds(): Promise<Bounds> {
        return this.wire.sendAction("get-window-bounds", this.identity)
            .then(({ payload }) => payload.data as Bounds)
    }
    focus(): Promise<void> {
        return this.wire.sendAction("focus-window", this.identity)
    }
    blur(): Promise<void> {
        return this.wire.sendAction("blur-window", this.identity)
    }
    moveBy(deltaLeft: number, deltaTop: number): Promise<void> {
        return this.wire.sendAction("move-window-by", this.identity.mergeWith({ deltaLeft, deltaTop }))
    }
}
export interface _Window {
    addEventListener(type: "focused", listener: Function) 
    addEventListener(type: "bounds-changed", listener: (data: BoundsChangedReply) => void) 
}