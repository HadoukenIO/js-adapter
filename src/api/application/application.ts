import { Base, Bare, Reply, RuntimeEvent } from "../base";
import { Identity } from "../../identity";
import { _Window } from "../window/window";
import { Point } from "../system/point";
import { MonitorInfo } from "../system/monitor";
import Transport from "../../transport/transport";

export interface TrayIconClickReply extends Point, Reply<"application", "tray-icon-clicked"> {
    button: number;
    monitorInfo: MonitorInfo;
};

export class NavigationRejectedReply extends Reply<"window-navigation-rejected", void> {
    sourceName: string;
    url: string;
}

export default class ApplicationModule extends Bare {
    wrap(identity: Identity): Application {
        const wrapped = new Application(this.wire, identity);
        return wrapped;
    }

    create(appOptions: any): Promise<Application> {
        return this.wire.sendAction("create-application", appOptions)
            .then(() => this.wrap({ uuid: appOptions.uuid }));
    }
}

export class Application extends Base {

    constructor(wire: Transport, public identity: Identity) {
        super(wire);

        this.on("removeListener", eventType => {    
            this.deregisterEventListener(Object.assign({}, this.identity, {
                type: eventType,
                topic : this.topic
            }));
        });
        
        this.on("newListener", eventType => {
            this.registerEventListener(Object.assign({}, this.identity, {
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
            windowList.push(new _Window(this.wire, {
                uuid: this.identity.uuid as string,
                name: nameList[i]
            }));
        }
        return windowList;
    }

    isRunning(): Promise<boolean> {
        return this.wire.sendAction("is-application-running", this.identity)
            .then(({ payload }) => payload.data);
    }

    close(force:boolean = false): Promise<void> {
        return this.wire.sendAction("close-application", Object.assign({}, this.identity, {force}));
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
        return Promise.resolve(new _Window(this.wire, {
            uuid: this.identity.uuid as string,
            name: this.identity.uuid as string
        }));
    }

    registerCustomData(data: Object): Promise<void> {
        return this.wire.sendAction("register-custom-data", Object.assign({}, this.identity, {data}));
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
        return this.wire.sendAction("set-tray-icon", Object.assign({}, this.identity, {
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
    on(type: "closed", listener: (data: Reply<"application", "closed">) => void): this;
    on(type: "connected", listener: (data: Reply<"application", "connected">) => void): this;
    on(type: "crashed", listener: (data: Reply<"application", "crashed">) => void): this;
    on(type: "error", listener: (data: Reply<"application", "error">) => void): this;
    on(type: "not-responding", listener: (data: Reply<"application", "not-responding">) => void): this;
    on(type: "out-of-memory", listener: (data: Reply<"application", "out-of-memory">) => void): this;
    on(type: "responding", listener: (data: Reply<"application", "responding">) => void): this;
    on(type: "started", listener: (data: Reply<"application", "started">) => void): this;
    on(type: "run-requested", listener: (data: Reply<"application", "run-requested">) => void): this;
    on(type: "window-navigation-rejected", listener: (data: NavigationRejectedReply) => void): this;
    on(type: "window-created", listener: (data: Reply<"application", "window-created">) => void): this;
    on(type: "window-closed", listener: (data: Reply<"application", "window-closed">) => void): this;
    on(type: "tray-icon-clicked", listener: (data: TrayIconClickReply) => void): this;
    on(type: "removeListener", listener: (eventType: string) => void): this;
    on(type: "newListener", listener: (eventType: string) => void): this;
}
