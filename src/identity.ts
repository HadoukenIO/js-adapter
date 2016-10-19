export class Identity {
    constructor(public uuid: string, public name?: string) {}
    toWireObject() {
        return this 
    }
}

export class NoIdentityError extends Error {}