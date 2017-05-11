export default class RefCoutner {
    public topicRefMap = new Map();

    // returns the ref count after incrementing
    public incRefCount(key: string): number {
        const refCount = this.topicRefMap.get(key);
        let returnCount: number;

        if (!refCount) {
            this.topicRefMap.set(key, 1);
            returnCount = 1;
        } else {
            const newRefCount = refCount + 1;

            returnCount = newRefCount;
            this.topicRefMap.set(key, newRefCount);
        }

        return returnCount;
    }

    // returns the ref count after decrementing, or -1 if the key already had no references
    public decRefCount(key: string): number {
        const refCount = this.topicRefMap.get(key);
        let returnCount: number;

        if (refCount) {
            const newRefCount = refCount - 1;

            this.topicRefMap.set(key, newRefCount);
            returnCount = newRefCount;
        } else {
            returnCount = -1;
        }

        return returnCount;
    }

    // Execute firstAction if it is the first such ref, else execute nonFirstAction.
    // In either case the return value is that of the action executed
    // tslint:disable-next-line
    public actOnFirst(key: string, firstAction: () => any, nonFirstAction = () => { }): any {
        const numRefs = this.incRefCount(key);
        const isFirstRef = numRefs === 1;

        return isFirstRef ? firstAction() : nonFirstAction();
    }

    // Execute lastAction if it is the first such ref, else execute nonLastAction.
    // In either case the return value is that of the action executed
    // tslint:disable-next-line
    public actOnLast(key: string, lastAction: () => any, nonLastAction = () => { }) {
        const numRefs = this.decRefCount(key);
        const isLastRef = numRefs === 0;

        return isLastRef ? lastAction() : nonLastAction();
    }
}
