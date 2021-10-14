let lastTimeoutId = 0;

globalThis.setTimeout = function (callback, delay) {
    lastTimeoutId++;
    return lastTimeoutId;
}

globalThis.clearTimeout = function (timeoutID) {
}

console.error = console.log;
console.warn = console.log;