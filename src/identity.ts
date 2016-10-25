import Mergeable from "./util/mergeable"

export class Identity extends Mergeable<any> {
    constructor(public uuid: string, public name?: string) {
        super()
    }
}