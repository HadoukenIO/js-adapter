import { Identity } from "./identity"

export default class EventStore {
    protected map: Map<string, Function[]> = new Map
    add(identity: Identity, topic: string, type: string, listener: Function): void {
        const key = EventStore.makeKey(identity, topic, type)
        if (this.map.has(key))
            this.map.get(key)!.push(listener)
        else 
            this.map.set(key, [ listener ])
    }
    getAll(identity: Identity, topic: string, type: string): Function[] {
        const key = EventStore.makeKey(identity, topic, type)
        return this.map.get(key) || []
    }
    has(identity: Identity, topic: string, type: string): boolean {
        const key = EventStore.makeKey(identity, topic, type)
        return this.map.has(key)
    }
    // Implement lastRemoved(?)

    static makeKey(identity: Identity, topic: string, type: string): string {
        const SEP = "/"
        let key = ""
        key += encodeURIComponent(topic) + SEP
        key += encodeURIComponent(type) + SEP
        key += encodeURIComponent(identity.uuid) + SEP
        key += encodeURIComponent(identity.name || "*")
        return key
    }
}