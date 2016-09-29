import Transport from "../transport"

export default class Base {
    protected wire: Transport
    protected token: string
    constructor(wire: Transport, token?: string) {
        this.wire = wire
        this.token = token
    }
}