import Promise = require("bluebird")
import Base from "./base"

export default class _Window extends Base {
    wrap(uuid: string, name: string): WrapWindow {
        return new WrapWindow(this.wire, uuid, name)
    }
}

export class WrapWindow extends Base {
    private uuid: string
    private name: string
    constructor(wire, uuid: string, name: string) {
        super(wire)
        this.uuid = uuid
        this.name = name
    }
    getBounds(): Promise<Bounds> {
        return new Promise((resolve, reject) => {
            return this.wire.sendAction("get-window-bounds", { uuid: this.uuid, name: this.name })
                .then(({ action, payload }) => {
                    this.wire.assertAck(action, reject)
                    if (payload.success)
                        resolve(new Bounds(payload.data))
                    else    
                        reject(payload)
                })
        })
    }
}

export class Bounds {
    height: number
    width: number
    top: number
    left: number
    //right?: number
    //bottom?: number
    constructor(data) {
        this.height = data.height
        this.width = data.width
        this.top = data.top
        this.left = data.left
    }
}