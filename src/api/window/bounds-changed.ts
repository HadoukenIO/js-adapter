import { Reply } from "../base"

export default class BoundsChangedReply extends Reply {
    changeType: BoundsChangeType
    //deffered: boolean // Typo in API?
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