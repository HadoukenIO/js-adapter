import { EventEmitter } from 'events';
import { Wire, READY_STATE } from './wire';

declare var fin: any;
//TODO: ipc2 should not be a thing.
const ipc = fin.__internal_.ipc2;
const routingId = fin.__internal_.routingId;
const CORE_MESSAGE = fin.__internal_.ipcconfig.channels.CORE_MESSAGE;
const outboundTopic = 'of-window-message';
let topic = `${CORE_MESSAGE}-${routingId}`;

export default class ElIPCTransport extends EventEmitter implements Wire {

    protected wire: any = ipc;
    
    public onmessage: (data: any) => void;

    constructor(onmessage: (data: any) => void) {
        super();
        this.onmessage = onmessage;
    }

    public connect = (address: string): Promise<any> =>  {
        debugger;
        ipc.on(topic, (sender: any, data: any) => {
            try {
                this.onmessage(JSON.parse(data));
            }
            catch(err) {
                //Do something of value here.
                throw err;
            }
        });

        return Promise.resolve();
    }

    public send(data: any, flags?: any): Promise<any> {
        ipc.send(routingId, outboundTopic, data);
        return Promise.resolve(void 0);
    }

    public shutdown(): Promise<void> {
        return Promise.reject('Not Implemented');
    }

    public static READY_STATE = READY_STATE;
}
