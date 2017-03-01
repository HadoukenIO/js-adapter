import { Bare, Base, RuntimeEvent } from "../base";
import { Identity } from "../../identity";
import Bounds from "./bounds";
import BoundsChangedReply from "./bounds-changed";
import Animation from "./animation";
import { Application } from "../application/application";
import Transport from "../../transport/transport";

export default class _WindowModule extends Bare {
    wrap(identity: Identity): _Window {
        return new _Window(this.wire, identity);
    }
}

export interface CloseEventShape {
    name: string;
    uuid: string;
    type: string;
    topic: string;
}

// The window.Window name is taken
export class _Window extends Base {
    
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
        return listener.topic === this.topic && listener.uuid === this.identity.uuid &&
            listener.name === this.identity.name;
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
    
    getBounds(): Promise<Bounds> {
        return this.wire.sendAction("get-window-bounds", this.identity)
            .then(({ payload }) => payload.data as Bounds);
    }

    focus(): Promise<void> {
        return this.wire.sendAction("focus-window", this.identity);
    }
    
    blur(): Promise<void> {
        return this.wire.sendAction("blur-window", this.identity);
    }
    
    bringToFront(): Promise<void> {
        return this.wire.sendAction("bring-window-to-front", this.identity);
    }

    animationBuilder(interrupt = false): Animation {
        return new Animation(this.wire, this.identity, interrupt);
    }

    hide(): Promise<void> {
        return this.wire.sendAction("hide-window", this.identity);
    }
    
    close(force = false): Promise<void> {
        return this.wire.sendAction("close-window", Object.assign({}, this.identity, { force }))
            .then(() => Object.setPrototypeOf(this, null));
    }

    getNativeId(): Promise<string> {
        return this.wire.sendAction("get-window-native-id", this.identity)
            .then(({ payload }) => payload.data);
    }

    disableFrame(): Promise<void> {
        return this.wire.sendAction("disable-window-frame", this.identity);
    }

    enableFrame(): Promise<void> {
        return this.wire.sendAction("enable-window-frame", this.identity);
    }

    executeJavaScript(code: string): Promise<void> {
        return this.wire.sendAction("execute-javascript-in-window", Object.assign({}, this.identity, { code }));
    }

    flash(): Promise<void> {
        return this.wire.sendAction("flash-window", this.identity);
    }

    stopFlashing(): Promise<void> {
        return this.wire.sendAction("stop-flash-window", this.identity);
    }

    getGroup(): Promise<Array<_Window>> {
        return this.wire.sendAction("get-window-group", this.identity).then(({ payload }) => {
            let winGroups:Array<Array<_Window>> = [] as Array<Array<_Window>>;
            for (let i = 0; i < payload.data.length; i++) {
                winGroups[i] = this.windowListFromNameList(payload.data[i]);
            }

            return winGroups;
        });
    }

    getOptions(): Promise<any> {
        return this.wire.sendAction("get-window-options", this.identity).then(({ payload }) => payload.data);
    }

    getParentApplication(): Promise<Application> {
        return Promise.resolve(new Application(this.wire, this.identity));
    }

    getParentWindow(): Promise<_Window> {
        return Promise.resolve(new Application(this.wire, this.identity)).then(app => app.getWindow());
    }

    getSnapshot(): Promise<string> {
        return this.wire.sendAction("get-window-snapshot", this.identity).then(({ payload }) => payload.data);
    }

    getState(): Promise<string> {
        return this.wire.sendAction("get-window-state", this.identity).then(({ payload }) => payload.data);
    }

    isShowing(): Promise<boolean> {
        return this.wire.sendAction("is-window-showing", this.identity).then(({ payload }) => payload.data);
    }

    joinGroup(target: _Window): Promise<void> {
        return this.wire.sendAction("join-window-group", Object.assign({}, this.identity, {
            groupingUuid: target.identity.uuid,
            groupingWindowName: target.identity.name
        })).then(({ payload }) => payload.data);
    }

    leaveGroup(): Promise<void> {
        return this.wire.sendAction("leave-window-group", this.identity);
    }

    maximize(): Promise<void> {
        return this.wire.sendAction("maximize-window", this.identity);
    }

    mergeGroups(target: _Window): Promise<void> {
        return this.wire.sendAction("join-window-group", Object.assign({}, this.identity, {
            groupingUuid: target.identity.uuid,
            groupingWindowName: target.identity.name
        })).then(({ payload }) => payload.data);
    }

    minimize(): Promise<void> {
        return this.wire.sendAction("minimize-window", this.identity);
    }

    moveBy(deltaLeft: number, deltaTop: number): Promise<void> {
        return this.wire.sendAction("move-window-by", Object.assign({}, this.identity, { deltaLeft, deltaTop }));
    }

    moveTo(left: number, top: number): Promise<void> {
        return this.wire.sendAction("move-window", Object.assign({}, this.identity, { left, top }));
    }

    resizeBy(deltaWidth: number, deltaHeight: number, anchor: string): Promise<void> {
        return this.wire.sendAction("resize-window-by", Object.assign({}, this.identity, {
            deltaWidth: Math.floor(deltaWidth),
            deltaHeight: Math.floor(deltaHeight),
            anchor
        }));
    }

    resizeTo(width: number, height: number, anchor: string): Promise<void> {
        return this.wire.sendAction("resize-window", Object.assign({}, this.identity, {
            width: Math.floor(width),
            height: Math.floor(height),
            anchor
        }));
    }

    restore(): Promise<void> {
        return this.wire.sendAction("restore-window", this.identity);
    }

    setAsForeground(): Promise<void> {
        return this.wire.sendAction("set-foreground-window", this.identity);
    }

    setBounds(bounds: Bounds): Promise<void> {
        return this.wire.sendAction("set-window-bounds", Object.assign({}, this.identity, bounds));
    }

    show(force = false): Promise<void> {
        return this.wire.sendAction("show-window", Object.assign({}, this.identity, { force }));
    }

    showAt(left: number, top: number, force = false): Promise<void> {
        return this.wire.sendAction("show-at-window", Object.assign({}, this.identity, {
            force,
            left: Math.floor(left),
            top: Math.floor(top)
        }));
    }

    updateOptions(options: any): Promise<void> {
        return this.wire.sendAction("show-window", Object.assign({}, this.identity, { options }));
    }

    authenticate(userName: string, password: string): Promise<void> {
        return this.wire.sendAction("window-authenticate", Object.assign({}, this.identity, { userName, password }));
    }

    getZoomLevel(): Promise<number> {
        return this.wire.sendAction("get-zoom-level", this.identity).then(({ payload }) => payload.data);
    }

    setZoomLevel(level: number): Promise<void> {
        return this.wire.sendAction("set-zoom-level", Object.assign({}, this.identity, { level })).then(( { payload }) => payload.data);
    }
    
}
export interface _Window {
    on(type: "focused", listener: Function): this;
    on(type: "bounds-changed", listener: (data: BoundsChangedReply) => void): this;
    on(type: "hidden", listener: Function): this;
    on(type: "removeListener", listener: (eventType: string) => void): this;
    on(type: "newListener", listener: (eventType: string) => void): this;
    on(type: "closed", listener: (eventType: CloseEventShape) => void): this;
}
