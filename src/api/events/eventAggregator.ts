import { Message, EventMessage, NotificationEventMessage } from '../../transport/transport';
import { EmitterMap } from './emitterMap';
import { RuntimeEvent } from '../events/base';
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
function mapKeyFromEvent(event: RuntimeEvent): string[] {
    const { topic } = event;
    if (topic === 'frame') {
        const { uuid, name } = <RuntimeEvent<'frame'>>event;
        return [topic, uuid, name];
    } else if (topic === 'window') {
        const { uuid, name } = <RuntimeEvent<'window'>> event;
        return [topic, uuid, name];
    } else if (topic === 'application') {
        const { uuid } = <RuntimeEvent<'application'>> event;
        return [topic, uuid];
    } else if (topic === 'external-window') {
        const { uuid } = <RuntimeEvent<'external-window'>> event;
        return [topic, uuid];
    }
    return [topic];
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
