import { Bare, Base } from "../base";
import { WindowIdentity } from "../../identity";
import Bounds from "./bounds";
import BoundsChangedReply from "./bounds-changed";
import Animation from "./animation";

export default class _WindowModule extends Bare {
    wrap(identity: WindowIdentity): _Window {
        return new _Window(this.wire, identity);
    }
}

// The window.Window name is taken
export class _Window extends Base {
    constructor(wire, protected identity: WindowIdentity) {
        super(wire);
    }

    getBounds(): Promise<Bounds> {
        return this.wire.sendAction("get-window-bounds", this.identity)
            .then(({ payload }) => payload.data as Bounds);
    }

    focus(): Promise<void> {
        return this.wire.sendAction("focus-window", this.identity);
    }
    blur(): Promise<void> {
        return this.wire.sendAction("blur-window", this.identity);
    }
    bringToFront(): Promise<void> {
        return this.wire.sendAction("bring-window-to-front", this.identity);
    }

    moveBy(deltaLeft: number, deltaTop: number): Promise<void> {
        return this.wire.sendAction("move-window-by", this.identity.mergeWith({ deltaLeft, deltaTop }));
    }
    moveTo(left: number, top: number): Promise<void> {
        return this.wire.sendAction("move-window", this.identity.mergeWith({ left, top }));
    }
    animationBuilder(interrupt = false): Animation {
        return new Animation(this.wire, this.identity, interrupt);
    }

    hide(): Promise<void> {
        return this.wire.sendAction("hide-window", this.identity);
    }
    show(force = false): Promise<void> {
        return this.wire.sendAction("show-window", this.identity.mergeWith({ force }));
    }

    close(force = false): Promise<void> {
        return this.wire.sendAction("close-window", this.identity.mergeWith({ force }))
            .then(() => Object.setPrototypeOf(this, null));
    }

    getNativeId(): Promise<string> {
        return this.wire.sendAction("get-window-native-id", this.identity)
            .then(({ payload }) => payload.data);
    }
}
export interface _Window {
    addEventListener(type: "focused", listener: Function);
    addEventListener(type: "bounds-changed", listener: (data: BoundsChangedReply) => void);
    addEventListener(type: "hidden", listener: Function);
}
