import { Reply } from "../base"

export default class BoundsChangedReply extends Reply {
    changeType: BoundsChangeType
    deferred: boolean 
    height: number
    width: number
    top: number
    left: number
}

export const enum BoundsChangeType {
    POSITION,
    SIZE,
    POSITION_AND_SIZE
}