import Promise = require("bluebird")
import Transport from "../transport"
import Base from "./base"
import System from "./system"
import _Window from "./window"
import Application from "./application"
import InterApplicationBus from "./interappbus"
import _Notification from "./notification"

export class OpenFinAPI extends Base {
    System: System
    Window: _Window
    Application: Application
    InterApplicationBus: InterApplicationBus
    Notification: _Notification
    constructor(wire: Transport, token?: string) {
        super(wire, token)
        this.System = new System(wire)
        this.Window = new _Window(wire)
        this.Application = new Application(wire)
        this.InterApplicationBus = new InterApplicationBus(wire)
        this.Notification = new _Notification(wire)
    }
}