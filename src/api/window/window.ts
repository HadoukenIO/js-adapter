import { Bare, Base, RuntimeEvent } from '../base';
import { Identity } from '../../identity';
import Bounds from './bounds';
import BoundsChangedReply from './bounds-changed';
import Animation from './animation';
import { Application } from '../application/application';
import Transport from '../../transport/transport';

// tslint:disable-next-line
export default class _WindowModule extends Bare {
    public wrap(identity: Identity): _Window {
        return new _Window(this.wire, identity);
    }
}

export interface CloseEventShape {
    name: string;
    uuid: string;
    type: string;
    topic: string;
}

/**
  @classdesc
  @class
*/
// The window.Window name is taken
// tslint:disable-next-line
export class _Window extends Base {

    /**
      @param { object } wire
      @param { object } identity
      @constructor
    */
    constructor(wire: Transport, public identity: Identity) {
        super(wire);

        this.on('removeListener', eventType => {
            this.deregisterEventListener(Object.assign({}, this.identity, {
                type: eventType,
                topic : this.topic
            }));
        });

        this.on('newListener', eventType => {
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
        const windowList: Array<_Window> = [];

        // tslint:disable-next-line
        for (let i = 0; i < nameList.length; i++) {
            windowList.push(new _Window(this.wire, {
                // tslint:disable-next-line
                uuid: this.identity.uuid as string,
                name: nameList[i]
            }));
        }
        return windowList;
    }

    /**
      returns a promise of bounds
      @static
    */
    public getBounds(): Promise<Bounds> {
        return this.wire.sendAction('get-window-bounds', this.identity)
        // tslint:disable-next-line
            .then(({ payload }) => payload.data as Bounds);
    }

    public focus(): Promise<void> {
        return this.wire.sendAction('focus-window', this.identity).then(() => undefined);
    }

    public blur(): Promise<void> {
        return this.wire.sendAction('blur-window', this.identity).then(() => undefined);
    }

    public bringToFront(): Promise<void> {
        return this.wire.sendAction('bring-window-to-front', this.identity).then(() => undefined);
    }

    public animationBuilder(interrupt: boolean = false): Animation {
        return new Animation(this.wire, this.identity, interrupt);
    }

    public hide(): Promise<void> {
        return this.wire.sendAction('hide-window', this.identity).then(() => undefined);
    }

    /**
      closes the window application
      @param { boolean } force assigned that value to false by default
      @static
    */
    public close(force: boolean = false): Promise<void> {
        return this.wire.sendAction('close-window', Object.assign({}, this.identity, { force }))
            .then(() => {
                Object.setPrototypeOf(this, null);
                return undefined;
            });
    }

    public getNativeId(): Promise<string> {
        return this.wire.sendAction('get-window-native-id', this.identity)
            .then(({ payload }) => payload.data);
    }

    public disableFrame(): Promise<void> {
        return this.wire.sendAction('disable-window-frame', this.identity).then(() => undefined);
    }

    public enableFrame(): Promise<void> {
        return this.wire.sendAction('enable-window-frame', this.identity).then(() => undefined);
    }

    public executeJavaScript(code: string): Promise<void> {
        return this.wire.sendAction('execute-javascript-in-window', Object.assign({}, this.identity, { code }))
            .then(() => undefined);
    }

    public flash(): Promise<void> {
        return this.wire.sendAction('flash-window', this.identity).then(() => undefined);
    }

    public stopFlashing(): Promise<void> {
        return this.wire.sendAction('stop-flash-window', this.identity).then(() => undefined);
    }

    public getGroup(): Promise<Array<Array<_Window>>> {
        return this.wire.sendAction('get-window-group', this.identity).then(({ payload }) => {
            // tslint:disable-next-line
            let winGroups: Array<Array<_Window>> = [] as Array<Array<_Window>>;
            // tslint:disable-next-line
            for (let i = 0; i < payload.data.length; i++) {
                winGroups[i] = this.windowListFromNameList(payload.data[i]);
            }

            return winGroups;
        });
    }

    public getOptions(): Promise<any> {
        return this.wire.sendAction('get-window-options', this.identity).then(({ payload }) => payload.data);
    }

    public getParentApplication(): Promise<Application> {
        return Promise.resolve(new Application(this.wire, this.identity));
    }

    public getParentWindow(): Promise<_Window> {
        return Promise.resolve(new Application(this.wire, this.identity)).then(app => app.getWindow());
    }

    public getSnapshot(): Promise<string> {
        return this.wire.sendAction('get-window-snapshot', this.identity).then(({ payload }) => payload.data);
    }

    public getState(): Promise<string> {
        return this.wire.sendAction('get-window-state', this.identity).then(({ payload }) => payload.data);
    }

    public isShowing(): Promise<boolean> {
        return this.wire.sendAction('is-window-showing', this.identity).then(({ payload }) => payload.data);
    }

    public joinGroup(target: _Window): Promise<void> {
        return this.wire.sendAction('join-window-group', Object.assign({}, this.identity, {
            groupingUuid: target.identity.uuid,
            groupingWindowName: target.identity.name
        })).then(() => undefined);
    }

    public leaveGroup(): Promise<void> {
        return this.wire.sendAction('leave-window-group', this.identity).then(() => undefined);
    }

    public maximize(): Promise<void> {
        return this.wire.sendAction('maximize-window', this.identity).then(() => undefined);
    }

    public mergeGroups(target: _Window): Promise<void> {
        return this.wire.sendAction('join-window-group', Object.assign({}, this.identity, {
            groupingUuid: target.identity.uuid,
            groupingWindowName: target.identity.name
        })).then(() => undefined);
    }

    public minimize(): Promise<void> {
        return this.wire.sendAction('minimize-window', this.identity).then(() => undefined);
    }

    public moveBy(deltaLeft: number, deltaTop: number): Promise<void> {
        return this.wire.sendAction('move-window-by', Object.assign({}, this.identity, { deltaLeft, deltaTop })).then(() => undefined);
    }

    public moveTo(left: number, top: number): Promise<void> {
        return this.wire.sendAction('move-window', Object.assign({}, this.identity, { left, top })).then(() => undefined);
    }

    public resizeBy(deltaWidth: number, deltaHeight: number, anchor: string): Promise<void> {
        return this.wire.sendAction('resize-window-by', Object.assign({}, this.identity, {
            deltaWidth: Math.floor(deltaWidth),
            deltaHeight: Math.floor(deltaHeight),
            anchor
        })).then(() => undefined);
    }

    public resizeTo(width: number, height: number, anchor: string): Promise<void> {
        return this.wire.sendAction('resize-window', Object.assign({}, this.identity, {
            width: Math.floor(width),
            height: Math.floor(height),
            anchor
        })).then(() => undefined);
    }

    public restore(): Promise<void> {
        return this.wire.sendAction('restore-window', this.identity).then(() => undefined);
    }

    public setAsForeground(): Promise<void> {
        return this.wire.sendAction('set-foreground-window', this.identity).then(() => undefined);
    }

    public setBounds(bounds: Bounds): Promise<void> {
        return this.wire.sendAction('set-window-bounds', Object.assign({}, this.identity, bounds)).then(() => undefined);
    }

    public show(force: boolean = false): Promise<void> {
        return this.wire.sendAction('show-window', Object.assign({}, this.identity, { force })).then(() => undefined);
    }

    public showAt(left: number, top: number, force: boolean = false): Promise<void> {
        return this.wire.sendAction('show-at-window', Object.assign({}, this.identity, {
            force,
            left: Math.floor(left),
            top: Math.floor(top)
        })).then(() => undefined);
    }

    public updateOptions(options: any): Promise<void> {
        return this.wire.sendAction('show-window', Object.assign({}, this.identity, { options })).then(() => undefined);
    }

    public authenticate(userName: string, password: string): Promise<void> {
        return this.wire.sendAction('window-authenticate', Object.assign({}, this.identity, { userName, password })).then(() => undefined);
    }

    public getZoomLevel(): Promise<number> {
        return this.wire.sendAction('get-zoom-level', this.identity).then(({ payload }) => payload.data);
    }

    public setZoomLevel(level: number): Promise<void> {
        return this.wire.sendAction('set-zoom-level', Object.assign({}, this.identity, { level })).then(() => undefined);
    }

}

// tslint:disable-next-line
export interface _Window {
    on(type: 'focused', listener: Function): this;
    on(type: 'bounds-changed', listener: (data: BoundsChangedReply) => void): this;
    on(type: 'hidden', listener: Function): this;
    on(type: 'removeListener', listener: (eventType: string) => void): this;
    on(type: 'newListener', listener: (eventType: string) => void): this;
    on(type: 'closed', listener: (eventType: CloseEventShape) => void): this;
}
