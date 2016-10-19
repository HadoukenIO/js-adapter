import Transport from "../transport/transport"
import Base from "./base"
import System from "./system/system"
import _WindowModule from "./window/window"
import Application from "./application/application"
import InterApplicationBus from "./interappbus/interappbus"
import _Notification from "./notification/notification"

export class Fin extends Base {
    System: System
    Window: _WindowModule
    Application: Application
    InterApplicationBus: InterApplicationBus
    Notification: _Notification
    constructor(wire: Transport, token?: string) {
        super(wire, token)
        this.System = new System(wire)
        this.Window = new _WindowModule(wire)
        this.Application = new Application(wire)
        this.InterApplicationBus = new InterApplicationBus(wire)
        this.Notification = new _Notification(wire)
    }
}