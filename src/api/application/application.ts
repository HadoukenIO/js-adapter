import { Base, Bare, Reply } from "../base";
import { AppIdentity, WindowIdentity } from "../../identity";
import { _Window } from "../window/window";
import { Point } from "../system/point";
import { MonitorInfo } from "../system/monitor";

export interface TrayIconClickReply extends Point, Reply<"application", "tray-icon-clicked"> {
    button: number;
    monitorInfo: MonitorInfo;
};

export class NavigationRejectedReply extends Reply<"window-navigation-rejected", void> {
    sourceName: string;
    url: string;
}

export default class ApplicationModule extends Bare {
    wrap(identity: AppIdentity): Application {
        const wrapped = new Application(this.wire, identity);
        return wrapped;
    }

    create(appOptions): Promise<Application> {
        return this.wire.sendAction("create-application", appOptions)
            .then(() => this.wrap(new AppIdentity(appOptions.uuid)));
    }
}

export class Application extends Base {

    constructor(wire, protected identity: AppIdentity) {
        super(wire);
    }

    private windowListFromNameList(nameList: Array<string>): Array<_Window> {
        let windowList:Array<_Window> = [];

        for (let i = 0; i < nameList.length; i++) {
            windowList.push(new _Window(this.wire,
                                        new WindowIdentity(this.identity.uuid as string, nameList[i])));
        }
        return windowList;
    }

    isRunning(): Promise<boolean> {
        return this.wire.sendAction("is-application-running", this.identity)
            .then(({ payload }) => payload.data);
    }

    close(force:boolean = false): Promise<void> {
        return this.wire.sendAction("close-application", this.identity.mergeWith({force}));
    }

    getChildWindows(): Promise<Array<_Window>> {
        return this.wire.sendAction("get-child-windows", this.identity)
            .then(({ payload }) =>  this.windowListFromNameList(payload.data));
    }

    getGroups(): Promise<Array<Array<_Window>>> {
        let winGroups:Array<Array<_Window>> = [] as Array<Array<_Window>>;
        return this.wire.sendAction("get-application-groups", this.identity)
            .then(({ payload }) => {
                for (let i = 0; i < payload.data.length; i++) {
                    winGroups[i] = this.windowListFromNameList(payload.data[i]);
                }

                return winGroups;
            });
    }

    getManifest(): Promise<any> {
        return this.wire.sendAction("get-application-manifest", this.identity)
            .then(({ payload }) => payload.data);
    }

    getParentUuid(): Promise<string> {
        return this.wire.sendAction("get-parent-application", this.identity)
            .then(({ payload }) => payload.data);
    }

    getWindow(): Promise<_Window> {
        return Promise.resolve(new _Window(this.wire,
                                           new WindowIdentity(this.identity.uuid as string,
                                                              this.identity.uuid as string)));
    }

    registerCustomData(data: Object): Promise<void> {
        return this.wire.sendAction("register-custom-data", this.identity.mergeWith({data}));
    }

    removeTrayIcon(): Promise<void> {
        return this.wire.sendAction("remove-tray-icon", this.identity);
    }

    restart(): Promise<void> {
        return this.wire.sendAction("restart-application", this.identity);
    }

    run(): Promise<void> {
        return this.wire.sendAction("run-application", this.identity);
    }

    scheduleRestart(): Promise<void> {
        return this.wire.sendAction("relaunch-on-close", this.identity);
    }

    setTrayIcon(iconUrl: string): Promise<void> {
        return this.wire.sendAction("set-tray-icon", this.identity.mergeWith({
            enabledIcon: iconUrl
        }));
    }

    terminate(): Promise<void> {
        return this.wire.sendAction("terminate-application", this.identity);
    }

    wait(): Promise<void> {
        return this.wire.sendAction("wait-for-hung-application", this.identity);
    }

};

export interface Application {
    addEventListener(type: "closed", listener: (data: Reply<"application", "closed">) => void);
    addEventListener(type: "connected", listener: (data: Reply<"application", "connected">) => void);
    addEventListener(type: "crashed", listener: (data: Reply<"application", "crashed">) => void);
    addEventListener(type: "error", listener: (data: Reply<"application", "error">) => void);
    addEventListener(type: "not-responding", listener: (data: Reply<"application", "not-responding">) => void);
    addEventListener(type: "out-of-memory", listener: (data: Reply<"application", "out-of-memory">) => void);
    addEventListener(type: "responding", listener: (data: Reply<"application", "responding">) => void);
    addEventListener(type: "started", listener: (data: Reply<"application", "started">) => void);
    addEventListener(type: "run-requested", listener: (data: Reply<"application", "run-requested">) => void);
    addEventListener(type: "window-navigation-rejected", listener: (data: NavigationRejectedReply) => void);
    addEventListener(type: "window-created", listener: (data: Reply<"application", "window-created">) => void);
    addEventListener(type: "window-closed", listener: (data: Reply<"application", "window-closed">) => void);
    addEventListener(type: "tray-icon-clicked", listener: (data: TrayIconClickReply) => void);
}
