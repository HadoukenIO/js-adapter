import Promise = require("bluebird")
import Base from "./base"

export default class System extends Base {
    getVersion(): Promise<string> {
        return Promise.resolve("0.0.0")
    }
}