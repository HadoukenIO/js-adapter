import { BaseEventMap } from './base';

export interface FrameEvents extends BaseEventMap {
   connected: string;
   disconnected: string;
}