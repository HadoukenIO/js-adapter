import { connect, Fin } from '../src/main';
import { kill } from './multi-runtime-utils';

let c: Promise<Fin>;
export function conn() {
    if (!c) {
        c = connect({
            runtime: { version: process.env.OF_VER, rvmDir: process.env.RVM_DIR },
            // tslint:disable-next-line
            uuid: 'example_uuid' + Math.random()
        }).catch(() => {
            c = null;
            console.warn('Failed to connect, retrying');
            return conn();
        });
    }

    return c;
}

export async function clean() {
    if (c) {
        const f = await c;
        kill(f);
        c = null;
    }
}
