import Transport from '../transport/transport';
import { EventEmitter } from 'events';
import System from './system/system';
import _WindowModule from './window/window';
import Application from './application/application';
import InterApplicationBus from './interappbus/interappbus';
import _NotificationModule from './notification/notification';
import Clipbpard from './clipboard/clipboard';
import ExternalApplication from './external-application/external-application';
import _FrameModule from './frame/frame';
// import Plugin from './plugin/plugin';
import GlobalHotkey from './global-hotkey';
import { Identity } from '../identity';

export default class Fin extends EventEmitter {
    private  wire: Transport;

    public System: System;
    public Window: _WindowModule;
    public Application: Application;
    public InterApplicationBus: InterApplicationBus;
    public Notification: _NotificationModule;
    public Clipboard: Clipbpard;
    public ExternalApplication: ExternalApplication;
    public Frame: _FrameModule;
    // public Plugin: Plugin;
    public GlobalHotkey: GlobalHotkey;

    get me(): Identity {
        return this.wire.me;
    }

    constructor(wire: Transport) {
        super();
        this.wire = wire;
        this.System = new System(wire);
        this.Window = new _WindowModule(wire);
        this.Application = new Application(wire);
        this.InterApplicationBus = new InterApplicationBus(wire);
        this.Notification = new _NotificationModule(wire);
        this.Clipboard = new Clipbpard(wire);
        this.ExternalApplication = new ExternalApplication(wire);
        this.Frame = new _FrameModule(wire);
        // this.Plugin = new Plugin(wire);
        this.GlobalHotkey = new GlobalHotkey(wire);

        //Handle disconnect events
        wire.on('disconnected', () => {
            this.emit('disconnected');
        });
    }
}
