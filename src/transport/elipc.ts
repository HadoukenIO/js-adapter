import { EventEmitter } from 'events';
import { Wire, READY_STATE } from './wire';

export default class ElIPCTransport extends EventEmitter implements Wire {

    public onmessage: (data: any) => void;

    constructor(onmessage: (data: any) => void) {
        super();
        this.onmessage = onmessage;
    }

    public connect = (address: string): Promise<any> =>  {
        throw new Error('Not Implemented');
    }

    public send(data: any, flags?: any): Promise<any> {
        throw new Error('Not Implemented');
    }

    public shutdown(): Promise<void> {
        throw new Error('Not Implemented');
    }

    public static READY_STATE = READY_STATE;
}
