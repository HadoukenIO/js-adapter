class OpenFinAPI {
    static System = class System {
        static getVersion(): Promise<string> {
            return Promise.resolve("0.0.0")
        }
    }
}