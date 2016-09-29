export default class Base {
    protected wire: any
    protected token: string
    constructor(wire, token?: string) {
        this.wire = wire
        this.token = token
    }
}