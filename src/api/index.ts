import Promise = require("bluebird")
import System from "./system"
import Base from "./base"

export class OpenFinAPI extends Base {
    System: System
    constructor(wire, token?: string) {
        super(wire, token)
        this.System = new System(wire)
    }
    get _token() { return this.token }
}