import { Base } from "../base"
//import { version as adapterVersion } from "../../../package.json"

export default class System extends Base {
    getVersion(): Promise<string> {
        return this.wire.sendAction("get-version")
            .then(({ payload }) => payload.data)
    }
}