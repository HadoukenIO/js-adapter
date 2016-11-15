export default class Mergeable<T> {
    mergeWith(i: T) {
        return Object.assign({}, this, i);
    }
}