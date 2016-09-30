import Transport from "../transport"

export default class Base {
    constructor(protected wire: Transport, protected token?: string) {}
}