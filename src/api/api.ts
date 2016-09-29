import Promise = require("bluebird")

class Base {
    protected wire: any
    protected token: string
    constructor(wire, token?: string) {
        this.wire = wire
        this.token = token
    }
}

export default class OpenFinAPI extends Base {
    System: System
    constructor(wire, token?: string) {
        super(wire, token)
        this.System = new System(wire)
    }
    get _token() {
        return this.token
    }
}

export class System extends Base {
    getVersion(): Promise<string> {
        return Promise.resolve("0.0.0")
    }
}