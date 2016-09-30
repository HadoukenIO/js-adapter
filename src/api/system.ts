import Base from "./base"

export default class System extends Base {
    getVersion(): Promise<string> {
        return new Promise((resolve, reject) => {
            return this.wire.sendAction("get-version")
                .then(({ payload }) => resolve(payload.data))
                .catch(reject)
        })
    }
}