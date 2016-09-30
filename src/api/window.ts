import Promise = require("bluebird")
import Base from "./base"

// The window.Window name is taken
export default class _Window extends Base {
    wrap(uuid: string, name: string): WrapWindow {
        return new WrapWindow(this.wire, uuid, name)
    }
}

export class WrapWindow extends Base {
    constructor(wire, private uuid: string, private name: string) {
        super(wire)
    }
    getBounds(): Promise<Bounds> {
        return new Promise((resolve, reject) => {
            return this.wire.sendAction("get-window-bounds", { uuid: this.uuid, name: this.name })
                .then(({ payload }) => resolve(payload.data as Bounds))
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