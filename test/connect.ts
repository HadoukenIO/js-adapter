import { connect, Fin } from '../src/main';

let c: Promise<Fin>;
export function conn() {
    if (!c) {
        c = connect({
            runtime: {version: process.env.OF_VER},
            // tslint:disable-next-line
            uuid: 'example_uuid' + Math.random()
        });
    }

    return c;
}
