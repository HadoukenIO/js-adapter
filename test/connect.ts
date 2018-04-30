import { connect, Fin } from '../src/main';

const MAX_TRY_NUMBER = 5;
let c: Promise<Fin>;
let count = 0;
export function conn() {
    if (!c) {
        c = connect({
            address: 'ws://localhost:9696',
            // tslint:disable-next-line
            uuid: 'example_uuid' + Math.random()
        }).catch(() => {
            c = null;
            if (count < MAX_TRY_NUMBER) {
                count += 1;
                console.warn('Failed to connect, retrying ' + count);
                return conn();
            } else {
                throw new Error('Could not connect');
            }
        });
    }

    return c;
}
