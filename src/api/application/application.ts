import { Base, Bare, Reply, RuntimeEvent } from "../base";
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

        this.on("removeListener", eventType => {    
            this.deregisterEventListener(this.identity.mergeWith({
                type: eventType,
                topic : this.topic
            }));
        });
        
        this.on("newListener", eventType => {
            this.registerEventListener(this.identity.mergeWith({
                type: eventType,
                topic : this.topic
            }));
        });
    }

    protected runtimeEventComparator(listener: RuntimeEvent): boolean {
        return listener.topic === this.topic && listener.uuid === this.identity.uuid;
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
    on(type: "closed", listener: (data: Reply<"application", "closed">) => void);
    on(type: "connected", listener: (data: Reply<"application", "connected">) => void);
    on(type: "crashed", listener: (data: Reply<"application", "crashed">) => void);
    on(type: "error", listener: (data: Reply<"application", "error">) => void);
    on(type: "not-responding", listener: (data: Reply<"application", "not-responding">) => void);
    on(type: "out-of-memory", listener: (data: Reply<"application", "out-of-memory">) => void);
    on(type: "responding", listener: (data: Reply<"application", "responding">) => void);
    on(type: "started", listener: (data: Reply<"application", "started">) => void);
    on(type: "run-requested", listener: (data: Reply<"application", "run-requested">) => void);
    on(type: "window-navigation-rejected", listener: (data: NavigationRejectedReply) => void);
    on(type: "window-created", listener: (data: Reply<"application", "window-created">) => void);
    on(type: "window-closed", listener: (data: Reply<"application", "window-closed">) => void);
    on(type: "tray-icon-clicked", listener: (data: TrayIconClickReply) => void);
    on(type: "removeListener", listener: (eventType: string) => void);
    on(type: "newListener", listener: (eventType: string) => void);
}