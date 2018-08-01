import { Message, EventMessage } from '../../transport/transport';
import { emitterMap } from './emitterMap';
import { RuntimeEvent } from '../base';

function isEventMessage (message: Message<any>): message is EventMessage {
    return message.action === 'process-desktop-event';
}

function mapKeyFromEvent (event: RuntimeEvent) {
    const {topic, uuid, name} = event;
    switch (topic) {
        case 'window':
            return [topic, uuid, name];
        case 'application':
            return [topic, uuid];
        default:
            return [topic];
    }
}

export function dispatchEvent(message: Message<any>) {
    if (isEventMessage(message)) {
        const {payload} = message;
        const accessor = mapKeyFromEvent(payload);
        if (emitterMap.has(accessor)) {
           emitterMap.get(accessor).emit(payload.type, payload);
           return true;
        }
    } else if (message.action === 'process-notification-event') {
        const { payload: { notificationId }, type } = message.payload;
        const accessor = ['notification', '' + notificationId];
        if (emitterMap.has(accessor)) {
            emitterMap.get(accessor).emit(type, message.payload);
            return true;
        }
    }
    return false;
}