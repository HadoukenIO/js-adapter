import * as f from '../src/main';
import * as repl from 'repl';

export function startRepl() {
    f.connect({
        address: 'ws://localhost:9696',
        // tslint:disable-next-line
        uuid: Math.random().toString(36).slice(2)
    }).then(fin => {

        fin.System.getVersion().then(v => {

            // tslint:disable-next-line
            console.log(`Connected to ${v} Repl now ready, use fin to explore the OpenFin API.`);

            //need to cast to any because the definition for REPLServer does not have it.
            // tslint:disable-next-line
            const r = repl.start('> ') as any;

            Object.defineProperty(r.context, 'fin', {
                configurable: false,
                enumerable: true,
                value: fin
            });
        });

        fin.on('disconnected', () => {
            // tslint:disable-next-line
            console.log('runtime is now disconnected');
        });

    }).catch(err => {
        if (err.code === 'ECONNREFUSED') {
            //sleep and re-connect
            setTimeout(startRepl, 2000);
        }
    });
}
