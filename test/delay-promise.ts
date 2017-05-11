export function delayPromise(delay: number = 200) {
    // tslint:disable-next-line
    return new Promise(resolve => setTimeout(resolve, delay));
}
