import { Bare, Base } from '../base';
import { Identity } from '../../identity';
import Transport, { Message } from '../../transport/transport';

const events = {
    show: 'show',
    close: 'close',
    error: 'error',
    click: 'click',
    message: 'message'
};

export interface Notification {
    sendMessage(message: any): void;
    close(): void;
}

export class NotificationOptions {
    public url: string;
    public message: string;
    public timeout: string | number;
    public notificationId: number;
    public uuidOfProxiedApp: string;
    public ignoreMouseOver: boolean;

    // tslint:disable-next-line
    constructor(options: any = {}, identity: Identity, notificationId: number) {
        const { url, message, timeout, ignoreMouseOver } = options;

        this.url = url;
        this.message = message || null;
        this.timeout = timeout;
        this.notificationId = notificationId;
        this.uuidOfProxiedApp = identity.uuid;
        this.ignoreMouseOver = ignoreMouseOver;
    }
}

export interface NotificationCallback {
    message?: any;
}

/**
 * @classdesc A Notification object represents a window on OpenFin Runtime which
 * is shown briefly to the user on the bottom-right corner of the primary monitor.
 * A notification is typically used to alert the user of some important event which
 * requires his or her attention. Notifications are a child or your application that
 * are controlled by the runtime.
 * @class
 * @alias Notification
 */
// tslint:disable-next-line
export class _Notification extends Base implements Notification {
    private listenerList: Array<string> = ['newListener'];

    private unhookAllListeners = () => {
        this.listenerList.forEach(event => {
            this.removeAllListeners(event);
        });

        this.listenerList.length = 0;
    }

    private buildLocalPayload(rawPayload: any): NotificationCallback {
        const { payload: { message }, type } = rawPayload;

        const payload: NotificationCallback = {};

        switch (type) {
            case 'message': payload.message = message;
                break;
            case 'show':
            case 'error':
            case 'click':
            case 'close':
            default: break;
        }

        return payload;
    }

    protected options: NotificationOptions;
    protected generalListener: (msg: any) => void;
    protected notificationId: number;

    protected onmessage = (message: any): boolean => {
        const { action, payload: messagePayload } = message;

        if (action === 'process-notification-event') {
            const { payload: { notificationId }, type } = messagePayload;

            if (notificationId === this.notificationId) {
                this.emit(type, this.buildLocalPayload(messagePayload));
            }
        }

        return true;
    }

    constructor(wire: Transport, options: NotificationOptions) {
        super(wire);

        this.options = options;
        this.url = options.url;
        this.timeout = options.timeout;
        this.message = options.message;
        this.notificationId = options.notificationId;
        this.on('newListener', (event: any) => {
            this.listenerList.push(event);
        });

        // give any user added listeners a chance to run then unhook
        this.on('close', () => {
            setTimeout(this.unhookAllListeners, 1);
        });
    }

    public url: string;
    public timeout: number | string;
    public message: any;

    /**
     * Invoked when the notification is shown
     * @return {Promise.<Message>}
     * @tutorial Notification.show
     */
    public show(): Promise<Message<any>> {

        if (!this.url) {
            throw new Error('Notifications require a url');
        }

        return this.wire.sendAction('send-action-to-notifications-center', {
            action: 'create-notification',
            payload: {
                url: this.url,
                notificationId: this.options.notificationId,
                message: {
                    message: this.message
                },
                timeout: this.timeout
            }
        });
    }

    /**
     * Sends a message to the notification.
     * @param { any } message The message to be sent to the notification.
     * Can be either a primitive data type (string, number, or boolean)
     * or composite data type (object, array) that is composed of other
     * primitive or composite data types
     * @return {Promise.<void>}
     * @tutorial Notification.sendMessage
     */
    public sendMessage(message: any): Promise<Message<any>> {

        return this.wire.sendAction('send-action-to-notifications-center', {
            action: 'send-notification-message',
            payload: {
                notificationId: this.options.notificationId,
                message: {
                    message
                }
            }
        });
    }

    /**
     * Closes the notification
     * @return {Promise.<Messge>}
     * @tutorial Notification.close
     */
    public close(): Promise<Message<any>> {

        return this.wire.sendAction('send-action-to-notifications-center', {
            action: 'close-notification',
            payload: {
                notificationId: this.options.notificationId
            }
        });
    }
}

// tslint:disable-next-line
export default class _NotificationModule extends Bare {

    private nextNoteId = 0;
    private genNoteId() {
        // tslint:disable-next-line
        return ++this.nextNoteId;
    }

    public events = events;

    public create(options: any): _Notification {
        const noteOptions = new NotificationOptions(options, this.me, this.genNoteId());

        return new _Notification(this.wire, noteOptions);
    }
}
