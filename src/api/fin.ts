import Transport from '../transport/transport';
import { EventEmitter } from 'events';
import System from './system/system';
import _WindowModule from './window/window';
import Application from './application/application';
import InterApplicationBus from './interappbus/interappbus';
import _NotificationModule from './notification/notification';
import Clipbpard from './clipboard/clipboard';
import ExternalApplication from './external-application/external-application';
import ExternalWindow from './external-window/external-window';
import _FrameModule from './frame/frame';
import GlobalHotkey from './global-hotkey';
import { Identity } from '../identity';
import { BrowserViewModule } from './browserview/browserview';

const _wireMap: WeakMap<Fin, Transport> = new WeakMap();
export default class Fin extends EventEmitter {
    public System: System;
    public Window: _WindowModule;
    public Application: Application;
    public InterApplicationBus: InterApplicationBus;
    public Notification: _NotificationModule;
    public Clipboard: Clipbpard;
    public ExternalApplication: ExternalApplication;
    public ExternalWindow: ExternalWindow;
    public Frame: _FrameModule;
    public GlobalHotkey: GlobalHotkey;
    public BrowserView: BrowserViewModule;

    get me(): Identity {
        const wire = _wireMap.get(this);
        return wire.me;
    }

    constructor(wire: Transport) {
        super();
        _wireMap.set(this, wire);
        this.System = new System(wire);
        this.Window = new _WindowModule(wire);
        this.Application = new Application(wire);
        this.InterApplicationBus = new InterApplicationBus(wire);
        this.Notification = new _NotificationModule(wire);
        this.Clipboard = new Clipbpard(wire);
        this.ExternalApplication = new ExternalApplication(wire);
        this.ExternalWindow = new ExternalWindow(wire);
        this.Frame = new _FrameModule(wire);
        this.GlobalHotkey = new GlobalHotkey(wire);
        this.BrowserView = new BrowserViewModule(wire);

        //Handle disconnect events
        wire.on('disconnected', () => {
            this.emit('disconnected');
        });
    }
}
