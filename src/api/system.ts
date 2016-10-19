import Base from "./base"

export default class System extends Base {
    getVersion(): Promise<string> {
        return this.wire.sendAction("get-version")
            .then(message => message.payload.data)
    }
}