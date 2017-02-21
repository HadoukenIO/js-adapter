import { Base, Reply } from "../base";
import { Identity } from "../../identity";

class ExternalApplication extends Base {
    identity: Identity;
    wrap(uuid: string): ExternalApplication {
        const wrapped = new ExternalApplication(this.wire);
        wrapped.identity = { uuid };
        return wrapped;
    }
}

interface ExternalApplication {
    addEventListener(type: "connected", listener: (data: Reply<"externalapplication", "connected">) => Promise<void>);
    addEventListener(type: "disconnected", listener: (data: Reply<"externalapplication", "disconnected">) => Promise<void>);
}

export default ExternalApplication;
