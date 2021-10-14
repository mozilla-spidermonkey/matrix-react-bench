let lastTimeoutId = 0;

globalThis.setTimeout = function (callback, delay) {
    lastTimeoutId++;
    return lastTimeoutId;
}

globalThis.clearTimeout = function (timeoutID) {
}

globalThis.window = globalThis;
globalThis.XMLHttpRequest = function () { };

console.error = console.log;
console.warn = console.log;

// Replacement for matrix-react-sdk/src/Skinner.ts logic
globalThis.mxSkinner = {
    getComponent(name) { return null; }
};
