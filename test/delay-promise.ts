export function delayPromise(delay = 200) {
    return new Promise(resolve => setTimeout(resolve, delay));
}
