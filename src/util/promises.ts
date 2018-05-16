export function promisify(func: Function): (...args: any[]) => Promise<any> {
    return (...args: any[]) => new Promise((resolve, reject) => {
        func(...args, (err: Error, val: any) => err ? reject(err) : resolve(val));
    });
}

export async function promiseMap<T, S>(arr: T[], asyncF: (x: T, i: number, r: T[]) => Promise<S>): Promise<S[]> {
    return Promise.all<S>(arr.map(asyncF));
}

export type asyncF<T> = (...args: any[]) => Promise<T>;
export async function serial<T>(arr: asyncF<T>[]): Promise<T[]> {
    const ret: T[] = [];
    for (const func of arr) {
        const next = await func();
        ret.push(next);
    }
    return ret;
}
export async function promiseMapSerial<T>(arr: any[], func: asyncF<T>): Promise<T[]> {
    return serial(arr.map((value, index, array) => () => func(value, index, array)));
}
