import { Base, Reply } from "../base"
import { AppIdentity } from "../../identity"

class Application extends Base {
    wrap(identity: AppIdentity): Application {
        const wrapped = new Application(this.wire)
        wrapped.identity = identity
        return wrapped
    }

    isRunning(): Promise<boolean> {
        return this.wire.sendAction("is-application-running", this.identity)
            .then(({ payload }) => payload.data)
    }
}
export default Application
interface Application {
    addEventListener(type: "closed", listener: (data: Reply<"application", "closed">) => void) 
    addEventListener(type: "connected", listener: (data: Reply<"application", "connected">) => void) 
    addEventListener(type: "crashed", listener: (data: Reply<"application", "crashed">) => void) 
    addEventListener(type: "error", listener: (data: Reply<"application", "error">) => void) 
    addEventListener(type: "not-responding", listener: (data: Reply<"application", "not-responding">) => void) 
    addEventListener(type: "out-of-memory", listener: (data: Reply<"application", "out-of-memory">) => void) 
    addEventListener(type: "responding", listener: (data: Reply<"application", "responding">) => void) 
    addEventListener(type: "started", listener: (data: Reply<"application", "started">) => void) 
    addEventListener(type: "run-requested", listener: (data: Reply<"application", "run-requested">) => void) 
    addEventListener(type: "window-navigation-rejected", listener: (data: NavigationRejectedReply) => void) 
    addEventListener(type: "window-created", listener: (data: Reply<"application", "window-created">) => void) 
    addEventListener(type: "window-closed", listener: (data: Reply<"application", "window-closed">) => void) 
}

export class NavigationRejectedReply extends Reply<"window-navigation-rejected", void> {
    sourceName: string
    url: string
}
