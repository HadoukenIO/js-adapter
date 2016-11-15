import { ListenerNotRegistered } from "../transport/transport-errors";

export default class ListenerStore<K> {
    protected map: Map<K, Set<Function>> = new Map;
    add(key: K, listener: Function): { sizeBefore: number } {
        const entry = this.map.get(key);
        let sizeBefore = 0;
        if (this.map.has(key)) {
            sizeBefore = entry!.size;
            entry!.add(listener);
        } else 
            this.map.set(key, new Set([ listener ]));
        return { sizeBefore };
    }
    getAll(...keys: K[]): Function[] {
        const result: Function[] = [];
        for (const k of keys)
            if (this.map.has(k)) result.push(...this.map.get(k)!);
        return result;
    }
    has(key: K): boolean {
        return this.map.has(key);
    }
    delete(key: K, listener: Function): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const entry = this.map.get(key),
                had = entry && entry.delete(listener),
                wasLast = (entry && entry.size === 0) as boolean;
            if (!entry || !had)
                reject(new ListenerNotRegistered);
            else
                resolve(wasLast);

        });
    }
}