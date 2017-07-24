import { Reply } from '../base';

/**
  @class
*/
export default class BoundsChangedReply extends Reply<'window', 'bounds-changed'> {
    public changeType: BoundsChangeType;
    public deferred: boolean;
    public height: number;
    public width: number;
    public top: number;
    public left: number;
}

export const enum BoundsChangeType {
    POSITION,
    SIZE,
    POSITION_AND_SIZE
}
