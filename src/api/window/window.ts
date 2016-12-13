import { Bare, Base } from "../base";
import { WindowIdentity } from "../../identity";
import Bounds from "./bounds";
import BoundsChangedReply from "./bounds-changed";
import Animation from "./animation";
import { Application } from "../application/application";

export default class _WindowModule extends Bare {
    wrap(identity: WindowIdentity): _Window {
        return new _Window(this.wire, identity);
    }
}

// The window.Window name is taken
export class _Window extends Base {
    constructor(wire, protected identity: WindowIdentity) {
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
        return this.wire.sendAction("close-window", this.identity.mergeWith({ force }))
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
        return this.wire.sendAction("execute-javascript-in-window", this.identity.mergeWith({ code }));
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
        return this.wire.sendAction("join-window-group", this.identity.mergeWith({
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
        return this.wire.sendAction("join-window-group", this.identity.mergeWith({
            groupingUuid: target.identity.uuid,
            groupingWindowName: target.identity.name
        })).then(({ payload }) => payload.data);
    }

    minimize(): Promise<void> {
        return this.wire.sendAction("minimize-window", this.identity);
    }

    moveBy(deltaLeft: number, deltaTop: number): Promise<void> {
        return this.wire.sendAction("move-window-by", this.identity.mergeWith({ deltaLeft, deltaTop }));
    }

    moveTo(left: number, top: number): Promise<void> {
        return this.wire.sendAction("move-window", this.identity.mergeWith({ left, top }));
    }

    resizeBy(deltaWidth: number, deltaHeight: number, anchor: string): Promise<void> {
        return this.wire.sendAction("resize-window-by", this.identity.mergeWith({
            deltaWidth: Math.floor(deltaWidth),
            deltaHeight: Math.floor(deltaHeight),
            anchor
        }));
    }

    resizeTo(width: number, height: number, anchor: string): Promise<void> {
        return this.wire.sendAction("resize-window", this.identity.mergeWith({
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
        return this.wire.sendAction("set-window-bounds", this.identity.mergeWith(bounds));
    }

    show(force = false): Promise<void> {
        return this.wire.sendAction("show-window", this.identity.mergeWith({ force }));
    }

    showAt(left: number, top: number, force = false): Promise<void> {
        return this.wire.sendAction("show-at-window", this.identity.mergeWith({
            force,
            left: Math.floor(left),
            top: Math.floor(top)
        }));
    }

    updateOptions(options: any): Promise<void> {
        return this.wire.sendAction("show-window", this.identity.mergeWith({ options }));
    }

    authenticate(userName: string, password: string): Promise<void> {
        return this.wire.sendAction("window-authenticate", this.identity.mergeWith({ userName, password }));
    }

    getZoomLevel(): Promise<number> {
        return this.wire.sendAction("get-zoom-level", this.identity).then(({ payload }) => payload.data);
    }

    setZoomLevel(level: number): Promise<void> {
        return this.wire.sendAction("set-zoom-level", this.identity.mergeWith({ level })).then(( { payload }) => payload.data);
    }
    
}
export interface _Window {
    addEventListener(type: "focused", listener: Function);
    addEventListener(type: "bounds-changed", listener: (data: BoundsChangedReply) => void);
    addEventListener(type: "hidden", listener: Function);
}
