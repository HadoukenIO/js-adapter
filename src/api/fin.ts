import Transport from "../transport/transport";
import { Bare } from "./base";
import System from "./system/system";
import _WindowModule from "./window/window";
import Application from "./application/application";
import InterApplicationBus from "./interappbus/interappbus";
import _NotificationModule from "./notification/notification";
import Clipbpard from "./clipboard/clipboard";
import ExternalApplication from "./external-application/external-application";

export default class Fin extends Bare {
    System: System;
    Window: _WindowModule;
    Application: Application;
    InterApplicationBus: InterApplicationBus;
    Notification: _NotificationModule;
    Clipboard: Clipbpard;
    ExternalApplication: ExternalApplication;

    constructor(wire: Transport, public token: Token) {
        super(wire);
        this.System = new System(wire);
        this.Window = new _WindowModule(wire);
        this.Application = new Application(wire);
        this.InterApplicationBus = new InterApplicationBus(wire);
        this.Notification = new _NotificationModule(wire);
        this.Clipboard = new Clipbpard(wire);
        this.ExternalApplication = new ExternalApplication(wire);

        //Handle disconnect events
        wire.on("disconnected", ()=> {
            this.emit("disconnected");
        });
    }
}
