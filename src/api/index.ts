import Promise = require("bluebird")
import Transport from "../transport"
import Base from "./base"
import System from "./system"
import _Window from "./window"

export class OpenFinAPI extends Base {
    System: System
    Window: _Window
    constructor(wire: Transport, token?: string) {
        super(wire, token)
        this.System = new System(wire)
        this.Window = new _Window(wire)
    }
    get _token() { return this.token }
}