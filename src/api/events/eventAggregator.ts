import { Message, EventMessage, NotificationEventMessage } from '../../transport/transport';
import { EmitterMap } from './emitterMap';
import { RuntimeEvent } from '../base';
import { NotificationCallback } from '../notification/notification';

function isEventMessage(message: Message<any>): message is EventMessage {
    return message.action === 'process-desktop-event';
}

function isNotificationMessage(message: Message<any>): message is NotificationEventMessage {
    return message.action === 'process-notification-event';
}

const buildLocalPayload = (rawPayload: any): NotificationCallback => {
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
};
function mapKeyFromEvent(event: RuntimeEvent) {
    const { topic, uuid, name } = event;
    switch (topic) {
        case 'frame':
        case 'window':
            return [topic, uuid, name];
        case 'application':
            return [topic, uuid];
        default:
            return [topic];
    }
}
export class EventAggregator extends EmitterMap {
    public dispatchEvent = (message: Message<any>) => {
        if (isEventMessage(message)) {
            const { payload } = message;
            const accessor = mapKeyFromEvent(payload);
            if (this.has(accessor)) {
                this.get(accessor).emit(payload.type, payload);
                return true;
            }
        } else if (isNotificationMessage(message)) {
            const { payload: { notificationId }, type } = message.payload;
            const accessor = ['notification', '' + notificationId];
            if (this.has(accessor)) {
                this.get(accessor).emit(type, buildLocalPayload(message.payload));
                return true;
            }
        }
        return false;
    }
}
