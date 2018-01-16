import { EventEmitter } from 'events';
import { Wire, READY_STATE } from './wire';
import { NotImplementedError } from './transport-errors';
import { ipc, routingId, outboundTopic, inboundTopic } from '../environment/openfin-renderer-api';

export default class ElIPCTransport extends EventEmitter implements Wire {

    protected wire: any = ipc;

    public onmessage: (data: any) => void;

    constructor(onmessage: (data: any) => void) {
        super();
        this.onmessage = onmessage;
    }

    public connectSync = (): any => {
        ipc.on(inboundTopic, (sender: any, data: any) => {
            try {
                this.onmessage(JSON.parse(data));
            } catch (err) {
                //Do something of value here.
                throw err;
            }
        });
    }

    public connect = (address: string): Promise<any> => {
        throw new NotImplementedError('Not Implemented');
    }

    public send(data: any, flags?: any): Promise<any> {
        ipc.send(routingId, outboundTopic, data);
        return Promise.resolve();
    }

    public shutdown(): Promise<void> {
        return Promise.reject('Not Implemented');
    }

    public static READY_STATE = READY_STATE;
}
