import { Identity } from "../identity"
import { ListenerNotRegistered } from "./transport-errors"

export default class ListenerStore {
    protected map: Map<string, Set<Function>> = new Map
    add(identity: Identity, topic: string, type: string, listener: Function): void {
        const key = makeKey(identity, topic, type)
        if (this.map.has(key))
            this.map.get(key)!.add(listener)
        else
            this.map.set(key, new Set([listener]))
    }
    getAll(identity: Identity, topic: string, type: string): Iterable<Function> {
        const key = makeKey(identity, topic, type)
        return this.map.get(key) || []
    }
    has(identity: Identity, topic: string, type: string): boolean {
        const key = makeKey(identity, topic, type)
        return this.map.has(key)
    }
    delete(identity: Identity, topic: string, type: string, listener: Function): boolean {
        const key = makeKey(identity, topic, type),
            set = this.map.get(key),
            had = set && set.delete(listener)
        if (!set || !had)
            throw new ListenerNotRegistered 
        else 
            return (set && set.size === 0) as boolean
    }
}

function makeKey(identity: Identity, topic: string, type: string): string {
    const SEP = "/"
    let key = ""
    key += encodeURIComponent(topic) + SEP
    key += encodeURIComponent(type) + SEP
    key += encodeURIComponent(identity.uuid) + SEP
    key += encodeURIComponent(identity.name || "*")
    return key
}