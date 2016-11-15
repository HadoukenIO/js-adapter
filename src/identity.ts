import Mergeable from "./util/mergeable";

export class Identity extends Mergeable<any> {
    constructor(public uuid?: string, public name?: string) { super(); }
}

export class AppIdentity extends Identity {
    constructor(public uuid: string, public name?: string) { super(); }
}

export class WindowIdentity extends AppIdentity {
    constructor(public uuid: string, public name: string) { super(uuid); }
}