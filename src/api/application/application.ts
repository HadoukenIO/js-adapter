import { Base_with_Identity } from "../base"
import { Identity } from "../../identity"

export default class Application extends Base_with_Identity {
    constructor(wire, protected identity: Identity) {
        super(wire)
    }
}